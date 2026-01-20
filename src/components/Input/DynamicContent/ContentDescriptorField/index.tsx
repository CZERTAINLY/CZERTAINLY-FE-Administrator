import WidgetButtons from 'components/WidgetButtons';
import { useEffect, useMemo } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import Button from 'components/Button';
import Label from 'components/Label';
import TextInput from 'components/TextInput';
import DatePicker from 'components/DatePicker';
import { AttributeContentType } from 'types/openapi';
import { getStepValue } from 'utils/common-utils';
import { composeValidators, validateRequired } from 'utils/validators';
import { ContentFieldConfiguration } from '../index';
import { Plus } from 'lucide-react';
import cn from 'classnames';

type Props = {
    isList: boolean;
    contentType: AttributeContentType;
};

export default function ContentDescriptorField({ isList, contentType }: Props) {
    const { control, setValue, watch } = useFormContext();
    const contentValues = watch('content');
    const readOnly = watch('readOnly');

    useEffect(() => {
        if (!isList && contentValues?.length > 1) {
            setValue('content', contentValues.slice(0, 1));
        }
    }, [isList, contentValues, setValue]);

    const fieldStepValue = useMemo(() => {
        const stepValue = getStepValue(ContentFieldConfiguration[contentType].type);
        return stepValue;
    }, [contentType]);

    useEffect(() => {
        if (readOnly) {
            const updatedContent =
                Array.isArray(contentValues) && contentValues?.length
                    ? contentValues?.map((content: any) => ({ data: content.data || ContentFieldConfiguration[contentType].initial }))
                    : [{ data: ContentFieldConfiguration[contentType].initial }];
            setValue('content', updatedContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readOnly, contentType, setValue]);

    // Helper function to convert validators for react-hook-form
    const buildValidationRules = (validators: Array<(value: any) => string | undefined>) => {
        return {
            validate: (value: any) => {
                const composed = composeValidators(...validators);
                return composed(value);
            },
        };
    };

    return (
        <>
            {contentValues?.map((_contentValue: any, index: number) => {
                const name = `content.${index}.data` as const;

                return (
                    ContentFieldConfiguration[contentType].type && (
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            rules={
                                ContentFieldConfiguration[contentType].validators
                                    ? buildValidationRules([
                                          ...(ContentFieldConfiguration[contentType].validators ?? []),
                                          validateRequired(),
                                      ])
                                    : buildValidationRules([validateRequired()])
                            }
                            render={({ field, fieldState }) => {
                                const inputType = ContentFieldConfiguration[contentType].type;
                                const isCheckbox = inputType === 'checkbox';
                                const isDateTime = inputType === 'datetime-local';
                                const needsStep = inputType === 'number';

                                const inputComponent = isCheckbox ? (
                                    <input
                                        {...field}
                                        type="checkbox"
                                        id={name}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                ) : isDateTime ? (
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
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                        required
                                        timePicker
                                    />
                                ) : needsStep ? (
                                    <input
                                        {...field}
                                        type={inputType}
                                        id={name}
                                        step={fieldStepValue}
                                        placeholder="Default Content"
                                        value={field.value || ''}
                                        className={cn(
                                            'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                                            {
                                                'border-red-500 focus:border-red-500 focus:ring-red-500':
                                                    fieldState.error && fieldState.isTouched,
                                            },
                                        )}
                                    />
                                ) : (
                                    <TextInput
                                        {...field}
                                        id={name}
                                        type={inputType as 'text' | 'textarea' | 'date' | 'time'}
                                        placeholder="Default Content"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                    />
                                );
                                const labelComponent = (
                                    <Label htmlFor={name} className="!mb-0">
                                        Default Content
                                    </Label>
                                );
                                const buttonComponent = (
                                    <WidgetButtons
                                        justify="start"
                                        buttons={[
                                            {
                                                icon: 'trash',
                                                disabled: readOnly && contentValues?.length === 1,
                                                tooltip: 'Remove',
                                                onClick: () => {
                                                    setValue(
                                                        'content',
                                                        contentValues.filter(
                                                            (_contentValue: any, filterIndex: number) => index !== filterIndex,
                                                        ),
                                                    );
                                                },
                                            },
                                        ]}
                                    />
                                );
                                const feedbackComponent =
                                    fieldState.error && fieldState.isTouched ? (
                                        <p className="mt-1 text-sm text-red-600">
                                            {typeof fieldState.error === 'string'
                                                ? fieldState.error
                                                : fieldState.error?.message || 'Invalid value'}
                                        </p>
                                    ) : null;

                                return (
                                    <div className="mb-4">
                                        {contentType !== AttributeContentType.Boolean ? (
                                            <>
                                                {labelComponent}
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1">{inputComponent}</div>
                                                    {buttonComponent}
                                                </div>
                                                {feedbackComponent}
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {inputComponent}
                                                {labelComponent}
                                                {buttonComponent}
                                                {feedbackComponent}
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    )
                );
            })}
            {(isList || !contentValues || contentValues.length === 0) && (
                <Button
                    variant="outline"
                    color="secondary"
                    onClick={() =>
                        setValue('content', [
                            ...(isList ? (contentValues ?? []) : []),
                            { data: ContentFieldConfiguration[contentType].initial },
                        ])
                    }
                >
                    <Plus className="w-4 h-4" />
                    &nbsp;Add Content
                </Button>
            )}
        </>
    );
}
