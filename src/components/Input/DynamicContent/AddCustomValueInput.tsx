import React from 'react';
import TextInput from 'components/TextInput';
import DatePicker from 'components/DatePicker';
import Switch from 'components/Switch';
import { AttributeContentType } from 'types/openapi';

const defaultInputClassName =
    'py-2.5 px-4 block w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700';

type Props = {
    id: string;
    inputType: string;
    contentType: AttributeContentType;
    fieldStepValue: number | undefined;
    value: string | number | boolean;
    onChange: (v: string | number | boolean) => void;
    readOnly: boolean;
    inputClassName?: string;
};

export function AddCustomValueInput({
    id,
    inputType,
    contentType,
    fieldStepValue,
    value,
    onChange,
    readOnly,
    inputClassName = defaultInputClassName,
}: Props): React.ReactNode {
    if (inputType === 'datetime-local') {
        let dateVal = typeof value === 'string' && value ? value : undefined;
        if (dateVal && !dateVal.includes('T')) dateVal = dateVal.replace(' ', 'T');
        return <DatePicker id={id} value={dateVal} onChange={(v) => onChange(v ?? '')} disabled={readOnly} timePicker />;
    }
    if (inputType === 'number') {
        const isInt = contentType === AttributeContentType.Integer;
        return (
            <input
                type="number"
                step={fieldStepValue}
                className={inputClassName}
                value={value === '' ? '' : Number(value)}
                onChange={(e) =>
                    onChange(e.target.value === '' ? '' : isInt ? parseInt(e.target.value, 10) || 0 : parseFloat(e.target.value) || 0)
                }
                disabled={readOnly}
            />
        );
    }
    if (inputType === 'checkbox') {
        return <Switch id={id} checked={Boolean(value)} onChange={onChange} disabled={readOnly} />;
    }
    return (
        <TextInput
            id={id}
            type={inputType as 'text' | 'date' | 'time'}
            value={String(value ?? '')}
            onChange={(v) => onChange(v)}
            disabled={readOnly}
        />
    );
}
