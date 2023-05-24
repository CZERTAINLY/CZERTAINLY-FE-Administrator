import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/customAttributes";
import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Badge, Container } from "reactstrap";
import { PlatformEnum } from "types/openapi";
import { getAttributeContent } from "utils/attributes/attributes";

export default function CustomAttributeDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const customAttribute = useSelector(selectors.customAttribute);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const attributeContentTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AttributeContentType));

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;
        if (!customAttribute || id !== customAttribute.uuid) {
            dispatch(actions.getCustomAttribute(id));
        }
    }, [dispatch, customAttribute, id]);

    const onEditClick = useCallback(() => {
        navigate(`../../edit/${customAttribute?.uuid}`, { relative: "path" });
    }, [customAttribute, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!customAttribute) return;
        dispatch(actions.deleteCustomAttribute(customAttribute.uuid));
        setConfirmDelete(false);
    }, [customAttribute, dispatch]);

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
            {
                icon: customAttribute?.enabled ? "times" : "check",
                disabled: !customAttribute || isEnabling || isDisabling,
                tooltip: customAttribute?.enabled ? "Disable" : "Enable",
                onClick: () =>
                    customAttribute?.enabled
                        ? dispatch(actions.disableCustomAttribute(customAttribute?.uuid))
                        : customAttribute
                        ? dispatch(actions.enableCustomAttribute(customAttribute?.uuid))
                        : {},
            },
        ],
        [onEditClick, customAttribute, dispatch, isDisabling, isEnabling],
    );

    const detailsTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons} />
                </div>
                <h5>
                    Custom Attribute <span className="fw-semi-bold">Details</span>
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

    const getBadge = (property: boolean | undefined, label: string) =>
        property ? (
            <Badge style={{ margin: "1px" }} color="success">
                {label}
            </Badge>
        ) : (
            <></>
        );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !customAttribute
                ? []
                : [
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
                          columns: [
                              "Resources",
                              customAttribute.resources?.map((r) => (
                                  <Badge key={r} style={{ margin: "1px" }} color="secondary">
                                      {getEnumLabel(resourceEnum, r)}
                                  </Badge>
                              )) ?? "",
                          ],
                      },
                      {
                          id: "contentType",
                          columns: ["Content Type", getEnumLabel(attributeContentTypeEnum, customAttribute.contentType)],
                      },
                      {
                          id: "content",
                          columns: ["Content", getAttributeContent(customAttribute.contentType, customAttribute.content)],
                      },
                      {
                          id: "properties",
                          columns: [
                              "Properties",
                              <>
                                  <StatusBadge style={{ margin: "1px" }} enabled={customAttribute.enabled} />
                                  {getBadge(customAttribute.visible, "Visible")}
                                  {getBadge(customAttribute.required, "Required")}
                                  {getBadge(customAttribute.readOnly, "Read Only")}
                                  {getBadge(customAttribute.list, "List")}
                                  {getBadge(customAttribute.multiSelect, "Multi Select")}
                              </>,
                          ],
                      },
                  ],
        [customAttribute, attributeContentTypeEnum, resourceEnum],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={detailsTitle} busy={isFetchingDetail || isEnabling || isDisabling}>
                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Custom Attribute"
                body="You are about to delete an Custom Attribute. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
