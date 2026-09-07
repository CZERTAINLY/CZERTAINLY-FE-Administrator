import { describe, expect, test } from 'vitest';
import { KeyUsage } from 'types/openapi';
import { getSupportedTokenProfileKeyUsageOptions } from './index';

describe('getSupportedTokenProfileKeyUsageOptions', () => {
    test('returnsOnlyKeyUsagesSupportedByTheSelectedTokenInstance', () => {
        // given
        const supportedKeyUsages = [KeyUsage.Sign, KeyUsage.Wrap];

        // when
        const options = getSupportedTokenProfileKeyUsageOptions(supportedKeyUsages, undefined);

        // then
        expect(options).toEqual([
            { value: KeyUsage.Sign, label: KeyUsage.Sign, description: undefined },
            { value: KeyUsage.Wrap, label: KeyUsage.Wrap, description: undefined },
        ]);
    });
});
