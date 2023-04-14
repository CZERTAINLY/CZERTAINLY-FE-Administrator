import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

import Dialog from "components/Dialog";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/certificateGroups";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Container } from "reactstrap";
import { Resource } from "../../../../types/openapi";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";

export default function GroupDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const group = useSelector(selectors.certificateGroup);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        dispatch(actions.getGroupDetail({ uuid: id }));
    }, [dispatch, id]);

    const onEditClick = useCallback(() => {
        navigate(`../../edit/${group?.uuid}`, { relative: "path" });
    }, [group, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!group) return;

        dispatch(actions.deleteGroup({ uuid: group.uuid }));
        setConfirmDelete(false);
    }, [group, dispatch]);

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

    const detailsTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons} />
                </div>

                <h5>
                    Group <span className="fw-semi-bold">Details</span>
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
            !group
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", group.uuid],
                      },
                      {
                          id: "name",
                          columns: ["Name", group.name],
                      },
                      {
                          id: "description",
                          columns: ["Description", group.description || ""],
                      },
                  ],
        [group],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={detailsTitle} busy={isFetchingDetail}>
                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            {group && <CustomAttributeWidget resource={Resource.Groups} resourceUuid={group.uuid} attributes={group.customAttributes} />}

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Group"
                body="You are about to delete an Group. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
