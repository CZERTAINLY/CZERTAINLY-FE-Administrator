import CustomTable, { TableDataRow } from "components/CustomTable";
import React, { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";
import { Form as BootstrapForm } from "reactstrap";
import { AttributeResponseModel, BaseAttributeContentModel, CustomAttributeModel } from "types/attributes";
import { MetadataItemModel, MetadataModel } from "types/locations";
import { getAttributeContent } from "utils/attributes/attributes";
import ContentValueField from "../../Input/DynamicContent/ContentValueField";
import WidgetButtons, { IconName } from "../../WidgetButtons";

export enum ATTRIBUTE_VIEWER_TYPE {
    ATTRIBUTE,
    METADATA,
    METADATA_FLAT,
    ATTRIBUTE_EDIT,
}

export interface Props {
    attributes?: AttributeResponseModel[] | undefined;
    descriptors?: CustomAttributeModel[];
    metadata?: MetadataModel[] | undefined;
    viewerType?: ATTRIBUTE_VIEWER_TYPE;
    hasHeader?: boolean;
    onSubmit?: (attributeUuid: string, content: BaseAttributeContentModel[]) => void;
    onRemove?: (attributeUuid: string) => void;
}

export default function AttributeViewer({
                                            attributes = [],
                                            descriptors = [],
                                            metadata = [],
                                            hasHeader = true,
                                            viewerType = ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE,
                                            onSubmit,
                                            onRemove,
                                        }: Props) {
    const getContent = useCallback(getAttributeContent, []);
    const [editingAttributesNames, setEditingAttributesNames] = useState<string[]>([]);

    const tableHeaders = (viewerType: ATTRIBUTE_VIEWER_TYPE) => {
        const result = [];
        if (viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA || viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT) {
            result.push(
                {
                    id: "connector",
                    content: "Connector",
                    sortable: true,
                },
            );
        }
        if (viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE || viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT || viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT) {
            result.push(
                {
                    id: "name",
                    content: "Name",
                    sortable: true,
                    width: "20%",
                },
                {
                    id: "contentType",
                    content: "Content Type",
                    sortable: true,
                    width: "20%",
                },
                {
                    id: "content",
                    content: "Content",
                    sortable: true,
                    width: "40%",
                },
            );
        }
        if (viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT) {
            result.push(
                {
                    id: "actions",
                    content: "Actions",
                    sortable: false,
                    width: "15%",
                },
            );
        }
        return result;
    };

    const getAttributesTableData = useCallback((attribute: AttributeResponseModel | MetadataItemModel) => ({
        id: attribute.uuid || "",
        columns: [
            attribute.label || "",
            attribute.contentType || "",
            getContent(attribute.contentType, attribute.content),
        ],
    }), [getContent]);

    const getMetadataTableData = useCallback((attribute: MetadataModel) => ({
        id: attribute.connectorUuid || "",
        columns: [attribute.connectorName],
        detailColumns: [
            <CustomTable
                headers={tableHeaders(ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE)}
                data={attribute.items.map(getAttributesTableData)}
                hasHeader={true}/>,
        ],
    }), [getAttributesTableData]);

    const getButtons = useCallback((descriptor: CustomAttributeModel, attributeName: string) => {
        const buttons = [];
        if (editingAttributesNames.find(a => a === attributeName)) {
            buttons.push({
                icon: "times" as IconName,
                disabled: false,
                tooltip: "Cancel",
                onClick: () => {
                    setEditingAttributesNames(editingAttributesNames.filter(n => n !== attributeName));
                },
            });
        } else {
            buttons.push({
                icon: "pencil" as IconName,
                disabled: descriptor.properties.readOnly,
                tooltip: descriptor.properties.readOnly ? "Attribute is read only, edit is disabled" : "Edit",
                onClick: () => {
                    setEditingAttributesNames([...editingAttributesNames, attributeName]);
                },
            });
        }
        onRemove && buttons.push({
            icon: "trash" as IconName,
            disabled: descriptor.properties.required,
            tooltip: descriptor.properties.required ? "Attribute is required, can't be removed" : "Remove",
            onClick: () => onRemove(descriptor.uuid),
        });
        return buttons;
    }, [editingAttributesNames, onRemove]);

    const getAttributesEditTableData = useCallback((attributes: AttributeResponseModel[], descriptors: CustomAttributeModel[]) => {
        if (!attributes || !descriptors) {
            return [];
        }
        return attributes.filter(a => descriptors.find(d => d.name === a.name)).map(a => {
            const descriptor = descriptors.find(d => d.name === a.name);
            return {
                id: a.uuid || "",
                columns: [
                    a.label || "",
                    a.contentType || "",
                    onSubmit && descriptor && editingAttributesNames.find(n => n === a.name)
                        ? <Form onSubmit={() => {
                        }}>
                            {({values}) => (
                                <BootstrapForm>
                                    <ContentValueField descriptor={descriptor} initialContent={a.content} onSubmit={(uuid, content) => {
                                        setEditingAttributesNames(editingAttributesNames.filter(n => n !== descriptor.name));
                                        onSubmit(uuid, content);
                                    }}/>
                                </BootstrapForm>
                            )}
                        </Form>
                        : getContent(a.contentType, a.content),
                    <WidgetButtons buttons={getButtons(descriptor!, a.name)}/>,
                ],
            };
        });
    }, [getContent, getButtons, editingAttributesNames, onSubmit]);

    const tableData: TableDataRow[] = useMemo(() => {
        switch (viewerType) {
            case ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE:
                return attributes?.map(getAttributesTableData);
            case ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT:
                return getAttributesEditTableData(attributes, descriptors);
            case ATTRIBUTE_VIEWER_TYPE.METADATA:
                return metadata?.map(getMetadataTableData);
            case ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT:
                return metadata?.map(m => m.items.map(i => ({
                    ...getAttributesTableData(i),
                    columns: [m.connectorName, ...getAttributesTableData(i).columns],
                }))).flat();
            default:
                return [];
        }
    }, [attributes, metadata, getAttributesTableData, getAttributesEditTableData, getMetadataTableData, viewerType, descriptors]);

    return (tableData) ? (
        <CustomTable
            headers={tableHeaders(viewerType)}
            data={tableData}
            hasHeader={hasHeader}
            hasDetails={viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA}
        />
    ) : <></>;
}
