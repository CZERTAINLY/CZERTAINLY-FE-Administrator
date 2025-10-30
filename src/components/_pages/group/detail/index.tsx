import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/certificateGroups';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import EventsTable from 'components/_pages/notifications/events-settings/EventsTable';
import TabLayout from 'components/Layout/TabLayout';
import { getEditAndDeleteWidgetButtons, createWidgetDetailHeaders } from 'utils/widget';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import Container from 'components/Container';
import Breadcrumb from 'components/Breadcrumb';

export default function GroupDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const group = useSelector(selectors.certificateGroup);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const getFreshGroupDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.getGroupDetail({ uuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshGroupDetails();
    }, [getFreshGroupDetails, id]);

    const onEditClick = useCallback(() => {
        navigate(`../../edit/${group?.uuid}`, { relative: 'path' });
    }, [group, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!group) return;

        dispatch(actions.deleteGroup({ uuid: group.uuid }));
        setConfirmDelete(false);
    }, [group, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(() => getEditAndDeleteWidgetButtons(onEditClick, setConfirmDelete), [onEditClick]);

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !group
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', group.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', group.name],
                      },
                      {
                          id: 'email',
                          columns: ['Email', group.email || ''],
                      },
                      {
                          id: 'description',
                          columns: ['Description', group.description || ''],
                      },
                  ],
        [group],
    );

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.Groups)} Inventory`, href: '/groups' },
                    { label: group?.name || 'Group Details', href: '' },
                ]}
            />
            <Container>
                <TabLayout
                    tabs={[
                        {
                            title: 'Details',
                            content: (
                                <Container>
                                    <Widget
                                        title="Group Details"
                                        busy={isFetchingDetail}
                                        widgetButtons={buttons}
                                        titleSize="large"
                                        refreshAction={getFreshGroupDetails}
                                        widgetLockName={LockWidgetNameEnum.GroupDetails}
                                    >
                                        <CustomTable headers={detailHeaders} data={detailData} />
                                    </Widget>

                                    {group && (
                                        <CustomAttributeWidget
                                            resource={Resource.Groups}
                                            resourceUuid={group.uuid}
                                            attributes={group.customAttributes}
                                        />
                                    )}
                                </Container>
                            ),
                        },
                        {
                            title: 'Events',
                            content: (
                                <>
                                    {group && (
                                        <EventsTable
                                            mode="association"
                                            resource={Resource.Groups}
                                            resourceUuid={group.uuid}
                                            widgetLocks={[LockWidgetNameEnum.GroupDetails, LockWidgetNameEnum.EventSettings]}
                                        />
                                    )}
                                </>
                            ),
                        },
                    ]}
                />

                <Dialog
                    isOpen={confirmDelete}
                    caption="Delete Group"
                    body="You are about to delete an Group. Is this what you want to do?"
                    toggle={() => setConfirmDelete(false)}
                    icon="delete"
                    buttons={[
                        { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                        { color: 'secondary', type: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    ]}
                />
            </Container>
        </div>
    );
}
