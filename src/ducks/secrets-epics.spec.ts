import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as secretsActions } from './secrets';
import { actions as userInterfaceActions } from './user-interface';
import { actions as pagingActions } from './paging';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { EntityType } from './filters';
import { LockWidgetNameEnum } from 'types/user-interface';

vi.mock('../App', async () => ({ store: (await import('./epics-test-mocks')).getEpicMocks().appStore }));
vi.mock('./alerts', async () => ({ actions: (await import('./epics-test-mocks')).getEpicMocks().alertActions }));

type EpicDeps = {
    apiClients: {
        secrets: {
            listSecrets: (args: any) => any;
            createSecret: (args: any) => any;
            deleteSecret: (args: any) => any;
            updateSecret: (args: any) => any;
            updateSecretObjects: (args: any) => any;
        };
    };
};

enum SecretsEpicIndex {
    ListSecrets = 0,
    GetDetail = 1,
    GetVersions = 2,
    GetCreationAttributes = 3,
    Create = 4,
    Delete = 5,
    Enable = 6,
    Disable = 7,
    Update = 8,
    UpdateObjects = 9,
}

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
        createSecret: () => of({ uuid: 's-1', name: 'Secret' }),
        deleteSecret: () => of(null),
        updateSecret: () => of({ uuid: 's-1', name: 'Updated Secret' }),
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
        const emitted = await runEpic(SecretsEpicIndex.ListSecrets, secretsActions.listSecrets(search), {}, 3);

        expect(emitted[0].type).toBe(secretsActions.listSecretsSuccess.type);
        expect(emitted[1]).toEqual(pagingActions.listSuccess({ entity: EntityType.SECRET, totalItems: 1 }));
        expect(emitted[2]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfSecrets));
    });

    test('listSecrets failure emits listSecretsFailure, paging listFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            SecretsEpicIndex.ListSecrets,
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

    test('createSecret success emits createSecretSuccess, redirect and success alert', async () => {
        const payload = {
            vaultUuid: 'v-1',
            vaultProfileUuid: 'vp-1',
            request: {
                name: 's1',
                description: '',
                sourceVaultProfileUuid: 'vp-1',
                secret: { type: 'Generic', content: '' },
                attributes: [],
            } as any,
        };
        const emitted = await runEpic(SecretsEpicIndex.Create, secretsActions.createSecret(payload), {}, 4);

        expect(emitted[0].type).toBe(secretsActions.createSecretSuccess.type);
        expect(emitted[1]).toEqual(secretsActions.listSecrets({ pageNumber: 1, itemsPerPage: 10, filters: [] }));
        expect(emitted[2]).toEqual(appRedirectActions.redirect({ url: '/secrets' }));
        expect(emitted[3]).toEqual(alertActions.success('Secret created successfully.'));
    });

    test('deleteSecret success emits deleteSecretSuccess and info fetchError', async () => {
        const emitted = await runEpic(SecretsEpicIndex.Delete, secretsActions.deleteSecret({ uuid: 's-1' }), {}, 3);

        expect(emitted[0]).toEqual(secretsActions.deleteSecretSuccess({ uuid: 's-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '/secrets' }));
        expect(emitted[2]).toEqual(appRedirectActions.fetchError({ error: undefined as any, message: 'Secret deleted successfully' }));
    });

    test('deleteSecret failure emits deleteSecretFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            SecretsEpicIndex.Delete,
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

    test('updateSecret success emits updateSecretSuccess and success fetchError', async () => {
        const emitted = await runEpic(
            SecretsEpicIndex.Update,
            secretsActions.updateSecret({ uuid: 's-1', update: { description: '', attributes: [] } as any }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(secretsActions.updateSecretSuccess.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: undefined as any, message: 'Secret updated successfully' }));
    });

    test('updateSecret failure emits updateSecretFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            SecretsEpicIndex.Update,
            secretsActions.updateSecret({ uuid: 's-1', update: { description: '', attributes: [] } as any }),
            {
                secrets: {
                    updateSecret: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(secretsActions.updateSecretFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update Secret' }));
    });

    test('updateSecretObjects success emits updateSecretObjectsSuccess and info fetchError', async () => {
        const emitted = await runEpic(
            SecretsEpicIndex.UpdateObjects,
            secretsActions.updateSecretObjects({ uuid: 's-1', update: { ownerUuid: 'u-1' } as any }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(secretsActions.updateSecretObjectsSuccess({ uuid: 's-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: undefined as any, message: 'Secret updated successfully' }));
    });

    test('updateSecretObjects failure emits updateSecretObjectsFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            SecretsEpicIndex.UpdateObjects,
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
