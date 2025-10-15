import cronValidator from 'cron-expression-validator';
import { parse } from 'regexp-tree';

export const composeValidators =
    (...validators: any[]) =>
    (value: any, allValues?: object, fieldState?: any) =>
        validators
            .filter((validator) => typeof validator === 'function')
            .reduce((error, validator) => error || validator(value, allValues, fieldState), undefined);

export const validateRequired = () => (value: any) => {
    let isValid = !!(Array.isArray(value) ? value.length > 0 : value);
    isValid = isValid || (typeof value === 'boolean' && value !== undefined);
    return isValid ? undefined : 'Required Field';
};

const getValueFromObject = (value: any) => {
    if (typeof value === 'object' && value && value.hasOwnProperty('label') && value.hasOwnProperty('value')) {
        return value['value']['data'];
    } else {
        return value;
    }
};

export const validatePattern = (pattern: RegExp, message?: string) => (value: any) => {
    if (Array.isArray(value)) {
        return value.reduce((prev, curr) => prev && pattern.test(getValueFromObject(curr)), true)
            ? undefined
            : message || `Value must conform to ${pattern}`;
    }
    const validationInput = getValueFromObject(value);
    return !validationInput || pattern.test(validationInput) ? undefined : message || `Value must conform to ${pattern}`;
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

export const validateRoutelessUrl = () =>
    validatePattern(/^((https?):\/\/)?[a-zA-Z0-9\-.]+(:\d+)?$/, 'Value must be a valid url. Example: http://localhost:8443');

export const validateUrlWithRoute = (value: string) => {
    return !value || new RegExp(/^(https?:\/\/)?([\w.-]+)(:\d+)?(\/[\w#.-]*)*\/?$/g).test(value) ? undefined : 'Value must be a valid url';
};

export const validateCustomIp = (value: string) => {
    return !value ||
        new RegExp(
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        ).test(value)
        ? undefined
        : 'Value must be a valid ip address';
};

export const validateLength = (min: number, max: number) => (value: any) => {
    const validationInput = getValueFromObject(value);
    return !validationInput || (validationInput.length >= min && validationInput.length <= max)
        ? undefined
        : `Value must be between ${min} and ${max} characters long`;
};

export const validateDuration =
    (denominations: ('d' | 'h' | 'm' | 's')[] = ['d', 'h', 'm', 's']) =>
    (value: string) => {
        if (!value?.trim()) return undefined;
        const regexPattern = `^(\\d{1,10}\\s*[${denominations.join('')}]\\s*)+$`;
        const regex = new RegExp(regexPattern);
        return regex.test(value.trim())
            ? undefined
            : `Invalid duration. Should be formatted as: ${denominations.map((d) => '0' + d).join(' ')}.`;
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

export const validateOid = () => validatePattern(/^[0-2](\.(0|[1-9]\d*)){1,50}$/, 'Value must be a valid OID');

export const validateOidCode = () => validatePattern(/^[A-Za-z][A-Za-z0-9-]*$/, 'Value must be a valid OID code');

// Letters that must NOT follow a single backslash (\\X is OK)
const FORBIDDEN_AFTER_SINGLE_BACKSLASH = new Set([
    'Q',
    'E',
    'R',
    'T',
    'U',
    'u',
    'I',
    'i',
    'O',
    'o',
    'P',
    'p',
    'F',
    'G',
    'g',
    'H',
    'h',
    'J',
    'j',
    'K',
    'k',
    'L',
    'l',
    'Z',
    'z',
    'X',
    'x',
    'C',
    'V',
    'N',
]);

// Disallow these PCRE/JS tokens — not POSIX ARE
const FORBIDDEN_TOKENS = [
    // Inline groups & modifiers not in POSIX ARE
    '(?=',
    '(?!',
    '(?:',
    '(?i',
    '(?m',
    '(?s',
    '(?x',
    '(?>',
    '(?P<',
    '(?<',
    '(?#',
    // Unicode/Property escapes & named backrefs
    '\\k<',
    '\\N',
    '\\p{',
    '\\P{',
    '\\u{',
    '\\x{',
    // PCRE specials
    '\\Q',
    '\\E',
    '\\R',
    '\\K',
    '\\G',
    '\\L',
    '\\U',
];

// Valid POSIX classes (must be used as [[:name:]])
const POSIX_CLASSES = new Set([
    'alnum',
    'alpha',
    'blank',
    'cntrl',
    'digit',
    'graph',
    'lower',
    'print',
    'punct',
    'space',
    'upper',
    'xdigit',
]);

const hasUnescapedSequence = (haystack: string, seq: string): boolean => {
    for (let i = 0; i <= haystack.length - seq.length; i++) {
        if (haystack.slice(i, i + seq.length) !== seq) continue;
        let bs = 0;
        for (let j = i - 1; j >= 0 && haystack[j] === '\\'; j--) bs++;
        if (bs % 2 === 0) {
            return true;
        }
    }
    return false;
};

export const validatePostgresPosixRegex = (value: string): string => {
    if (!value) return '';

    // 0) Quick JS parse for gross syntax errors (not authoritative for POSIX,
    //    but catches obviously broken inputs like stray backslash at the end).
    try {
        parse(`/${value}/`);
    } catch (error: any) {
        return `Invalid regex pattern: ${error?.message ?? error}`;
    }

    // 1) Forbid known non-POSIX/PCRE tokens outright
    for (const tok of FORBIDDEN_TOKENS) {
        // tokens starting with '\' must respect escape parity
        if (tok.startsWith('\\')) {
            if (hasUnescapedSequence(value, tok)) {
                return `Unsupported regex token for PostgreSQL POSIX: "${tok}"`;
            }
        } else {
            // for tokens like '(?=' treat them as unescaped if not preceded by a backslash
            if (hasUnescapedSequence(value, tok)) {
                return `Unsupported regex token for PostgreSQL POSIX: "${tok}"`;
            }
        }
    }

    // 2) Single-backslash rule from your screenshot
    for (let i = 0; i < value.length - 1; i++) {
        if (value[i] !== '\\') continue;
        // count consecutive backslashes ending at i
        let backslashes = 1;
        for (let j = i - 1; j >= 0 && value[j] === '\\'; j--) backslashes++;

        // odd = real escape, even = escaped backslash
        if (backslashes % 2 === 1) {
            const next = value[i + 1];
            if (FORBIDDEN_AFTER_SINGLE_BACKSLASH.has(next)) {
                return `Unsupported escape sequence "\\${next}". Use "\\\\${next}" or remove it.`;
            }
        }
    }

    // 3) Structural checks for (), [], and {m,n}
    let paren = 0;
    let inBracket = false;

    for (let i = 0; i < value.length; i++) {
        const ch = value[i];

        // Skip escaped characters
        if (ch === '\\') {
            i++;
            continue;
        }

        if (!inBracket && ch === '(') paren++;
        else if (!inBracket && ch === ')') {
            paren--;
            if (paren < 0) return 'Unbalanced ")".';
        }

        if (ch === '[') {
            if (!inBracket) {
                inBracket = true;
            }
        } else if (ch === ']' && inBracket) {
            inBracket = false;
        }

        // Validate POSIX classes only inside [...]
        if (inBracket && ch === ':' && i > 0 && value[i - 1] === '[') {
            // attempt to read [:name:]
            const end = value.indexOf(':]', i + 1);
            if (end === -1) return 'Unterminated POSIX character class.';
            const name = value.slice(i + 1, end);
            if (!POSIX_CLASSES.has(name)) {
                return `Unknown POSIX class [:${name}:].`;
            }
            // jump to closing :]
            i = end + 1;
        }

        // Validate {m}, {m,}, {m,n}
        if (!inBracket && ch === '{') {
            const close = value.indexOf('}', i + 1);
            if (close === -1) return 'Unterminated quantifier "{...}".';
            const body = value.slice(i + 1, close);
            if (!/^\d+(,\d*)?$/.test(body)) {
                return `Invalid quantifier "{${body}}". Use {m}, {m,}, or {m,n}.`;
            }
            const [mStr, nStr] = body.split(',');
            const m = Number(mStr);
            if (nStr !== undefined && nStr.length) {
                const n = Number(nStr);
                if (Number.isNaN(n) || m > n) return `Invalid quantifier range "{${body}}".`;
            }
            i = close; // skip to }
        }
    }

    if (inBracket) return 'Unterminated character class "[...]"';
    if (paren !== 0) return 'Unbalanced parentheses "(...)"';

    // 4) Backreferences \1..\9 are allowed in ARE only if that many groups exist
    //    (basic check; not 100% perfect but helpful)
    let groupCount = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === '\\') {
            i++;
            continue;
        }
        if (value[i] === '(') groupCount++;
    }

    //    Find unescaped backreferences \1..\9 (again via backslash parity):
    const backrefs: number[] = [];
    for (let i = 0; i < value.length - 1; i++) {
        if (value[i] !== '\\') continue;

        // count consecutive backslashes ending at position i
        let bs = 1;
        for (let j = i - 1; j >= 0 && value[j] === '\\'; j--) bs++;

        // odd => this '\' is unescaped
        if (bs % 2 === 1) {
            const d = value.charCodeAt(i + 1) - 48; // '1'..'9' -> 1..9
            if (d >= 1 && d <= 9) backrefs.push(d);
        }
    }

    for (const d of backrefs) {
        if (d > groupCount) {
            return `Backreference \\${d} refers to non-existent capturing group.`;
        }
    }

    return '';
};
