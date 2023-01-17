import WidgetButtons from "components/WidgetButtons";
import React, { useEffect, useMemo } from "react";

import { Field, useForm, useFormState } from "react-final-form";
import { Button, FormFeedback, FormGroup, Input, InputGroup, Label } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import { AttributeContentType } from "types/openapi";
import { composeValidators, validateAlphaNumeric, validateFloat, validateInteger, validateRequired } from "utils/validators";

const AllowedAttributeContentType = [AttributeContentType.String, AttributeContentType.Integer, AttributeContentType.Boolean, AttributeContentType.Date, AttributeContentType.Float, AttributeContentType.Text, AttributeContentType.Time, AttributeContentType.Datetime];

type Props = {
    editable: boolean;
    isList: boolean;
}

export default function DynamicContent({editable, isList}: Props) {
    const form = useForm();
    const formState = useFormState();
    const contentTypeValue = formState.values["contentType"];
    const contentValues = formState.values["content"];

    useEffect(() => {
        if (!isList && contentValues?.length > 1) {
            form.change("content", contentValues.slice(0, 1));
        }
    }, [isList, contentValues, form]);

    const contentField: ({ [key: string]: { validators?: (value: string) => any, type: InputType, initial: string | boolean | number } }) = useMemo(() => ({
        [AttributeContentType.Text]: {
            validators: composeValidators(validateAlphaNumeric()),
            type: "textarea",
            initial: "",
        },
        [AttributeContentType.String]: {
            validators: composeValidators(validateAlphaNumeric()),
            type: "text",
            initial: "",
        },
        [AttributeContentType.Integer]: {
            validators: composeValidators(validateInteger()),
            type: "number",
            initial: 0,
        },
        [AttributeContentType.Float]: {
            validators: composeValidators(validateFloat()),
            type: "number",
            initial: 0,
        },
        [AttributeContentType.Boolean]: {
            type: "checkbox",
            initial: false,
        },
        [AttributeContentType.Datetime]: {
            type: "datetime-local",
            initial: "",
        },
        [AttributeContentType.Date]: {
            type: "date",
            initial: "",
        },
        [AttributeContentType.Time]: {
            type: "time",
            initial: "",
        },
    }), []);

    return (
        <>
            <Field name="contentType" validate={composeValidators(validateRequired())}>
                {({input, meta}) => (
                    <FormGroup>
                        <Label for="contentType">Content Type</Label>
                        <Input
                            {...input}
                            valid={!meta.error && meta.touched}
                            invalid={!!meta.error && meta.touched}
                            type="select"
                            id="contentType"
                            placeholder="Content Type"
                            disabled={!editable}
                            onChange={(e) => {
                                form.change("contentType", e.target.value);
                                form.change("content", []);
                            }}
                        >
                            {AllowedAttributeContentType.map(contentType => (
                                <option key={contentType} value={contentType}>
                                    {contentType}
                                </option>
                            ))}
                        </Input>
                        <FormFeedback>{meta.error}</FormFeedback>
                    </FormGroup>
                )}
            </Field>

            {
                contentValues?.map((_contentValue: any, index: number) => {
                    const name = `content[${index}].data`;

                    return contentField[contentTypeValue].type &&
                        (<Field key={name} name={name} validate={contentField[contentTypeValue].validators}
                                type={contentField[contentTypeValue].type}>
                            {({input, meta}) => {
                                const inputComponent = <Input
                                    {...input}
                                    valid={!meta.error && meta.touched}
                                    invalid={!!meta.error && meta.touched}
                                    type={contentField[contentTypeValue].type}
                                    id={name}
                                    placeholder="Default Content"
                                />;
                                const labelComponent = <Label for={name}>Default Content</Label>;
                                const buttonComponent = <WidgetButtons buttons={[{
                                    icon: "trash", disabled: false, tooltip: "Remove", onClick: () => {
                                        form.change("content", contentValues.filter((_contentValue: any, filterIndex: number) => index !== filterIndex));
                                    },
                                }]}/>;

                                return <FormGroup>{contentTypeValue !== AttributeContentType.Boolean
                                    ? (<>{labelComponent}<InputGroup>{inputComponent}{buttonComponent}</InputGroup></>)
                                    : (<>{inputComponent} {labelComponent}{buttonComponent}</>)
                                }<FormFeedback>{meta.error}</FormFeedback></FormGroup>;
                            }}
                        </Field>);
                })
            }
            {
                (isList || !contentValues || contentValues.length === 0) && (
                    <Button color={"default"}
                            onClick={() => form.change("content", [...(isList ? (contentValues ?? []) : []), {data: contentField[contentTypeValue].initial}])}>
                        <i className={"fa fa-plus"}/>&nbsp;Add Content
                    </Button>)
            }
        </>
    );
}