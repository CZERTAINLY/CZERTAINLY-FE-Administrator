import { firstValueFrom, of } from 'rxjs';
import { describe, expect, test, vi } from 'vitest';
import { TokenProfileManagementApi } from './token-profile-api';

function createClientWithRequestSpy() {
    const client = new TokenProfileManagementApi();
    const request = vi.fn(() => of([]));
    Object.defineProperty(client, 'request', { value: request });
    return { client, request };
}

describe('TokenProfileManagementApi.listSupportedTokenProfileKeyUsages', () => {
    test('listSupportedTokenProfileKeyUsages_buildsPostRequest_forTokenInstance', async () => {
        // given
        const tokenInstanceUuid = 'token-instance-1';
        const { client, request } = createClientWithRequestSpy();

        // when
        await firstValueFrom(client.listSupportedTokenProfileKeyUsages({ tokenInstanceUuid }));

        // then
        expect(request).toHaveBeenCalledWith(
            {
                url: `/v1/tokens/${tokenInstanceUuid}/tokenProfile/keyUsages`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            },
            undefined,
        );
    });

    test('listSupportedTokenProfileKeyUsages_throwsForMissingTokenInstanceUuid', () => {
        // given
        const missingTokenInstanceUuid = undefined;
        const { client } = createClientWithRequestSpy();

        // when
        const request = () =>
            client.listSupportedTokenProfileKeyUsages({ tokenInstanceUuid: missingTokenInstanceUuid as unknown as string });

        // then
        expect(request).toThrow(/tokenInstanceUuid/);
    });
});
