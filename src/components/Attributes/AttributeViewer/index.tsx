import cx from 'classnames';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
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
} from 'types/attributes';
import { MetadataItemModel, MetadataModel } from 'types/locations';
import { NameAndUuidDto, PlatformEnum, Resource } from 'types/openapi';
import { getAttributeContent } from 'utils/attributes/attributes';
import { useCopyToClipboard } from 'utils/common-hooks';
import { actions as userInterfaceActions } from '../../../ducks/user-interface';
import ContentValueField from '../../Input/DynamicContent/ContentValueField';
import WidgetButtons, { WidgetButtonProps } from '../../WidgetButtons';
import styles from './attributeViewer.module.scss';

export enum ATTRIBUTE_VIEWER_TYPE {
    ATTRIBUTE,
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
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const dispatch = useDispatch();
    const copyToClipboard = useCopyToClipboard();

    const onCopyContentClick = useCallback(
        (attribute: AttributeResponseModel) => {
            let textToCopy = '';
            if (!attribute?.content?.length) return;
            // if (attribute.content.length > 1) textToCopy = attribute?.content?.map((content) => content.data).join(', ');
            // if (attribute.content.length === 1) textToCopy = attribute.content[0]?.reference.toString();

            // check if reference is there or if no reference then use .data to copy

            if (attribute.content.length > 1) {
                textToCopy = attribute.content
                    .map((content) => {
                        if (content.reference) {
                            return content.reference;
                        }
                        return content.data;
                    })
                    .join(', ');
            }
            if (attribute.content.length === 1) {
                textToCopy = attribute.content[0]?.reference?.toString() || attribute.content[0]?.data.toString();
            }

            if (attribute) {
                copyToClipboard(textToCopy, 'Custom Attribute content was copied to clipboard', 'Failed to copy to clipboard');
            }
        },
        [copyToClipboard],
    );

    const tableHeaders = (viewerType: ATTRIBUTE_VIEWER_TYPE) => {
        const result: TableHeader[] = [];
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
                align: 'center',
            });
        }
        // We add this action if it doesn't exist to add copy to clipboard button
        if (
            viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE ||
            viewerType === ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT ||
            viewerType === ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT
        ) {
            if (!result.find((r) => r.id === 'actions')) {
                result.push({
                    id: 'actions',
                    content: 'Actions',
                    sortable: false,
                    align: 'center',
                    width: '15%',
                });
            }
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
                    <Link onClick={() => dispatch(userInterfaceActions.resetState())} to={`/${resource}/detail/${so.uuid}`}>
                        {so.name}
                    </Link>,
                    so.uuid,
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
                        <i className="fa fa-info" style={{ color: 'auto', marginBottom: '9.5px', marginLeft: '4px', fontSize: '14px' }} />
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
                <i
                    className={cx('fa fa-copy', styles.copyContentButton)}
                    onClick={() => {
                        onCopyContentClick(attribute);
                    }}
                />,
            ],
        }),
        [getContent, contentTypeEnum, renderSourceObjectsButton, onCopyContentClick],
    );

    const getMetadataTableData = useCallback(
        (attribute: MetadataModel): TableDataRow => ({
            id: attribute.connectorUuid || '',
            columns: [
                attribute.connectorName || 'No connector',
                attribute.sourceObjectType ? getEnumLabel(resourceEnum, attribute.sourceObjectType) : '',
            ],
            detailColumns: [
                <CustomTable
                    headers={tableHeaders(ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE)}
                    data={attribute.items.map((attributeItem) => getAttributesTableData(attributeItem, attribute.sourceObjectType))}
                    hasHeader={true}
                />,
            ],
        }),
        [getAttributesTableData, resourceEnum],
    );

    const getButtons = useCallback(
        (attribute: AttributeResponseModel, descriptor: CustomAttributeModel, attributeName: string) => {
            const buttons: WidgetButtonProps[] = [];
            if (editingAttributesNames.find((a) => a === attributeName)) {
                buttons.push({
                    icon: 'times',
                    disabled: false,
                    tooltip: 'Cancel',
                    onClick: () => {
                        setEditingAttributesNames(editingAttributesNames.filter((n) => n !== attributeName));
                    },
                });
            } else {
                buttons.push({
                    icon: 'copy',
                    disabled: false,
                    tooltip: 'Copy to clipboard',
                    onClick: () => {
                        onCopyContentClick(attribute);
                    },
                });
                buttons.push({
                    icon: 'pencil',
                    disabled: descriptor.properties.readOnly,
                    tooltip: descriptor.properties.readOnly ? 'Attribute is read only, edit is disabled' : 'Edit',
                    onClick: () => {
                        setEditingAttributesNames([...editingAttributesNames, attributeName]);
                    },
                });
            }
            onRemove &&
                buttons.push({
                    icon: 'trash',
                    disabled: descriptor.properties.required,
                    tooltip: descriptor.properties.required ? "Attribute is required, can't be removed" : 'Remove',
                    onClick: () => onRemove(descriptor.uuid),
                });
            return buttons;
        },
        [editingAttributesNames, onRemove, onCopyContentClick],
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
                                        <BootstrapForm className="mt-3">
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
                            <WidgetButtons buttons={getButtons(a, descriptor!, a.name)} />,
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
            case ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT:
                return isCustomAttributeModelArray(descriptors) ? getAttributesEditTableData(attributes, descriptors) : [];
            case ATTRIBUTE_VIEWER_TYPE.METADATA:
                return metadata?.map(getMetadataTableData);
            case ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT:
                return metadata
                    ?.map((m) =>
                        m.items.map((i) => ({
                            ...getAttributesTableData(i),
                            columns: [
                                m.connectorName ?? 'No connector',
                                m.sourceObjectType ? getEnumLabel(resourceEnum, m.sourceObjectType) : 'No Source Object',

                                ...getAttributesTableData(i).columns,
                            ],
                        })),
                    )
                    .flat();

            default:
                return [];
        }
    }, [
        attributes,
        metadata,
        resourceEnum,
        getAttributesTableData,
        getAttributesEditTableData,
        getMetadataTableData,
        viewerType,
        descriptors,
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
