import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { useCallback, useMemo } from 'react';
import { AttributeDescriptorModel, AttributeResponseModel, isDataAttributeModel } from 'types/attributes';
import { getAttributeContent } from 'utils/attributes/attributes';

export interface Props {
    attributes?: AttributeResponseModel[];
    descriptorAttributes?: AttributeDescriptorModel[];
    hasHeader?: boolean;
}

export default function ComplianceRuleAttributeViewer({ attributes, descriptorAttributes, hasHeader = true }: Props) {
    const getContent = useCallback(getAttributeContent, []);

    const tableHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                width: '20%',
            },
            {
                id: 'value',
                content: 'Value',
                sortable: true,
                width: '80%',
            },
        ],
        [],
    );

    const tableData: TableDataRow[] = useMemo(() => {
        const attributeRows = attributes?.map((attribute) => ({
            id: attribute.uuid || attribute.name,
            columns: [attribute.name || '', getContent(attribute.contentType, attribute.content)],
        }));
        const descriptorRows = descriptorAttributes?.filter(isDataAttributeModel).map((attribute) => ({
            id: attribute.uuid || attribute.name,
            columns: [attribute.name || '', getContent(attribute.contentType, attribute.content)],
        }));
        return [...(attributeRows ?? []), ...(descriptorRows ?? [])];
    }, [attributes, descriptorAttributes, getContent]);

    return <CustomTable headers={tableHeaders} data={tableData} hasHeader={hasHeader} />;
}
