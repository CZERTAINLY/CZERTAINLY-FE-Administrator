import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { getStepValue } from 'utils/common-utils';
import { getFormattedDateTime } from 'utils/dateUtil';
import { BaseAttributeContentModel, CustomAttributeModel } from '../../../../types/attributes';
import { AttributeContentType } from '../../../../types/openapi';
import { composeValidators, validateRequired } from '../../../../utils/validators';
import WidgetButtons from '../../../WidgetButtons';
import { ContentFieldConfiguration } from '../index';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import DatePicker from 'components/DatePicker';
import Container from 'components/Container';
import cn from 'classnames';
import Switch from 'components/Switch';

type Props = {
    id?: string;
    descriptor: CustomAttributeModel;
    initialContent?: BaseAttributeContentModel[];
    onSubmit: (attributeUuid: string, content: BaseAttributeContentModel[]) => void;
};

export default function ContentValueField({ id, descriptor, initialContent, onSubmit }: Props) {
    const { control, setValue } = useFormContext();

    const options = useMemo(
        () =>
            descriptor.content?.map((a) => ({
                label: a.reference
                    ? a.reference
                    : descriptor.contentType === AttributeContentType.Datetime
                      ? getFormattedDateTime(a.data.toString())
                      : a.data.toString(),
                value: a.data.toString(),
            })),
        [descriptor],
    );

    useEffect(() => {
        const initialValue =
            initialContent && initialContent.length > 0
                ? descriptor.properties.list
                    ? descriptor.properties.multiSelect
                        ? options?.filter((o) =>
                              initialContent.find((i) => {
                                  if (descriptor.contentType === AttributeContentType.Datetime) {
                                      return getFormattedDateTime(i.data.toString()) === getFormattedDateTime(o.value.toString());
                                  } else {
                                      return i.data === o.value;
                                  }
                              }),
                          )
                        : options?.find((o) => {
                              if (descriptor.contentType === AttributeContentType.Datetime) {
                                  return (
                                      getFormattedDateTime(initialContent[0].data.toString()) === getFormattedDateTime(o.value.toString())
                                  );
                              } else {
                                  return initialContent[0].data === o.value;
                              }
                          })?.value
                    : initialContent[0].data
                : undefined;

        const descriptorValue = !descriptor.properties.list
            ? descriptor.content && descriptor.content.length > 0
                ? descriptor.content[0].data
                : undefined
            : undefined;

        setValue(descriptor.name, initialValue ?? descriptorValue ?? ContentFieldConfiguration[descriptor.contentType].initial);
    }, [descriptor, setValue, initialContent, options]);

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
            const booleanValue = input.checked !== undefined ? input.checked : input.value;
            return [{ data: booleanValue }];
        }
        if (!input.value) {
            return undefined;
        }
        if (descriptor.properties.list) {
            if (descriptor.properties.multiSelect) {
                return input.value.map((v: any) => transformObjectContent(descriptor.contentType, { data: v.value }));
            } else {
                if (Array.isArray(input.value)) {
                    return input.value.map((v: any) => transformObjectContent(descriptor.contentType, { data: v.value }));
                } else {
                    return [transformObjectContent(descriptor.contentType, { data: input.value })];
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

    if (!ContentFieldConfiguration[descriptor.contentType].type) {
        return null;
    }

    return (
        <Controller
            key={descriptor.name}
            name={descriptor.name}
            control={control}
            rules={{
                validate: validators,
            }}
            render={({ field, fieldState }) => {
                const inputContent = getFieldContent(field);
                const inputType = ContentFieldConfiguration[descriptor.contentType].type;
                const isDateTime = inputType === 'datetime-local';
                const needsStep = inputType === 'number';
                const displayValue =
                    descriptor.contentType === AttributeContentType.Datetime ? getFormattedDateTime(field.value) : field.value;

                const inputComponent = descriptor.properties.list ? (
                    <Select
                        {...field}
                        id={descriptor.name}
                        options={options ?? []}
                        isMulti={descriptor.properties.multiSelect}
                        disabled={descriptor.properties.readOnly}
                        isClearable={!descriptor.properties.required}
                    />
                ) : isDateTime ? (
                    <DatePicker
                        id={descriptor.name}
                        value={field.value ? (field.value.includes('T') ? field.value : field.value.replace(' ', 'T')) : undefined}
                        onChange={(value) => {
                            field.onChange(value);
                        }}
                        onBlur={field.onBlur}
                        disabled={descriptor.properties.readOnly}
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
                ) : needsStep ? (
                    <input
                        {...field}
                        disabled={descriptor.properties.readOnly}
                        type={inputType}
                        id={descriptor.name}
                        step={fieldStepValue}
                        value={displayValue || ''}
                        className={cn(
                            'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                            {
                                'border-red-500 focus:border-red-500 focus:ring-red-500': fieldState.isTouched && fieldState.invalid,
                            },
                        )}
                    />
                ) : inputType === 'checkbox' ? (
                    <Switch
                        id={id || descriptor.name || 'checkbox'}
                        checked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                        disabled={descriptor.properties.readOnly}
                    />
                ) : (
                    <TextInput
                        id={descriptor.name}
                        type={inputType as 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date' | 'time'}
                        disabled={descriptor.properties.readOnly}
                        value={displayValue || ''}
                        onChange={(value) => field.onChange(value)}
                        invalid={fieldState.isTouched && !!fieldState.invalid}
                        error={fieldState.isTouched && fieldState.invalid ? fieldState.error?.message : undefined}
                    />
                );
                const feedbackComponent = <div className="text-red-500 mt-2">{fieldState.error?.message}</div>;

                return (
                    <>
                        <Container className={cn('flex-row !gap-0 items-center', { 'justify-center': inputType !== 'checkbox' })}>
                            <div className={cn({ grow: inputType !== 'checkbox' })}>{inputComponent}</div>
                            <WidgetButtons
                                buttons={[
                                    {
                                        id: 'save',
                                        icon: 'plus',
                                        disabled: !inputContent || fieldState.invalid,
                                        tooltip: 'Save',
                                        onClick: () => beforeOnSubmit(descriptor.uuid, inputContent),
                                    },
                                ]}
                            />
                        </Container>
                        {feedbackComponent}
                    </>
                );
            }}
        />
    );
}
