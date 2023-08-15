import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";
import { actions as notificationsActions, selectors as notificationsSelectors } from "ducks/notifications";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Container } from "reactstrap";

const NotificationInstanceList = () => {
    const dispatch = useDispatch();

    const notificationInstances = useSelector(notificationsSelectors.notificationInstances);
    const isFetchingNotificationInstances = useSelector(notificationsSelectors.isFetchingNotificationInstances);
    const navigate = useNavigate();

    const getFreshNotificationInstances = useCallback(() => {
        dispatch(notificationsActions.listNotificationInstances());
    }, [dispatch]);

    useEffect(() => {
        getFreshNotificationInstances();
    }, [getFreshNotificationInstances]);

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

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
        ],
        [],
    );
    const notificationInstanceHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "name",
                content: "Name",
            },
            {
                id: "description",
                content: "Description",
            },
            {
                id: "connector",
                content: "Connector",
            },
            {
                id: "kind",
                content: "Kind",
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
                          <Link to={`../../../connectors/detail/${notificationInstance.connectorUuid}`}>
                              <Badge color="primary">{notificationInstance.connectorName}</Badge>
                          </Link>,
                          <Badge>{notificationInstance.kind}</Badge> || "",
                      ],
                  })),
        [notificationInstances],
    );

    return (
        <Container>
            <Widget
                titleSize="larger"
                title="Notification Instances"
                refreshAction={getFreshNotificationInstances}
                busy={isFetchingNotificationInstances}
                widgetButtons={buttons}
            >
                <CustomTable data={notificationInstanceData} headers={notificationInstanceHeaders} />
            </Widget>
        </Container>
    );
};

export default NotificationInstanceList;
