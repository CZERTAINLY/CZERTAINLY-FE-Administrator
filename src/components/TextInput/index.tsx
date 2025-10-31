import cn from 'classnames';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time';
    invalid?: boolean;
}

function TextInput({ value, onChange, placeholder, disabled, id, type = 'text', invalid = false }: Props) {
    return (
        <div className="max-w-sm space-y-3">
            <input
                type={type}
                className={cn(
                    'py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                    {
                        'border-red-500': invalid,
                    },
                )}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                id={id}
            />
        </div>
    );
}

export default TextInput;
