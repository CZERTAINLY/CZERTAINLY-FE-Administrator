import { Input } from 'reactstrap';
import styles from './EditableTableCell.module.scss';
import { useCallback, useState, useRef } from 'react';
import Spinner from 'components/Spinner';
import { Field, FieldRenderProps, Form } from 'react-final-form';
import Button from 'components/Button';
import { Check, X, Pencil } from 'lucide-react';

export interface EditableTableCellProps<TValue> {
    value: TValue;
    onSave: (value: TValue) => void;
    busy?: boolean;
    onCancel?: () => void;
    renderField?: (props: FieldRenderProps<TValue, HTMLElement, TValue>) => React.ReactNode;
    renderValue?: (value: TValue) => React.ReactNode;
    formProps?: {
        validate?: (value: TValue) => any;
    };
}

interface FormValues<TValue> {
    field: TValue;
}

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

    const handleSave = useCallback(
        (formValues: FormValues<TValue>) => {
            setIsEditing(false);
            onSave(formValues.field);
        },
        [onSave],
    );

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

    const initialValues: FormValues<TValue> = { field: value };

    return isEditing ? (
        <div
            data-editable-cell-opened={isEditing}
            ref={blurListenerWrapperRef}
            onBlur={handleBlur}
            className={styles.cell}
            // Make div focusable to prevent blurring on accidental click on the empty spaces inside the div.
            tabIndex={-1}
            // Add onKeyDown handler to satisfy typescript:S1082 SQ Quality Check.
            onKeyDown={() => {}}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <Form onSubmit={handleSave} initialValues={initialValues}>
                {({ handleSubmit }) => (
                    <>
                        <Field name="field" validate={formProps?.validate}>
                            {renderField ??
                                (({ input, meta }) => (
                                    <Input
                                        {...input}
                                        value={input.value as string}
                                        id="field"
                                        type="text"
                                        autoFocus
                                        className={styles.editInput}
                                        invalid={meta.touched && meta.error}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSubmit();
                                            }
                                        }}
                                    />
                                ))}
                        </Field>
                        <div className={styles.btnGroup}>
                            <Button variant="transparent" onClick={() => handleSubmit()} disabled={busy}>
                                <Check size={16} />
                            </Button>
                            <Button variant="transparent" onClick={() => handleCancel()} disabled={busy}>
                                <X size={16} />
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    ) : (
        <div className={styles.cell}>
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
