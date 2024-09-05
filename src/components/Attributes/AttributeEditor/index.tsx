import Widget from 'components/Widget';

import { actions as connectorActions, selectors as connectorSelectors } from 'ducks/connectors';
import { selectors as userInterfaceSelectors } from 'ducks/user-interface';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    AttributeCallbackMappingModel,
    AttributeDescriptorModel,
    AttributeResponseModel,
    CodeBlockAttributeContentDataModel,
    CustomAttributeModel,
    DataAttributeModel,
    FileAttributeContentModel,
    InfoAttributeModel,
    isAttributeDescriptorModel,
    isCustomAttributeModel,
    isDataAttributeModel,
    isGroupAttributeModel,
    isInfoAttributeModel,
} from 'types/attributes';
import { CallbackAttributeModel } from 'types/connectors';
import { AttributeContentType, AttributeValueTarget, FunctionGroupCode, Resource } from 'types/openapi';
import { base64ToUtf8 } from 'utils/common-utils';
import { getFormattedDateTime } from 'utils/dateUtil';
import { Attribute } from './Attribute';

// same empty array is used to prevent re-rendering of the component
// !!! never modify the attributes field inside of the component !!!
const emptyAttributes: AttributeResponseModel[] = [];
const emptyGroupAttributesCallbackAttributes: AttributeDescriptorModel[] = [];

export interface Props {
    id: string;
    attributeDescriptors: AttributeDescriptorModel[];
    groupAttributesCallbackAttributes?: AttributeDescriptorModel[];
    setGroupAttributesCallbackAttributes?: Function;
    attributes?: AttributeResponseModel[];
    connectorUuid?: string;
    functionGroupCode?: FunctionGroupCode;
    kind?: string;
    callbackResource?: Resource;
    callbackParentUuid?: string;
}

export default function AttributeEditor({
    id,
    attributeDescriptors,
    attributes = emptyAttributes,
    connectorUuid,
    functionGroupCode,
    kind,
    callbackResource,
    callbackParentUuid,
    groupAttributesCallbackAttributes = emptyGroupAttributesCallbackAttributes,
    setGroupAttributesCallbackAttributes = () => emptyGroupAttributesCallbackAttributes,
}: Props) {
    const dispatch = useDispatch();

    const form = useForm();
    const formState = useFormState();

    const isRunningCallback = useSelector(connectorSelectors.isRunningCallback);
    const initiateAttributeCallback = useSelector(userInterfaceSelectors.selectInitiateAttributeCallback);
    // data from callbacks
    const callbackData = useSelector(connectorSelectors.callbackData);

    // used to check if descritors have changed
    const [prevDescriptors, setPrevDescriptors] = useState<AttributeDescriptorModel[]>();

    // used to check if attributes have changed
    const [prevAttributes, setPrevAttributes] = useState<AttributeResponseModel[]>();

    const [prevGroupDescriptors, setPrevGroupDescriptors] = useState<AttributeDescriptorModel[]>();

    // options for selects
    const [options, setOptions] = useState<{ [attributeName: string]: { label: string; value: any }[] }>({});

    // stores previous values of form in order to be possible to detect attribute changes
    const [previousFormValues, setPreviousFormValues] = useState<{ [name: string]: any }>({});

    // stores previous callback data in order to be possible to detect what data changed
    const [previousCallbackData, setPreviousCallbackData] = useState<{ [callbackId: string]: any }>({});

    // workaround to be possible to set options from multiple places;
    // multiple effects can modify opts during single render call
    let opts: { [attributeName: string]: { label: string; value: any }[] } = {};

    useEffect(() => {
        dispatch(connectorActions.resetState());
    }, [dispatch]);

    /**
     * Gets the value from the object property identified by path
     */
    const getObjectPropertyValue = useCallback((object: any, path: string) => {
        const pathParts = path.split('.');

        let currentObject = object;

        for (const pathPart of pathParts) {
            if (currentObject === undefined) {
                return undefined;
            }

            if (Array.isArray(currentObject)) {
                if (currentObject.length > 0) {
                    currentObject = currentObject[0][pathPart];
                } else {
                    return undefined;
                }
            } else {
                currentObject = currentObject[pathPart];
            }
        }

        return currentObject;
    }, []);

    const isRunningCb: boolean = useMemo((): boolean => {
        let isRunningCb = false;
        for (const k in isRunningCallback) isRunningCb = isRunningCb || isRunningCallback[k];
        return isRunningCb;
    }, [isRunningCallback]);
    /**
     * Gets the value of the attribute identified by the path (attributeName.propertyName.propertyName...)
     */
    const getAttributeValue = useCallback(
        (attributes: AttributeResponseModel[], path: string | undefined): any => {
            if (!path) return undefined;

            if (!path.includes('.')) return getObjectPropertyValue(attributes.find((a) => a.name === path)?.content, 'value');

            let spath = path.split('.');

            return getObjectPropertyValue(attributes.find((a) => a.name === spath[0])?.content, spath.slice(1).join('.'));
        },
        [getObjectPropertyValue],
    );

    /**
     * Gets the value from the current input state or from the attribute or from the default value of the attribute descriptor.
     */
    const getCurrentFromMappingValue = useCallback(
        (mapping: AttributeCallbackMappingModel): any => {
            const attributeFromValue = getAttributeValue(attributes, mapping.from);

            const formAttributes = !formState.values[`__attributes__${id}__`] ? undefined : formState.values[`__attributes__${id}__`];
            const formMappingName = mapping.from ? (mapping.from.includes('.') ? mapping.from.split('.')[0] : mapping.from) : '';
            const formAttribute = formAttributes
                ? Object.keys(formAttributes).find((key) => key.startsWith(`${formMappingName}`))
                : undefined;

            // only lists are supported now, because of this the 'value' is added to the path as the list selected option is { label: "", value: "" }
            const formMappingPath = mapping.from
                ? mapping.from.includes('.')
                    ? 'value.' + mapping.from.split('.').slice(1).join('.')
                    : 'value'
                : 'value';
            const currentContent = formAttribute
                ? (getObjectPropertyValue(formAttributes[formAttribute], formMappingPath) ?? formAttributes[formAttribute])
                : undefined;

            const depDescriptor = attributeDescriptors.find(
                (d) => d.name === (mapping.from ? (mapping.from.includes('.') ? mapping.from.split('.')[0] : mapping.from) : ''),
            );
            const depDescriptorValue = depDescriptor ? getObjectPropertyValue(depDescriptor, `content.${formMappingPath}`) : undefined;

            const groupDescriptor = groupAttributesCallbackAttributes.find(
                (d) => d.name === (mapping.from ? (mapping.from.includes('.') ? mapping.from.split('.')[0] : mapping.from) : ''),
            );
            const groupDescriptorValue = groupDescriptor
                ? getObjectPropertyValue(groupDescriptor, `content.${formMappingPath}`)
                : undefined;

            return currentContent || attributeFromValue || depDescriptorValue || groupDescriptorValue;
        },

        [
            attributeDescriptors,
            groupAttributesCallbackAttributes,
            attributes,
            formState.values,
            getAttributeValue,
            getObjectPropertyValue,
            id,
        ],
    );

    /**
     * Builds mappingg of values taken from the form, attribute or attribute descriptor
     * for the callback as defined by the API
     */
    const buildCallbackMappings = useCallback(
        (descriptor: AttributeDescriptorModel): CallbackAttributeModel | undefined => {
            let hasUndefinedMapping = false;

            const data: CallbackAttributeModel = {
                uuid: '',
                name: '',
                pathVariable: {},
                requestParameter: {},
                body: {},
            };

            if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor)) {
                descriptor.attributeCallback?.mappings.forEach((mapping) => {
                    let value = mapping.value || getCurrentFromMappingValue(mapping);
                    if (typeof value === 'object' && value.hasOwnProperty('data')) value = value.data;
                    if (value === undefined) hasUndefinedMapping = true;

                    mapping.targets.forEach((target) => {
                        if (target === AttributeValueTarget.PathVariable) {
                            data.pathVariable![mapping.to] = value;
                        }
                        if (target === AttributeValueTarget.Body) {
                            data.body![mapping.to] = value;
                        }
                        if (target === AttributeValueTarget.RequestParameter) {
                            data.requestParameter![mapping.to] = value;
                        }
                    });
                });
            }

            return hasUndefinedMapping ? undefined : data;
        },
        [getCurrentFromMappingValue],
    );

    const executeCallback = useCallback(
        (mappings: CallbackAttributeModel, descriptor: AttributeDescriptorModel, formAttributeName: string) => {
            mappings.name = descriptor.name;
            mappings.uuid = descriptor.uuid;
            dispatch(
                callbackParentUuid && callbackResource
                    ? connectorActions.callbackResource({
                          callbackId: formAttributeName,
                          callbackResource: {
                              parentObjectUuid: callbackParentUuid,
                              resource: callbackResource,
                              requestAttributeCallback: mappings,
                          },
                      })
                    : connectorActions.callbackConnector({
                          callbackId: formAttributeName,
                          callbackConnector: {
                              uuid: connectorUuid!,
                              kind: kind!,
                              functionGroup: functionGroupCode!,
                              requestAttributeCallback: mappings,
                          },
                      }),
            );
        },
        [callbackParentUuid, callbackResource, connectorUuid, dispatch, functionGroupCode, kind],
    );

    /**
     * Groups attributes for rendering according to the attribute descriptor group property
     */
    const groupedAttributesDescriptors: { [key: string]: (DataAttributeModel | InfoAttributeModel | CustomAttributeModel)[] } =
        useMemo(() => {
            const grouped: { [key: string]: (DataAttributeModel | InfoAttributeModel | CustomAttributeModel)[] } = {};
            [...attributeDescriptors, ...groupAttributesCallbackAttributes].forEach((descriptor) => {
                if (isDataAttributeModel(descriptor) || isInfoAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                    const groupName = descriptor.properties.group || '__';
                    grouped[groupName] ? grouped[groupName].push(descriptor) : (grouped[groupName] = [descriptor]);
                }
            });
            return grouped;
        }, [attributeDescriptors, groupAttributesCallbackAttributes]);

    /**
     * Clean form attributes, callback data and previous form state whenever passed attribute descriptors or attributes changed
     */
    useEffect(() => {
        // variables are passed just to prevent linting error, they are unused in the clearAttributes function
        form.mutators.clearAttributes(id, attributeDescriptors, attributes);
        // setGroupAttributesCallbackAttributes(emptyGroupAttributesCallbackAttributes);
        dispatch(connectorActions.clearCallbackData());
    }, [attributeDescriptors, attributes, dispatch, form.mutators, id]);

    /**
     * Called on first render
     * Setups final form values and initial values (based on descriptors and attributes passed)
     * Setups "static" options for selects from the attribute descriptors
     * Performs initial callbacks
     */
    useEffect(() => {
        // run this effect only when attribute descriptors or attributes changes
        if (
            attributeDescriptors === prevDescriptors &&
            attributes === prevAttributes &&
            groupAttributesCallbackAttributes === prevGroupDescriptors
        )
            return;

        let newOptions: { [attributeName: string]: { label: string; value: any }[] } = {};

        const descriptorsToLoad =
            attributeDescriptors === prevDescriptors && attributes === prevAttributes
                ? (groupAttributesCallbackAttributes ?? [])
                : [...attributeDescriptors, ...groupAttributesCallbackAttributes];

        setPrevGroupDescriptors(groupAttributesCallbackAttributes);
        setPrevDescriptors(attributeDescriptors);
        setPrevAttributes(attributes);

        descriptorsToLoad.forEach((descriptor) => {
            if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                const formAttributeName = `__attributes__${id}__.${descriptor.name}`;

                const attribute = attributes.find((a) => a.name === descriptor.name);

                // Build "static" options from the descriptor
                if (
                    (isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) &&
                    descriptor.properties.list &&
                    Array.isArray(descriptor.content)
                ) {
                    newOptions = {
                        ...newOptions,
                        [formAttributeName]: descriptor.content.map((data) => ({
                            label: data.reference ?? data.data.toString(),
                            value: data,
                        })),
                    };
                }

                if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor)) {
                    // Perform initial callbacks based on "static" mappings
                    if (descriptor.attributeCallback) {
                        let mappings = buildCallbackMappings(descriptor);
                        if (mappings) {
                            executeCallback(mappings, descriptor, formAttributeName);
                        }
                    }
                }

                // Set initial values from the attribute
                if (isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                    if (descriptor.contentType === AttributeContentType.File) {
                        if (attribute?.content) {
                            form.mutators.setAttribute(
                                `${formAttributeName}.content`,
                                (attribute.content as FileAttributeContentModel[])[0].reference,
                            );
                            form.mutators.setAttribute(
                                `${formAttributeName}.fileName`,
                                (attribute.content as FileAttributeContentModel[])[0].data.fileName || 'unknown',
                            );
                            form.mutators.setAttribute(
                                `${formAttributeName}.mimeType`,
                                (attribute.content as FileAttributeContentModel[])[0].data.mimeType || 'unknown',
                            );
                        } else if (descriptor.content) {
                            form.mutators.setAttribute(
                                `${formAttributeName}.content`,
                                (descriptor.content as FileAttributeContentModel[])[0].reference,
                            );
                            form.mutators.setAttribute(
                                `${formAttributeName}.fileName`,
                                (descriptor.content as FileAttributeContentModel[])[0].data.fileName || 'unknown',
                            );
                            form.mutators.setAttribute(
                                `${formAttributeName}.mimeType`,
                                (descriptor.content as FileAttributeContentModel[])[0].data.mimeType || 'unknown',
                            );
                        }
                        return;
                    }

                    let formAttributeValue = undefined;

                    if (descriptor.properties.list && descriptor.properties.multiSelect) {
                        if (Array.isArray(attribute?.content)) {
                            formAttributeValue = attribute!.content.map((content) => ({
                                label: content.reference
                                    ? content.reference
                                    : descriptor.contentType === AttributeContentType.Datetime
                                      ? getFormattedDateTime(content.data.toString())
                                      : content.data.toString(),
                                value: content,
                            }));
                        } else {
                            formAttributeValue = undefined;
                        }
                    } else if (descriptor.properties.list) {
                        if (attribute?.content) {
                            formAttributeValue = {
                                label: attribute.content[0].reference
                                    ? attribute.content[0].reference
                                    : descriptor.contentType === AttributeContentType.Datetime
                                      ? getFormattedDateTime(attribute.content[0].data.toString())
                                      : attribute.content[0].data.toString(),
                                value: attribute.content[0],
                            };
                        } else {
                            formAttributeValue = undefined;
                        }
                    } else if (attribute?.content) {
                        formAttributeValue = attribute.content[0].reference ?? attribute.content[0].data;
                    } else if (descriptor.content && descriptor.content.length > 0) {
                        formAttributeValue = descriptor.content[0].reference ?? descriptor.content[0].data;
                    }

                    if (
                        descriptor.contentType === AttributeContentType.Codeblock &&
                        formAttributeValue !== undefined &&
                        (formAttributeValue as CodeBlockAttributeContentDataModel).code !== undefined
                    ) {
                        formAttributeValue = {
                            code: base64ToUtf8((formAttributeValue as CodeBlockAttributeContentDataModel).code),
                            language: (formAttributeValue as CodeBlockAttributeContentDataModel).language,
                        };
                    }

                    form.mutators.setAttribute(formAttributeName, formAttributeValue);
                }
            }
        });

        // multiple effects can modify opts during single render call
        // eslint-disable-next-line react-hooks/exhaustive-deps
        opts = { ...opts, ...newOptions };
        setOptions({ ...options, ...opts });

        // now all fields are loaded in form, so set those formState.values as previousFormValues to prevent calling doCallback on form change
        setPreviousFormValues(formState.values);
    }, [
        id,
        attributeDescriptors,
        groupAttributesCallbackAttributes,
        attributes,
        form.mutators,
        options,
        dispatch,
        prevDescriptors,
        prevAttributes,
        prevGroupDescriptors,
        buildCallbackMappings,
    ]);

    /**
     * Called on every form change
     * Evaluates changed attributes and eventually performs a callback whenever necessary
     */
    const doCallbacks = useCallback(() => {
        if (previousFormValues === formState.values) return;

        setPreviousFormValues(formState.values);

        // I am not really sure about this. It is currently preventing other callbacks when the form is open in "edit" mode and data loaded to it
        // It works, but this state should be managed in a different way
        if (isRunningCb) return;

        const changedAttributes: { [name: string]: { previous: any; current: any } } = {};

        // get changed attributes and their current values
        for (const key in formState.values) {
            if (key.startsWith(`__attributes__${id}__`)) {
                for (const attrKey in formState.values[key]) {
                    if (
                        previousFormValues[key] === undefined ||
                        previousFormValues[key][attrKey] === undefined ||
                        previousFormValues[key][attrKey] !== formState.values[key][attrKey]
                    ) {
                        changedAttributes[attrKey] = {
                            previous:
                                previousFormValues[key] !== undefined && previousFormValues[key][attrKey] !== undefined
                                    ? previousFormValues[key][attrKey]
                                    : undefined,
                            current: formState.values[key][attrKey],
                        };
                    }
                }
            }
        }

        // for each changed attribute check if there are mappings depending on it and if so perform the callback
        [...attributeDescriptors, ...groupAttributesCallbackAttributes].forEach((descriptor) => {
            if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor)) {
                // list all 'from' mappings (get attribute names from the descriptor)
                const fromNames: string[] = [];
                descriptor.attributeCallback?.mappings?.forEach((mapping) => {
                    if (mapping.from) {
                        fromNames.push(mapping.from);
                    }
                });

                // check if any of the changed attributes is in the 'from' list
                for (const fromName in fromNames) {
                    const attributeName = fromNames[fromName].includes('.') ? fromNames[fromName].split('.')[0] : fromNames[fromName];

                    // if there is any attribute changed on which the current descriptor depends, clear the form field and perform the callback
                    if (changedAttributes[attributeName]) {
                        let mappings = buildCallbackMappings(descriptor);

                        if (mappings) {
                            const formAttributeName = `__attributes__${id}__.${descriptor.name}`;
                            // removed it as it was causing form value to be cleared  , it does not seem to be necessary and other places it is working without it
                            // form.mutators.setAttribute(formAttributeName, undefined);
                            executeCallback(mappings, descriptor, formAttributeName);
                        }
                    }
                }
            }
        });
    }, [
        attributeDescriptors,
        groupAttributesCallbackAttributes,
        buildCallbackMappings,
        // removed it as it was causing form value to be cleared  , it does not seem to be necessary and other places it is working without it
        // form.mutators,
        formState.values,
        id,
        isRunningCb,
        previousFormValues,
        executeCallback,
    ]);
    const ref = useRef(debounce((doCallbacksParam) => doCallbacksParam(), 600));

    useEffect(() => {
        ref.current(doCallbacks);
    }, [doCallbacks]);

    useEffect(() => {
        if (!initiateAttributeCallback) return;
        let newOptions: { [attributeName: string]: { label: string; value: any }[] } = {};
        const descriptorsToLoad = [...attributeDescriptors, ...groupAttributesCallbackAttributes];
        setPrevGroupDescriptors(groupAttributesCallbackAttributes);
        setPrevDescriptors(attributeDescriptors);
        setPrevAttributes(attributes);
        descriptorsToLoad.forEach((descriptor) => {
            if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                const formAttributeName = `__attributes__${id}__.${descriptor.name}`;

                if (
                    (isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) &&
                    descriptor.properties.list &&
                    Array.isArray(descriptor.content)
                ) {
                    newOptions = {
                        ...newOptions,
                        [formAttributeName]: descriptor.content.map((data) => ({
                            label: data.reference ?? data.data.toString(),
                            value: data,
                        })),
                    };
                }

                if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor)) {
                    if (descriptor.attributeCallback) {
                        let mappings = buildCallbackMappings(descriptor);
                        if (mappings) {
                            executeCallback(mappings, descriptor, formAttributeName);
                        }
                    }
                }
            }
        });
        // This effect should only be called if the initiateAttributeCallback value is updated
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initiateAttributeCallback]);

    /**
     * Obtains values from attribute callbacks and updates the form values / options accordingly
     */
    useEffect(() => {
        if (previousCallbackData === callbackData) return;

        for (const callbackId in callbackData) {
            if (callbackData[callbackId] === previousCallbackData[callbackId]) continue;
            if (!callbackData[callbackId]) continue;

            if (Array.isArray(callbackData[callbackId])) {
                const groupCallbackAttributes: AttributeDescriptorModel[] = callbackData[callbackId].filter(isAttributeDescriptorModel);
                // Check if there are any other attributes in the callback data before setting it as empty
                if (!groupCallbackAttributes.length) {
                    const callbackDataArray = Object.values(callbackData);
                    for (let i = 0; i < callbackDataArray.length; i++) {
                        if (Array.isArray(callbackDataArray[i])) {
                            const groupCallbackAttributesOther: AttributeDescriptorModel[] =
                                callbackDataArray[i].filter(isAttributeDescriptorModel);

                            if (groupCallbackAttributesOther.length) {
                                groupCallbackAttributes.push(groupCallbackAttributesOther[i]);
                            }
                        }
                    }
                }
                const descriptors = [...attributeDescriptors, ...groupAttributesCallbackAttributes];
                const descriptor = descriptors.find((d) => `__attributes__${id}__.${d.name}` === callbackId);

                if (descriptor && `__attributes__${id}__.${descriptor.name}` === callbackId) {
                    setGroupAttributesCallbackAttributes(groupCallbackAttributes);
                }

                const groupCallbackAttributesContentOpts = groupCallbackAttributes.reduce((acc, attr) => {
                    if (isDataAttributeModel(attr) || isInfoAttributeModel(attr)) {
                        const formAttributeName = `__attributes__${id}__.${attr.name}`;
                        const optionsFromGroupCallback = attr.content?.map((value: any) => ({
                            label: value.reference ?? value.data.toString(),
                            value,
                        }));
                        const callbackContentOpts = optionsFromGroupCallback ? { [formAttributeName]: optionsFromGroupCallback } : {};
                        return { ...acc, ...callbackContentOpts };
                    }

                    return { ...acc };
                }, {});

                const callbackContentOpts = {
                    [callbackId]: callbackData[callbackId]
                        .filter((v: any) => !isAttributeDescriptorModel(v))
                        .map((value: any) => ({ label: value.reference ?? value.data.toString(), value })),
                };

                // multiple effects can modify opts during single render call
                // eslint-disable-next-line react-hooks/exhaustive-deps
                opts = {
                    ...opts,
                    ...callbackContentOpts,
                    ...groupCallbackAttributesContentOpts,
                };

                setOptions({ ...options, ...opts });

                if (descriptor && isDataAttributeModel(descriptor) && !descriptor.properties.list) {
                    form.mutators.setAttribute(callbackId, callbackData[callbackId][0].reference ?? callbackData[callbackId][0].data);
                }
            }
        }

        setPreviousCallbackData(callbackData);
    }, [callbackData, options, previousCallbackData]);

    /*
      Attribute Form Rendering
   */

    const attrs = useMemo(() => {
        const attrs: JSX.Element[] = [];
        for (const group in groupedAttributesDescriptors)
            attrs.push(
                <Widget key={group} title={group === '__' ? '' : group} busy={isRunningCb}>
                    {groupedAttributesDescriptors[group].map((descriptor) => (
                        <div key={descriptor.name}>
                            <Attribute
                                busy={isRunningCb}
                                name={`__attributes__${id}__.${descriptor.name}`}
                                descriptor={descriptor}
                                options={options[`__attributes__${id}__.${descriptor.name}`]}
                            />
                        </div>
                    ))}
                </Widget>,
            );

        return attrs;
    }, [groupedAttributesDescriptors, isRunningCb, id, options]);

    return <>{attrs}</>;
}
