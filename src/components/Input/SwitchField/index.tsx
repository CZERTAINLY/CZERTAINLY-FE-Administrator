import { Controller, useFormContext } from 'react-hook-form';
import Label from 'components/Label';

type viewOnly = {
    checked: boolean;
};

type Props = {
    id: string;
    label: string;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
    viewOnly?: viewOnly;
};

export default function SwitchField({ id, label, onChange = undefined, disabled = false, viewOnly }: Props) {
    const { control } = useFormContext();

    if (viewOnly) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={id}
                    disabled
                    checked={viewOnly.checked}
                    className="relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600"
                />
                <Label htmlFor={id}>{label}</Label>
            </div>
        );
    }

    return (
        <Controller
            name={id}
            control={control}
            render={({ field }) => (
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={id}
                        disabled={disabled}
                        checked={field.value || false}
                        onChange={(e) => {
                            field.onChange(e.target.checked);
                            if (onChange) {
                                onChange(e.target.checked);
                            }
                        }}
                        className="relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                    />
                    <Label htmlFor={id} className="mb-0">
                        {label}
                    </Label>
                </div>
            )}
        />
    );
}
