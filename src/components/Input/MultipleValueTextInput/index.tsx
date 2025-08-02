import { useEffect, useRef, useState } from 'react';
import styles from './MultipleValueTextInput.module.scss';

type Props = {
    id?: string;
    initialValues?: string[];
    onChange?: (values: string[]) => void;
    placeholder?: string;
};

export default function MultipleValueTextInput({
    id,
    initialValues = [],
    onChange,
    placeholder = 'Add value and separate with comma or press enter...',
}: Props) {
    const [values, setValues] = useState<string[]>(initialValues);
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const trimmedInput = inputValue.trim();
        const isEnter = event.key === 'Enter';
        const isComma = event.key === ',';

        if ((isEnter || isComma) && trimmedInput.length > 0) {
            event.preventDefault();
            if (!values.includes(trimmedInput)) {
                const newValues = [...values, trimmedInput];
                setValues(newValues);
                if (onChange) {
                    onChange(newValues);
                }
            }
            setInputValue('');
        }

        if (event.key === 'Backspace' && trimmedInput.length === 0) {
            event.preventDefault();
            const newValues = values.slice(0, -1);
            setValues(newValues);
            if (onChange) {
                onChange(newValues);
            }
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if (val.endsWith(',')) {
            const trimmedVal = val.slice(0, -1).trim();
            if (trimmedVal.length > 0 && !values.includes(trimmedVal)) {
                const newValues = [...values, trimmedVal];
                setValues(newValues);
                if (onChange) {
                    onChange(newValues);
                }
            }
            setInputValue('');
        } else {
            setInputValue(val);
        }
    };

    const handleRemoveTag = (valueToRemove: string) => {
        const newValues = values.filter((value) => value !== valueToRemove);
        setValues(newValues);
        if (onChange) {
            onChange(newValues);
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div
            className={styles.container}
            onClick={() => inputRef.current?.focus()}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    inputRef.current?.focus();
                }
            }}
            tabIndex={0}
        >
            {values.map((value) => (
                <span key={value} className={styles.tag}>
                    {value}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(value);
                        }}
                        className={styles.removeButton}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className={styles.svgIcon}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </span>
            ))}

            <input
                ref={inputRef}
                id={id}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={values.length === 0 ? placeholder : ''}
                className={styles.input}
            />
        </div>
    );
}
