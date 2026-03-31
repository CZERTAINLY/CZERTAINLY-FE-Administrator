import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as ilmSigningProtocolConfigurationActions } from './ilm-signing-protocol-configurations';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as userInterfaceActions } from './user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';

type EpicDeps = {
    apiClients: {
        ilmSigningProtocolConfigurations: {
            listIlmSigningProtocolConfigurations: (args: any) => any;
            getIlmSigningProtocolConfiguration: (args: any) => any;
            listIlmSigningProtocolConfigurationSearchableFields: () => any;
            createIlmSigningProtocolConfiguration: (args: any) => any;
            updateIlmSigningProtocolConfiguration: (args: any) => any;
            deleteIlmSigningProtocolConfiguration: (args: any) => any;
            enableIlmSigningProtocolConfiguration: (args: any) => any;
            disableIlmSigningProtocolConfiguration: (args: any) => any;
            bulkDeleteIlmSigningProtocolConfigurations: (args: any) => any;
            bulkEnableIlmSigningProtocolConfigurations: (args: any) => any;
            bulkDisableIlmSigningProtocolConfigurations: (args: any) => any;
        };
    };
};

enum IlmSigningProtocolConfigurationsEpicIndex {
    List = 0,
    Detail = 1,
    SearchableFields = 2,
    Create = 3,
    Update = 4,
    Delete = 5,
    Enable = 6,
    Disable = 7,
    BulkDelete = 8,
    BulkEnable = 9,
    BulkDisable = 10,
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
    const { default: epics } = await import('./ilm-signing-protocol-configurations-epics');

    const defaultClient = {
        listIlmSigningProtocolConfigurations: () =>
            of({
                items: [{ uuid: 'c-1', name: 'Config 1', enabled: true }],
                totalItems: 1,
            }),
        getIlmSigningProtocolConfiguration: () => of({ uuid: 'c-1', name: 'Config 1', enabled: true }),
        listIlmSigningProtocolConfigurationSearchableFields: () => of([{ searchGroupEnum: 'g-1' }]),
        createIlmSigningProtocolConfiguration: () => of({ uuid: 'c-new', name: 'New Config' }),
        updateIlmSigningProtocolConfiguration: () => of({ uuid: 'c-1', name: 'Updated Config' }),
        deleteIlmSigningProtocolConfiguration: () => of(null),
        enableIlmSigningProtocolConfiguration: () => of(undefined),
        disableIlmSigningProtocolConfiguration: () => of(undefined),
        bulkDeleteIlmSigningProtocolConfigurations: () => of([]),
        bulkEnableIlmSigningProtocolConfigurations: () => of(undefined),
        bulkDisableIlmSigningProtocolConfigurations: () => of(undefined),
    };

    const deps: EpicDeps = {
        apiClients: {
            ilmSigningProtocolConfigurations: depsOverrides.ilmSigningProtocolConfigurations
                ? { ...defaultClient, ...depsOverrides.ilmSigningProtocolConfigurations }
                : defaultClient,
        },
    };

    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('ilmSigningProtocolConfigurations epics', () => {
    test('listIlmSigningProtocolConfigurations success emits listSuccess and removeWidgetLock', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.List,
            ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurations(),
            {},
            2,
        );

        expect(emitted[0]).toEqual(
            ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurationsSuccess({
                ilmSigningProtocolConfigurations: [{ uuid: 'c-1', name: 'Config 1', enabled: true }] as any,
                totalItems: 1,
            }),
        );
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfIlmSigningProtocolConfigurations));
    });

    test('listIlmSigningProtocolConfigurations failure emits listFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.List,
            ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurations(),
            {
                ilmSigningProtocolConfigurations: {
                    listIlmSigningProtocolConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurationsFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('getIlmSigningProtocolConfiguration success emits getSuccess and removeWidgetLock', async () => {
        const config = { uuid: 'c-1', name: 'Config 1', enabled: true };
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Detail,
            ilmSigningProtocolConfigurationActions.getIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {
                ilmSigningProtocolConfigurations: {
                    getIlmSigningProtocolConfiguration: () => of(config),
                } as any,
            },
            2,
        );

        expect(emitted[0]).toEqual(
            ilmSigningProtocolConfigurationActions.getIlmSigningProtocolConfigurationSuccess({
                ilmSigningProtocolConfiguration: config as any,
            }),
        );
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.IlmSigningProtocolConfigurationDetails));
    });

    test('getIlmSigningProtocolConfiguration failure emits getFailure, fetchError and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Detail,
            ilmSigningProtocolConfigurationActions.getIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {
                ilmSigningProtocolConfigurations: {
                    getIlmSigningProtocolConfiguration: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.getIlmSigningProtocolConfigurationFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to get ILM Signing Protocol Configuration details' }),
        );
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('listIlmSigningProtocolConfigurationSearchableFields success emits searchableFieldsSuccess', async () => {
        const fields = [{ searchGroupEnum: 'g-1' }];
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.SearchableFields,
            ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurationSearchableFields(),
            {
                ilmSigningProtocolConfigurations: {
                    listIlmSigningProtocolConfigurationSearchableFields: () => of(fields),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(
            ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurationSearchableFieldsSuccess({
                searchableFields: fields as any,
            }),
        );
    });

    test('listIlmSigningProtocolConfigurationSearchableFields failure emits searchableFieldsFailure', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.SearchableFields,
            ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurationSearchableFields(),
            {
                ilmSigningProtocolConfigurations: {
                    listIlmSigningProtocolConfigurationSearchableFields: () => throwError(() => err),
                } as any,
            },
            1,
        );

        expect(emitted[0].type).toBe(
            ilmSigningProtocolConfigurationActions.listIlmSigningProtocolConfigurationSearchableFieldsFailure.type,
        );
    });

    test('createIlmSigningProtocolConfiguration success emits createSuccess and redirect', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Create,
            ilmSigningProtocolConfigurationActions.createIlmSigningProtocolConfiguration({
                ilmSigningProtocolConfigurationRequestDto: {} as any,
            }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.createIlmSigningProtocolConfigurationSuccess.type);
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../ilmsigningprotocolconfigurations/detail/c-new' }));
    });

    test('createIlmSigningProtocolConfiguration failure emits createFailure and fetchError', async () => {
        const err = new Error('create failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Create,
            ilmSigningProtocolConfigurationActions.createIlmSigningProtocolConfiguration({
                ilmSigningProtocolConfigurationRequestDto: {} as any,
            }),
            {
                ilmSigningProtocolConfigurations: {
                    createIlmSigningProtocolConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.createIlmSigningProtocolConfigurationFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to create ILM Signing Protocol Configuration' }),
        );
    });

    test('updateIlmSigningProtocolConfiguration success emits updateSuccess and redirect', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Update,
            ilmSigningProtocolConfigurationActions.updateIlmSigningProtocolConfiguration({
                uuid: 'c-1',
                ilmSigningProtocolConfigurationRequestDto: {} as any,
            }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.updateIlmSigningProtocolConfigurationSuccess.type);
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../../ilmsigningprotocolconfigurations/detail/c-1' }));
    });

    test('updateIlmSigningProtocolConfiguration failure emits updateFailure and fetchError', async () => {
        const err = new Error('update failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Update,
            ilmSigningProtocolConfigurationActions.updateIlmSigningProtocolConfiguration({
                uuid: 'c-1',
                ilmSigningProtocolConfigurationRequestDto: {} as any,
            }),
            {
                ilmSigningProtocolConfigurations: {
                    updateIlmSigningProtocolConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.updateIlmSigningProtocolConfigurationFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to update ILM Signing Protocol Configuration' }),
        );
    });

    test('deleteIlmSigningProtocolConfiguration success emits deleteSuccess and redirect', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Delete,
            ilmSigningProtocolConfigurationActions.deleteIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(ilmSigningProtocolConfigurationActions.deleteIlmSigningProtocolConfigurationSuccess({ uuid: 'c-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../../ilmsigningprotocolconfigurations' }));
    });

    test('deleteIlmSigningProtocolConfiguration failure emits deleteFailure and fetchError', async () => {
        const err = new Error('delete failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Delete,
            ilmSigningProtocolConfigurationActions.deleteIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {
                ilmSigningProtocolConfigurations: {
                    deleteIlmSigningProtocolConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.deleteIlmSigningProtocolConfigurationFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to delete ILM Signing Protocol Configuration' }),
        );
    });

    test('enableIlmSigningProtocolConfiguration success emits enableSuccess', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Enable,
            ilmSigningProtocolConfigurationActions.enableIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(ilmSigningProtocolConfigurationActions.enableIlmSigningProtocolConfigurationSuccess({ uuid: 'c-1' }));
    });

    test('enableIlmSigningProtocolConfiguration failure emits enableFailure and fetchError', async () => {
        const err = new Error('enable failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Enable,
            ilmSigningProtocolConfigurationActions.enableIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {
                ilmSigningProtocolConfigurations: {
                    enableIlmSigningProtocolConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.enableIlmSigningProtocolConfigurationFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to enable ILM Signing Protocol Configuration' }),
        );
    });

    test('disableIlmSigningProtocolConfiguration success emits disableSuccess', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Disable,
            ilmSigningProtocolConfigurationActions.disableIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(ilmSigningProtocolConfigurationActions.disableIlmSigningProtocolConfigurationSuccess({ uuid: 'c-1' }));
    });

    test('disableIlmSigningProtocolConfiguration failure emits disableFailure and fetchError', async () => {
        const err = new Error('disable failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.Disable,
            ilmSigningProtocolConfigurationActions.disableIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
            {
                ilmSigningProtocolConfigurations: {
                    disableIlmSigningProtocolConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.disableIlmSigningProtocolConfigurationFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to disable ILM Signing Protocol Configuration' }),
        );
    });

    test('bulkDeleteIlmSigningProtocolConfigurations success emits bulkDeleteSuccess and alert', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.BulkDelete,
            ilmSigningProtocolConfigurationActions.bulkDeleteIlmSigningProtocolConfigurations({ uuids: ['c-1', 'c-2'] }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(
            ilmSigningProtocolConfigurationActions.bulkDeleteIlmSigningProtocolConfigurationsSuccess({
                uuids: ['c-1', 'c-2'],
                errors: [],
            }),
        );
        expect(emitted[1]).toEqual(alertActions.success('Selected ILM Signing Protocol Configurations successfully deleted.'));
    });

    test('bulkDeleteIlmSigningProtocolConfigurations failure emits bulkDeleteFailure and fetchError', async () => {
        const err = new Error('bulk delete failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.BulkDelete,
            ilmSigningProtocolConfigurationActions.bulkDeleteIlmSigningProtocolConfigurations({ uuids: ['c-1'] }),
            {
                ilmSigningProtocolConfigurations: {
                    bulkDeleteIlmSigningProtocolConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.bulkDeleteIlmSigningProtocolConfigurationsFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to delete ILM Signing Protocol Configurations' }),
        );
    });

    test('bulkEnableIlmSigningProtocolConfigurations success emits bulkEnableSuccess', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.BulkEnable,
            ilmSigningProtocolConfigurationActions.bulkEnableIlmSigningProtocolConfigurations({ uuids: ['c-1', 'c-2'] }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(
            ilmSigningProtocolConfigurationActions.bulkEnableIlmSigningProtocolConfigurationsSuccess({ uuids: ['c-1', 'c-2'] }),
        );
    });

    test('bulkEnableIlmSigningProtocolConfigurations failure emits bulkEnableFailure and fetchError', async () => {
        const err = new Error('bulk enable failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.BulkEnable,
            ilmSigningProtocolConfigurationActions.bulkEnableIlmSigningProtocolConfigurations({ uuids: ['c-1'] }),
            {
                ilmSigningProtocolConfigurations: {
                    bulkEnableIlmSigningProtocolConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.bulkEnableIlmSigningProtocolConfigurationsFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to enable ILM Signing Protocol Configurations' }),
        );
    });

    test('bulkDisableIlmSigningProtocolConfigurations success emits bulkDisableSuccess', async () => {
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.BulkDisable,
            ilmSigningProtocolConfigurationActions.bulkDisableIlmSigningProtocolConfigurations({ uuids: ['c-1', 'c-2'] }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(
            ilmSigningProtocolConfigurationActions.bulkDisableIlmSigningProtocolConfigurationsSuccess({ uuids: ['c-1', 'c-2'] }),
        );
    });

    test('bulkDisableIlmSigningProtocolConfigurations failure emits bulkDisableFailure and fetchError', async () => {
        const err = new Error('bulk disable failed');
        const emitted = await runEpic(
            IlmSigningProtocolConfigurationsEpicIndex.BulkDisable,
            ilmSigningProtocolConfigurationActions.bulkDisableIlmSigningProtocolConfigurations({ uuids: ['c-1'] }),
            {
                ilmSigningProtocolConfigurations: {
                    bulkDisableIlmSigningProtocolConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(ilmSigningProtocolConfigurationActions.bulkDisableIlmSigningProtocolConfigurationsFailure.type);
        expect(emitted[1]).toEqual(
            appRedirectActions.fetchError({ error: err, message: 'Failed to disable ILM Signing Protocol Configurations' }),
        );
    });
});
