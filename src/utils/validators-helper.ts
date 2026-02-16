import { composeValidators } from './validators';

export interface FieldErrorState {
    error?: unknown;
    isTouched?: boolean;
}

export function getFieldErrorMessage(fieldState: FieldErrorState, fallback = 'Invalid value'): string | undefined {
    if (!fieldState.error || !fieldState.isTouched) return undefined;
    if (typeof fieldState.error === 'string') return fieldState.error;
    return (fieldState.error as { message?: string })?.message ?? fallback;
}

export const buildValidationRules = (validators: Array<(value: any) => string | undefined>) => {
    return {
        validate: (value: any) => {
            const composed = composeValidators(...validators);
            return composed(value);
        },
    };
};
