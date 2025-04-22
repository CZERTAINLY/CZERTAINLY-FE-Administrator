import {
    composeValidators,
    validateRequired,
    validateInteger,
    validatePositiveInteger,
    validateNonZeroInteger,
    validateFloat,
    validateAlphaNumericWithoutAccents,
    validateAlphaNumericWithSpecialChars,
    validateEmail,
    validateRoutelessUrl,
    validateUrlWithRoute,
    validateCustomIp,
    validatePattern,
    validateLength,
    validateQuartzCronExpression,
} from '../../../src/utils/validators';

describe('Validator Functions', () => {
    function expectToFail(result: string | undefined) {
        expect(result).to.be.a('string');
    }
    function expectToPass(result: string | undefined) {
        expect(result).to.be.undefined;
    }

    describe('validatePattern', () => {
        const validator1 = validatePattern(/\d+/, 'Value must contain only digits');
        const validator2 = validatePattern(/[a-zA-Z]+/, 'Value must contain only letters');
        const data = {
            label: 'Label',
            value: {
                data: '1234',
            },
        };
        it('should work with plain value', () => {
            expectToPass(validator1('1234'));
            expectToFail(validator2('1234'));
        });
        it('should parse data from a value object', () => {
            expectToPass(validator1(data));
            expectToFail(validator2(data));
        });
        it('should work with data arrays', () => {
            const testData = [JSON.parse(JSON.stringify(data)), '1234'];
            expectToPass(validator1(testData));
            expectToFail(validator2(testData));
        });
    });

    describe('composeValidators', () => {
        it('should run multiple validators in sequence', () => {
            const validator = composeValidators(validateRequired(), validatePositiveInteger());

            expectToPass(validator('123'));
            expectToFail(validator(''));
            expectToFail(validator('-1'));
        });
        it('should propagate all of the parameters to the validator functions', () => {
            const allValuesRef = {};
            const fieldStateRef = {};

            function validator1(value: any, allValues?: object, fieldState?: any) {
                if (allValues !== allValuesRef) return 'allValues param is not propagated';
                if (fieldState !== fieldStateRef) return 'fieldState param is not propagated';
            }
            function validator2(value: any, allValues?: object, fieldState?: any) {
                if (allValues !== allValuesRef) return 'allValues param is not propagated';
                if (fieldState !== fieldStateRef) return 'fieldState param is not propagated';
            }
            const validator = composeValidators(validator1, validator2);

            expectToPass(validator('123', allValuesRef, fieldStateRef));
        });

        it('should accept falsy values as validators', () => {
            const validator = composeValidators(false);

            expectToPass(validator(null));
        });
    });

    describe('validateRequired', () => {
        const validator = validateRequired();

        it('should pass for non-empty string', () => {
            expectToPass(validator('some text'));
        });

        it('should pass for false boolean', () => {
            expectToPass(validator(false));
        });

        it('should pass for non-empty array', () => {
            expectToPass(validator(['item']));
        });

        it('should pass for true boolean', () => {
            expectToPass(validator(true));
        });

        it('should fail for undefined', () => {
            expectToFail(validator(undefined));
        });

        it('should fail for empty string', () => {
            expectToFail(validator(''));
        });

        it('should fail for empty array', () => {
            expectToFail(validator([]));
        });
    });

    describe('validateInteger', () => {
        const validator = validateInteger();

        it('should pass for valid integers', () => {
            expectToPass(validator('123'));
            expectToPass(validator('-456'));
            expectToPass(validator('+789'));
        });

        it('should fail for invalid integers', () => {
            expectToFail(validator('123.45'));
            expectToFail(validator('abc'));
        });
    });

    describe('validatePositiveInteger', () => {
        const validator = validatePositiveInteger();

        it('should pass for positive integers, including 0', () => {
            expectToPass(validator('123'));
            expectToPass(validator('0'));
        });

        it('should fail for negative or invalid integers', () => {
            expectToFail(validator('-1'));
            expectToFail(validator('abc'));
        });
    });

    describe('validateNonZeroInteger', () => {
        const validator = validateNonZeroInteger();

        it('should pass for non-zero integers', () => {
            expectToPass(validator('123'));
            expectToPass(validator('-123'));
        });

        it('should fail for zero', () => {
            expectToFail(validator('0'));
        });

        it('should fail for invalid integers', () => {
            expectToFail(validator('10.10'));
            expectToFail(validator('abc'));
        });
    });

    describe('validateFloat', () => {
        const validator = validateFloat();

        it('should pass for valid floats', () => {
            expectToPass(validator('1.23'));
            expectToPass(validator('-0.45'));
            expectToPass(validator('0.0'));
        });

        it('should fail for invalid floats', () => {
            expectToFail(validator('1e10'));
            expectToFail(validator('abc'));
        });
    });

    describe('validateAlphaNumericWithoutAccents', () => {
        const validator = validateAlphaNumericWithoutAccents();

        it('should pass for simple alphanumeric values and symbols', () => {
            expectToPass(validator('Test123'));
            expectToPass(validator('-._~'));
            expectToPass(validator('valid_value'));
        });

        it('should fail for values with accents or other unsupported characters', () => {
            expectToFail(validator('é'));
            expectToFail(validator('か'));
            expectToFail(validator('#/\\\'"'));
        });
    });

    describe('validateAlphaNumericWithSpecialChars', () => {
        const validator = validateAlphaNumericWithSpecialChars();

        it('should pass for values with allowed special chars', () => {
            expectToPass(validator('Test Name'));
            expectToPass(validator("O'Reilly"));
            expectToPass(validator('path/to/resource'));
            expectToPass(validator('file_name'));
            expectToPass(validator('ěščřžýáíéóúůďťňĎŇŤŠČŘŽÝÁÍÉÚŮ'));
        });

        it('should fail for invalid special chars', () => {
            expectToFail(validator('Invalid@Name'));
        });

        it('should fail for leading or trailing special chars', () => {
            expectToFail(validator('_-Invalid'));
            expectToFail(validator('Invalid-_'));
        });
        it('should fail for more separators than necessary', () => {
            expectToFail(validator('Test  Invalid'));
        });
    });

    describe('validateEmail', () => {
        const validator = validateEmail();

        it('should pass for valid emails', () => {
            expectToPass(validator('test@example.com'));
        });

        it('should fail for invalid emails', () => {
            expectToFail(validator('invalid-email'));
        });
    });

    describe('validateRoutelessUrl', () => {
        const validator = validateRoutelessUrl();

        it('should pass for valid URLs', () => {
            expectToPass(validator('example.com'));
            expectToPass(validator('http://localhost:8080'));
            expectToPass(validator('http://example.com:3000'));
            expectToPass(validator('https://example.com'));
            expectToPass(validator('https://example.com:3000'));
        });

        it('should fail for invalid URLs', () => {
            expectToFail(validator('http://localhost:'));
            expectToFail(validator('http://localhost/route'));
        });
    });

    describe('validateUrlWithRoute', () => {
        it('should pass for valid URLs', () => {
            expectToPass(validateUrlWithRoute('http://example.com'));
            expectToPass(validateUrlWithRoute('http://subdomain.example.com'));
            expectToPass(validateUrlWithRoute('https://localhost:3000'));
            expectToPass(validateUrlWithRoute('https://localhost:3000/test-route'));
            expectToPass(validateUrlWithRoute('https://localhost:3000/test-route/document123.pdf'));
            expectToPass(validateUrlWithRoute('https://localhost:3000/administarator/#/dashboard'));
        });

        it('should fail for invalid URLs', () => {
            expectToFail(validateUrlWithRoute('https://localhost:'));
            expectToFail(validateUrlWithRoute('ftp://localhost'));
        });
    });

    describe('validateCustomIp', () => {
        it('should pass for valid IP addresses', () => {
            expectToPass(validateCustomIp('192.0.2.34'));
            expectToPass(validateCustomIp('127.0.0.1'));
        });

        it('should fail for invalid IPs', () => {
            expectToFail(validateCustomIp('999.999.999.999'));
            expectToFail(validateCustomIp('abc.def.ghi.jkl'));
        });
    });

    describe('validateLength', () => {
        const min = 3;
        const max = 5;
        const validator = validateLength(min, max);

        it('should pass for strings within the length range', () => {
            expectToPass(validator('abc')); //
            expectToPass(validator('abcd'));
            expectToPass(validator('abcde'));
        });

        it('should fail for strings outside the length range', () => {
            expectToFail(validator('ab'));
            expectToFail(validator('abcdef'));
        });

        it('should pass for falsy input', () => {
            expectToPass(validator(undefined));
            expectToPass(validator(null));
            expectToPass(validator(''));
        });
    });
    describe('validateQuartzCronExpression', () => {
        const validator = validateQuartzCronExpression(undefined);

        it('should pass for valid cron expressions', () => {
            expectToPass(validator('0 0 12 * * ?'));
            expectToPass(validator('0 15 10 ? * MON-FRI'));
            expectToPass(validator('0 0/5 14 * * ?'));
        });

        it('should pass for falsy input', () => {
            expectToPass(validator(''));
        });

        it('should fail for invalid cron expressions', () => {
            expectToFail(validator('invalid cron'));
            expectToFail(validator('* * *'));
            expectToFail(validator('60 24 0 0 0 0'));
        });
    });
});
