import AttributeViewer from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/credentials";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import { Resource } from "../../../../types/openapi";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";

function CredentialDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const credential = useSelector(selectors.credential);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);

    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;
        dispatch(actions.getCredentialDetail({ uuid: id }));
    }, [id, dispatch]);

    const onEditClick = useCallback(() => {
        if (!credential) return;
        navigate(`../../credentials/edit/${credential.uuid}`);
    }, [navigate, credential]);

    const onDeleteConfirmed = useCallback(() => {
        if (!credential) return;
        dispatch(actions.deleteCredential({ uuid: credential.uuid }));
        setConfirmDelete(false);
    }, [dispatch, credential]);

    const onForceDeleteConfirmed = useCallback(() => {
        if (!credential) return;
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.deleteCredential({ uuid: credential.uuid }));
    }, [dispatch, credential]);

    const widgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "pencil",
                disabled: false,
                tooltip: "Edit",
                onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: "trash",
                disabled: false,
                tooltip: "Delete",
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
        ],
        [onEditClick, setConfirmDelete],
    );

    const detailsTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={widgetButtons} />
                </div>

                <h5>
                    Credential <span className="fw-semi-bold">Details</span>
                </h5>
            </div>
        ),
        [widgetButtons],
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
            !credential
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", credential.uuid],
                      },
                      {
                          id: "name",
                          columns: ["Name", credential.name],
                      },
                      {
                          id: "kind",
                          columns: ["Kind", credential.kind],
                      },
                      {
                          id: "credentialProviderName",
                          columns: [
                              "Credential Provider Name",
                              credential.connectorUuid ? (
                                  <Link to={`../../connectors/detail/${credential.connectorUuid}`}>{credential.connectorName}</Link>
                              ) : (
                                  ""
                              ),
                          ],
                      },
                      {
                          id: "credentialProviderUuid",
                          columns: ["Credential Provider UUID", credential.connectorUuid],
                      },
                  ],
        [credential],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={detailsTitle} busy={isFetching || isDeleting}>
                <br />

                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            {credential && credential.attributes && credential.attributes.length > 0 && (
                <Widget title="Credential Attributes">
                    <br />
                    <AttributeViewer attributes={credential?.attributes} />
                </Widget>
            )}

            {credential && (
                <CustomAttributeWidget
                    resource={Resource.Credentials}
                    resourceUuid={credential.uuid}
                    attributes={credential.customAttributes}
                />
            )}

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Credential"
                body="You are about to delete an Credential. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage !== ""}
                caption="Delete Connector"
                body={
                    <>
                        Failed to delete the Credential as the Credential has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    { color: "danger", onClick: onForceDeleteConfirmed, body: "Force" },
                    { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
                ]}
            />
        </Container>
    );
}

export default CredentialDetail;
