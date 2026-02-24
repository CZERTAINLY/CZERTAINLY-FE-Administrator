import type { CustomAttributeModel, DataAttributeModel } from 'types/attributes';
import { AttributeConstraintType, AttributeContentType, RangeAttributeConstraintData } from 'types/openapi';
import { isCustomAttributeModel, isDataAttributeModel } from 'types/attributes';
import type { RegexpAttributeConstraintModel } from 'types/attributes';
import { getFormattedDateTime } from 'utils/dateUtil';
import { composeValidators, validateFloat, validateInteger, validatePattern, validateRequired } from 'utils/validators';

export function transformInputValueForDescriptor(value: any, descriptor: DataAttributeModel | CustomAttributeModel): any {
    if (descriptor.contentType === AttributeContentType.Datetime) {
        return getFormattedDateTime(value);
    }
    if (descriptor.contentType === AttributeContentType.Boolean && descriptor.properties.required) {
        return value ?? false;
    }
    return value;
}

export function getSelectValueFromField(fieldValue: unknown, multiSelect: boolean): { value: string; label: string }[] | string | number {
    if (multiSelect) {
        if (!fieldValue) return [];
        if (!Array.isArray(fieldValue)) return [];
        return fieldValue.map((v: any) => {
            if (typeof v === 'object' && v.value !== undefined) {
                return { value: v.value, label: v.label || String(v.value) };
            }
            return typeof v === 'object'
                ? { value: v, label: String((v as any).reference ?? (v as any).data ?? JSON.stringify(v)) }
                : { value: v, label: String(v) };
        });
    }
    if (!fieldValue) return '';
    if (typeof fieldValue === 'object' && (fieldValue as any).value !== undefined) {
        return (fieldValue as any).value;
    }
    return fieldValue as string | number;
}

export function getFormTypeFromAttributeContentType(
    type: AttributeContentType,
): 'text' | 'number' | 'date' | 'time' | 'datetime-local' | 'password' | 'checkbox' | 'textarea' {
    switch (type) {
        case AttributeContentType.Boolean:
            return 'checkbox';
        case AttributeContentType.Integer:
        case AttributeContentType.Float:
            return 'number';
        case AttributeContentType.String:
        case AttributeContentType.Credential:
        case AttributeContentType.Object:
            return 'text';
        case AttributeContentType.Text:
        case AttributeContentType.Codeblock:
            return 'textarea';
        case AttributeContentType.Date:
            return 'date';
        case AttributeContentType.Time:
            return 'time';
        case AttributeContentType.Datetime:
            return 'datetime-local';
        case AttributeContentType.Secret:
            return 'password';
        default:
            return 'text';
    }
}

function addDataAttributeConstraintValidators(descriptor: DataAttributeModel, validators: any[]): void {
    const regexValidator = descriptor.constraints?.find((c) => c.type === AttributeConstraintType.RegExp);
    if (regexValidator) {
        const pattern = new RegExp((regexValidator as RegexpAttributeConstraintModel).data ?? '');
        validators.push(validatePattern(pattern, regexValidator.errorMessage));
    }
    const rangeValidator = descriptor.constraints?.find((c) => c.type === AttributeConstraintType.Range);
    if (!rangeValidator?.data) return;
    const rangeData = rangeValidator.data as RangeAttributeConstraintData;
    const { from, to } = rangeData;
    if (from && to) {
        const pattern = new RegExp(`^(?:${from === 1 ? '[1-9]\\d{0,' + (to.toString().length - 1) + '}' : from}|${to})$`);
        validators.push(validatePattern(pattern, rangeValidator.errorMessage));
    }
}

export function buildAttributeValidators(descriptor: DataAttributeModel | CustomAttributeModel | undefined): any {
    const validators: any[] = [];
    if (!descriptor) return composeValidators.apply(undefined, validators);

    if (!isDataAttributeModel(descriptor) && !isCustomAttributeModel(descriptor)) {
        return composeValidators.apply(undefined, validators);
    }
    if (descriptor.properties.required) validators.push(validateRequired());
    if (descriptor.contentType === AttributeContentType.Integer) validators.push(validateInteger());
    if (descriptor.contentType === AttributeContentType.Float) validators.push(validateFloat());
    if (isDataAttributeModel(descriptor)) {
        addDataAttributeConstraintValidators(descriptor, validators);
    }
    return composeValidators.apply(undefined, validators);
}

export function getUpdatedOptionsForEditSelect(
    valuesRecieved: { label: string; value: any }[],
    options?: { label: string; value: any }[],
): { label: string; value: any }[] | undefined {
    if (valuesRecieved?.length > 0) {
        const updatedOptions = options?.filter((option) => {
            return !valuesRecieved.some((value) => JSON.stringify(value.value) == JSON.stringify(option.value));
        });
        return updatedOptions;
    }
    return options;
}
