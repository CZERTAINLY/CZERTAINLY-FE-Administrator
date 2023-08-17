import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";
import { actions as notificationsActions, selectors as notificationsSelectors } from "ducks/notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "reactstrap";

const NotificationInstanceList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notificationInstances = useSelector(notificationsSelectors.notificationInstances);
    const isFetchingNotificationInstances = useSelector(notificationsSelectors.isFetchingNotificationInstances);
    const [checkedRows, setCheckedRows] = useState<string[]>([]);

    const isDeleting = useSelector(notificationsSelectors.isDeleting);

    const deleteErrorMessage = useSelector(notificationsSelectors.deleteErrorMessage);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetchingNotificationInstances || isDeleting, [isFetchingNotificationInstances, isDeleting]);

    const getFreshNotificationInstances = useCallback(() => {
        dispatch(notificationsActions.listNotificationInstances());
    }, [dispatch]);

    useEffect(() => {
        getFreshNotificationInstances();
    }, [getFreshNotificationInstances]);

    const onAddClick = useCallback(() => {
        navigate(`../../../notificationinstances/add`);
    }, [navigate]);

    const onDeleteClick = useCallback(() => {
        dispatch(notificationsActions.deleteNotificationInstance({ uuid: checkedRows[0] }));
    }, [checkedRows]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(notificationsActions.clearDeleteErrorMessages());
        dispatch(notificationsActions.deleteNotificationInstance({ uuid: checkedRows[0] }));
        setConfirmDelete(false);
    }, [dispatch, checkedRows]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "plus",
                disabled: false,
                tooltip: "Create",
                onClick: () => {
                    onAddClick();
                },
            },
            {
                icon: "trash",
                disabled: !checkedRows.length,
                tooltip: "Delete",
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
        ],
        [checkedRows],
    );
    const notificationInstanceHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "notificationInstanceName",
                content: "Name",
                sortable: true,
                sort: "asc",
                width: "auto",
            },
            {
                id: "description",
                content: "Description",
                sortable: true,
                width: "auto",
            },
            {
                id: "notificationProvider",
                content: "Notification Provider",
                align: "center",
                sortable: true,
                width: "15%",
            },
            {
                id: "kinds",
                content: "Kinds",
                align: "center",
                width: "15%",
            },
        ],
        [],
    );

    const notificationInstanceData: TableDataRow[] = useMemo(
        () =>
            !notificationInstances.length
                ? []
                : notificationInstances.map((notificationInstance) => ({
                      id: notificationInstance.uuid,
                      columns: [
                          (
                              <Link to={`../../../notificationinstances/detail/${notificationInstance.uuid}`}>
                                  {notificationInstance.name}
                              </Link>
                          ) || "",
                          notificationInstance.description || "",
                          <Badge color="primary">{notificationInstance.connectorName}</Badge>,
                          <Badge color="primary">{notificationInstance.kind}</Badge> || "",
                      ],
                  })),
        [notificationInstances],
    );

    return (
        <>
            <Widget
                titleSize="larger"
                title="Notification Store"
                refreshAction={getFreshNotificationInstances}
                busy={isBusy}
                widgetButtons={buttons}
            >
                <br />
                <CustomTable
                    checkedRows={checkedRows}
                    hasCheckboxes
                    hasAllCheckBox={false}
                    multiSelect={false}
                    data={notificationInstanceData}
                    headers={notificationInstanceHeaders}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    canSearch={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Notification Instance`}
                body={`You are about to delete a Notification Instance. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />

            {/* <Dialog
                isOpen={confirmForceDelete}
                caption={`Force Delete ${checkedRows.length > 1 ? "Authorities" : "an Authority"}`}
                body={forceDeleteBody}
                toggle={() => setConfirmForceDelete(false)}
                buttons={[
                    { color: "danger", onClick: onForceDeleteConfirmed, body: "Force delete" },
                    { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
                ]}
            /> */}
            {/* <Dialog
                isOpen={confirmDelete}
                caption="Delete Certification Authority"
                body="You are about to delete Authority. If you continue, connectors
                  related to the authority will fail. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage !== ""}
                caption="Delete Authority"
                body={
                    <>
                        Failed to delete the Authority Instance as it has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                } */}
        </>
    );
};

export default NotificationInstanceList;
