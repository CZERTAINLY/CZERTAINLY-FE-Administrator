import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Widget from "components/Widget";
import { actions as notificationsActions, selectors as notificationsSelectors } from "ducks/notifications";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Badge, Col, Row } from "reactstrap";
const NotificationInstanceList = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const notificationInstance = useSelector(notificationsSelectors.notificationInstanceDetail);
    const isFetchingNotificationInstanceDetail = useSelector(notificationsSelectors.isFetchingNotificationInstanceDetail);

    useEffect(() => {
        if (!id) return;
        dispatch(notificationsActions.getNotificationInstance({ uuid: id }));
    }, [id]);
    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "property",
                content: "Property",
            },
            {
                id: "value",
                content: "Value",
            },
        ],
        [],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !notificationInstance
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", notificationInstance.uuid],
                      },
                      {
                          id: "name",
                          columns: ["Name", notificationInstance.name],
                      },
                      {
                          id: "description",
                          columns: ["Description", notificationInstance.description || ""],
                      },
                      {
                          id: "connectorName",
                          columns: [
                              "Type",
                              <Link to={`../../../connectors/detail/${notificationInstance.connectorUuid}`}>
                                  <Badge color="primary">{notificationInstance.connectorName}</Badge>
                              </Link>,
                          ],
                      },
                      {
                          id: "kind",
                          columns: ["Config", notificationInstance.kind || ""],
                      },
                  ],
        [notificationInstance],
    );

    return (
        <Widget>
            <Row>
                <Col>
                    <Widget title="Notification Instance Details" titleSize="large" busy={isFetchingNotificationInstanceDetail}>
                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>
                <Col>
                    {notificationInstance?.attributes?.length ? (
                        <Widget title="Notification Instance Attributes" busy={isFetchingNotificationInstanceDetail}>
                            <AttributeViewer attributes={notificationInstance.attributes} viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE} />
                        </Widget>
                    ) : (
                        <></>
                    )}
                </Col>
            </Row>
        </Widget>
    );
};

export default NotificationInstanceList;
