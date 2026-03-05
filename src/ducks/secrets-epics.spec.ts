import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as secretsActions } from './secrets';
import { actions as userInterfaceActions } from './user-interface';
import { actions as pagingActions } from './paging';
import { actions as appRedirectActions } from './app-redirect';
import { EntityType } from './filters';
import { LockWidgetNameEnum } from 'types/user-interface';

vi.mock('../App', async () => ({ store: (await import('./epics-test-mocks')).getEpicMocks().appStore }));
vi.mock('./alerts', async () => ({ actions: (await import('./epics-test-mocks')).getEpicMocks().alertActions }));

type EpicDeps = {
    apiClients: {
        secrets: {
            listSecrets: (args: any) => any;
            deleteSecret: (args: any) => any;
            updateSecretObjects: (args: any) => any;
        };
    };
};

async function runEpic(
    epicIndex: number,
    action: any,
    depsOverrides: Partial<EpicDeps['apiClients']> = {},
    takeCount = 1,
): Promise<UnknownAction[]> {
    const { default: epics } = await import('./secrets-epics');

    const defaultSecrets = {
        listSecrets: () =>
            of({
                items: [{ uuid: 's-1' }],
                totalItems: 1,
                pageNumber: 1,
                itemsPerPage: 10,
                totalPages: 1,
            }),
        deleteSecret: () => of(null),
        updateSecretObjects: () => of(null),
    };
    const deps: EpicDeps = {
        apiClients: {
            secrets: depsOverrides.secrets ? { ...defaultSecrets, ...depsOverrides.secrets } : defaultSecrets,
        },
    };

    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('secrets epics', () => {
    test('listSecrets success emits listSecretsSuccess, paging listSuccess and removeWidgetLock', async () => {
        const search = { pageNumber: 1, itemsPerPage: 10, filters: [] } as any;
        const emitted = await runEpic(0, secretsActions.listSecrets(search), {}, 3);

        expect(emitted[0].type).toBe(secretsActions.listSecretsSuccess.type);
        expect(emitted[1]).toEqual(pagingActions.listSuccess({ entity: EntityType.SECRET, totalItems: 1 }));
        expect(emitted[2]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfSecrets));
    });

    test('listSecrets failure emits listSecretsFailure, paging listFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            0,
            secretsActions.listSecrets({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any),
            {
                secrets: {
                    listSecrets: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(secretsActions.listSecretsFailure.type);
        expect(emitted[1]).toEqual(pagingActions.listFailure(EntityType.SECRET));
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('deleteSecret success emits deleteSecretSuccess and info fetchError', async () => {
        const emitted = await runEpic(1, secretsActions.deleteSecret({ uuid: 's-1' }), {}, 2);

        expect(emitted[0]).toEqual(secretsActions.deleteSecretSuccess({ uuid: 's-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: undefined as any, message: 'Secret deleted successfully' }));
    });

    test('deleteSecret failure emits deleteSecretFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            1,
            secretsActions.deleteSecret({ uuid: 's-1' }),
            {
                secrets: {
                    deleteSecret: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(secretsActions.deleteSecretFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete Secret' }));
    });

    test('updateSecretObjects success emits updateSecretObjectsSuccess and info fetchError', async () => {
        const emitted = await runEpic(2, secretsActions.updateSecretObjects({ uuid: 's-1', update: { ownerUuid: 'u-1' } as any }), {}, 2);

        expect(emitted[0]).toEqual(secretsActions.updateSecretObjectsSuccess({ uuid: 's-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: undefined as any, message: 'Secret updated successfully' }));
    });

    test('updateSecretObjects failure emits updateSecretObjectsFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            2,
            secretsActions.updateSecretObjects({ uuid: 's-1', update: { ownerUuid: 'u-1' } as any }),
            {
                secrets: {
                    updateSecretObjects: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(secretsActions.updateSecretObjectsFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update Secret' }));
    });
});
