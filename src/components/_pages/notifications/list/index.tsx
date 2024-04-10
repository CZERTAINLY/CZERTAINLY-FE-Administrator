import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EntityType } from 'ducks/filters';
import { actions, selectors } from 'ducks/notifications';
import { selectors as pagingSelectors } from 'ducks/paging';

import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';
import { dateFormatter } from 'utils/dateUtil';

function NotificationsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notifications = useSelector(selectors.notifications);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isMarking = useSelector(selectors.isMarking);
    const isBulkMarking = useSelector(selectors.isBulkMarking);
    const isBusy = isDeleting || isMarking || isBulkDeleting || isBulkMarking;

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.NOTIFICATIONS));

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Mark as read',
                onClick: () =>
                    checkedRows.length > 1
                        ? dispatch(actions.bulkMarkNotificationAsRead({ uuids: checkedRows }))
                        : dispatch(actions.markAsReadNotification({ uuid: checkedRows[0] })),
            },
        ],
        [checkedRows, dispatch],
    );

    const notificationsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Sent At',
                id: 'sent',
                width: '10%',
            },
            {
                content: 'Message',
                id: 'message',
                width: '50%',
            },
        ],
        [],
    );

    const notificationsList: TableDataRow[] = useMemo(
        () =>
            notifications.map((notification) => ({
                id: notification.uuid,
                columns: [
                    dateFormatter(notification.sentAt),
                    <div
                        key={notification.uuid}
                        className={notification.readAt ? '' : 'fw-bolder'}
                        onClick={(event) => {
                            event.stopPropagation();
                            if (!notification.readAt) {
                                dispatch(actions.markAsReadNotification({ uuid: notification.uuid }));
                            }
                        }}
                    >
                        {notification.message}
                        {notification.targetObjectType && notification.targetObjectIdentification && (
                            <Button
                                color="white"
                                size="sm"
                                className={'px-1 m-0'}
                                onClick={() => {
                                    navigate(
                                        `/${notification.targetObjectType}/detail/${notification.targetObjectIdentification?.reduce(
                                            (prev, curr) => prev + '/' + curr,
                                        )}`,
                                    );
                                }}
                            >
                                <i className="fa fa-circle-arrow-right"></i>
                            </Button>
                        )}
                    </div>,
                ],
                detailColumns: notification.detail ? [notification.detail] : undefined,
            })),
        [notifications, dispatch, navigate],
    );
    const onListCallback = useCallback(
        (pagination: SearchRequestModel) => dispatch(actions.listNotifications({ unread: false, pagination })),
        [dispatch],
    );

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.NOTIFICATIONS}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids) =>
                    uuids.length > 1
                        ? dispatch(actions.bulkDeleteNotification({ uuids }))
                        : dispatch(actions.deleteNotification({ uuid: uuids[0] }))
                }
                headers={notificationsRowHeaders}
                data={notificationsList}
                isBusy={isBusy}
                addHidden={true}
                title="List of notifications"
                entityNameSingular="a Notification"
                entityNamePlural="Notifications"
                pageWidgetLockName={LockWidgetNameEnum.ListOfNotifications}
                additionalButtons={buttons}
                hasDetails={true}
            />
        </Container>
    );
}

export default NotificationsList;
