import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/discoveries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { Col, Container, Label, Row } from "reactstrap";

import { dateFormatter } from "utils/dateUtil";
import { Resource } from "../../../../types/openapi";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";
import DiscoveryStatus from "../DiscoveryStatus";
import DiscoveryCertificates from "./DiscoveryCertificates";

export default function DiscoveryDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const discovery = useSelector(selectors.discovery);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetching || isDeleting, [isFetching, isDeleting]);

    useEffect(() => {
        if (!id) return;

        dispatch(actions.getDiscoveryDetail({ uuid: id }));
    }, [dispatch, id]);

    const onDeleteConfirmed = useCallback(() => {
        if (!discovery) return;

        dispatch(actions.deleteDiscovery({ uuid: discovery.uuid }));
        setConfirmDelete(false);
    }, [discovery, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "trash",
                disabled: false,
                tooltip: "Delete",
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
        ],
        [],
    );

    const discoveryTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons} />
                </div>

                <h5>
                    Certificate Discovery <span className="fw-semi-bold">Details</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const metaTitle = (
        <h5>
            <span className="fw-semi-bold">Meta Data</span>
        </h5>
    );

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
            !discovery
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", discovery.uuid],
                      },
                      {
                          id: "name",
                          columns: ["Name", discovery.name],
                      },
                      {
                          id: "kind",
                          columns: ["Kind", discovery.kind],
                      },
                      {
                          id: "discoveryProviderUUID",
                          columns: ["Discovery Provider UUID", discovery.connectorUuid],
                      },
                      {
                          id: "discoveryProviderName",
                          columns: [
                              "Discovery Provider Name",
                              discovery.connectorUuid ? (
                                  <Link to={`../../connectors/detail/${discovery.connectorUuid}`}>{discovery.connectorName}</Link>
                              ) : (
                                  ""
                              ),
                          ],
                      },
                      {
                          id: "status",
                          columns: ["Status", <DiscoveryStatus status={discovery.status} />],
                      },
                      {
                          id: "startTime",
                          columns: [
                              "Discovery Start Time",
                              <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(discovery.startTime)}</span>,
                          ],
                      },
                      {
                          id: "endTime",
                          columns: ["Discovery End Time", <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(discovery.endTime)}</span>],
                      },
                      {
                          id: "totalCertificatesDiscovered",
                          columns: ["Total Certificates Discovered", discovery.totalCertificatesDiscovered?.toString() || "0"],
                      },
                      {
                          id: "message",
                          columns: ["Message", discovery.message || ""],
                      },
                  ],
        [discovery],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={discoveryTitle} busy={isBusy}>
                <br />

                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget title="Attributes">
                        <br />
                        <Label>Discovery Attributes</Label>
                        <AttributeViewer attributes={discovery?.attributes} />
                    </Widget>
                    {discovery && (
                        <CustomAttributeWidget
                            resource={Resource.Discoveries}
                            resourceUuid={discovery.uuid}
                            attributes={discovery.customAttributes}
                        />
                    )}
                </Col>
                <Col>
                    <Widget title={metaTitle}>
                        <br />
                        <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={discovery?.metadata} />
                    </Widget>
                </Col>
            </Row>

            {id && <DiscoveryCertificates id={id} />}

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Certification Discovery"
                body="You are about to delete Discovery. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
