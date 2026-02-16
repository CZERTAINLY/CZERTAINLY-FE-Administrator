import Select from 'components/Select';
import Label from 'components/Label';
import { getEnumLabel } from 'ducks/enums';
import { useMemo } from 'react';
import { KeyUsage } from 'types/openapi';

type KeyUsageEnum = { [key: string]: { label: string } } | undefined;

export interface KeyUsageSelectProps {
    value: KeyUsage[];
    onChange: (values: KeyUsage[]) => void;
    keyUsageEnum: KeyUsageEnum;
    id?: string;
    label?: string;
}

export default function KeyUsageSelect({ value, onChange, keyUsageEnum, id = 'field', label = 'Key Usage' }: KeyUsageSelectProps) {
    const options = useMemo(() => {
        const list: { value: KeyUsage; label: string }[] = [];
        for (const suit in KeyUsage) {
            list.push({
                value: KeyUsage[suit as keyof typeof KeyUsage],
                label: getEnumLabel(keyUsageEnum, KeyUsage[suit as keyof typeof KeyUsage]),
            });
        }
        return list;
    }, [keyUsageEnum]);

    const selectValue = useMemo(
        () =>
            value.map(
                (usage) =>
                    options.find((opt) => opt.value === usage) || {
                        value: usage,
                        label: getEnumLabel(keyUsageEnum, usage),
                    },
            ),
        [value, options, keyUsageEnum],
    );

    return (
        <div>
            <div className="form-group">
                <Label htmlFor={id}>{label}</Label>
                <Select
                    isMulti={true}
                    id={id}
                    options={options}
                    value={selectValue}
                    onChange={(values) => onChange((values || []).map((item) => item.value as KeyUsage))}
                    isClearable={true}
                />
            </div>
        </div>
    );
}
