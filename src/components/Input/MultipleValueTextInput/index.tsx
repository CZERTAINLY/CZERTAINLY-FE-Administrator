import { useCallback, useRef, useState } from 'react';
import styles from './MultipleValueTextInput.module.scss';

type Props = {
    id?: string;
    value?: string[];
    onChange?: (values: string[]) => void;
    onBlur?: () => void;
    placeholder?: string;
    isValid?: boolean;
    isInvalid?: boolean;
};
import cx from 'classnames';

export default function MultipleValueTextInput({
    id,
    value = [],
    onChange,
    placeholder = 'Add value and separate with comma or press enter...',
    isValid,
    isInvalid,
    onBlur,
}: Readonly<Props>) {
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            const trimmedInput = inputValue.trim();
            const isEnter = event.key === 'Enter';
            const isComma = event.key === ',';

            if ((isEnter || isComma) && trimmedInput.length > 0) {
                event.preventDefault();
                if (!value.includes(trimmedInput)) {
                    const newValues = [...value, trimmedInput];
                    if (onChange) {
                        onChange(newValues);
                    }
                }
                setInputValue('');
            }

            if (event.key === 'Backspace' && trimmedInput.length === 0) {
                event.preventDefault();
                const newValues = value.slice(0, -1);
                if (onChange) {
                    onChange(newValues);
                }
            }
        },
        [inputValue, value, onChange],
    );

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;
            if (val.endsWith(',')) {
                const trimmedVal = val.slice(0, -1).trim();
                if (trimmedVal.length > 0 && !value.includes(trimmedVal)) {
                    const newValues = [...value, trimmedVal];
                    if (onChange) {
                        onChange(newValues);
                    }
                }
                setInputValue('');
            } else {
                setInputValue(val);
            }
        },
        [value, onChange],
    );

    const handleRemoveTag = useCallback(
        (valueToRemove: string) => {
            const newValues = value.filter((val) => val !== valueToRemove);
            if (onChange) {
                onChange(newValues);
            }
            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        [value, onChange],
    );

    const containerClass = cx(
        styles.container,
        { 'is-valid': isValid },
        { 'is-invalid': isInvalid },
        { [styles['is-valid']]: isValid },
        { [styles['is-invalid']]: isInvalid },
    );

    return (
        <div className={containerClass}>
            {value.map((val) => (
                <span key={val} className={styles.tag}>
                    {val}
                    <button type="button" onClick={() => handleRemoveTag(val)} className={styles.removeButton}>
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
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ''}
                className={styles.input}
            />
        </div>
    );
}
