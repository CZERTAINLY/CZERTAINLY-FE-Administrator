import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EntityType } from "ducks/filters";
import { actions, selectors } from "ducks/notifications";
import { selectors as pagingSelectors } from "ducks/paging";

import { TableDataRow, TableHeader } from "components/CustomTable";
import PagedList from "components/PagedList/PagedList";
import { WidgetButtonProps } from "components/WidgetButtons";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { SearchRequestModel } from "types/certificate";
import { LockWidgetNameEnum } from "types/widget-locks";

function NotificationsList() {
    const dispatch = useDispatch();

    const notifications = useSelector(selectors.notifications);
    const isDeleting = useSelector(selectors.isDeleting);
    const isMarking = useSelector(selectors.isMarking);
    const isBusy = isDeleting || isMarking;

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.NOTIFICATIONS));
    const isFetching = useSelector(pagingSelectors.isFetchingList(EntityType.NOTIFICATIONS));

    const [isOpenNotifications, setIsOpenNotifications] = useState(false);
    const toggleNotificationsDropdown = useCallback(() => setIsOpenNotifications(!isOpenNotifications), [isOpenNotifications]);

    const onMarkAsReadClick = useCallback(() => {
        for (const uuid of checkedRows) {
            dispatch(actions.markAsReadNotification({ uuid }));
        }
    }, [checkedRows, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "check",
                disabled: checkedRows.length === 0,
                tooltip: "Mark as read",
                onClick: () => {
                    onMarkAsReadClick();
                },
            },
        ],
        [checkedRows.length, onMarkAsReadClick],
    );

    const notificationsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Message",
                id: "message",
                width: "100%",
            },
            {
                content: "Unread",
                id: "unread",
                width: "5%",
            },
        ],
        [],
    );

    const notificationsList: TableDataRow[] = useMemo(
        () =>
            notifications.map((notification) => ({
                id: notification.uuid,
                columns: [
                    notification.message,
                    notification.readAt ? <></> : <i className="fa fa-check-circle" style={{ color: "grey" }} />,
                ],
                detailColumns: notification.detail ? [notification.detail] : undefined,
            })),
        [notifications],
    );

    const onListCallback = useCallback(
        (pagination: SearchRequestModel) => dispatch(actions.listNotifications({ unread: false, pagination })), // TODO: unread
        [dispatch],
    );

    return (
        <Dropdown isOpen={isOpenNotifications} toggle={toggleNotificationsDropdown}>
            <DropdownToggle nav>
                <i
                    className={
                        isFetching
                            ? "fa fa-spinner pt-1 mt-2"
                            : notifications.filter((n) => n.readAt === undefined).length > 0
                            ? "fa fa-bell pt-1 mt-2"
                            : "fa fa-bell-slash pt-1 mt-2"
                    }
                    style={{ color: "white" }}
                />
            </DropdownToggle>

            <DropdownMenu style={{ width: "400px" }} className="m-0 p-0">
                {isOpenNotifications && (
                    <PagedList
                        entity={EntityType.NOTIFICATIONS}
                        onListCallback={onListCallback}
                        onDeleteCallback={(uuids) => uuids.forEach((uuid) => dispatch(actions.deleteNotification({ uuid })))}
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
                )}
            </DropdownMenu>
        </Dropdown>
    );
}

export default NotificationsList;
