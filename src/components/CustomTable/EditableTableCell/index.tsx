import { useCallback, useState, useRef } from 'react';
import Spinner from 'components/Spinner';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Button from 'components/Button';
import { Check, X, Pencil } from 'lucide-react';
import cn from 'classnames';

export interface EditableTableCellProps<TValue> {
    value: TValue;
    onSave: (value: TValue) => void;
    busy?: boolean;
    onCancel?: () => void;
    renderField?: (props: {
        field: { value: TValue; onChange: (value: TValue) => void; onBlur: () => void };
        fieldState: { error?: { message?: string } | string; isTouched: boolean };
    }) => React.ReactNode;
    renderValue?: (value: TValue) => React.ReactNode;
    formProps?: {
        validate?: (value: TValue) => string | undefined;
    };
}

interface FormValues<TValue> {
    field: TValue;
}

const EditableTableCellInner = <TValue,>({
    value,
    onSave,
    busy,
    onCancel,
    renderField,
    setIsEditing,
    blurListenerWrapperRef,
    handleCancel,
    handleBlur,
    formProps,
}: EditableTableCellProps<TValue> & {
    setIsEditing: (value: boolean) => void;
    blurListenerWrapperRef: React.RefObject<HTMLDivElement | null>;
    handleCancel: () => void;
    handleBlur: React.FocusEventHandler<HTMLDivElement>;
}) => {
    const methods = useForm<FormValues<TValue>>({
        defaultValues: { field: value },
        mode: 'onTouched',
    });

    const { handleSubmit, control } = methods;

    const onSubmit = (formValues: FormValues<TValue>) => {
        setIsEditing(false);
        onSave(formValues.field);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name={'field' as any}
                    control={control}
                    rules={{
                        validate: formProps?.validate,
                    }}
                    render={({ field, fieldState }) => {
                        const fieldProps = {
                            field: {
                                value: field.value,
                                onChange: field.onChange,
                                onBlur: field.onBlur,
                            },
                            fieldState: {
                                error: fieldState.error,
                                isTouched: fieldState.isTouched,
                            },
                        };

                        if (renderField) {
                            return <>{renderField(fieldProps)}</>;
                        }

                        return (
                            <input
                                {...field}
                                value={(field.value as string) || ''}
                                id="field"
                                type="text"
                                autoFocus
                                className={cn(
                                    'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                                    {
                                        'border-red-500 focus:border-red-500 focus:ring-red-500': fieldState.isTouched && fieldState.error,
                                    },
                                )}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmit(onSubmit)();
                                    }
                                }}
                            />
                        );
                    }}
                />
                <div>
                    <Button variant="transparent" onClick={handleSubmit(onSubmit)} disabled={busy} type="button">
                        <Check size={16} />
                    </Button>
                    <Button variant="transparent" onClick={handleCancel} disabled={busy} type="button">
                        <X size={16} />
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

const EditableTableCell = <TValue,>({
    value,
    onSave,
    busy,
    onCancel,
    renderField,
    renderValue,
    formProps,
}: EditableTableCellProps<TValue>) => {
    const [isEditing, setIsEditing] = useState(false);
    const blurListenerWrapperRef = useRef<HTMLDivElement>(null);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        onCancel?.();
    }, [onCancel]);

    const handleBlur: React.FocusEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            if (blurListenerWrapperRef.current && !blurListenerWrapperRef.current.contains(event.relatedTarget as Node)) {
                handleCancel();
            }
        },
        [handleCancel],
    );

    return isEditing ? (
        <div
            data-editable-cell-opened={isEditing}
            ref={blurListenerWrapperRef}
            onBlur={handleBlur}
            // Make div focusable to prevent blurring on accidental click on the empty spaces inside the div.
            tabIndex={-1}
            // Add onKeyDown handler to satisfy typescript:S1082 SQ Quality Check.
            onKeyDown={() => {}}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <EditableTableCellInner
                value={value}
                onSave={onSave}
                busy={busy}
                onCancel={onCancel}
                renderField={renderField}
                renderValue={renderValue}
                formProps={formProps}
                setIsEditing={setIsEditing}
                blurListenerWrapperRef={blurListenerWrapperRef}
                handleCancel={handleCancel}
                handleBlur={handleBlur}
            />
        </div>
    ) : (
        <div>
            {typeof renderValue === 'function' ? renderValue(value) : (value as React.ReactNode)}
            <Spinner active={busy} />
            <Button
                title="Edit"
                variant="transparent"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                disabled={busy}
            >
                <Pencil size={16} />
            </Button>
        </div>
    );
};

export default EditableTableCell;
