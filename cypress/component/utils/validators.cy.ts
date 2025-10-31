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
    validatePostgresPosixRegex,
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

    describe('validatePostgresPosixRegex', () => {
        describe('Basic syntax validation', () => {
            it('should pass for empty string', () => {
                expect(validatePostgresPosixRegex('')).to.equal('');
            });

            it('should pass for simple valid regex patterns', () => {
                expect(validatePostgresPosixRegex('abc')).to.equal('');
                expect(validatePostgresPosixRegex('[a-z]+')).to.equal('');
                expect(validatePostgresPosixRegex('\\d+')).to.equal('');
                expect(validatePostgresPosixRegex('test.*pattern')).to.equal('');
            });

            it('should detect gross syntax errors', () => {
                const result = validatePostgresPosixRegex('test\\');
                expect(result).to.include('Invalid regex pattern');
            });
        });

        describe('Forbidden PCRE/JS tokens', () => {
            it('should reject positive lookahead (?=)', () => {
                const result = validatePostgresPosixRegex('test(?=pattern)');
                expect(result).to.include('Unsupported regex token for PostgreSQL POSIX');
                expect(result).to.include('(?=');
            });

            it('should reject negative lookahead (?!)', () => {
                const result = validatePostgresPosixRegex('test(?!pattern)');
                expect(result).to.include('Unsupported regex token for PostgreSQL POSIX');
                expect(result).to.include('(?!');
            });

            it('should reject non-capturing group (?:)', () => {
                const result = validatePostgresPosixRegex('(?:test)');
                expect(result).to.include('Unsupported regex token for PostgreSQL POSIX');
                expect(result).to.include('(?:');
            });

            it('should reject inline modifiers (?i)', () => {
                const result = validatePostgresPosixRegex('(?i)test');
                expect(result).to.be.a('string');
                expect(result.length).to.be.greaterThan(0);
            });

            it('should reject atomic groups (?>)', () => {
                const result = validatePostgresPosixRegex('(?>test)');
                expect(result).to.be.a('string');
                expect(result.length).to.be.greaterThan(0);
            });

            it('should reject named capture groups (?P<)', () => {
                const result = validatePostgresPosixRegex('(?P<name>test)');
                expect(result).to.be.a('string');
                expect(result.length).to.be.greaterThan(0);
            });

            it('should reject Unicode property escapes \\p{', () => {
                const result = validatePostgresPosixRegex('\\p{Letter}');
                expect(result).to.include('Unsupported regex token for PostgreSQL POSIX');
                expect(result).to.include('\\p{');
            });

            it('should allow escaped forbidden tokens', () => {
                expect(validatePostgresPosixRegex('\\\\Q')).to.equal('');
                expect(validatePostgresPosixRegex('\\(\\?\\=')).to.equal('');
            });
        });

        describe('Single backslash validation', () => {
            it('should reject forbidden single backslash sequences', () => {
                const result = validatePostgresPosixRegex('\\Q');
                expect(result).to.include('Unsupported');
                expect(result).to.include('\\Q');
            });

            it('should reject \\u escape', () => {
                const result = validatePostgresPosixRegex('\\u0041');
                expect(result).to.include('Unsupported escape sequence');
                expect(result).to.include('\\u');
            });

            it('should reject \\x escape (when single backslash)', () => {
                const result = validatePostgresPosixRegex('\\xAB');
                expect(result).to.include('Unsupported escape sequence');
                expect(result).to.include('\\x');
            });

            it('should reject \\K escape (single backslash)', () => {
                const result = validatePostgresPosixRegex('test\\K');
                expect(result).to.include('Unsupported');
                expect(result).to.include('\\K');
            });

            it('should allow double backslash before forbidden characters', () => {
                expect(validatePostgresPosixRegex('\\\\Q')).to.equal('');
                expect(validatePostgresPosixRegex('\\\\u0041')).to.equal('');
                expect(validatePostgresPosixRegex('\\\\x41')).to.equal('');
            });

            it('should allow common POSIX escapes', () => {
                expect(validatePostgresPosixRegex('\\d')).to.equal('');
                expect(validatePostgresPosixRegex('\\w')).to.equal('');
                expect(validatePostgresPosixRegex('\\s')).to.equal('');
                expect(validatePostgresPosixRegex('\\n')).to.equal('');
                expect(validatePostgresPosixRegex('\\t')).to.equal('');
            });
        });

        describe('Structural checks - Parentheses', () => {
            it('should pass for balanced parentheses', () => {
                expect(validatePostgresPosixRegex('(test)')).to.equal('');
                expect(validatePostgresPosixRegex('((test))')).to.equal('');
                expect(validatePostgresPosixRegex('(a)(b)')).to.equal('');
            });

            it('should reject unbalanced opening parenthesis', () => {
                const result = validatePostgresPosixRegex('(test');
                expect(result).to.include('Invalid regex pattern');
            });

            it('should reject unbalanced closing parenthesis', () => {
                const result = validatePostgresPosixRegex('test)');
                expect(result).to.include('Invalid regex pattern');
            });

            it('should ignore escaped parentheses', () => {
                expect(validatePostgresPosixRegex('\\(test\\)')).to.equal('');
            });
        });

        describe('Structural checks - Brackets', () => {
            it('should pass for balanced brackets', () => {
                expect(validatePostgresPosixRegex('[abc]')).to.equal('');
                expect(validatePostgresPosixRegex('[a-z]')).to.equal('');
                expect(validatePostgresPosixRegex('[^abc]')).to.equal('');
            });

            it('should reject unterminated character class', () => {
                const result = validatePostgresPosixRegex('[abc');
                expect(result).to.include('Invalid regex pattern');
            });

            it('should allow nested brackets for POSIX classes', () => {
                expect(validatePostgresPosixRegex('[[:alpha:]]')).to.equal('');
            });
        });

        describe('POSIX character classes', () => {
            it('should pass for valid POSIX classes', () => {
                expect(validatePostgresPosixRegex('[[:alnum:]]')).to.equal('');
                expect(validatePostgresPosixRegex('[[:alpha:]]')).to.equal('');
                expect(validatePostgresPosixRegex('[[:digit:]]')).to.equal('');
                expect(validatePostgresPosixRegex('[[:lower:]]')).to.equal('');
                expect(validatePostgresPosixRegex('[[:upper:]]')).to.equal('');
                expect(validatePostgresPosixRegex('[[:space:]]')).to.equal('');
                expect(validatePostgresPosixRegex('[[:punct:]]')).to.equal('');
                expect(validatePostgresPosixRegex('[[:xdigit:]]')).to.equal('');
            });

            it('should reject unknown POSIX classes', () => {
                const result = validatePostgresPosixRegex('[[:invalid:]]');
                expect(result).to.include('Unknown POSIX class');
                expect(result).to.include('invalid');
            });

            it('should reject unterminated POSIX class', () => {
                const result = validatePostgresPosixRegex('[[:alpha]');
                expect(result).to.include('Unterminated POSIX character class');
            });

            it('should allow POSIX classes combined with other characters', () => {
                expect(validatePostgresPosixRegex('[[:alpha:]0-9]')).to.equal('');
            });
        });

        describe('Quantifiers', () => {
            it('should pass for valid exact quantifiers {m}', () => {
                expect(validatePostgresPosixRegex('a{3}')).to.equal('');
                expect(validatePostgresPosixRegex('test{10}')).to.equal('');
            });

            it('should pass for valid min quantifiers {m,}', () => {
                expect(validatePostgresPosixRegex('a{3,}')).to.equal('');
                expect(validatePostgresPosixRegex('test{1,}')).to.equal('');
            });

            it('should pass for valid range quantifiers {m,n}', () => {
                expect(validatePostgresPosixRegex('a{3,5}')).to.equal('');
                expect(validatePostgresPosixRegex('test{1,10}')).to.equal('');
            });

            it('should reject unterminated quantifiers', () => {
                const result = validatePostgresPosixRegex('a{3');
                expect(result).to.include('Unterminated quantifier');
            });

            it('should reject unterminated quantifier without closing brace', () => {
                const result = validatePostgresPosixRegex('a{2');
                // May be caught by parse() or our custom check
                expect(result).to.be.a('string');
                expect(result.length).to.be.greaterThan(0);
            });

            it('should reject invalid quantifier format', () => {
                const result = validatePostgresPosixRegex('a{a}');
                expect(result).to.include('Invalid quantifier');
            });

            it('should reject invalid range where m > n', () => {
                const result = validatePostgresPosixRegex('a{5,3}');
                expect(result).to.include('Invalid regex pattern');
            });

            it('should allow quantifiers in character classes', () => {
                expect(validatePostgresPosixRegex('[a-z]{2,4}')).to.equal('');
            });
        });

        describe('Backreferences', () => {
            it('should pass for valid backreferences', () => {
                expect(validatePostgresPosixRegex('(test)\\1')).to.equal('');
                expect(validatePostgresPosixRegex('(a)(b)\\1\\2')).to.equal('');
            });

            it('should reject backreferences to non-existent groups', () => {
                const result = validatePostgresPosixRegex('test\\1');
                expect(result).to.include('Backreference');
                expect(result).to.include('non-existent capturing group');
            });

            it('should reject backreference beyond available groups', () => {
                const result = validatePostgresPosixRegex('(test)\\2');
                expect(result).to.include('Backreference');
                expect(result).to.include('non-existent capturing group');
            });

            it('should allow escaped digits', () => {
                expect(validatePostgresPosixRegex('\\\\1')).to.equal('');
            });
        });

        describe('Complex valid patterns', () => {
            it('should pass for email-like patterns', () => {
                expect(validatePostgresPosixRegex('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')).to.equal('');
            });

            it('should pass for phone number patterns', () => {
                expect(validatePostgresPosixRegex('^\\d{3}-\\d{3}-\\d{4}$')).to.equal('');
            });

            it('should pass for alphanumeric validation', () => {
                expect(validatePostgresPosixRegex('^[a-zA-Z0-9]+$')).to.equal('');
            });

            it('should pass for word boundaries', () => {
                expect(validatePostgresPosixRegex('\\bword\\b')).to.equal('');
            });

            it('should pass for multiple groups with backreferences', () => {
                expect(validatePostgresPosixRegex('(.)(.)(.)\\1\\2\\3')).to.equal('');
            });

            it('should pass for escaped forbidden characters', () => {
                expect(validatePostgresPosixRegex('something\\\\Q')).to.equal('');
            });

            it('should pass for complex JSON-like pattern', () => {
                expect(validatePostgresPosixRegex('"dNSName"\\s*:\\s*\\[[^\\]]*"\\s*3key\\.company\\s*"[^]]*\\]')).to.equal('');
            });
        });

        describe('Edge cases', () => {
            it('should handle multiple errors by returning the first one', () => {
                const result = validatePostgresPosixRegex('(test(?=lookahead)');
                expect(result).to.be.a('string');
                expect(result.length).to.be.greaterThan(0);
            });

            it('should handle mixed valid and invalid patterns', () => {
                const result = validatePostgresPosixRegex('valid.*\\Kinvalid');
                expect(result).to.include('Unsupported');
            });

            it('should handle escaped backslashes correctly', () => {
                expect(validatePostgresPosixRegex('\\\\')).to.equal('');
                expect(validatePostgresPosixRegex('\\\\\\\\')).to.equal('');
            });

            it('should handle literal braces not used as quantifiers', () => {
                expect(validatePostgresPosixRegex('\\{test\\}')).to.equal('');
            });
        });
    });
});
