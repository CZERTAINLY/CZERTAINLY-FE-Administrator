import { useCallback, useEffect, useMemo } from 'react';
import { Field, useForm } from 'react-final-form';
import Select from 'react-select';
import { Col, FormFeedback, FormGroup, Input, InputGroup } from 'reactstrap';
import { getStepValue } from 'utils/common-utils';
import { getFormattedDateTime } from 'utils/dateUtil';
import { BaseAttributeContentModel, CustomAttributeModel } from '../../../../types/attributes';
import { AttributeContentType } from '../../../../types/openapi';
import { composeValidators, validateRequired } from '../../../../utils/validators';
import WidgetButtons from '../../../WidgetButtons';
import { ContentFieldConfiguration } from '../index';

type Props = {
    descriptor: CustomAttributeModel;
    initialContent?: BaseAttributeContentModel[];
    onSubmit: (attributeUuid: string, content: BaseAttributeContentModel[]) => void;
};

export default function ContentValueField({ descriptor, initialContent, onSubmit }: Props) {
    const form = useForm();

    const options = useMemo(
        () =>
            descriptor.content?.map((a) => ({
                label: a.reference
                    ? a.reference
                    : descriptor.contentType === AttributeContentType.Datetime
                      ? getFormattedDateTime(a.data.toString())
                      : a.data.toString(),
                value: a,
            })),
        [descriptor],
    );

    useEffect(() => {
        const initialValue =
            initialContent && initialContent.length > 0
                ? descriptor.properties.list
                    ? options?.filter((o) =>
                          initialContent.find((i) => {
                              if (descriptor.contentType === AttributeContentType.Datetime) {
                                  return getFormattedDateTime(i.data.toString()) === getFormattedDateTime(o.value.data.toString());
                              } else {
                                  return i.data === o.value.data;
                              }
                          }),
                      )
                    : initialContent[0].data
                : undefined;

        const descriptorValue = !descriptor.properties.list
            ? descriptor.content && descriptor.content.length > 0
                ? descriptor.content[0].data
                : undefined
            : undefined;

        form.change(descriptor.name, initialValue ?? descriptorValue ?? ContentFieldConfiguration[descriptor.contentType].initial);
    }, [descriptor, form, initialContent, options]);

    const fieldStepValue = useMemo(() => {
        const stepValue = getStepValue(descriptor.contentType);
        return stepValue;
    }, [descriptor]);

    const beforeOnSubmit = useCallback(
        (attributeUuid: string, content: BaseAttributeContentModel[]) => {
            const updatedContent = content.map((contentObject) => {
                if (descriptor.contentType === 'date') {
                    const updatedDate = new Date(contentObject.data as string);
                    const formattedDate = updatedDate.toISOString().slice(0, 10);
                    return { ...contentObject, data: formattedDate };
                }
                if (descriptor.contentType === 'time') {
                    const timeString = contentObject.data as string;
                    const timeStringSplit = timeString.split(':');
                    if (timeStringSplit.length === 2) {
                        return { ...contentObject, data: timeString + ':00' };
                    }
                    return contentObject;
                } else {
                    return contentObject;
                }
            });

            onSubmit(attributeUuid, updatedContent);
        },
        [onSubmit, descriptor],
    );

    const transformObjectContent = (contentType: AttributeContentType, value: BaseAttributeContentModel) => {
        if (contentType === AttributeContentType.Datetime || contentType === AttributeContentType.Date) {
            return { ...value, data: new Date(value.data as string).toISOString() };
        }
        return value;
    };

    const getFieldContent = (input: any) => {
        if (ContentFieldConfiguration[descriptor.contentType].type === 'checkbox') {
            return [{ data: input.checked }];
        }
        if (!input.value) {
            return undefined;
        }
        if (descriptor.properties.list) {
            if (descriptor.properties.multiSelect) {
                return input.value.map((v: any) => transformObjectContent(descriptor.contentType, v.value));
            } else {
                if (Array.isArray(input.value)) {
                    return input.value.map((v: any) => transformObjectContent(descriptor.contentType, v.value));
                } else {
                    return [transformObjectContent(descriptor.contentType, input.value.value)];
                }
            }
        }
        return [transformObjectContent(descriptor.contentType, { data: input.value })];
    };

    const validators = useMemo(() => {
        const result = [];
        if (ContentFieldConfiguration[descriptor.contentType].validators) {
            result.push(...(ContentFieldConfiguration[descriptor.contentType].validators ?? []));
        }
        if (descriptor.properties.required) {
            result.push(validateRequired());
        }
        return result.length === 0 ? undefined : composeValidators(...result);
    }, [descriptor]);

    return ContentFieldConfiguration[descriptor.contentType].type ? (
        <Field
            key={descriptor.name}
            name={descriptor.name}
            validate={validators ?? undefined}
            type={ContentFieldConfiguration[descriptor.contentType].type}
        >
            {({ input, meta }) => {
                const inputContent = getFieldContent(input);
                const inputComponent = descriptor.properties.list ? (
                    <Col xs="10" sm="10" md="10" lg="10" xl="10">
                        <Select
                            {...input}
                            options={options}
                            menuPortalTarget={document.body}
                            styles={{
                                control: (provided) =>
                                    meta.touched && meta.invalid
                                        ? {
                                              ...provided,
                                              border: 'solid 1px red',
                                              '&:hover': { border: 'solid 1px red' },
                                          }
                                        : { ...provided },
                            }}
                            isMulti={descriptor.properties.multiSelect}
                            isDisabled={descriptor.properties.readOnly}
                            isClearable={!descriptor.properties.required}
                        />
                    </Col>
                ) : (
                    <Input
                        disabled={descriptor.properties.readOnly}
                        {...input}
                        valid={!meta.error && meta.touched}
                        invalid={!!meta.error && meta.touched}
                        type={ContentFieldConfiguration[descriptor.contentType].type}
                        id={descriptor.name}
                        step={fieldStepValue}
                        value={descriptor.contentType === AttributeContentType.Datetime ? getFormattedDateTime(input.value) : input.value}
                    />
                );
                const feedbackComponent = <FormFeedback>{meta.error}</FormFeedback>;

                return (
                    <FormGroup>
                        <InputGroup>
                            {inputComponent}
                            <WidgetButtons
                                buttons={[
                                    {
                                        icon: 'plus',
                                        disabled: !inputContent || !meta.valid,
                                        tooltip: 'Save',
                                        onClick: () => beforeOnSubmit(descriptor.uuid, inputContent),
                                    },
                                ]}
                            />
                            {feedbackComponent}
                        </InputGroup>
                    </FormGroup>
                );
            }}
        </Field>
    ) : (
        <></>
    );
}
