import * as DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { marked } from 'marked';
import React, { useCallback, useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';

import Select from 'react-select';
import Editor from 'react-simple-code-editor';

import { Card, CardBody, CardHeader, FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/types/lib/Input';
import {
    CustomAttributeModel,
    DataAttributeModel,
    InfoAttributeModel,
    RegexpAttributeConstraintModel,
    isCustomAttributeModel,
    isDataAttributeModel,
} from 'types/attributes';
import { AttributeConstraintType, AttributeContentType, RangeAttributeConstraintData } from 'types/openapi';

import CustomSelectComponent from 'components/CustomSelectComponent';
import { useDispatch, useSelector } from 'react-redux';
import { AddNewAttributeList, AddNewAttributeType } from 'types/user-interface';
import { getStepValue } from 'utils/common-utils';
import { getFormattedDateTime } from 'utils/dateUtil';
import { composeValidators, validateFloat, validateInteger, validatePattern, validateRequired } from 'utils/validators';
import { actions as userInterfaceActions, selectors as userInterfaceSelectors } from '../../../../ducks/user-interface';
import { getAttributeContent } from '../../../../utils/attributes/attributes';
import { getHighLightedCode } from '../../CodeBlock';

interface Props {
    name: string;
    descriptor: DataAttributeModel | InfoAttributeModel | CustomAttributeModel | undefined;
    options?: { label: string; value: any }[];
    busy?: boolean;
}

export function Attribute({ name, descriptor, options, busy = false }: Props): JSX.Element {
    const form = useForm();
    const formState = useFormState();
    const [addNewAttributeValue, setIsAddNewAttributeValue] = useState<AddNewAttributeType | undefined>();
    const attributeCallbackValue = useSelector(userInterfaceSelectors.selectAttributeCallbackValue);
    const initiateAttributeCallback = useSelector(userInterfaceSelectors.selectInitiateAttributeCallback);
    const dispatch = useDispatch();

    useEffect(() => {
        if (descriptor?.name) {
            const addNewAttributeValue = AddNewAttributeList.find((a) => a.name === descriptor.name);
            setIsAddNewAttributeValue(addNewAttributeValue);
        }
    }, [descriptor]);

    const onFileLoaded = useCallback(
        (data: ProgressEvent<FileReader>, fileName: string) => {
            const fileInfo = data.target!.result as string;

            const contentType = fileInfo.split(',')[0].split(':')[1].split(';')[0];
            const fileContent = fileInfo.split(',')[1];

            form.mutators.setAttribute(`${name}.content`, fileContent);
            form.mutators.setAttribute(`${name}.fileName`, fileName);
            form.mutators.setAttribute(`${name}.mimeType`, contentType);
        },
        [form.mutators, name],
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
                form.change(name, newOption);
                dispatch(userInterfaceActions.clearAttributeCallbackValue());
                dispatch(userInterfaceActions.setInitiateAttributeCallback(false));
            }
        }
    }, [attributeCallbackValue, dispatch, options, form, initiateAttributeCallback, name]);

    if (!descriptor) return <></>;

    const getFormTypeFromAttributeContentType = (type: AttributeContentType): InputType => {
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
            case AttributeContentType.File:
                return 'file';
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

    const createSelect = (descriptor: DataAttributeModel | CustomAttributeModel): JSX.Element => {
        return (
            <Field name={name} validate={buildValidators()} type={getFormTypeFromAttributeContentType(descriptor.contentType)}>
                {({ input, meta }) => (
                    <>
                        {descriptor.properties.visible ? (
                            <Label for={`${name}Select`}>
                                {descriptor.properties.label}
                                {descriptor.properties.required ? ' *' : ''}
                            </Label>
                        ) : (
                            <></>
                        )}

                        {!addNewAttributeValue ? (
                            <Select
                                {...input}
                                inputId={`${name}Select`}
                                maxMenuHeight={140}
                                menuPlacement="auto"
                                options={getUpdatedOptionsForEditSelect(input.value, options)}
                                placeholder={`Select ${descriptor.properties.label}`}
                                styles={{
                                    control: (provided) =>
                                        meta.touched && meta.invalid
                                            ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                            : { ...provided },
                                }}
                                isDisabled={descriptor.properties.readOnly || busy}
                                isMulti={descriptor.properties.multiSelect}
                                isClearable={!descriptor.properties.required}
                            />
                        ) : (
                            <Select
                                {...input}
                                inputId={`${name}Select`}
                                maxMenuHeight={140}
                                menuPlacement="auto"
                                options={options}
                                placeholder={`Select ${descriptor.properties.label}`}
                                styles={{
                                    control: (provided) =>
                                        meta.touched && meta.invalid
                                            ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                            : { ...provided },
                                }}
                                isDisabled={descriptor.properties.readOnly}
                                isMulti={descriptor.properties.multiSelect}
                                isClearable={!descriptor.properties.required}
                                components={{
                                    Menu: (props) => (
                                        <CustomSelectComponent
                                            onAddNew={() => {
                                                dispatch(
                                                    userInterfaceActions.showGlobalModal({
                                                        content: addNewAttributeValue.content,
                                                        isOpen: true,
                                                        size: 'lg',
                                                        title: `Add New ${descriptor.name}`,
                                                    }),
                                                );
                                            }}
                                            {...props}
                                        />
                                    ),
                                }}
                            />
                        )}
                        {descriptor.properties.visible ? (
                            <>
                                <FormText style={{ marginTop: '0.2em' }}>{descriptor.description}</FormText>

                                <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                    {meta.error}
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </Field>
        );
    };

    const createFile = (descriptor: DataAttributeModel | CustomAttributeModel): JSX.Element => {
        return (
            <>
                {descriptor.properties.visible ? (
                    <Label for={`${name}-content`}>
                        {descriptor.properties.label}
                        {descriptor.properties.required ? ' *' : ''}
                    </Label>
                ) : (
                    <></>
                )}

                {!descriptor.properties.visible ? (
                    <></>
                ) : (
                    <div
                        className="border border-light rounded mb-0"
                        style={{ display: 'flex', flexWrap: 'wrap', padding: '1em', borderStyle: 'dashed !important' }}
                        onDrop={onFileDrop}
                        onDragOver={onFileDragOver}
                    >
                        <div style={{ flexGrow: 1 }}>
                            <Label for={`${name}-content`}>File content</Label>

                            <Field
                                name={`${name}.content`}
                                validate={buildValidators()}
                                type={getFormTypeFromAttributeContentType(descriptor.contentType)}
                            >
                                {({ input, meta }) => (
                                    <>
                                        <Input
                                            {...input}
                                            id={`${name}-content`}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type={descriptor.properties.visible ? 'text' : 'hidden'}
                                            placeholder={`Select or drag & drop ${descriptor.properties.label} File`}
                                            readOnly={true}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </>
                                )}
                            </Field>

                            <FormText>{descriptor.description}</FormText>
                        </div>
                        &nbsp;
                        <div style={{ width: '13rem' }}>
                            <Label for={`${name}-mimeType`}>Content type</Label>

                            <Field name={`${name}.mimeType`}>
                                {({ input, meta }) => (
                                    <Input
                                        {...input}
                                        id={`${name}-mimeType`}
                                        type={descriptor.properties.visible ? 'text' : 'hidden'}
                                        placeholder="File not selected"
                                        disabled={true}
                                        style={{ textAlign: 'center' }}
                                    />
                                )}
                            </Field>
                        </div>
                        &nbsp;
                        <div style={{ width: '10rem' }}>
                            <Label for={`${name}-fileName`}>File name</Label>

                            <Field name={`${name}.fileName`}>
                                {({ input }) => (
                                    <Input
                                        {...input}
                                        id={`${name}-fileName`}
                                        type={descriptor.properties.visible ? 'text' : 'hidden'}
                                        placeholder="File not selected"
                                        disabled={true}
                                        style={{ textAlign: 'center' }}
                                    />
                                )}
                            </Field>
                        </div>
                        &nbsp;
                        <div>
                            <Label for={name}>&nbsp;</Label>
                            <br />

                            <Label className="btn btn-default" for={name} style={{ margin: 0 }}>
                                Select file...
                            </Label>

                            <Input id={name} type="file" style={{ display: 'none' }} onChange={onFileChanged} />
                        </div>
                        <div style={{ flexBasis: '100%', height: 0 }}></div>
                        <div className="text-muted" style={{ textAlign: 'center', flexBasis: '100%', marginTop: '1rem' }}>
                            Select or Drag &amp; Drop file to Drop Zone.
                        </div>
                    </div>
                )}
            </>
        );
    };

    const createInput = (descriptor: DataAttributeModel | CustomAttributeModel): JSX.Element => {
        if (descriptor.contentType === AttributeContentType.Codeblock) {
            const attributes = formState.values[name.slice(0, name.indexOf('.'))];
            const language = attributes ? (attributes[descriptor.name]?.language ?? 'javascript') : 'javascript';

            return (
                <>
                    <Label for={`${name}.codeTextArea`}>
                        {descriptor.properties.label}
                        {descriptor.properties.required ? ' *' : ''}
                        <span style={{ fontStyle: 'italic' }}> ({language})</span>
                    </Label>
                    &nbsp;
                    <Field name={`${name}.code`} type={getFormTypeFromAttributeContentType(descriptor.contentType)}>
                        {({ input }) => {
                            return (
                                <Editor
                                    {...input}
                                    textareaId={`${name}.codeTextArea`}
                                    id={`${name}.code`}
                                    value={input.value}
                                    onValueChange={(code) => {
                                        form.change(`${name}.code`, code);
                                    }}
                                    highlight={(code) => getHighLightedCode(code, language)}
                                    padding={10}
                                    style={{
                                        fontFamily: '"Fira code", "Fira Mono", monospace',
                                        fontSize: 14,
                                        border: 'solid 1px #ccc',
                                        borderRadius: '0.375rem',
                                    }}
                                />
                            );
                        }}
                    </Field>
                </>
            );
        }

        return (
            <Field name={name} validate={buildValidators()} type={getFormTypeFromAttributeContentType(descriptor.contentType)}>
                {({ input, meta }) => (
                    <>
                        {descriptor.properties.visible && descriptor.contentType !== AttributeContentType.Boolean ? (
                            <Label for={name}>
                                {descriptor.properties.label}
                                {descriptor.properties.required ? ' *' : ''}
                            </Label>
                        ) : (
                            <></>
                        )}

                        <Input
                            {...input}
                            id={name}
                            valid={!meta.error && meta.touched}
                            invalid={!!meta.error && meta.touched}
                            type={descriptor.properties.visible ? getFormTypeFromAttributeContentType(descriptor.contentType) : 'hidden'}
                            placeholder={`Enter ${descriptor.properties.label}`}
                            disabled={descriptor.properties.readOnly || busy}
                            step={getStepValue(descriptor.contentType)}
                            value={
                                descriptor.contentType === AttributeContentType.Datetime ? getFormattedDateTime(input.value) : input.value
                            }
                        />

                        {descriptor.properties.visible && descriptor.contentType === AttributeContentType.Boolean ? (
                            <>
                                &nbsp;
                                <Label for={name}>
                                    {descriptor.properties.label}
                                    {descriptor.properties.required ? ' *' : ''}
                                </Label>
                            </>
                        ) : (
                            <></>
                        )}

                        {descriptor.properties.visible ? (
                            <>
                                <FormText
                                    style={
                                        descriptor.contentType === AttributeContentType.Boolean
                                            ? { display: 'block', marginTop: '-0.8em' }
                                            : { marginTop: '0.2em' }
                                    }
                                >
                                    {descriptor.description}
                                </FormText>

                                <FormFeedback>{meta.error}</FormFeedback>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </Field>
        );
    };

    const createField = (descriptor: DataAttributeModel | CustomAttributeModel): JSX.Element => {
        if (descriptor.properties.list) return createSelect(descriptor);
        if (descriptor.contentType === AttributeContentType.File) return createFile(descriptor);
        return createInput(descriptor);
    };

    const createInfo = (descriptor: InfoAttributeModel): JSX.Element => {
        return (
            <Card color="default">
                <CardHeader>{descriptor.properties.label}</CardHeader>
                <CardBody>
                    {parse(
                        DOMPurify.sanitize(
                            marked.parse(getAttributeContent(descriptor.contentType, descriptor.content).toString()) as string,
                        ),
                    )}
                </CardBody>
            </Card>
        );
    };

    return (
        <FormGroup>
            {isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor) ? createField(descriptor) : createInfo(descriptor)}
        </FormGroup>
    );
}
