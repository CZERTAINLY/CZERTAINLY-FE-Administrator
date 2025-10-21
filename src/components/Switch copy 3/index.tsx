import cn from 'classnames';

interface Props {
    checked: boolean;
    onChange: (checked: boolean) => void;
    placeholder?: string;
    id: string;
    inputId?: string;
    label?: string;
    secondaryLabel?: string;
}

function Switch({ checked, onChange, id, inputId, label, secondaryLabel }: Props) {
    return (
        <div className="flex items-center gap-x-3">
            {label && (
                <label htmlFor={id} className="text-sm text-gray-800 dark:text-neutral-200">
                    {label}
                </label>
            )}
            <label htmlFor={id} className="relative inline-block w-11 h-6 cursor-pointer">
                <input type="checkbox" id={id} className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-blue-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
            </label>
            {secondaryLabel && (
                <label htmlFor={id} className="text-sm text-gray-800 dark:text-neutral-200">
                    {secondaryLabel}
                </label>
            )}
        </div>
    );
}

export default Switch;
