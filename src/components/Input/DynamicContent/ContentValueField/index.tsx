import { useCallback, useEffect, useMemo, useState } from 'react';
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
import Button from 'components/Button';
import { Plus } from 'lucide-react';
import { AddCustomValuePanel } from '../AddCustomValuePanel';
import { parseListValueByContentType } from 'components/Attributes/AttributeEditor/Attribute/attributeHelpers';

function getValueFieldError(fieldState: { error?: { message?: string }; isTouched: boolean; invalid: boolean }) {
    if (!fieldState.isTouched || !fieldState.invalid) return undefined;
    return typeof fieldState.error === 'string' ? fieldState.error : fieldState.error?.message || 'Invalid value';
}

function ValueFieldInput({
    descriptor,
    id,
    field,
    fieldState,
    fieldStepValue,
    options,
}: {
    descriptor: CustomAttributeModel;
    id?: string;
    field: { value: any; onChange: (v: any) => void; onBlur: () => void };
    fieldState: { isTouched: boolean; invalid: boolean; error?: { message?: string } };
    fieldStepValue: number | undefined;
    options: { label: string; value: string }[];
}) {
    const [showAddCustom, setShowAddCustom] = useState(false);

    const inputType = ContentFieldConfiguration[descriptor.contentType].type;
    const displayValue = descriptor.contentType === AttributeContentType.Datetime ? getFormattedDateTime(field.value) : field.value;
    const error = getValueFieldError(fieldState);
    const invalid = fieldState.isTouched && !!fieldState.invalid;
    const inputClassName = cn(
        'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
        { 'border-red-500 focus:border-red-500 focus:ring-red-500': invalid },
    );

    if (descriptor.properties.list) {
        const isExtensible = true || descriptor.properties.extensibleList === true;

        const handleListChange = (v: any) => {
            if (descriptor.properties.multiSelect) {
                const arr = Array.isArray(v) ? v : [];
                const parsed = arr
                    .map((item) => parseListValueByContentType(descriptor.contentType, item?.value ?? item))
                    .filter((x) => x !== undefined);
                field.onChange(parsed.length > 0 ? parsed : undefined);
            } else {
                const parsed = parseListValueByContentType(descriptor.contentType, v);
                field.onChange(parsed !== undefined ? parsed : '');
            }
        };

        const listValue =
            descriptor.properties.multiSelect && Array.isArray(field.value)
                ? field.value.map((v: string | number | boolean) => ({ value: v, label: String(v) }))
                : field.value;

        const base = options;
        const currentValues = descriptor.properties.multiSelect
            ? Array.isArray(field.value)
                ? field.value
                : []
            : field.value != null && field.value !== ''
              ? [field.value]
              : [];
        const seen = new Set(base.map((o: { value: string }) => String(o.value)));
        const extra = currentValues
            .filter((v: string | number | boolean) => !seen.has(String(v)))
            .map((v: string | number | boolean) => ({ label: String(v), value: v }));
        const extendedOptions = [...base, ...extra];

        return (
            <div className="flex flex-col gap-2 w-full">
                <Container className="flex-row" gap={2}>
                    <div className="grow">
                        <Select
                            {...field}
                            value={listValue}
                            onChange={handleListChange}
                            id={descriptor.name}
                            options={extendedOptions as { label: string; value: string | number | object }[]}
                            isMulti={descriptor.properties.multiSelect}
                            disabled={descriptor.properties.readOnly || showAddCustom}
                            isClearable={!descriptor.properties.required}
                            dropdownScope="window"
                        />
                    </div>
                    {isExtensible && !descriptor.properties.readOnly && (
                        <>
                            <Button
                                type="button"
                                variant="transparent"
                                className="text-blue-600"
                                onClick={() => setShowAddCustom(true)}
                                data-testid={`${descriptor.name}-add-custom`}
                                disabled={showAddCustom}
                            >
                                <Plus size={14} className="mr-1" />
                                Add custom
                            </Button>
                        </>
                    )}
                </Container>
                <AddCustomValuePanel
                    open={showAddCustom}
                    onClose={() => setShowAddCustom(false)}
                    idPrefix={descriptor.name}
                    contentType={descriptor.contentType}
                    multiSelect={descriptor.properties.multiSelect}
                    readOnly={descriptor.properties.readOnly}
                    fieldValue={field.value}
                    onFieldChange={field.onChange}
                    inputClassName={inputClassName}
                />
            </div>
        );
    }
    if (inputType === 'datetime-local') {
        let dateValue: string | undefined;
        if (field.value) {
            dateValue = field.value.includes('T') ? field.value : field.value.replace(' ', 'T');
        } else {
            dateValue = undefined;
        }
        return (
            <DatePicker
                id={descriptor.name}
                value={dateValue}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
                disabled={descriptor.properties.readOnly}
                invalid={invalid}
                error={error}
                required={descriptor.properties.required}
                timePicker
            />
        );
    }
    if (inputType === 'number') {
        return (
            <input
                {...field}
                disabled={descriptor.properties.readOnly}
                type={inputType}
                id={descriptor.name}
                step={fieldStepValue}
                value={displayValue || ''}
                className={inputClassName}
            />
        );
    }
    if (inputType === 'checkbox') {
        return (
            <Switch
                id={id || descriptor.name || 'checkbox'}
                checked={field.value}
                onChange={(checked) => field.onChange(checked)}
                disabled={descriptor.properties.readOnly}
            />
        );
    }
    return (
        <TextInput
            id={descriptor.name}
            type={inputType as 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date' | 'time'}
            disabled={descriptor.properties.readOnly}
            value={displayValue || ''}
            onChange={(value) => field.onChange(value)}
            invalid={invalid}
            error={fieldState.isTouched && fieldState.invalid ? fieldState.error?.message : undefined}
        />
    );
}

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
        (attributeUuid: string, content: BaseAttributeContentModel[] | undefined) => {
            if (!content || content.length === 0) {
                return;
            }

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
            const booleanValue = input.checked !== undefined ? input.checked : (input.value ?? false);
            return [{ data: booleanValue }];
        }
        if (!input.value && input.value !== 0 && input.value !== false) {
            return undefined;
        }
        if (descriptor.properties.list) {
            const dataFrom = (v: any) => (v != null && typeof v === 'object' && 'value' in v ? v.value : v);
            if (descriptor.properties.multiSelect) {
                return (input.value || []).map((v: any) => transformObjectContent(descriptor.contentType, { data: dataFrom(v) }));
            } else {
                if (Array.isArray(input.value)) {
                    return input.value.map((v: any) => transformObjectContent(descriptor.contentType, { data: dataFrom(v) }));
                } else {
                    return [transformObjectContent(descriptor.contentType, { data: dataFrom(input.value) })];
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
                const inputComponent = (
                    <ValueFieldInput
                        descriptor={descriptor}
                        id={id}
                        field={field}
                        fieldState={fieldState}
                        fieldStepValue={fieldStepValue}
                        options={options ?? []}
                    />
                );
                const feedbackComponent = fieldState.error?.message ? (
                    <div className="text-red-500 mt-2">{fieldState.error?.message}</div>
                ) : null;

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
