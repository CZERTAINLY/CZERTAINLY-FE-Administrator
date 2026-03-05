import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as vaultActions } from './vaults';
import { actions as userInterfaceActions } from './user-interface';
import { actions as pagingActions } from './paging';
import { actions as appRedirectActions } from './app-redirect';
import { EntityType } from './filters';
import { LockWidgetNameEnum } from 'types/user-interface';
import { alertsSlice } from './alert-slice';

vi.mock('../App', async () => ({ store: (await import('./epics-test-mocks')).getEpicMocks().appStore }));
vi.mock('./alerts', async () => ({ actions: (await import('./epics-test-mocks')).getEpicMocks().alertActions }));

type EpicDeps = {
    apiClients: {
        vaults: {
            listVaultInstances: (args: any) => any;
            getVaultInstanceDetails: (args: any) => any;
            listVaultInstanceAttributes: (args: any) => any;
            createVaultInstance: (args: any) => any;
            updateVaultInstance: (args: any) => any;
            deleteVaultInstance: (args: any) => any;
        };
    };
};

function createDeps(overrides: Partial<EpicDeps['apiClients']> = {}): EpicDeps {
    const defaultVaults = {
        listVaultInstances: () =>
            of({
                items: [{ uuid: 'v-1' }],
                totalItems: 1,
                pageNumber: 1,
                itemsPerPage: 10,
                totalPages: 1,
            }),
        getVaultInstanceDetails: () => of({ uuid: 'v-1', name: 'Vault' }),
        listVaultInstanceAttributes: () => of([]),
        createVaultInstance: () => of({ uuid: 'v-1', name: 'Vault' }),
        updateVaultInstance: () =>
            of({ uuid: 'v-1', name: 'Vault', description: '', connector: { uuid: 'c-1', name: 'C' }, attributes: [] }),
        deleteVaultInstance: () => of(null),
    };
    return {
        apiClients: {
            vaults: overrides.vaults ? { ...defaultVaults, ...overrides.vaults } : defaultVaults,
        },
    };
}

async function runEpic(
    epicIndex: number,
    action: any,
    depsOverrides: Partial<EpicDeps['apiClients']> = {},
    takeCount = 1,
): Promise<UnknownAction[]> {
    const { default: epics } = await import('./vaults-epics');
    const deps = createDeps(depsOverrides);
    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('vaults epics', () => {
    test('getVaultDetail success emits getVaultDetailSuccess and removeWidgetLock', async () => {
        const emitted = await runEpic(1, vaultActions.getVaultDetail({ uuid: 'v-1' }), {}, 2);

        expect(emitted[0].type).toBe(vaultActions.getVaultDetailSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.VaultDetails));
    });

    test('getVaultDetail failure emits getVaultDetailFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            1,
            vaultActions.getVaultDetail({ uuid: 'v-1' }),
            {
                vaults: {
                    getVaultInstanceDetails: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(vaultActions.getVaultDetailFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('listVaults success emits listVaultsSuccess, paging listSuccess and removeWidgetLock', async () => {
        const search = { pageNumber: 1, itemsPerPage: 10, filters: [] } as any;
        const emitted = await runEpic(0, vaultActions.listVaults(search), {}, 3);

        expect(emitted[0].type).toBe(vaultActions.listVaultsSuccess.type);
        expect(emitted[1]).toEqual(pagingActions.listSuccess({ entity: EntityType.VAULT, totalItems: 1 }));
        expect(emitted[2]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfVaults));
    });

    test('listVaults failure emits listVaultsFailure, paging listFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            0,
            vaultActions.listVaults({ pageNumber: 1, itemsPerPage: 10, filters: [] } as any),
            {
                vaults: {
                    listVaultInstances: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(vaultActions.listVaultsFailure.type);
        expect(emitted[1]).toEqual(pagingActions.listFailure(EntityType.VAULT));
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('getVaultInstanceAttributes success emits getVaultInstanceAttributesSuccess', async () => {
        const attrs = [{ uuid: 'a-1', name: 'Attr' }] as any[];
        const emitted = await runEpic(2, vaultActions.getVaultInstanceAttributes({ connectorUuid: 'c-1' }), {
            vaults: {
                listVaultInstanceAttributes: ({ connectorUuid }: { connectorUuid: string }) => {
                    expect(connectorUuid).toBe('c-1');
                    return of(attrs);
                },
            } as any,
        });
        expect(emitted[0].type).toBe(vaultActions.getVaultInstanceAttributesSuccess.type);
        expect((emitted[0] as unknown as { payload: { connectorUuid: string; attributes: unknown[] } }).payload.connectorUuid).toBe('c-1');
        expect((emitted[0] as unknown as { payload: { connectorUuid: string; attributes: unknown[] } }).payload.attributes).toHaveLength(1);
    });

    test('getVaultInstanceAttributes failure emits getVaultInstanceAttributesFailure', async () => {
        const err = new Error('attrs failed');
        const emitted = await runEpic(2, vaultActions.getVaultInstanceAttributes({ connectorUuid: 'c-1' }), {
            vaults: {
                listVaultInstanceAttributes: () => throwError(() => err),
            } as any,
        });
        expect(emitted[0].type).toBe(vaultActions.getVaultInstanceAttributesFailure.type);
        expect((emitted[0] as unknown as { payload: { connectorUuid: string } }).payload.connectorUuid).toBe('c-1');
    });

    test('createVault success emits createVaultSuccess, listVaults and redirect', async () => {
        const request = {
            connectorUuid: 'c-1',
            interfaceUuid: 'V2',
            name: 'vault-1',
            description: 'desc',
            attributes: [],
            customAttributes: [],
        };

        const emitted = await runEpic(3, vaultActions.createVault({ request }), {}, 3);

        expect(emitted[0].type).toBe(vaultActions.createVaultSuccess.type);
        expect(emitted[1]).toEqual(vaultActions.listVaults({ pageNumber: 1, itemsPerPage: 10, filters: [] }));
        expect(emitted[2]).toEqual(appRedirectActions.redirect({ url: '/vaults' }));
    });

    test('createVault failure emits createVaultFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            3,
            vaultActions.createVault({ request: {} as any }),
            {
                vaults: {
                    createVaultInstance: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(vaultActions.createVaultFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to create Vault' }));
    });

    test('updateVault success emits updateVaultSuccess and getVaultDetail', async () => {
        const request = { description: 'Updated', attributes: [], customAttributes: [] } as any;
        const emitted = await runEpic(4, vaultActions.updateVault({ uuid: 'v-1', request }), {}, 2);
        expect(emitted[0].type).toBe(vaultActions.updateVaultSuccess.type);
        expect(emitted[1]).toEqual(vaultActions.getVaultDetail({ uuid: 'v-1' }));
    });

    test('updateVault failure emits updateVaultFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            4,
            vaultActions.updateVault({ uuid: 'v-1', request: { attributes: [] } as any }),
            { vaults: { updateVaultInstance: () => throwError(() => err) } as any },
            2,
        );
        expect(emitted[0].type).toBe(vaultActions.updateVaultFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update Vault' }));
    });

    test('deleteVault success emits deleteVaultSuccess and success alert', async () => {
        const emitted = await runEpic(5, vaultActions.deleteVault({ uuid: 'v-1' }), {}, 2);

        expect(emitted[0]).toEqual(vaultActions.deleteVaultSuccess({ uuid: 'v-1' }));
        expect(emitted[1]).toEqual(alertsSlice.actions.success('Vault deleted successfully.'));
    });

    test('deleteVault failure emits deleteVaultFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            5,
            vaultActions.deleteVault({ uuid: 'v-1' }),
            {
                vaults: {
                    deleteVaultInstance: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(vaultActions.deleteVaultFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete Vault' }));
    });
});
