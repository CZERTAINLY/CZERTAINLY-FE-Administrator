import { Button, Input } from 'reactstrap';
import styles from './EditableTableCell.module.scss';
import { useCallback, useState, useRef } from 'react';
import Spinner from 'components/Spinner';
import { Field, FieldRenderProps, Form } from 'react-final-form';

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
                            <Button
                                className={`btn btn-link ${styles.editCellBtn}`}
                                color="link"
                                onClick={() => handleSubmit()}
                                disabled={busy}
                            >
                                <i className="fa fa-check" style={{ color: 'green' }} />
                            </Button>
                            <Button
                                className={`btn btn-link ${styles.editCellBtn}`}
                                color="link"
                                onClick={() => handleCancel()}
                                disabled={busy}
                            >
                                <i className="fa fa-times" style={{ color: 'red' }} />
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    ) : (
        <div className={styles.cell}>
            {typeof renderValue === 'function' ? renderValue(value) : typeof value === 'string' ? value : ''}
            <Spinner active={busy} />
            <Button
                title="Edit"
                className={`btn btn-link ${styles.editCellBtn}`}
                color="link"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                disabled={busy}
            >
                <i className="fa fa-pencil" />
            </Button>
        </div>
    );
};

export default EditableTableCell;
