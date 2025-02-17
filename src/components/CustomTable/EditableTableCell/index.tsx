import { Button, Input, InputProps } from 'reactstrap';
import styles from './EditableTableCell.module.scss';
import { useCallback, useState, useRef } from 'react';
import Spinner from 'components/Spinner';
import { Field, Form } from 'react-final-form';

export interface EditableTableCellProps {
    value: string;
    onSave: (value: string) => void;
    busy?: boolean;
    onCancel?: () => void;
    formProps?: {
        validate?: (value: string) => any;
    };
}

interface FormValues {
    field: string;
}

const EditableTableCell = ({ value, onSave, busy, onCancel, formProps }: EditableTableCellProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const blurListenerWrapperRef = useRef<HTMLDivElement>(null);

    const handleSave = useCallback(
        (formValues: FormValues) => {
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

    const initialValues: FormValues = { field: value };

    return isEditing ? (
        <div
            ref={blurListenerWrapperRef}
            onBlur={handleBlur}
            // Make div focusable to prevent blurring on accidental click on the empty spaces inside the div.
            tabIndex={-1}
        >
            <div
                className={styles.cell}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <Form onSubmit={handleSave} initialValues={initialValues}>
                    {({ handleSubmit }) => (
                        <>
                            <Field name="field" validate={formProps?.validate}>
                                {({ input, meta }) => (
                                    <Input
                                        {...input}
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
                                )}
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
        </div>
    ) : (
        <div className={styles.cell}>
            {value}
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
