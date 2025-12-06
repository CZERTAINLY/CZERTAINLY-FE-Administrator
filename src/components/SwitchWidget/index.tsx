import Label from 'components/Label';

interface Props {
    label?: string;
    disabled?: boolean;
    onClick?: () => void;
    checked?: boolean;
    id?: string;
}

const SwitchWidget = ({ label, disabled, onClick, checked = false, id }: Props) => {
    return (
        <div className="flex items-center gap-2">
            {label && <Label>{label}</Label>}
            <input
                type="checkbox"
                className="my-2 relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                checked={checked}
                disabled={disabled}
                onChange={onClick}
                id={id}
            />
        </div>
    );
};

export default SwitchWidget;
