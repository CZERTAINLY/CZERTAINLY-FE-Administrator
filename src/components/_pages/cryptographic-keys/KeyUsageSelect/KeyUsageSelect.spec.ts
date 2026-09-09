import { describe, expect, test } from 'vitest';
import { KeyUsage } from 'types/openapi';
import { getKeyUsageOptions } from './index';

describe('getKeyUsageOptions', () => {
    test('usesOnlyUsagesProvidedByTheConnector', () => {
        // given
        const connectorSupportedUsages = [KeyUsage.Sign, KeyUsage.Verify];

        // when
        const options = getKeyUsageOptions(connectorSupportedUsages, undefined);

        // then
        expect(options.map((option) => option.value)).toEqual(connectorSupportedUsages);
    });

    test('keepsKeyTypeFilteringForConnectorSupportedUsages', () => {
        // given
        const connectorSupportedUsages = [KeyUsage.Sign, KeyUsage.Verify];
        const privateKeyUsages = [KeyUsage.Sign, KeyUsage.Decrypt, KeyUsage.Unwrap];

        // when
        const options = getKeyUsageOptions(connectorSupportedUsages, undefined, privateKeyUsages);

        // then
        expect(options.map((option) => option.value)).toEqual([KeyUsage.Sign]);
    });
});
