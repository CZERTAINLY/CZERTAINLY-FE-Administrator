import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Select from 'components/Select';
import { PlatformEnum, Resource } from 'types/openapi';

import { useHasEventsResourceOptions, useRuleEvaluatorResourceOptions } from 'utils/rules';

const TriggerList = () => {
    const triggers = useSelector(rulesSelectors.triggers);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const eventNameEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const isFetchingList = useSelector(rulesSelectors.isFetchingTriggers);
    const isDeleting = useSelector(rulesSelectors.isDeletingTrigger);

    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { resourceOptionsWithEvents } = useHasEventsResourceOptions();

    const isBusy = useMemo(() => isFetchingList || isDeleting, [isFetchingList, isDeleting]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(rulesActions.deleteTrigger({ triggerUuid: checkedRows[0] }));
        setConfirmDelete(false);
        setCheckedRows([]);
    }, [dispatch, checkedRows]);

    const getFreshList = useCallback(() => {
        dispatch(rulesActions.listTriggers({ resource: selectedResource }));
    }, [dispatch, selectedResource]);

    useEffect(() => {
        getFreshList();
    }, [getFreshList]);

    const triggerTableHeader: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                align: 'left',
                id: 'name',
                width: '12%',
                sortable: true,
            },
            {
                content: 'Ignore Trigger',
                align: 'left',
                id: 'ignoreTrigger',
                width: '12%',
            },
            {
                content: 'Trigger Type',
                align: 'left',
                id: 'triggerType',
                width: '12%',
                sortable: true,
            },
            {
                content: 'Event Name',
                align: 'left',
                id: 'eventName',
                width: '12%',
                sortable: true,
            },
            {
                content: 'Resource',
                align: 'left',
                id: 'resource',
                width: '12%',
                sortable: true,
            },
            {
                content: 'Description',
                align: 'left',
                id: 'description',
                width: '12%',
            },
        ],
        [],
    );

    const triggerListData: TableDataRow[] = useMemo(
        () =>
            triggers.map((trigger) => {
                return {
                    id: trigger.uuid,
                    columns: [
                        <Link to={`./detail/${trigger.uuid}`}>{trigger.name}</Link>,
                        trigger.ignoreTrigger ? 'Yes' : 'No',
                        getEnumLabel(triggerTypeEnum, trigger.type ?? ''),
                        getEnumLabel(eventNameEnum, trigger.event ?? ''),
                        getEnumLabel(resourceTypeEnum, trigger.resource),
                        trigger.description || '',
                    ],
                };
            }),
        [triggers, resourceTypeEnum, eventNameEnum, triggerTypeEnum],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'search',
                disabled: false,
                tooltip: 'Select Resource',
                onClick: () => {},
                custom: (
                    <Select
                        placeholder="Select Resource"
                        id="resource"
                        options={resourceOptionsWithEvents}
                        value={selectedResource || 'Select Resource'}
                        onChange={(value) => {
                            setSelectedResource(value as Resource);
                        }}
                    />
                ),
            },
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: () => navigate(`./add`),
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [checkedRows, navigate, resourceOptionsWithEvents, selectedResource],
    );

    return (
        <>
            <Widget
                titleSize="larger"
                title="Triggers"
                refreshAction={getFreshList}
                busy={isBusy}
                widgetButtons={buttons}
                widgetInfoCard={{
                    title: 'Information',
                    description: 'Triggers are defined to trigger actions based on certain conditions of a resource',
                }}
            >
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={triggerListData}
                    headers={triggerTableHeader}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Trigger`}
                body={`You are about to delete a Trigger. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </>
    );
};

export default TriggerList;
