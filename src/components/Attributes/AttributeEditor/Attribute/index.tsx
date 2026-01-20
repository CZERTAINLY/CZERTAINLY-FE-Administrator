import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { marked } from 'marked';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import Select from 'components/Select';
import Label from 'components/Label';
import TextInput from 'components/TextInput';
import DatePicker from 'components/DatePicker';
import Switch from 'components/Switch';
import Editor from 'react-simple-code-editor';
import cn from 'classnames';
import {
    CustomAttributeModel,
    DataAttributeModel,
    InfoAttributeModel,
    RegexpAttributeConstraintModel,
    isCustomAttributeModel,
    isDataAttributeModel,
} from 'types/attributes';
import { AttributeConstraintType, AttributeContentType, RangeAttributeConstraintData } from 'types/openapi';

import { useDispatch, useSelector } from 'react-redux';
import { AddNewAttributeList, AddNewAttributeType } from 'types/user-interface';
import { getStepValue } from 'utils/common-utils';
import { getFormattedDateTime } from 'utils/dateUtil';
import { composeValidators, validateFloat, validateInteger, validatePattern, validateRequired } from 'utils/validators';
import { actions as userInterfaceActions, selectors as userInterfaceSelectors } from '../../../../ducks/user-interface';
import { getAttributeContent, getCodeBlockLanguage } from '../../../../utils/attributes/attributes';
import { getHighLightedCode } from '../../CodeBlock';

interface Props {
    name: string;
    descriptor: DataAttributeModel | InfoAttributeModel | CustomAttributeModel | undefined;
    options?: { label: string; value: any }[];
    busy?: boolean;
    userInteractedRef?: React.MutableRefObject<boolean>;
    deleteButton?: React.ReactNode;
}

export function Attribute({
    name,
    descriptor,
    options,
    busy = false,
    userInteractedRef: userInteractionRef,
    deleteButton,
}: Props): React.ReactNode {
    const { setValue, watch, control } = useFormContext<Record<string, any>>();
    const formValues = watch();
    const [addNewAttributeValue, setIsAddNewAttributeValue] = useState<AddNewAttributeType | undefined>();
    const attributeCallbackValue = useSelector(userInterfaceSelectors.selectAttributeCallbackValue);
    const initiateAttributeCallback = useSelector(userInterfaceSelectors.selectInitiateAttributeCallback);
    const dispatch = useDispatch();

    useEffect(() => {
        if (descriptor?.name) {
            const addNewAttributeValue = AddNewAttributeList.find((a) => a.contentType === descriptor.contentType);
            setIsAddNewAttributeValue(addNewAttributeValue);
        }
    }, [descriptor]);

    const handleAddNew = useCallback(() => {
        if (!addNewAttributeValue) return;
        dispatch(
            userInterfaceActions.showGlobalModal({
                content: addNewAttributeValue.content,
                isOpen: true,
                size: 'lg',
                title: `Add New ${addNewAttributeValue.name}`,
            }),
        );
    }, [dispatch, addNewAttributeValue]);

    const onUserInteraction = useCallback(() => {
        if (userInteractionRef) {
            userInteractionRef.current = true;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInteractionRef, name]);

    const onFileLoaded = useCallback(
        (data: ProgressEvent<FileReader>, fileName: string) => {
            const fileInfo = data.target!.result as string;

            const contentType = fileInfo.split(',')[0].split(':')[1].split(';')[0];
            const fileContent = fileInfo.split(',')[1];

            setValue(`${name}.content`, fileContent);
            setValue(`${name}.fileName`, fileName);
            setValue(`${name}.mimeType`, contentType);
        },
        [setValue, name],
    );

    const onFileChanged = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) return;

            const fileName = e.target.files[0].name;

            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = (data) => onFileLoaded(data, fileName);
        },
        [onFileLoaded],
    );

    const onFileDrop = useCallback(
        (e: React.DragEvent<HTMLInputElement>) => {
            e.preventDefault();

            if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

            const fileName = e.dataTransfer.files[0].name;

            const reader = new FileReader();
            reader.readAsDataURL(e.dataTransfer.files[0]);
            reader.onload = (data) => {
                onFileLoaded(data, fileName);
            };
        },
        [onFileLoaded],
    );

    const onFileDragOver = useCallback((e: React.DragEvent<HTMLInputElement>) => {
        e.preventDefault();
    }, []);

    useEffect(() => {
        if (initiateAttributeCallback && attributeCallbackValue && options) {
            const newOption = options.find((option) => option.label === attributeCallbackValue);
            if (newOption) {
                setValue(name, newOption);
                dispatch(userInterfaceActions.clearAttributeCallbackValue());
                dispatch(userInterfaceActions.setInitiateAttributeCallback(false));
            }
        }
    }, [attributeCallbackValue, dispatch, options, setValue, initiateAttributeCallback, name]);

    if (!descriptor) return <></>;

    const getFormTypeFromAttributeContentType = (
        type: AttributeContentType,
    ): 'text' | 'number' | 'date' | 'time' | 'datetime-local' | 'password' | 'checkbox' | 'textarea' => {
        switch (type) {
            case AttributeContentType.Boolean:
                return 'checkbox';
            case AttributeContentType.Integer:
            case AttributeContentType.Float:
                return 'number';
            case AttributeContentType.String:
            case AttributeContentType.Credential:
            case AttributeContentType.Object:
                return 'text';
            case AttributeContentType.Text:
            case AttributeContentType.Codeblock:
                return 'textarea';
            case AttributeContentType.Date:
                return 'date';
            case AttributeContentType.Time:
                return 'time';
            case AttributeContentType.Datetime:
                return 'datetime-local';
            case AttributeContentType.Secret:
                return 'password';
            default:
                return 'text';
        }
    };

    const buildValidators: any = () => {
        const validators: any[] = [];

        if (isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
            if (descriptor.properties.required) validators.push(validateRequired());
            if (descriptor.contentType === AttributeContentType.Integer) validators.push(validateInteger());
            if (descriptor.contentType === AttributeContentType.Float) validators.push(validateFloat());
            if (isDataAttributeModel(descriptor)) {
                const regexValidator = descriptor.constraints?.find((c) => c.type === AttributeConstraintType.RegExp);
                if (regexValidator) {
                    const pattern = new RegExp((regexValidator as RegexpAttributeConstraintModel).data ?? '');
                    const errorMessage = regexValidator.errorMessage;
                    validators.push(validatePattern(pattern, errorMessage));
                }

                const rangeValidator = descriptor.constraints?.find((c) => c.type === AttributeConstraintType.Range);
                if (rangeValidator?.data) {
                    const rangeData = rangeValidator.data as RangeAttributeConstraintData;
                    const { from, to } = rangeData;
                    if (from && to) {
                        const pattern = new RegExp(`^(?:${from === 1 ? '[1-9]\\d{0,' + (to.toString().length - 1) + '}' : from}|${to})$`);
                        const errorMessage = rangeValidator.errorMessage;
                        validators.push(validatePattern(pattern, errorMessage));
                    }
                }
            }
        }

        const composed = composeValidators.apply(undefined, validators);

        return composed;
    };

    const getUpdatedOptionsForEditSelect = (
        valuesRecieved: { label: string; value: any }[],
        options?: { label: string; value: any }[],
    ): { label: string; value: any }[] | undefined => {
        if (valuesRecieved?.length > 0) {
            const updatedOptions = options?.filter((option) => {
                return !valuesRecieved.some((value) => JSON.stringify(value.value) == JSON.stringify(option.value));
            });
            return updatedOptions;
        }

        return options;
    };

    const createSelect = (descriptor: DataAttributeModel | CustomAttributeModel): React.ReactNode => {
        return (
            <Controller
                name={name}
                control={control}
                rules={{ validate: buildValidators() }}
                render={({ field, fieldState }) => {
                    // Convert field.value to the format expected by custom Select component
                    const getSelectValue = () => {
                        if (descriptor.properties.multiSelect) {
                            // For multi-select, convert to { value, label }[] format
                            if (!field.value) return [];
                            if (Array.isArray(field.value)) {
                                return field.value.map((v: any) => {
                                    if (typeof v === 'object' && v.value !== undefined) {
                                        return { value: v.value, label: v.label || String(v.value) };
                                    }
                                    // If it's already in the right format, return as is
                                    return typeof v === 'object'
                                        ? { value: v, label: String(v.reference ?? v.data ?? JSON.stringify(v)) }
                                        : { value: v, label: String(v) };
                                });
                            }
                            return [];
                        } else {
                            // For single select, return value as-is (Select handles object comparison)
                            if (!field.value) return '';
                            if (typeof field.value === 'object' && field.value.value !== undefined) {
                                return field.value.value;
                            }
                            return field.value;
                        }
                    };

                    // Convert options to the format expected by custom Select component
                    // Keep options as-is (with objects) - Select component handles it
                    const baseSelectOptions = options || [];

                    // Add "+" option for Add New functionality if available
                    const selectOptions = addNewAttributeValue
                        ? [
                              ...baseSelectOptions,
                              {
                                  label: '+',
                                  value: '__add_new__',
                                  disabled: false,
                              },
                          ]
                        : baseSelectOptions;

                    const selectValue = getSelectValue();

                    const isTargeted = descriptor.name === 'authority_credential';

                    return (
                        <>
                            {descriptor.properties.visible ? (
                                <Label htmlFor={`${name}Select`} required={descriptor.properties.required}>
                                    {descriptor.properties.label}
                                </Label>
                            ) : (
                                <></>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    {descriptor.properties.multiSelect ? (
                                        <Select
                                            id={`${name}Select`}
                                            value={selectValue as { value: string | number; label: string }[]}
                                            onChange={(newValue) => {
                                                if (Array.isArray(newValue) && newValue.some((v) => v.value === '__add_new__')) {
                                                    handleAddNew();
                                                    // Remove the "__add_new__" option from the selection
                                                    const filteredValue = newValue.filter((v) => v.value !== '__add_new__');
                                                    field.onChange(filteredValue.length > 0 ? filteredValue : undefined);
                                                    return;
                                                }
                                                field.onChange(newValue);
                                                onUserInteraction();
                                            }}
                                            options={selectOptions}
                                            placeholder={`Select ${descriptor.properties.label}`}
                                            isDisabled={descriptor.properties.readOnly || busy}
                                            isMulti={true}
                                            isClearable={!descriptor.properties.required}
                                            className={fieldState.isTouched && fieldState.invalid ? 'border-red-500' : ''}
                                        />
                                    ) : (
                                        <Select
                                            id={`${name}Select`}
                                            value={selectValue as string | number | { value: string | number; label: string }}
                                            onChange={(newValue) => {
                                                // Handle Add New option
                                                if (newValue === '__add_new__') {
                                                    handleAddNew();
                                                    return;
                                                }
                                                field.onChange(newValue);
                                                onUserInteraction();
                                            }}
                                            options={selectOptions}
                                            placeholder={`Select ${descriptor.properties.label}`}
                                            isDisabled={descriptor.properties.readOnly || busy}
                                            isMulti={false}
                                            isClearable={!descriptor.properties.required}
                                            className={fieldState.isTouched && fieldState.invalid ? 'border-red-500' : ''}
                                        />
                                    )}
                                </div>
                                {deleteButton}
                            </div>

                            {descriptor.properties.visible ? (
                                <>
                                    {descriptor.description && (
                                        <p className="text-xs text-gray-400 mt-1 dark:text-neutral-400">{descriptor.description}</p>
                                    )}

                                    {fieldState.isTouched && fieldState.invalid && (
                                        <div className="mt-1 text-sm text-red-600">{fieldState.error?.message}</div>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    );
                }}
            />
        );
    };

    const createFile = (descriptor: DataAttributeModel | CustomAttributeModel): React.ReactNode => {
        return (
            <>
                {descriptor.properties.visible ? (
                    <Label htmlFor={`${name}-content`} required={descriptor.properties.required}>
                        {descriptor.properties.label}
                    </Label>
                ) : (
                    <></>
                )}

                {!descriptor.properties.visible ? (
                    <></>
                ) : (
                    <div
                        id={`${name}-dragAndDrop`}
                        className="border-2 border-dashed border-gray-200 rounded-lg p-4 dark:border-neutral-700"
                        style={{ display: 'flex', flexWrap: 'wrap' }}
                        onDrop={onFileDrop}
                        onDragOver={onFileDragOver}
                    >
                        <div className="flex-grow">
                            <Label htmlFor={`${name}-content`}>File content</Label>

                            <Controller
                                name={`${name}.content`}
                                control={control}
                                rules={{ validate: buildValidators() }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <input
                                            {...field}
                                            id={`${name}-content`}
                                            type={descriptor.properties.visible ? 'text' : 'hidden'}
                                            placeholder={`Select or drag & drop ${descriptor.properties.label} File`}
                                            readOnly
                                            className={cn(
                                                'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                                                {
                                                    'border-red-500 focus:border-red-500 focus:ring-red-500':
                                                        fieldState.isTouched && fieldState.invalid,
                                                },
                                            )}
                                        />

                                        {fieldState.isTouched && fieldState.invalid && (
                                            <div className="mt-1 text-sm text-red-600">{fieldState.error?.message}</div>
                                        )}
                                    </>
                                )}
                            />

                            {descriptor.description && (
                                <p className="text-xs text-gray-400 mt-1 dark:text-neutral-400">{descriptor.description}</p>
                            )}
                        </div>
                        <div className="w-52 ml-4">
                            <Label htmlFor={`${name}-mimeType`}>Content type</Label>

                            <Controller
                                name={`${name}.mimeType`}
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        {...field}
                                        id={`${name}-mimeType`}
                                        type="text"
                                        placeholder="File not selected"
                                        disabled
                                        value={field.value || ''}
                                        onChange={() => {}}
                                        className="text-center"
                                    />
                                )}
                            />
                        </div>
                        <div className="w-40 ml-4">
                            <Label htmlFor={`${name}-fileName`}>File name</Label>

                            <Controller
                                name={`${name}.fileName`}
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        {...field}
                                        id={`${name}-fileName`}
                                        type="text"
                                        placeholder="File not selected"
                                        disabled
                                        value={field.value || ''}
                                        onChange={() => {}}
                                        className="text-center"
                                    />
                                )}
                            />
                        </div>
                        <div className="ml-4 flex items-center">
                            <label
                                htmlFor={name}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Select file...
                            </label>

                            <input id={name} type="file" className="hidden" onChange={onFileChanged} />
                        </div>
                        <div className="w-full h-0"></div>
                        <div className="text-sm text-gray-400 text-center w-full mt-4 dark:text-neutral-400">
                            Select or Drag &amp; Drop file to Drop Zone.
                        </div>
                        {deleteButton}
                    </div>
                )}
            </>
        );
    };

    const createInput = (descriptor: DataAttributeModel | CustomAttributeModel): React.ReactNode => {
        if (descriptor.contentType === AttributeContentType.Codeblock) {
            const attributeValue = formValues[name];
            const language = getCodeBlockLanguage(attributeValue?.language ?? undefined, descriptor.content);

            return (
                <>
                    <Label htmlFor={`${name}.codeTextArea`} required={descriptor.properties.required}>
                        {descriptor.properties.label}
                        <span className="italic"> ({language})</span>
                    </Label>
                    &nbsp;
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Controller
                            name={`${name}.code`}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Editor
                                        {...field}
                                        textareaId={`${name}.codeTextArea`}
                                        id={`${name}.code`}
                                        value={field.value || ''}
                                        onValueChange={(code) => {
                                            setValue(`${name}.code`, code);
                                        }}
                                        highlight={(code) => getHighLightedCode(code, language)}
                                        padding={10}
                                        style={{
                                            fontFamily: '"Fira code", "Fira Mono", monospace',
                                            fontSize: 14,
                                            border: 'solid 1px #ccc',
                                            borderRadius: '0.375rem',
                                            width: '100%',
                                        }}
                                    />
                                );
                            }}
                        />
                        {deleteButton}
                    </div>
                </>
            );
        }

        function transformInputValue(value: any) {
            if (descriptor.contentType === AttributeContentType.Datetime) {
                return getFormattedDateTime(value);
            } else if (descriptor.contentType === AttributeContentType.Boolean && descriptor.properties.required) {
                return value ?? false;
            }
            return value;
        }

        return (
            <Controller
                name={name}
                control={control}
                rules={{ validate: buildValidators() }}
                render={({ field, fieldState }) => (
                    <>
                        {descriptor.properties.visible && descriptor.contentType !== AttributeContentType.Boolean ? (
                            <Label htmlFor={name} required={descriptor.properties.required}>
                                {descriptor.properties.label}
                            </Label>
                        ) : (
                            <></>
                        )}
                        <div className="flex items-center">
                            {descriptor.contentType === AttributeContentType.Boolean ? (
                                <div className="flex items-center mb-3">
                                    <Switch
                                        id={name}
                                        checked={transformInputValue(field.value) ?? false}
                                        onChange={(checked) => field.onChange(checked)}
                                        disabled={descriptor.properties.readOnly || busy}
                                        secondaryLabel={descriptor.properties.label}
                                    />
                                    {deleteButton}
                                </div>
                            ) : descriptor.contentType === AttributeContentType.Text ? (
                                <>
                                    <textarea
                                        {...field}
                                        id={name}
                                        placeholder={`Enter ${descriptor.properties.label}`}
                                        disabled={descriptor.properties.readOnly || busy}
                                        value={transformInputValue(field.value) || ''}
                                        rows={4}
                                        className={cn(
                                            'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                                            {
                                                'border-red-500 focus:border-red-500 focus:ring-red-500':
                                                    fieldState.isTouched && fieldState.invalid,
                                            },
                                        )}
                                    />
                                    {deleteButton}
                                </>
                            ) : (
                                <>
                                    {descriptor.contentType === AttributeContentType.Datetime ? (
                                        <DatePicker
                                            id={name}
                                            value={
                                                field.value
                                                    ? field.value.includes('T')
                                                        ? field.value
                                                        : field.value.replace(' ', 'T')
                                                    : undefined
                                            }
                                            onChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            onBlur={field.onBlur}
                                            disabled={descriptor.properties.readOnly || busy}
                                            invalid={fieldState.isTouched && !!fieldState.invalid}
                                            error={
                                                fieldState.isTouched && fieldState.invalid
                                                    ? typeof fieldState.error === 'string'
                                                        ? fieldState.error
                                                        : fieldState.error?.message || 'Invalid value'
                                                    : undefined
                                            }
                                            required={descriptor.properties.required}
                                            timePicker
                                        />
                                    ) : (
                                        <TextInput
                                            id={name}
                                            type={
                                                descriptor.properties.visible
                                                    ? (getFormTypeFromAttributeContentType(descriptor.contentType) as
                                                          | 'text'
                                                          | 'number'
                                                          | 'date'
                                                          | 'time'
                                                          | 'password')
                                                    : 'text'
                                            }
                                            placeholder={`Enter ${descriptor.properties.label}`}
                                            disabled={descriptor.properties.readOnly || busy}
                                            value={transformInputValue(field.value) || ''}
                                            onChange={(value) => field.onChange(value)}
                                            invalid={fieldState.isTouched && !!fieldState.invalid}
                                            error={fieldState.isTouched && fieldState.invalid ? fieldState.error?.message : undefined}
                                        />
                                    )}
                                    {deleteButton}
                                </>
                            )}
                        </div>

                        {descriptor.properties.visible ? (
                            <>
                                {descriptor.description && (
                                    <p
                                        className={cn('text-xs text-gray-400 dark:text-neutral-400', {
                                            'block -mt-2': descriptor.contentType === AttributeContentType.Boolean,
                                            'mt-1': descriptor.contentType !== AttributeContentType.Boolean,
                                        })}
                                    >
                                        {descriptor.description}
                                    </p>
                                )}

                                {fieldState.isTouched && fieldState.invalid && descriptor.contentType !== AttributeContentType.Boolean && (
                                    <div className="mt-1 text-sm text-red-600">{fieldState.error?.message}</div>
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                )}
            />
        );
    };

    const createField = (descriptor: DataAttributeModel | CustomAttributeModel): React.ReactNode => {
        if (descriptor.properties.list) return createSelect(descriptor);
        if (descriptor.contentType === AttributeContentType.File) return createFile(descriptor);
        return createInput(descriptor);
    };

    const createInfo = (descriptor: InfoAttributeModel): React.ReactNode => {
        return (
            <div
                id={`${descriptor.name}Info`}
                className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
            >
                <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
                    <h3 className="text-gray-800 dark:text-white text-sm">{descriptor.properties.label}</h3>
                </div>
                <div className="p-4 text-sm text-[var(--dark-gray-color)] server-content">
                    {parse(
                        DOMPurify.sanitize(
                            marked.parse(getAttributeContent(descriptor.contentType, descriptor.content).toString()) as string,
                        ),
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor) ? createField(descriptor) : createInfo(descriptor)}
        </div>
    );
}
