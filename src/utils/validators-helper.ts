import { composeValidators } from './validators';

export const buildValidationRules = (validators: Array<(value: any) => string | undefined>) => {
    return {
        validate: (value: any) => {
            const composed = composeValidators(...validators);
            return composed(value);
        },
    };
};
