import AttributeViewer from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/entities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Container, Label } from "reactstrap";
import { Resource } from "../../../../types/openapi";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";

export default function EntityDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const entity = useSelector(selectors.entity);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetching || isDeleting, [isFetching, isDeleting]);

    useEffect(() => {
        if (!id) return;
        dispatch(actions.resetState());
        dispatch(actions.getEntityDetail({ uuid: id }));
    }, [dispatch, id]);

    const onEditClick = useCallback(() => {
        if (!entity) return;
        navigate(`../../edit/${entity.uuid}`, { relative: "path" });
    }, [entity, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!entity) return;

        dispatch(actions.deleteEntity({ uuid: entity.uuid, redirect: "../../" }));
        setConfirmDelete(false);
    }, [entity, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
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
        [onEditClick],
    );

    const entityTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons} />
                </div>

                <h5>
                    Entity <span className="fw-semi-bold">Details</span>
                </h5>
            </div>
        ),
        [buttons],
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
            !entity
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", entity.uuid],
                      },
                      {
                          id: "name",
                          columns: ["Name", entity.name],
                      },
                      {
                          id: "kind",
                          columns: ["Kind", entity.kind],
                      },
                      {
                          id: "entityProviderUUID",
                          columns: ["Entity Provider UUID", entity.connectorUuid],
                      },
                      {
                          id: "entityProviderName",
                          columns: [
                              "Entity Provider Name",
                              entity.connectorUuid ? (
                                  <Link to={`../../connectors/detail/${entity.connectorUuid}`}>{entity.connectorName}</Link>
                              ) : (
                                  ""
                              ),
                          ],
                      },
                  ],
        [entity],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={entityTitle} busy={isBusy}>
                <br />

                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            <Widget title="Attributes">
                <br />
                <Label>Entity Attributes</Label>
                <AttributeViewer attributes={entity?.attributes} />
            </Widget>

            {entity && (
                <CustomAttributeWidget resource={Resource.Entities} resourceUuid={entity.uuid} attributes={entity.customAttributes} />
            )}

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Entity"
                body="You are about to delete Entity. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
