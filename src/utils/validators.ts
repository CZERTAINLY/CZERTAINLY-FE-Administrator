import cronValidator from 'cron-expression-validator';

export const composeValidators =
    (...validators: any[]) =>
    (value: any) =>
        validators.reduce((error, validator) => error || validator(value), undefined);

export const validateRequired = () => (value: any) => ((Array.isArray(value) ? value.length > 0 : value) ? undefined : 'Required Field');

const getValueFromObject = (value: any) => {
    if (typeof value === 'object' && value && value.hasOwnProperty('label') && value.hasOwnProperty('value')) {
        return value['value']['data'];
    } else {
        return value;
    }
};

export const validatePattern = (pattern: RegExp, message?: string) => (value: any) => {
    const validationInput = getValueFromObject(value);
    return (Array.isArray(value) && value.reduce((prev, curr) => prev && pattern.test(getValueFromObject(curr)), true)) ||
        !validationInput ||
        pattern.test(validationInput)
        ? undefined
        : message || `Value must conform to ${pattern}`;
};

export const validateInteger = () => validatePattern(/^[+-]?(\d*)$/, 'Value must be an integer');

export const validatePositiveInteger = () => validatePattern(/^\d+$/, 'Value must be a positive integer');

export const validateNonZeroInteger = () => validatePattern(/^[+-]?([1-9]\d*)$/, 'Value must be a non-zero integer');

export const validateFloat = () => validatePattern(/^[+-]?(\d*[.])?\d+$/, 'Value must be a float without an exponent.');

export const validateAlphaNumericWithoutAccents = () => {
    return validatePattern(/^[a-zA-Z0-9-._~]+$/, 'Value can only contain numbers or letters, dash, underscore, dot or tilde.');
};

export const validateAlphaNumericWithSpecialChars = () => {
    return validatePattern(
        /^[a-zA-Z0-9À-ž]+([ '-/_][a-zA-Z0-9À-ž]+)*$/,
        'Value can only contain numbers or letters eventually separated by a space, dash, apostrophe or slash and underscore',
    );
};

export const validateEmail = () => validatePattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/, 'Value must be a valid email address');

export const validateUrl = () =>
    validatePattern(/^((http(s?)?):\/\/)?[a-zA-Z0-9\-.]+:[0-9]+?$/g, 'Value must be a valid url. Example: http://localhost:8443');

export const validateCustom = (pattern: string, value: string) => {
    return !value || new RegExp(pattern).test(value) ? undefined : `Value must conform to '${pattern}'`;
};

export const validateCustomUrl = (value: string) => {
    return !value ||
        new RegExp(
            /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/g,
        ).test(value)
        ? undefined
        : 'Value must be a valid url';
};

export const validateCustomIp = (value: string) => {
    return !value ||
        new RegExp(
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        ).test(value)
        ? undefined
        : 'Value must be a valid ip address';
};

export const validateCustomPort = (value: string) => {
    return !value || new RegExp(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/).test(value)
        ? undefined
        : 'Value must be a valid port';
};

export const validateLength = (min: number, max: number) => (value: any) => {
    const validationInput = getValueFromObject(value);
    return !validationInput || (validationInput.length >= min && validationInput.length <= max)
        ? undefined
        : `Value must be between ${min} and ${max} characters long`;
};

export const validateUrlSafe = () => {
    return validatePattern(/^[a-zA-Z0-9-._~]+$/, 'Value can only contain numbers or letters, dash, underscore, dot or tilde.');
};

export const validateQuartzCronExpression = (cronExpression: string | undefined) => (value: string) => {
    const validationInput = getValueFromObject(value);

    try {
        let validObj: { isValid: boolean; errorMessage: Array<string> } = cronValidator.isValidCronExpression(validationInput, {
            error: true,
        });
        let uniqueErrors: string[] = [];

        if (Array.isArray(validObj.errorMessage)) {
            uniqueErrors = validObj.errorMessage?.splice(0, validObj?.errorMessage?.length);
        }

        return !validationInput || validObj.isValid
            ? undefined
            : Array.isArray(validObj.errorMessage)
              ? uniqueErrors.join(', ')
              : validObj.errorMessage;
    } catch (error) {
        return 'Unknown error, please check the cron expression.';
    }
};
