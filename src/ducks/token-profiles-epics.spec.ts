import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { describe, expect, test, vi } from 'vitest';
import { KeyUsage } from 'types/openapi';
import { actions as appRedirectActions } from './app-redirect';
import { actions, type State } from './token-profiles';
import { getSupportedTokenProfileKeyUsages } from './token-profiles-epics';

function createDeps(listSupportedTokenProfileKeyUsages: () => ReturnType<typeof of>) {
    return {
        apiClients: {
            tokenProfiles: {
                listSupportedTokenProfileKeyUsages,
            },
        },
    };
}

async function runSupportedKeyUsagesEpic(
    action: ReturnType<typeof actions.getSupportedTokenProfileKeyUsages>,
    listSupportedTokenProfileKeyUsages: () => ReturnType<typeof of>,
    count: number,
) {
    const state$ = of({ tokenprofiles: {} as State });
    const output$ = getSupportedTokenProfileKeyUsages(
        of(action) as any,
        state$ as any,
        createDeps(listSupportedTokenProfileKeyUsages) as any,
    );
    return firstValueFrom(output$.pipe(take(count), toArray()));
}

describe('supported token profile key usages epic', () => {
    test('getSupportedTokenProfileKeyUsages_emitsSupportedUsages', async () => {
        // given
        const tokenInstanceUuid = 'token-1';
        const supportedKeyUsages = [KeyUsage.Sign, KeyUsage.Verify];
        const listSupportedTokenProfileKeyUsages = vi.fn(() => of(supportedKeyUsages));

        // when
        const emitted = await runSupportedKeyUsagesEpic(
            actions.getSupportedTokenProfileKeyUsages({ tokenInstanceUuid }),
            listSupportedTokenProfileKeyUsages,
            1,
        );

        // then
        expect(listSupportedTokenProfileKeyUsages).toHaveBeenCalledWith({ tokenInstanceUuid });
        expect(emitted).toEqual([actions.getSupportedTokenProfileKeyUsagesSuccess({ tokenInstanceUuid, keyUsages: supportedKeyUsages })]);
    });

    test('getSupportedTokenProfileKeyUsages_emitsFailureAndDisplaysApiError', async () => {
        // given
        const tokenInstanceUuid = 'token-1';
        const apiError = new Error('token instance rejected the request');
        const listSupportedTokenProfileKeyUsages = vi.fn(() => throwError(() => apiError));

        // when
        const emitted = await runSupportedKeyUsagesEpic(
            actions.getSupportedTokenProfileKeyUsages({ tokenInstanceUuid }),
            listSupportedTokenProfileKeyUsages,
            2,
        );

        // then
        expect(emitted).toEqual([
            actions.getSupportedTokenProfileKeyUsagesFailure({
                tokenInstanceUuid,
                error: 'Failed to get supported Token Profile Key Usages. token instance rejected the request',
            }),
            appRedirectActions.fetchError({ error: apiError, message: 'Failed to get supported Token Profile Key Usages' }),
        ]);
    });
});
