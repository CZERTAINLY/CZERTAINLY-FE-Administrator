import Widget from 'components/Widget';

import { actions as connectorActions, selectors as connectorSelectors } from 'ducks/connectors';
import { selectors as userInterfaceSelectors } from 'ducks/user-interface';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    AttributeCallbackMappingModel,
    AttributeDescriptorModel,
    AttributeResponseModel,
    CodeBlockAttributeContentDataModel,
    CustomAttributeModel,
    DataAttributeModel,
    FileAttributeContentModel,
    GroupAttributeModel,
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
import { Attribute } from './Attribute';
import CustomAttributeAddSelect from 'components/Attributes/AttributeEditor/CustomAttributeAddSelect';
import { mapAttributeContentToOptionValue } from 'utils/attributes/attributes';
import { deepEqual } from 'utils/deep-equal';
import Button from 'components/Button';
import { Trash } from 'lucide-react';

// same empty array is used to prevent re-rendering of the component
// !!! never modify the attributes field inside of the component !!!
const emptyAttributes: AttributeResponseModel[] = [];
const emptyGroupAttributesCallbackAttributes: AttributeDescriptorModel[] = [];

export interface Props {
    id: string;
    attributeDescriptors: AttributeDescriptorModel[];
    groupAttributesCallbackAttributes?: AttributeDescriptorModel[];
    setGroupAttributesCallbackAttributes?: React.Dispatch<React.SetStateAction<AttributeDescriptorModel[]>>;
    attributes?: AttributeResponseModel[];
    connectorUuid?: string;
    functionGroupCode?: FunctionGroupCode;
    kind?: string;
    callbackResource?: Resource;
    callbackParentUuid?: string;
    withRemoveAction?: boolean;
    onValuesChange?: (values: Record<string, any> | null) => void;
}

type AttributeEditorInnerProps = Omit<Props, 'onValuesChange'>;

function AttributeEditorInner({
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
    withRemoveAction = true,
}: AttributeEditorInnerProps) {
    const dispatch = useDispatch();

    const { setValue, watch } = useFormContext<Record<string, any>>();
    const formValues = watch();

    const isRunningCallback = useSelector(connectorSelectors.isRunningCallback);
    const initiateAttributeCallback = useSelector(userInterfaceSelectors.selectInitiateAttributeCallback);
    // data from callbacks
    const callbackData = useSelector(connectorSelectors.callbackData);

    // used to check if descriptors have changed
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

    // used to store custom attributes which user has selected
    const [prevShownCustomAttributes, setPrevShownCustomAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [shownCustomAttributes, setShownCustomAttributes] = useState<AttributeDescriptorModel[]>([]);

    // State to track deleted attributes
    const [deletedAttributes, setDeletedAttributes] = useState<string[]>([]);
    // State to track attributes that were deleted and re-added in this session (to prevent using old backend values)
    const [reAddedAttributes, setReAddedAttributes] = useState<string[]>([]);
    const userInteractedRef = useRef<boolean>(false);

    // workaround to be possible to set options from multiple places;
    // multiple effects can modify opts during single render call
    let opts: { [attributeName: string]: { label: string; value: any }[] } = {};

    useEffect(() => {
        dispatch(connectorActions.resetState());
    }, [dispatch]);
    /**
     * Handles deletion of an attribute from the grouped attributes
     */
    const handleDeleteAttribute = useCallback(
        (attributeName: string) => {
            // Create a unique key for this AttributeEditor instance
            const deletedAttributesKey = `deletedAttributes_${id}`;

            // Add to deletedAttributes in form state using the unique key
            const currentDeleted = formValues[deletedAttributesKey] || [];
            setValue(deletedAttributesKey, [...currentDeleted, attributeName]);

            // Remove from form values
            setValue(`__attributes__${id}__.${attributeName}`, undefined);

            // Remove from options
            const newOptions = { ...options };
            delete newOptions[`__attributes__${id}__.${attributeName}`];
            setOptions(newOptions);

            // Remove from shown custom attributes if it's a custom attribute
            setShownCustomAttributes((prev) => prev.filter((attr) => attr.name !== attributeName));

            // Remove from group attributes callback attributes if it exists there
            if (groupAttributesCallbackAttributes.some((attr) => attr.name === attributeName)) {
                setGroupAttributesCallbackAttributes((prev) => prev.filter((attr) => attr.name !== attributeName));
            }

            // Add to deletedAttributes to filter them out from rendering
            // Custom attributes will still be available for re-adding through notYetShownCustomAttributeDescriptors
            setDeletedAttributes((prev) => [...prev, attributeName]);
        },
        [setValue, formValues, id, options, groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes],
    );

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
            const formAttributes = formValues[`__attributes__${id}__`] ?? undefined;
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

        [attributeDescriptors, groupAttributesCallbackAttributes, attributes, formValues, getAttributeValue, getObjectPropertyValue, id],
    );

    /**
     * Builds mapping of values taken from the form, attribute or attribute descriptor
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

    /*
     * Get non-required custom attributes, without a value assigned
     */
    const initiallyHiddenCustomAttributeDescriptors = useMemo(
        () =>
            attributeDescriptors.filter((descriptor) => {
                if (isCustomAttributeModel(descriptor)) {
                    const attribute = attributes.find((el) => el.name === descriptor.name);
                    return !descriptor.properties.required && !attribute?.content;
                }
                return false;
            }),
        [attributeDescriptors, attributes],
    );

    /*
     * Get all non-required custom attributes that can be added (including deleted ones)
     */
    const availableCustomAttributeDescriptors = useMemo(
        () =>
            attributeDescriptors
                .filter((descriptor) => {
                    if (isCustomAttributeModel(descriptor)) {
                        return !descriptor.properties.required;
                    }
                    return false;
                })
                .filter((descriptor) => !shownCustomAttributes.find((el) => el.uuid === descriptor.uuid)),
        [attributeDescriptors, shownCustomAttributes],
    );

    /*
     * Get non-required custom attributes which weren't shown by user or were deleted and can be re-added
     */
    const notYetShownCustomAttributeDescriptors = useMemo(
        () =>
            availableCustomAttributeDescriptors
                .filter((descriptor) => !shownCustomAttributes.find((el) => el.uuid === descriptor.uuid))
                .filter((descriptor) => {
                    // For custom attributes, allow them to be re-added even if deleted
                    // For non-custom attributes, filter out deleted ones
                    if (isCustomAttributeModel(descriptor)) {
                        return true; // Always allow custom attributes to be re-added
                    }
                    return !deletedAttributes.includes(descriptor.name);
                }),
        [availableCustomAttributeDescriptors, shownCustomAttributes, deletedAttributes],
    );

    /*
     * Filter and order custom attributes which should be rendered
     */
    const orderedAttributeDescriptors = useMemo(() => {
        const initiallyShownDescriptors = [...attributeDescriptors, ...groupAttributesCallbackAttributes]
            .filter((descriptor) => !initiallyHiddenCustomAttributeDescriptors.find((el) => el.uuid === descriptor.uuid))
            .filter((descriptor) => {
                // For all attributes (including custom ones), filter out deleted ones from rendering
                return !deletedAttributes.includes(descriptor.name);
            });

        const ordered = [
            ...initiallyShownDescriptors,
            ...initiallyHiddenCustomAttributeDescriptors
                .filter((descriptor) => shownCustomAttributes.find((el) => el.uuid === descriptor.uuid))
                .filter((descriptor) => !deletedAttributes.includes(descriptor.name)) // Also filter out deleted ones from shown custom attributes
                .sort(
                    (a, b) =>
                        shownCustomAttributes.findIndex((el) => el.uuid === a.uuid) -
                        shownCustomAttributes.findIndex((el) => el.uuid === b.uuid),
                ),
        ];
        return ordered;
    }, [
        initiallyHiddenCustomAttributeDescriptors,
        shownCustomAttributes,
        groupAttributesCallbackAttributes,
        attributeDescriptors,
        deletedAttributes,
    ]);

    /**
     * Groups attributes for rendering according to the attribute descriptor group property
     */
    const groupedAttributesDescriptors: { [key: string]: (DataAttributeModel | InfoAttributeModel | CustomAttributeModel)[] } =
        useMemo(() => {
            const grouped: { [key: string]: (DataAttributeModel | InfoAttributeModel | CustomAttributeModel)[] } = {};

            orderedAttributeDescriptors.forEach((descriptor) => {
                if (isDataAttributeModel(descriptor) || isInfoAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                    const groupName = descriptor.properties.group || '__';
                    grouped[groupName] ? grouped[groupName].push(descriptor) : (grouped[groupName] = [descriptor]);
                }
            });
            return grouped;
        }, [orderedAttributeDescriptors]);
    /**
     * Clean form attributes, callback data and previous form state whenever passed attribute descriptors or attributes changed
     */
    useEffect(() => {
        // Clear all attributes that start with __attributes__${id}__
        const currentValues = watch();
        const keysToClear = Object.keys(currentValues).filter((k) => k.startsWith(`__attributes__${id}__`));
        keysToClear.forEach((key) => {
            setValue(key, undefined);
        });
        dispatch(connectorActions.clearCallbackData());
    }, [attributeDescriptors, attributes, dispatch, setValue, watch, id]);

    /**
     * Synchronize local deletedAttributes state with form state after clearAttributes
     */
    useEffect(() => {
        // After clearAttributes, ensure deletedAttributes are preserved in form state
        if (deletedAttributes.length > 0) {
            setValue(`deletedAttributes_${id}`, deletedAttributes);
        }
    }, [deletedAttributes, setValue, id]);

    /**
     * Synchronize local deletedAttributes state with form state to maintain consistency
     */
    useEffect(() => {
        const formDeletedAttributes = formValues[`deletedAttributes_${id}`] || [];
        if (
            formDeletedAttributes.length !== deletedAttributes.length ||
            !formDeletedAttributes.every((attr: string) => deletedAttributes.includes(attr))
        ) {
            setDeletedAttributes(formDeletedAttributes);
        }
    }, [formValues, deletedAttributes, id]);

    const setAttributeFormValue = useCallback(
        (
            descriptor: DataAttributeModel | CustomAttributeModel,
            attribute: AttributeResponseModel | undefined,
            formAttributeName: string,
            setDefaultOnRequiredValuesOnly: boolean,
            forceDefaultDescriptorValue: boolean,
            wasDeletedLocally: boolean = false,
        ) => {
            let formAttributeValue = undefined;
            // For re-added attributes, we want empty values but still need access to descriptor options for selects
            // So we use a separate flag for value setting vs options access
            const shouldUseAttributeValues = !wasDeletedLocally;
            const appliedContent = shouldUseAttributeValues
                ? forceDefaultDescriptorValue
                    ? descriptor?.content
                    : attribute?.content
                : undefined;

            function handleFileAttributeContentType() {
                if (appliedContent) {
                    setValue(`${formAttributeName}.content`, (appliedContent as FileAttributeContentModel[])[0].reference);
                    setValue(
                        `${formAttributeName}.fileName`,
                        (appliedContent as FileAttributeContentModel[])[0].data.fileName || 'unknown',
                    );
                    setValue(
                        `${formAttributeName}.mimeType`,
                        (appliedContent as FileAttributeContentModel[])[0].data.mimeType || 'unknown',
                    );
                } else if (descriptor.content) {
                    setValue(`${formAttributeName}.content`, (descriptor.content as FileAttributeContentModel[])[0].reference);
                    setValue(
                        `${formAttributeName}.fileName`,
                        (descriptor.content as FileAttributeContentModel[])[0].data.fileName || 'unknown',
                    );
                    setValue(
                        `${formAttributeName}.mimeType`,
                        (descriptor.content as FileAttributeContentModel[])[0].data.mimeType || 'unknown',
                    );
                }
            }

            if (descriptor.contentType === AttributeContentType.File) {
                handleFileAttributeContentType();
                return;
            }

            function setMultiSelectListAttributeValue() {
                if (Array.isArray(appliedContent)) {
                    formAttributeValue = appliedContent.map((content) => mapAttributeContentToOptionValue(content, descriptor));
                } else {
                    formAttributeValue = undefined;
                }
            }

            function setSelectListAttributeValue() {
                if (appliedContent) {
                    formAttributeValue = mapAttributeContentToOptionValue(appliedContent[0], descriptor);
                } else {
                    formAttributeValue = undefined;
                }
            }

            function setBooleanAttributeValue() {
                if (appliedContent?.[0]?.data !== undefined) {
                    formAttributeValue = appliedContent[0].data;
                } else if (descriptor.properties.required) {
                    // set value to false, if attribute is required, has no value, and no default value are provided
                    // otherwise allow the value to be undefined
                    formAttributeValue = descriptor.content?.[0]?.data ?? false;
                } else {
                    formAttributeValue = descriptor.content?.[0]?.data;
                }
            }

            if (descriptor.properties.list && descriptor.properties.multiSelect) {
                setMultiSelectListAttributeValue();
            } else if (descriptor.properties.list) {
                setSelectListAttributeValue();
            } else if (appliedContent) {
                const firstApplied = appliedContent[0] as any;
                formAttributeValue = firstApplied?.reference ?? firstApplied?.data;
            } else if (
                descriptor.content &&
                descriptor.content.length > 0 &&
                (!setDefaultOnRequiredValuesOnly || descriptor.properties.required)
            ) {
                // This acts as a fallback for the case when the attribute has no value, but has a default value in the descriptor
                const firstDescriptorContent = descriptor.content[0] as any;
                formAttributeValue = firstDescriptorContent?.data ?? firstDescriptorContent?.reference;
            }

            if (descriptor.contentType === AttributeContentType.Codeblock && formAttributeValue !== undefined) {
                if ((formAttributeValue as CodeBlockAttributeContentDataModel).code !== undefined) {
                    formAttributeValue = {
                        code: base64ToUtf8((formAttributeValue as CodeBlockAttributeContentDataModel).code),
                        language: (formAttributeValue as CodeBlockAttributeContentDataModel).language,
                    };
                } else {
                    formAttributeValue = {
                        language: (formAttributeValue as CodeBlockAttributeContentDataModel).language,
                    };
                }
            }
            if (descriptor.contentType === AttributeContentType.Boolean) {
                setBooleanAttributeValue();
            }

            setValue(formAttributeName, formAttributeValue);
        },
        [setValue],
    );

    const getAttributeStaticOptions = useCallback(
        (descriptor: DataAttributeModel | CustomAttributeModel | GroupAttributeModel, formAttributeName: string) => {
            let newOptions = {};
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
            return newOptions;
        },
        [buildCallbackMappings, executeCallback],
    );
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
        setShownCustomAttributes(
            attributeDescriptors.filter(
                (descriptor) => isCustomAttributeModel(descriptor) && attributes.some((attr) => attr.uuid === descriptor.uuid),
            ),
        );

        descriptorsToLoad.forEach((descriptor) => {
            if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                const formAttributeName = `__attributes__${id}__.${descriptor.name}`;

                // Skip if this attribute was deleted
                if (deletedAttributes.includes(descriptor.name)) {
                    return;
                }

                const attribute = attributes.find((a) => a.name === descriptor.name);

                // Build "static" options from the descriptor
                newOptions = {
                    ...newOptions,
                    ...getAttributeStaticOptions(descriptor, formAttributeName),
                };

                // Set initial values from the attribute
                if (isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                    setAttributeFormValue(
                        descriptor,
                        attribute,
                        formAttributeName,
                        true,
                        // If the attribute has been set more than once, consider it not being initial update call, so set the default value instead (see Issue: #915)
                        userInteractedRef.current,
                        // Check if this attribute was deleted locally
                        reAddedAttributes.includes(descriptor.name),
                    );
                }
            }
        });
        // multiple effects can modify opts during single render call
        // eslint-disable-next-line react-hooks/exhaustive-deps
        opts = { ...opts, ...newOptions };
        setOptions({ ...options, ...opts });

        // now all fields are loaded in form, so set those form values as previousFormValues to prevent calling doCallback on form change
        setPreviousFormValues(formValues);
    }, [
        id,
        attributeDescriptors,
        groupAttributesCallbackAttributes,
        attributes,
        options,
        dispatch,
        prevDescriptors,
        prevAttributes,
        prevGroupDescriptors,
        buildCallbackMappings,
        setAttributeFormValue,
        getAttributeStaticOptions,
        deletedAttributes,
        reAddedAttributes,
    ]);

    /**
     * Setups default values of shown custom attributes attributes
     */
    useEffect(() => {
        // run this effect only when the list of shown attributes changes
        if (prevShownCustomAttributes === shownCustomAttributes) return;

        setPrevShownCustomAttributes(shownCustomAttributes);

        let newOptions: { [attributeName: string]: { label: string; value: any }[] } = {};

        shownCustomAttributes.forEach((descriptor) => {
            if (isCustomAttributeModel(descriptor)) {
                const formAttributeName = `__attributes__${id}__.${descriptor.name}`;
                const attribute = attributes.find((a) => a.name === descriptor.name);

                // Set up options for select fields (always needed for re-added attributes)
                newOptions = {
                    ...newOptions,
                    ...getAttributeStaticOptions(descriptor, formAttributeName),
                };

                // Only set the value for attributes whose value was not yet modified
                if (!getObjectPropertyValue(formValues, formAttributeName)) {
                    setAttributeFormValue(
                        descriptor,
                        attribute,
                        formAttributeName,
                        false,
                        false,
                        reAddedAttributes.includes(descriptor.name),
                    );
                }
            }
        });

        // Update options if we added any new ones
        if (Object.keys(newOptions).length > 0) {
            setOptions((prevOptions) => ({ ...prevOptions, ...newOptions }));
        }

        setPreviousFormValues(formValues);
    }, [
        id,
        formValues,
        attributes,
        prevShownCustomAttributes,
        shownCustomAttributes,
        setAttributeFormValue,
        getObjectPropertyValue,
        deletedAttributes,
        reAddedAttributes,
        getAttributeStaticOptions,
    ]);

    /**
     * Called on every form change
     * Evaluates changed attributes and eventually performs a callback whenever necessary
     */
    const doCallbacks = useCallback(() => {
        if (previousFormValues === formValues) return;

        setPreviousFormValues(formValues);

        // I am not really sure about this. It is currently preventing other callbacks when the form is open in "edit" mode and data loaded to it
        // It works, but this state should be managed in a different way
        if (isRunningCb) return;

        const changedAttributes: { [name: string]: { previous: any; current: any } } = {};

        // get changed attributes and their current values
        for (const key in formValues) {
            if (key.startsWith(`__attributes__${id}__`)) {
                for (const attrKey in formValues[key]) {
                    if (
                        previousFormValues[key] === undefined ||
                        previousFormValues[key][attrKey] === undefined ||
                        previousFormValues[key][attrKey] !== formValues[key][attrKey]
                    ) {
                        changedAttributes[attrKey] = {
                            previous:
                                previousFormValues[key] !== undefined && previousFormValues[key][attrKey] !== undefined
                                    ? previousFormValues[key][attrKey]
                                    : undefined,
                            current: formValues[key][attrKey],
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
        formValues,
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

        const descriptorsToLoad = [...attributeDescriptors, ...groupAttributesCallbackAttributes];
        setPrevGroupDescriptors(groupAttributesCallbackAttributes);
        setPrevDescriptors(attributeDescriptors);
        setPrevAttributes(attributes);
        descriptorsToLoad.forEach((descriptor) => {
            if (isDataAttributeModel(descriptor) || isGroupAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
                const formAttributeName = `__attributes__${id}__.${descriptor.name}`;

                getAttributeStaticOptions(descriptor, formAttributeName);
            }
        });
        // This effect should only be called if the initiateAttributeCallback value is updated
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initiateAttributeCallback]);

    /**
     * Obtains values from attribute callbacks and updates the form values / options accordingly
     * Sets groupAttributeCallbackAttributes from callbackData
     */
    useEffect(() => {
        if (previousCallbackData === callbackData) return;

        function updateValueFromCallbackData(callbackId: string, callbackDescriptor: AttributeDescriptorModel) {
            if (callbackDescriptor && isDataAttributeModel(callbackDescriptor)) {
                if (!callbackDescriptor.properties.list) {
                    setValue(callbackId, callbackData[callbackId][0].reference ?? callbackData[callbackId][0].data);
                } else if (userInteractedRef.current) {
                    setValue(callbackId, undefined);
                }
            }
        }

        for (const callbackId in callbackData) {
            if (callbackData[callbackId] === previousCallbackData[callbackId]) continue;
            if (!callbackData[callbackId]) continue;
            if (!Array.isArray(callbackData[callbackId])) continue;
            const groupCallbackAttributes: AttributeDescriptorModel[] = callbackData[callbackId].filter(isAttributeDescriptorModel);

            const descriptors = [...attributeDescriptors, ...groupAttributesCallbackAttributes];
            const callbackDescriptor = descriptors.find((d) => `__attributes__${id}__.${d.name}` === callbackId);

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

            // Set groupAttributesCallbackDescriptors inside the loop, to only run this if the callbackData fields have actually been changed.
            if (callbackDescriptor) {
                const newGroupCallbackDescriptors = Object.values(callbackData)
                    .filter(Array.isArray)
                    .map((callbackDataArray) => callbackDataArray.filter(isAttributeDescriptorModel))
                    .reduce((acc, el) => [...acc, ...el], []);

                setGroupAttributesCallbackAttributes(newGroupCallbackDescriptors);
                updateValueFromCallbackData(callbackId, callbackDescriptor);
            }
        }

        setPreviousCallbackData(callbackData);
    }, [callbackData, options, previousCallbackData, setValue, id, attributeDescriptors, groupAttributesCallbackAttributes]);

    /*
      Attribute Form Rendering
    */

    const deleteButton = useCallback(
        (descriptor: AttributeDescriptorModel) => (
            <Button
                variant="transparent"
                onClick={() => handleDeleteAttribute(descriptor.name)}
                title={`Delete ${descriptor.name}`}
                className="ml-2"
            >
                <Trash size={16} />
            </Button>
        ),
        [handleDeleteAttribute],
    );

    const attrs = useMemo(() => {
        const attrs: React.ReactNode[] = [];

        const attributeSelector = (
            <CustomAttributeAddSelect
                onAdd={(attribute) => {
                    setShownCustomAttributes((state) => [...state, attribute]);

                    // Check if this attribute was previously deleted
                    const wasPreviouslyDeleted = deletedAttributes.includes(attribute.name);

                    // Remove from deletedAttributes when re-adding
                    setDeletedAttributes((prev) => prev.filter((name) => name !== attribute.name));

                    // If it was previously deleted, add it to reAddedAttributes to prevent using old backend values
                    if (wasPreviouslyDeleted) {
                        setReAddedAttributes((prev) => [...prev, attribute.name]);
                    }

                    // Also remove from form state
                    const deletedAttributesKey = `deletedAttributes_${id}`;
                    const currentDeleted = formValues[deletedAttributesKey] || [];
                    setValue(
                        deletedAttributesKey,
                        currentDeleted.filter((name: string) => name !== attribute.name),
                    );
                }}
                attributeDescriptors={notYetShownCustomAttributeDescriptors}
            />
        );

        const groupedAttributesDescriptorsKeys = Object.keys(groupedAttributesDescriptors);

        // Show the attribute selector even when there no attributes are displayed, but some non required attributes exist
        if (groupedAttributesDescriptorsKeys.length === 0 && notYetShownCustomAttributeDescriptors.length > 0) {
            return (
                <Widget busy={isRunningCb} noBorder>
                    {attributeSelector}
                </Widget>
            );
        }

        groupedAttributesDescriptorsKeys.forEach((group, i, arr) => {
            attrs.push(
                <Widget key={group} title={group === '__' ? '' : group} busy={isRunningCb}>
                    {groupedAttributesDescriptors[group].map((descriptor, index) => (
                        <div key={descriptor.name} className="mb-4">
                            <Attribute
                                busy={isRunningCb}
                                name={`__attributes__${id}__.${descriptor.name}`}
                                descriptor={descriptor}
                                options={options[`__attributes__${id}__.${descriptor.name}`]}
                                userInteractedRef={userInteractedRef}
                                deleteButton={
                                    withRemoveAction && isCustomAttributeModel(descriptor) && !descriptor.properties.required
                                        ? deleteButton(descriptor)
                                        : undefined
                                }
                            />
                        </div>
                    ))}
                    {i === arr.length - 1 && notYetShownCustomAttributeDescriptors.length > 0 && attributeSelector}
                </Widget>,
            );
        });
        return attrs;
    }, [
        notYetShownCustomAttributeDescriptors,
        groupedAttributesDescriptors,
        isRunningCb,
        id,
        options,
        withRemoveAction,
        deleteButton,
        setValue,
        formValues,
        deletedAttributes,
    ]);

    return <>{attrs}</>;
}

type AttributeEditorFormBridgeProps = {
    values: Record<string, any>;
    onValuesChange?: (values: Record<string, any> | null) => void;
    children: React.ReactNode;
};

function AttributeEditorFormBridge({ values, onValuesChange, children }: AttributeEditorFormBridgeProps) {
    const previousValuesRef = useRef<Record<string, any> | null>(null);
    const onValuesChangeRef = useRef(onValuesChange);

    // Keep the ref updated with the latest callback
    useEffect(() => {
        onValuesChangeRef.current = onValuesChange;
    }, [onValuesChange]);

    useEffect(() => {
        if (!onValuesChangeRef.current) return;
        if (previousValuesRef.current && deepEqual(previousValuesRef.current, values)) {
            return;
        }
        previousValuesRef.current = values;
        onValuesChangeRef.current(values);
    }, [values]);

    useEffect(() => {
        return () => {
            onValuesChangeRef.current?.(null);
        };
    }, []);

    return <>{children}</>;
}

export default function AttributeEditor(props: Props) {
    const { onValuesChange, ...rest } = props;
    const methods = useForm<Record<string, any>>({
        defaultValues: {},
    });
    const formValues = useWatch({ control: methods.control });

    return (
        <FormProvider {...methods}>
            <AttributeEditorFormBridge values={formValues ?? {}} onValuesChange={onValuesChange}>
                <AttributeEditorInner {...rest} />
            </AttributeEditorFormBridge>
        </FormProvider>
    );
}
