import { test, expect } from '../../../../playwright/ct-test';
import { getHighLightedCode } from './index';
import { ProgrammingLanguageEnum } from 'types/openapi';

test.describe('CodeBlock getHighLightedCode', () => {
    test('should return string for valid code and language', () => {
        const result = getHighLightedCode('const x = 1;', ProgrammingLanguageEnum.Javascript);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('should handle null/empty code', () => {
        expect(getHighLightedCode('', ProgrammingLanguageEnum.Javascript)).toBe('');
        expect(getHighLightedCode(null as any, ProgrammingLanguageEnum.Javascript)).toBe('');
    });

    test('should return code unchanged when highlight throws', () => {
        const code = 'invalid {{';
        const result = getHighLightedCode(code, 'unknown-lang' as ProgrammingLanguageEnum);
        expect(result).toBe(code);
    });
});
