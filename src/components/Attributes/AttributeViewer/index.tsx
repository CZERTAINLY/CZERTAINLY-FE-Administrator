import CustomTable, { TableDataRow } from "components/CustomTable";
import { useCallback, useMemo } from "react";
import { AttributeResponseModel } from "types/attributes";
import { getAttributeContent } from "utils/attributes/attributes";
import { MetadataItemModel, MetadataModel } from "types/locations";

export enum ATTRIBUTE_VIEWER_TYPE {
    ATTRIBUTE,
    METADATA,
    METADATA_FLAT
}

export interface Props {
    attributes?: AttributeResponseModel[] | undefined;
    metadata?: MetadataModel[] | undefined;
    viewerType?: ATTRIBUTE_VIEWER_TYPE;
    hasHeader?: boolean
}

export default function AttributeViewer({
                                            attributes = [],
                                            metadata = [],
                                            hasHeader = true,
                                            viewerType = ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE
                                        }: Props) {
    const getContent = useCallback(getAttributeContent, []);

    const tableHeaders = (viewerType: ATTRIBUTE_VIEWER_TYPE) => {
        const result = [];
        if (viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA || viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT) {
            result.push(
                {
                    id: "connector",
                    content: "Connector",
                    sortable: true,
                }
            );
        }
        if (viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE || viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT) {
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
                    id: "settings",
                    content: "Settings",
                    sortable: true,
                    width: "40%",
                }
            );
        }
        return result;
    }

    const getAttributesTableData = useCallback((attribute: AttributeResponseModel | MetadataItemModel) => ({
        id: attribute.uuid || "",
        columns: [
            attribute.label || "",
            attribute.contentType || "",
            getContent(attribute.contentType, attribute.content)
        ]
    }), [getContent]);

    const getMetadataTableData = useCallback((attribute: MetadataModel) => ({
        id: attribute.connectorUuid || "",
        columns: [attribute.connectorName],
        detailColumns: [
            <CustomTable
                headers={tableHeaders(ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE)}
                data={attribute.items.map(getAttributesTableData)}
                hasHeader={true}/>
        ]
    }), [getAttributesTableData]);

    const tableData: TableDataRow[] = useMemo(() => viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE
        ? attributes?.map(getAttributesTableData)
        : (viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA
                ? metadata?.map(getMetadataTableData)
                : (viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT
                    ? metadata?.map(m => m.items.map(i => ({
                        ...getAttributesTableData(i),
                        columns: [m.connectorName, ...getAttributesTableData(i).columns]
                    }))).flat()
                    : [])
        ), [attributes, metadata, getAttributesTableData, getMetadataTableData, viewerType]);

    return (tableData) ? (
        <CustomTable
            headers={tableHeaders(viewerType)}
            data={tableData}
            hasHeader={hasHeader}
            hasDetails={viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA}
        />
    ) : <></>
}
