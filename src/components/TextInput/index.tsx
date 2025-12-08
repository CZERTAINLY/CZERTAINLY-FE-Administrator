import cn from 'classnames';
import Label from 'components/Label';
import DatePicker from 'components/DatePicker';
import TextArea from 'components/TextArea';

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
}: Props) {
    console.log('type', type);
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
            <input
                type={type}
                className={cn(
                    'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                    {
                        'border-red-500 focus:border-red-500 focus:ring-red-500': invalid,
                    },
                    {
                        'bg-[#F8FAFC]': disabled,
                    },
                    className,
                )}
                placeholder={placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                disabled={disabled}
                id={id}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </>
    );
}

export default TextInput;
