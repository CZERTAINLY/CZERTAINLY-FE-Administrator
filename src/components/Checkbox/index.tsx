import cn from 'classnames';

interface Props {
    checked: boolean;
    onChange: (checked: boolean) => void;
    placeholder?: string;
    id?: string;
    label?: string;
    disabled?: boolean;
}

function Checkbox({ checked, onChange, id, label, disabled = false }: Props) {
    return (
        <div className="flex items-center h-5">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                data-testid="table-checkbox"
                className="border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                disabled={disabled}
            />
            <label htmlFor={id} className={cn('ml-2', { 'sr-only': !label })}>
                {label || 'Checkbox'}
            </label>
        </div>
    );
}

export default Checkbox;
