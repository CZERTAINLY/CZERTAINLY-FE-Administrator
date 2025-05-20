import BooleanBadge from 'components/BooleanBadge/BooleanBadge';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/notification-profiles';
import { actions as notificationActions, selectors as notificationSelectors } from 'ducks/notifications';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';

import { Badge, Col, Container, Row } from 'reactstrap';
import { PlatformEnum, RecipientType, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getInputStringFromIso8601String } from 'utils/duration';

export default function EventDetail() {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const eventDetails = useMemo(
        () => ({
            uuid: '1',
            name: 'Event1',
            resource: Resource.Certificates,
        }),
        [],
    );
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);

    const getFreshData = useCallback(() => {
        if (!id) return;
        dispatch(actions.getNotificationProfileDetail({ uuid: id, version: 1 }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const onEditEvent = useCallback(() => {
        if (!id) return;
        navigate(`../events/edit/${id}/`);
    }, [navigate, id]);

    const widgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditEvent();
                },
            },
        ],
        [onEditEvent],
    );

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const profileData: TableDataRow[] = useMemo(
        () =>
            !eventDetails
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', eventDetails.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', eventDetails.name],
                      },
                  ],
        [eventDetails],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Event Details"
                busy={isFetchingDetail}
                widgetLockName={LockWidgetNameEnum.EventDetails}
                widgetButtons={widgetButtons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <CustomTable headers={headers} data={profileData} />
            </Widget>
        </Container>
    );
}
