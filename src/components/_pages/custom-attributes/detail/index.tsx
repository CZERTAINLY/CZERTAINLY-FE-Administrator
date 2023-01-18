import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/customAttributes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Badge, Container } from "reactstrap";
import { getAttributeContent } from "utils/attributes/attributes";

export default function CustomAttributeDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {id} = useParams();

    const customAttribute = useSelector(selectors.customAttribute);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    useEffect(
        () => {
            if (!id) return;
            if (!customAttribute || (id !== customAttribute.uuid)) {
                dispatch(actions.getCustomAttribute(id));
            }
        },
        [dispatch, customAttribute, id],
    );

    const onEditClick = useCallback(
        () => {
            navigate(`../../edit/${customAttribute?.uuid}`, {relative: "path"});
        },
        [customAttribute, navigate],
    );

    const onDeleteConfirmed = useCallback(
        () => {
            if (!customAttribute) return;
            dispatch(actions.deleteCustomAttribute(customAttribute.uuid));
            setConfirmDelete(false);
        },
        [customAttribute, dispatch],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: "trash", disabled: false, tooltip: "Delete", onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: customAttribute?.enabled ? "times" : "check",
                disabled: !customAttribute || isEnabling || isDisabling,
                tooltip: customAttribute?.enabled ? "Disable" : "Enable",
                onClick: () => customAttribute?.enabled ? dispatch(actions.disableCustomAttribute(customAttribute?.uuid)) : (customAttribute ? dispatch(actions.enableCustomAttribute(customAttribute?.uuid)) : {}),
            },
        ],
        [onEditClick, customAttribute, dispatch, isDisabling, isEnabling],
    );

    const detailsTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons}/>
                </div>
                <h5>
                    Group <span className="fw-semi-bold">Details</span>
                </h5>
            </div>
        ), [buttons],
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
        () => !customAttribute ? [] : [
            {
                id: "uuid",
                columns: ["UUID", customAttribute.uuid],
            },
            {
                id: "name",
                columns: ["Name", customAttribute.name],
            },
            {
                id: "label",
                columns: ["Label", customAttribute.label],
            },
            {
                id: "description",
                columns: ["Description", customAttribute.description],
            },
            {
                id: "group",
                columns: ["Group", customAttribute.group ?? ""],
            },
            {
                id: "resources",
                columns: ["Resources", customAttribute.resources?.join(", ") ?? ""],
            },
            {
                id: "contentType",
                columns: ["Content Type", customAttribute.contentType],
            },
            {
                id: "content",
                columns: ["Content", getAttributeContent(customAttribute.contentType, customAttribute.content)],
            },
            {
                id: "enabled",
                columns: ["Enabled", <StatusBadge enabled={customAttribute.enabled}/>],
            },
            {
                id: "visible",
                columns: ["Visible", customAttribute.visible ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>],
            },
            {
                id: "required",
                columns: ["Required", customAttribute.required ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>],
            },
            {
                id: "readOnly",
                columns: ["Read Only", customAttribute.readOnly ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>],
            },
            {
                id: "list",
                columns: ["List", customAttribute.list ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>],
            },
            {
                id: "multiSelect",
                columns: ["Multi Select", customAttribute.multiSelect ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>],
            },
        ],
        [customAttribute],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={detailsTitle} busy={isFetchingDetail || isEnabling || isDisabling}>
                <CustomTable
                    headers={detailHeaders}
                    data={detailData}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Custom Attribute"
                body="You are about to delete an Custom Attribute. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    {color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete"},
                    {color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel"},
                ]}
            />
        </Container>
    );
}

