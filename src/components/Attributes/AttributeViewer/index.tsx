import CustomTable, { TableDataRow } from 'components/CustomTable';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form as BootstrapForm, Button } from 'reactstrap';
import {
    AttributeDescriptorModel,
    AttributeResponseModel,
    BaseAttributeContentModel,
    CustomAttributeModel,
    isCustomAttributeModelArray,
    isDataAttributeModel,
} from 'types/attributes';
import { MetadataItemModel, MetadataModel } from 'types/locations';
import { NameAndUuidDto, PlatformEnum, Resource } from 'types/openapi';
import { getAttributeContent } from 'utils/attributes/attributes';
import { actions as userInterfaceActions } from '../../../ducks/user-interface';
import ContentValueField from '../../Input/DynamicContent/ContentValueField';
import WidgetButtons, { IconName } from '../../WidgetButtons';

export enum ATTRIBUTE_VIEWER_TYPE {
    ATTRIBUTE,
    ATTRIBUTES_WITH_DESCRIPTORS,
    METADATA,
    METADATA_FLAT,
    ATTRIBUTE_EDIT,
}

export interface Props {
    attributes?: AttributeResponseModel[] | undefined;
    descriptors?: AttributeDescriptorModel[] | CustomAttributeModel[];
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
    const contentTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AttributeContentType));
    const dispatch = useDispatch();

    const tableHeaders = (viewerType: ATTRIBUTE_VIEWER_TYPE) => {
        const result = [];
        if (viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA || viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT) {
            result.push(
                {
                    id: 'connector',
                    content: 'Connector',
                    sortable: true,
                },
                {
                    id: 'sourceObject',
                    content: 'Source Object',
                    sortable: true,
                },
            );
        }
        if (
            viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE ||
            viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTES_WITH_DESCRIPTORS ||
            viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT ||
            viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT
        ) {
            result.push(
                {
                    id: 'name',
                    content: 'Name',
                    sortable: true,
                    width: '20%',
                },
                {
                    id: 'contentType',
                    content: 'Content Type',
                    sortable: true,
                    width: '20%',
                },
                {
                    id: 'content',
                    content: 'Content',
                    sortable: true,
                    width: '40%',
                },
            );
        }
        if (viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT) {
            result.push({
                id: 'actions',
                content: 'Actions',
                sortable: false,
                width: '15%',
            });
        }

        return result;
    };

    const renderSourceObjectsButton = useCallback(
        (attribute: AttributeResponseModel | MetadataItemModel, resource: Resource) => {
            const headers = [
                { id: 'sourceObject', content: 'Name', sortable: true },
                { id: 'uuid', content: 'UUID', sortable: true },
            ];

            const createData = (so: NameAndUuidDto) => ({
                id: so.uuid,
                columns: [
                    so.name,
                    <Link onClick={() => dispatch(userInterfaceActions.resetState())} to={`/${resource}/detail/${so.uuid}`}>
                        {so.uuid}
                    </Link>,
                ],
            });

            if ('sourceObjects' in attribute && attribute.sourceObjects.length > 0 && resource) {
                return (
                    <Button
                        className="btn btn-link p-0 ms-2"
                        color="white"
                        title="Source objects"
                        onClick={() => {
                            dispatch(
                                userInterfaceActions.showGlobalModal({
                                    content: <CustomTable headers={headers} data={attribute.sourceObjects.map(createData)} />,
                                    isOpen: true,
                                    showCloseButton: true,
                                    title: 'Source objects',
                                    size: 'lg',
                                }),
                            );
                        }}
                    >
                        <i className="fa fa-info" style={{ color: 'auto' }} />
                    </Button>
                );
            }
            return null;
        },
        [dispatch],
    );

    const getAttributesTableData = useCallback(
        (attribute: AttributeResponseModel | MetadataItemModel, resource?: Resource): TableDataRow => ({
            id: attribute.uuid || attribute.name,
            columns: [
                attribute.label || attribute.name || '',
                getEnumLabel(contentTypeEnum, attribute.contentType),
                <>
                    {getContent(attribute.contentType, attribute.content)}
                    {resource && renderSourceObjectsButton(attribute, resource)}
                </>,
            ],
        }),
        [getContent, contentTypeEnum, renderSourceObjectsButton],
    );

    const getDescriptorsTableData = useCallback(
        (descriptor: AttributeDescriptorModel): TableDataRow => {
            const attribute = attributes?.find((a) => a.name === descriptor.name);
            return {
                id: descriptor.uuid || '',
                columns: [
                    isDataAttributeModel(descriptor) ? descriptor.properties.label : descriptor.name,
                    isDataAttributeModel(descriptor) ? getEnumLabel(contentTypeEnum, descriptor.contentType) : 'n/a',
                    isDataAttributeModel(descriptor)
                        ? attribute
                            ? getContent(attribute.contentType, attribute.content)
                            : getContent(descriptor.contentType, descriptor.content)
                        : '',
                ],
            };
        },
        [getContent, attributes, contentTypeEnum],
    );

    const getMetadataTableData = useCallback(
        (attribute: MetadataModel): TableDataRow => ({
            id: attribute.connectorUuid || '',
            columns: [attribute.connectorName || 'No connector', attribute.sourceObjectType || ''],
            detailColumns: [
                <CustomTable
                    headers={tableHeaders(ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE)}
                    data={attribute.items.map((attributeItem) => getAttributesTableData(attributeItem, attribute.sourceObjectType))}
                    hasHeader={true}
                />,
            ],
        }),
        [getAttributesTableData],
    );

    const getButtons = useCallback(
        (descriptor: CustomAttributeModel, attributeName: string) => {
            const buttons = [];
            if (editingAttributesNames.find((a) => a === attributeName)) {
                buttons.push({
                    icon: 'times' as IconName,
                    disabled: false,
                    tooltip: 'Cancel',
                    onClick: () => {
                        setEditingAttributesNames(editingAttributesNames.filter((n) => n !== attributeName));
                    },
                });
            } else {
                buttons.push({
                    icon: 'pencil' as IconName,
                    disabled: descriptor.properties.readOnly,
                    tooltip: descriptor.properties.readOnly ? 'Attribute is read only, edit is disabled' : 'Edit',
                    onClick: () => {
                        setEditingAttributesNames([...editingAttributesNames, attributeName]);
                    },
                });
            }
            onRemove &&
                buttons.push({
                    icon: 'trash' as IconName,
                    disabled: descriptor.properties.required,
                    tooltip: descriptor.properties.required ? "Attribute is required, can't be removed" : 'Remove',
                    onClick: () => onRemove(descriptor.uuid),
                });
            return buttons;
        },
        [editingAttributesNames, onRemove],
    );

    const getAttributesEditTableData = useCallback(
        (attributes: AttributeResponseModel[], descriptors: CustomAttributeModel[]): TableDataRow[] => {
            if (!attributes || !descriptors) {
                return [];
            }
            return attributes
                .filter((a) => descriptors.find((d) => d.name === a.name))
                .map((a) => {
                    const descriptor = descriptors.find((d) => d.name === a.name);
                    return {
                        id: a.uuid || '',
                        columns: [
                            a.label || '',
                            getEnumLabel(contentTypeEnum, a.contentType),
                            onSubmit && descriptor && editingAttributesNames.find((n) => n === a.name) ? (
                                <Form onSubmit={() => {}}>
                                    {({ values }) => (
                                        <BootstrapForm>
                                            <ContentValueField
                                                descriptor={descriptor}
                                                initialContent={a.content}
                                                onSubmit={(uuid, content) => {
                                                    setEditingAttributesNames(editingAttributesNames.filter((n) => n !== descriptor.name));
                                                    onSubmit(uuid, content);
                                                }}
                                            />
                                        </BootstrapForm>
                                    )}
                                </Form>
                            ) : (
                                getContent(a.contentType, a.content)
                            ),
                            <WidgetButtons buttons={getButtons(descriptor!, a.name)} />,
                        ],
                    };
                });
        },
        [getContent, getButtons, editingAttributesNames, onSubmit, contentTypeEnum],
    );

    const tableData: TableDataRow[] = useMemo(() => {
        switch (viewerType) {
            case ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE:
                return attributes?.map((attribute) => getAttributesTableData(attribute));
            case ATTRIBUTE_VIEWER_TYPE.ATTRIBUTES_WITH_DESCRIPTORS:
                return descriptors?.map(getDescriptorsTableData);
            case ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT:
                return isCustomAttributeModelArray(descriptors) ? getAttributesEditTableData(attributes, descriptors) : [];
            case ATTRIBUTE_VIEWER_TYPE.METADATA:
                return metadata?.map(getMetadataTableData);
            case ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT:
                return metadata
                    ?.map((m) =>
                        m.items.map((i) => ({
                            ...getAttributesTableData(i),
                            columns: [m.connectorName ?? 'No connector', ...getAttributesTableData(i).columns],
                        })),
                    )
                    .flat();

            default:
                return [];
        }
    }, [
        attributes,
        metadata,
        getAttributesTableData,
        getAttributesEditTableData,
        getMetadataTableData,
        viewerType,
        descriptors,
        getDescriptorsTableData,
    ]);

    return tableData ? (
        <CustomTable
            headers={tableHeaders(viewerType)}
            data={tableData}
            hasHeader={hasHeader}
            hasDetails={viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA}
        />
    ) : (
        <></>
    );
}
