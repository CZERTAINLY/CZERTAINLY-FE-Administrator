import { useState, useMemo, useEffect } from 'react';
import Select, {
    Props as SelectProps,
    OptionProps,
    InputActionMeta,
    SingleValue,
    MultiValue,
    components,
    ActionMeta,
    GroupBase,
} from 'react-select';
import Label from 'components/Label';
import { Plus } from 'lucide-react';

type OptionType = { label: string; value: string; isNew?: boolean };

type Props = SelectProps<OptionType, boolean> & {
    label: string;
    description?: string;
    error?: string;
} & (
        | {
              allowTextInput?: false;
              validators?: never;
          }
        | {
              allowTextInput: true;
              validators: ((value: string) => string | undefined | Promise<string | undefined>)[];
          }
    );

export default function CustomSelect({
    allowTextInput,
    isMulti,
    options = [],
    validators = [],
    description,
    required,
    error: propError,
    ...props
}: Props) {
    const [newOptions, setNewOptions] = useState<OptionType[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(propError ?? null);

    const allOptions = useMemo(() => {
        return [...newOptions, ...options];
    }, [options, newOptions]);

    const existingOption = useMemo(() => {
        return allOptions.find((opt) => opt?.label?.toLowerCase() === inputValue?.toLowerCase());
    }, [inputValue, allOptions]);

    const activeMenuOptions = useMemo(() => {
        if (!allowTextInput || !inputValue.trim() || existingOption) {
            return allOptions;
        }
        return [{ label: inputValue, value: inputValue, isNew: true }, ...allOptions];
    }, [allOptions, inputValue, allowTextInput, existingOption]);

    const handleInputChange = (newValue: string, actionMeta: InputActionMeta) => {
        if (actionMeta.action === 'input-change') {
            setInputValue(newValue);
            setError(null);
        }
    };

    const validateOption = async (value: string) => {
        for (const validator of validators) {
            const errorMessage = await validator(value);
            if (errorMessage) {
                setError(errorMessage);
                return false;
            }
        }
        return true;
    };

    const handleChange = async (newValue: SingleValue<OptionType> | MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
        const newSelection = newValue as OptionType | OptionType[];

        setNewOptions((prev) => prev.map((el) => ({ ...el, isNew: false })));

        if (Array.isArray(newSelection)) {
            for (const item of newSelection) {
                if (item.isNew) {
                    const isValid = await validateOption(item.value);
                    if (!isValid) return;

                    setNewOptions((prev) => {
                        if (prev.find((el) => el.value === item.value)) return prev;
                        return [item, ...prev];
                    });
                }
            }
        } else if (newSelection?.isNew) {
            const isValid = await validateOption(newSelection.value);
            if (!isValid) return;

            setNewOptions((prev) => [...prev, { ...newSelection, isNew: false }]);
        }

        setError(null);
        setInputValue('');
        props.onChange?.(newSelection, actionMeta);
    };

    useEffect(() => {
        setError(propError ?? null);
    }, [propError]);
    return (
        <div>
            <Label htmlFor={props.inputId ?? props.id} required={required}>
                {props.label}
            </Label>
            <Select
                {...props}
                isMulti={isMulti}
                options={activeMenuOptions}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onChange={handleChange}
                components={{ Option: CustomOption }}
                noOptionsMessage={allowTextInput ? () => 'Type in to create an option' : undefined}
            />
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

type CustomOptionProps = OptionProps<OptionType, boolean, GroupBase<OptionType>>;

function CustomOption(props: CustomOptionProps) {
    const { data } = props;
    return (
        <components.Option {...props}>
            {data.isNew && <Plus size={16} style={{ marginRight: '8px' }} />}
            {data.label}
        </components.Option>
    );
}
