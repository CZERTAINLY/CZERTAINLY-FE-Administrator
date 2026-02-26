import React, { useState } from 'react';
import Button from 'components/Button';
import { AttributeContentType } from 'types/openapi';
import { getStepValue } from 'utils/common-utils';
import { ContentFieldConfiguration } from './contentFieldConfiguration';
import { AddCustomValueInput } from './AddCustomValueInput';

type Props = {
    open: boolean;
    onClose: () => void;
    idPrefix: string;
    contentType: AttributeContentType;
    multiSelect?: boolean;
    readOnly: boolean;
    fieldValue: any;
    onFieldChange: (value: any) => void;
    parseValue?: (raw: string | number | boolean) => any;
    inputClassName?: string;
};

export function AddCustomValuePanel({
    open,
    onClose,
    idPrefix,
    contentType,
    multiSelect = false,
    readOnly,
    fieldValue,
    onFieldChange,
    parseValue = (x) => x,
    inputClassName,
}: Props): React.ReactNode {
    const [customValue, setCustomValue] = useState<string | number | boolean>('');

    if (!open) return null;

    const config = ContentFieldConfiguration[contentType];
    const inputType = config?.type ?? 'text';
    const fieldStepValue = getStepValue(inputType);

    const handleAdd = () => {
        const val = customValue;
        const isValid =
            contentType === AttributeContentType.Boolean ||
            (typeof val === 'number' && !Number.isNaN(val)) ||
            (val !== '' && val !== undefined && val !== null);
        if (!isValid) return;
        const parsed = parseValue(val);
        if (multiSelect) {
            const current = Array.isArray(fieldValue) ? fieldValue : fieldValue != null ? [fieldValue] : [];
            onFieldChange([...current, parsed]);
        } else {
            onFieldChange(parsed);
        }
        setCustomValue(contentType === AttributeContentType.Boolean ? false : '');
        onClose();
    };

    const handleCancel = () => {
        setCustomValue(contentType === AttributeContentType.Boolean ? false : '');
        onClose();
    };

    const canAdd =
        contentType === AttributeContentType.Boolean ||
        (typeof customValue === 'number' && !Number.isNaN(customValue)) ||
        (customValue !== '' && customValue !== undefined && String(customValue).trim() !== '');

    return (
        <div
            data-testid={`${idPrefix}-add-custom-panel`}
            className="flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-lg mt-2 dark:border-neutral-700"
        >
            <div className="min-w-[120px] flex-1">
                <AddCustomValueInput
                    id={`${idPrefix}-custom`}
                    inputType={inputType}
                    contentType={contentType}
                    fieldStepValue={fieldStepValue}
                    value={customValue}
                    onChange={setCustomValue}
                    readOnly={readOnly}
                    inputClassName={inputClassName}
                />
            </div>
            <div className="flex gap-1">
                <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type="button" onClick={handleAdd} disabled={!canAdd} data-testid={`${idPrefix}-add-custom-value`}>
                    Add
                </Button>
            </div>
        </div>
    );
}
