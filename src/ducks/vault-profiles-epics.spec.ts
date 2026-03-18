import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as vaultProfileActions } from './vault-profiles';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as pagingActions } from './paging';
import { EntityType } from './filters';
import { actions as userInterfaceActions } from './user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';

type EpicDeps = {
    apiClients: {
        vaultProfiles: {
            listVaultProfiles: (args: any) => any;
            getVaultProfileDetails: (args: any) => any;
            createVaultProfile: (args: any) => any;
            enableVaultProfile: (args: any) => any;
            disableVaultProfile: (args: any) => any;
            updateVaultProfile: (args: any) => any;
            deleteVaultProfile: (args: any) => any;
        };
        vaults: {
            listVaultProfileAttributes: (args: any) => any;
        };
    };
};

enum VaultProfilesEpicIndex {
    List = 0,
    Detail = 1,
    Create = 2,
    Delete = 6,
    GetAttributes = 7,
}

vi.mock('../App', () => ({
    store: {
        dispatch: vi.fn(),
        getState: vi.fn(() => ({})),
    },
}));

async function runEpic(
    epicIndex: number,
    action: any,
    depsOverrides: Partial<EpicDeps['apiClients']> = {},
    takeCount = 1,
): Promise<UnknownAction[]> {
    const { default: epics } = await import('./vault-profiles-epics');

    const defaultVaultProfiles = {
        listVaultProfiles: () =>
            of({
                items: [{ uuid: 'vp-1' }],
                totalItems: 1,
                pageNumber: 1,
                itemsPerPage: 10,
                totalPages: 1,
            }),
        getVaultProfileDetails: () => of({ uuid: 'vp-1', name: 'P1', vaultInstance: { uuid: 'v-1', name: 'V1' }, enabled: true }),
        createVaultProfile: () => of({ uuid: 'vp-1', name: 'Profile 1' }),
        enableVaultProfile: () => of(undefined),
        disableVaultProfile: () => of(undefined),
        updateVaultProfile: () => of({ uuid: 'vp-1', name: 'P1', vaultInstance: { uuid: 'v-1', name: 'V1' }, enabled: true }),
        deleteVaultProfile: () => of(null),
    };

    const defaultVaults = {
        listVaultProfileAttributes: () => of([]),
    };

    const deps: EpicDeps = {
        apiClients: {
            vaultProfiles: depsOverrides.vaultProfiles ? { ...defaultVaultProfiles, ...depsOverrides.vaultProfiles } : defaultVaultProfiles,
            vaults: depsOverrides.vaults ? { ...defaultVaults, ...depsOverrides.vaults } : defaultVaults,
        },
    };

    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('vaultProfiles epics', () => {
    test('listVaultProfiles success emits listVaultProfilesSuccess, paging listSuccess and removeWidgetLock', async () => {
        const emitted = await runEpic(VaultProfilesEpicIndex.List, vaultProfileActions.listVaultProfiles(), {}, 3);

        expect(emitted[0]).toEqual(
            vaultProfileActions.listVaultProfilesSuccess({
                items: [{ uuid: 'vp-1' }] as any,
            }),
        );
        expect(emitted[1]).toEqual(pagingActions.listSuccess({ entity: EntityType.VAULT_PROFILE, totalItems: 1 }));
        expect(emitted[2]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfVaultProfiles));
    });

    test('listVaultProfiles with filters passes searchRequestDto to API', async () => {
        const search = { pageNumber: 2, itemsPerPage: 20, filters: [{ field: { identifier: 'name' }, value: 'x' }] } as any;
        let capturedDto: any;
        const customDeps: Partial<EpicDeps['apiClients']> = {
            vaultProfiles: {
                listVaultProfiles: (args: { searchRequestDto: any }) => {
                    capturedDto = args.searchRequestDto;
                    return of({ items: [], totalItems: 0, pageNumber: 2, itemsPerPage: 20, totalPages: 0 });
                },
                getVaultProfileDetails: () => of({}),
                createVaultProfile: () => of({}),
                enableVaultProfile: () => of(undefined),
                disableVaultProfile: () => of(undefined),
                updateVaultProfile: () => of({}),
                deleteVaultProfile: () => of(null),
            },
        };
        await runEpic(VaultProfilesEpicIndex.List, vaultProfileActions.listVaultProfiles(search), customDeps, 3);
        expect(capturedDto?.pageNumber).toBe(2);
        expect(capturedDto?.itemsPerPage).toBe(20);
        expect(capturedDto?.filters).toHaveLength(1);
    });

    test('listVaultProfiles failure emits listVaultProfilesFailure, paging listFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            VaultProfilesEpicIndex.List,
            vaultProfileActions.listVaultProfiles(),
            {
                vaultProfiles: {
                    listVaultProfiles: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(vaultProfileActions.listVaultProfilesFailure.type);
        expect(emitted[1]).toEqual(pagingActions.listFailure(EntityType.VAULT_PROFILE));
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('createVaultProfile success emits createVaultProfileSuccess and redirect', async () => {
        const request = {
            name: 'Profile 1',
            description: 'desc',
            attributes: [],
        } as any;

        const emitted = await runEpic(
            VaultProfilesEpicIndex.Create,
            vaultProfileActions.createVaultProfile({ vaultUuid: 'v-1', request }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(vaultProfileActions.createVaultProfileSuccess.type);
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '/vaultprofiles' }));
    });

    test('createVaultProfile failure emits createVaultProfileFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            VaultProfilesEpicIndex.Create,
            vaultProfileActions.createVaultProfile({ vaultUuid: 'v-1', request: {} as any }),
            {
                vaultProfiles: {
                    createVaultProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(vaultProfileActions.createVaultProfileFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to create Vault Profile' }));
    });

    test('getVaultProfileDetail success emits getVaultProfileDetailSuccess', async () => {
        const profile = { uuid: 'vp-1', name: 'P1', vaultInstance: { uuid: 'v-1', name: 'V1' }, enabled: true, attributes: [] };
        const emitted = await runEpic(
            VaultProfilesEpicIndex.Detail,
            vaultProfileActions.getVaultProfileDetail({ vaultUuid: 'v-1', vaultProfileUuid: 'vp-1' }),
            {
                vaultProfiles: {
                    getVaultProfileDetails: () => of(profile),
                } as any,
            },
            1,
        );
        expect(emitted[0]).toEqual(vaultProfileActions.getVaultProfileDetailSuccess({ profile }));
    });

    test('getVaultProfileDetail failure emits getVaultProfileDetailFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            VaultProfilesEpicIndex.Detail,
            vaultProfileActions.getVaultProfileDetail({ vaultUuid: 'v-1', vaultProfileUuid: 'vp-1' }),
            {
                vaultProfiles: {
                    getVaultProfileDetails: () => throwError(() => err),
                } as any,
            },
            2,
        );
        expect(emitted[0].type).toBe(vaultProfileActions.getVaultProfileDetailFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
    });

    test('deleteVaultProfile success emits deleteVaultProfileSuccess, redirect and success alert', async () => {
        const emitted = await runEpic(
            VaultProfilesEpicIndex.Delete,
            vaultProfileActions.deleteVaultProfile({ vaultUuid: 'v-1', vaultProfileUuid: 'vp-1' }),
            {},
            3,
        );

        expect(emitted[0]).toEqual(vaultProfileActions.deleteVaultProfileSuccess({ vaultProfileUuid: 'vp-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '/vaultprofiles' }));
        expect(emitted[2]).toEqual(alertActions.success('Vault Profile deleted successfully.'));
    });

    test('deleteVaultProfile failure emits deleteVaultProfileFailure and fetchError', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            VaultProfilesEpicIndex.Delete,
            vaultProfileActions.deleteVaultProfile({ vaultUuid: 'v-1', vaultProfileUuid: 'vp-1' }),
            {
                vaultProfiles: {
                    deleteVaultProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(vaultProfileActions.deleteVaultProfileFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete Vault Profile' }));
    });

    test('getVaultProfileAttributes success emits getVaultProfileAttributesSuccess', async () => {
        const attrs = [{ uuid: 'a-1', name: 'Attr' }] as any[];
        const emitted = await runEpic(
            VaultProfilesEpicIndex.GetAttributes,
            vaultProfileActions.getVaultProfileAttributes({ vaultUuid: 'v-1' }),
            {
                vaults: {
                    listVaultProfileAttributes: ({ uuid }: { uuid: string }) => {
                        expect(uuid).toBe('v-1');
                        return of(attrs);
                    },
                },
            },
        );
        expect(emitted[0].type).toBe(vaultProfileActions.getVaultProfileAttributesSuccess.type);
        expect((emitted[0] as unknown as { payload: { vaultUuid: string; attributes: unknown[] } }).payload.vaultUuid).toBe('v-1');
        expect((emitted[0] as unknown as { payload: { vaultUuid: string; attributes: unknown[] } }).payload.attributes).toHaveLength(1);
    });

    test('getVaultProfileAttributes failure emits getVaultProfileAttributesFailure and fetchError', async () => {
        const err = new Error('attrs failed');
        const emitted = await runEpic(
            VaultProfilesEpicIndex.GetAttributes,
            vaultProfileActions.getVaultProfileAttributes({ vaultUuid: 'v-1' }),
            {
                vaults: {
                    listVaultProfileAttributes: () => throwError(() => err),
                },
            },
            2,
        );
        expect(emitted[0].type).toBe(vaultProfileActions.getVaultProfileAttributesFailure.type);
        expect((emitted[0] as any).payload.vaultUuid).toBe('v-1');
        expect((emitted[0] as any).payload.error).toContain('attrs failed');
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to get Vault Profile Attribute Descriptor list' }),
        );
    });
});
