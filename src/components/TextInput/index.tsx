import cn from 'classnames';
import { useRef, useEffect } from 'react';
import Label from 'components/Label';
import DatePicker from 'components/DatePicker';
import TextArea from 'components/TextArea';
import { inputBaseClassName } from './inputStyles';

export { inputBaseClassName } from './inputStyles';

interface Props {
    value?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    type?: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date' | 'time';
    invalid?: boolean;
    error?: string;
    label?: string;
    className?: string;
    required?: boolean;
    buttonRight?: React.ReactNode;
    dataTestId?: string;
}

function TextInput({
    value,
    onChange,
    onBlur,
    placeholder,
    disabled,
    id,
    type = 'text',
    invalid = false,
    error,
    label,
    className,
    required = false,
    buttonRight,
    dataTestId,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Disable autofill by making field readOnly on mount, then removing it on focus
    useEffect(() => {
        if (inputRef.current && type !== 'password' && type !== 'date') {
            inputRef.current.setAttribute('readonly', 'readonly');
            const handleFocus = () => {
                if (inputRef.current) {
                    inputRef.current.removeAttribute('readonly');
                }
            };
            const input = inputRef.current;
            input.addEventListener('focus', handleFocus);
            return () => {
                input.removeEventListener('focus', handleFocus);
            };
        }
    }, [type]);

    const getAutoComplete = () => {
        if (type === 'password') {
            return 'new-password';
        }
        return 'off';
    };

    if (type === 'date') {
        return (
            <>
                {label && (
                    <Label htmlFor={id} required={required}>
                        {label}
                    </Label>
                )}
                <DatePicker
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    id={id}
                    invalid={invalid}
                    error={error}
                    className={className}
                    required={required}
                />
            </>
        );
    }

    if (type === 'textarea') {
        return (
            <>
                {label && (
                    <Label htmlFor={id} required={required}>
                        {label}
                    </Label>
                )}
                <TextArea
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    id={id}
                    invalid={invalid}
                    error={error}
                    className={className}
                    required={required}
                />
            </>
        );
    }

    return (
        <>
            {label && (
                <Label htmlFor={id} required={required}>
                    {label}
                </Label>
            )}
            <div className="relative w-full">
                <input
                    ref={inputRef}
                    type={type}
                    className={cn(
                        inputBaseClassName,
                        {
                            'border-red-500 focus:border-red-500 focus:ring-red-500': invalid,
                        },
                        {
                            'bg-[#F8FAFC]': disabled,
                            'pr-10': !!buttonRight,
                        },
                        className,
                    )}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    disabled={disabled}
                    id={id}
                    autoComplete={getAutoComplete()}
                    data-form-type="other"
                    data-testid={dataTestId ?? (id ? `text-input-${id}` : 'text-input')}
                />
                {buttonRight && (
                    <div className="absolute right-0 top-[50%] translate-y-[-50%] h-full flex items-center justify-center w-[40px] border-l border-gray-200">
                        {buttonRight}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </>
    );
}

export default TextInput;
