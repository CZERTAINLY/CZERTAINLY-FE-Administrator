import { useEffect, useMemo, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Form as BootstrapForm, Col, FormText, Row } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../ducks/customAttributes';
import { AttributeResponseModel, BaseAttributeContentModel, CustomAttributeModel } from '../../../types/attributes';
import { Resource } from '../../../types/openapi';
import ContentValueField from '../../Input/DynamicContent/ContentValueField';
import Widget from '../../Widget';
import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from '../AttributeViewer';
import style from './customAttributeWidget.module.scss';

export type Props = {
    resource: Resource;
    resourceUuid: string;
    attributes: AttributeResponseModel[] | undefined;
    onRemove?: (attributeUuid: string) => void;
};

export default function CustomAttributeWidget({ resource, resourceUuid, attributes, onRemove }: Props) {
    const dispatch = useDispatch();
    const [isAttributeContentLoaded, setIsAttributeContentLoaded] = useState<boolean>(false);

    const resourceCustomAttributesContents = useSelector(
        customAttributesSelectors.resourceCustomAttributesContents(resource, resourceUuid),
    );

    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const isUpdatingContent = useSelector(customAttributesSelectors.isUpdatingContent);

    const [attribute, setAttribute] = useState<CustomAttributeModel>();

    const prevAttributesRef = useRef<AttributeResponseModel[] | undefined>();

    useEffect(() => {
        if (prevAttributesRef.current !== attributes) {
            setIsAttributeContentLoaded(false);
        }
        prevAttributesRef.current = attributes;
    }, [attributes]);

    useEffect(() => {
        if (attributes && !isAttributeContentLoaded) {
            dispatch(
                customAttributesActions.loadCustomAttributeContent({
                    resource: resource,
                    resourceUuid: resourceUuid,
                    customAttributes: attributes,
                }),
            );

            setIsAttributeContentLoaded(true);
        }
    }, [attributes, resource, resourceUuid, isAttributeContentLoaded, dispatch]);

    const addCustomAttribute = (attributeUuid: string, content: BaseAttributeContentModel[] | undefined) => {
        if (content) {
            dispatch(
                customAttributesActions.updateCustomAttributeContent({
                    resource: resource,
                    resourceUuid: resourceUuid,
                    attributeUuid: attributeUuid,
                    content: content,
                }),
            );
        }
    };

    const removeCustomAttribute = (attributeUuid: string) => {
        dispatch(
            customAttributesActions.removeCustomAttributeContent({
                resource: resource,
                resourceUuid: resourceUuid,
                attributeUuid: attributeUuid,
            }),
        );
    };

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(resource));
    }, [dispatch, resource]);

    const loadedAttributes = useMemo(() => resourceCustomAttributesContents ?? attributes, [resourceCustomAttributesContents, attributes]);
    const options = useMemo(
        () =>
            resourceCustomAttributes
                .filter((r) => !loadedAttributes?.find((a) => a.uuid === r.uuid))
                .map((r) => ({
                    label: r.properties.label,
                    value: r,
                })),
        [resourceCustomAttributes, loadedAttributes],
    );

    return (
        <Widget
            title={'Custom Attributes'}
            busy={isFetchingResourceCustomAttributes || isUpdatingContent}
            titleSize="large"
            widgetLockName={LockWidgetNameEnum.CustomAttributeWidget}
        >
            <AttributeViewer
                attributes={loadedAttributes}
                descriptors={resourceCustomAttributes}
                viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT}
                onSubmit={addCustomAttribute}
                onRemove={removeCustomAttribute}
            />
            {options && options.length > 0 && (
                <Form onSubmit={() => {}}>
                    {({ form }) => (
                        <BootstrapForm>
                            <h6>
                                <b>Add custom attribute</b>
                            </h6>
                            <Row>
                                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                                    <Field key={'selectCustomAttribute'} name={'selectCustomAttribute'}>
                                        {({ input }) => (
                                            <Select
                                                {...input}
                                                options={options}
                                                placeholder={`Add...`}
                                                isClearable={true}
                                                onChange={(v) => {
                                                    input.onChange(v);
                                                    setAttribute(v?.value ?? undefined);
                                                }}
                                            />
                                        )}
                                    </Field>
                                </Col>
                                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                                    {attribute && (
                                        <div>
                                            <ContentValueField
                                                descriptor={attribute}
                                                onSubmit={(uuid, content) => {
                                                    form.change('selectCustomAttribute', undefined);
                                                    setAttribute(undefined);
                                                    addCustomAttribute(uuid, content);
                                                }}
                                            />
                                            <FormText className={style.formatTextStyle}>{attribute.description}</FormText>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </BootstrapForm>
                    )}
                </Form>
            )}
        </Widget>
    );
}
