import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as tspConfigurationActions } from './tsp-configurations';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as userInterfaceActions } from './user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';

type EpicDeps = {
    apiClients: {
        tspConfigurations: {
            listTspConfigurations: (args: any) => any;
            getTspConfiguration: (args: any) => any;
            listTspConfigurationSearchableFields: () => any;
            createTspConfiguration: (args: any) => any;
            updateTspConfiguration: (args: any) => any;
            deleteTspConfiguration: (args: any) => any;
            enableTspConfiguration: (args: any) => any;
            disableTspConfiguration: (args: any) => any;
            bulkDeleteTspConfigurations: (args: any) => any;
            bulkEnableTspConfigurations: (args: any) => any;
            bulkDisableTspConfigurations: (args: any) => any;
        };
    };
};

enum TspConfigurationsEpicIndex {
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
    const { default: epics } = await import('./tsp-configurations-epics');

    const defaultClient = {
        listTspConfigurations: () =>
            of({
                items: [{ uuid: 'c-1', name: 'TSP Config 1', enabled: true }],
                totalItems: 1,
            }),
        getTspConfiguration: () => of({ uuid: 'c-1', name: 'TSP Config 1', enabled: true }),
        listTspConfigurationSearchableFields: () => of([{ searchGroupEnum: 'g-1' }]),
        createTspConfiguration: () => of({ uuid: 'c-new', name: 'New TSP Config' }),
        updateTspConfiguration: () => of({ uuid: 'c-1', name: 'Updated TSP Config' }),
        deleteTspConfiguration: () => of(null),
        enableTspConfiguration: () => of(undefined),
        disableTspConfiguration: () => of(undefined),
        bulkDeleteTspConfigurations: () => of([]),
        bulkEnableTspConfigurations: () => of(undefined),
        bulkDisableTspConfigurations: () => of(undefined),
    };

    const deps: EpicDeps = {
        apiClients: {
            tspConfigurations: depsOverrides.tspConfigurations ? { ...defaultClient, ...depsOverrides.tspConfigurations } : defaultClient,
        },
    };

    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('tspConfigurations epics', () => {
    test('listTspConfigurations success emits listSuccess and removeWidgetLock', async () => {
        const emitted = await runEpic(TspConfigurationsEpicIndex.List, tspConfigurationActions.listTspConfigurations(), {}, 2);

        expect(emitted[0]).toEqual(
            tspConfigurationActions.listTspConfigurationsSuccess({
                tspConfigurations: [{ uuid: 'c-1', name: 'TSP Config 1', enabled: true }] as any,
                totalItems: 1,
            }),
        );
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfTspConfigurations));
    });

    test('listTspConfigurations failure emits listFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.List,
            tspConfigurationActions.listTspConfigurations(),
            {
                tspConfigurations: {
                    listTspConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.listTspConfigurationsFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('getTspConfiguration success emits getSuccess and removeWidgetLock', async () => {
        const config = { uuid: 'c-1', name: 'TSP Config 1', enabled: true };
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Detail,
            tspConfigurationActions.getTspConfiguration({ uuid: 'c-1' }),
            {
                tspConfigurations: {
                    getTspConfiguration: () => of(config),
                } as any,
            },
            2,
        );

        expect(emitted[0]).toEqual(tspConfigurationActions.getTspConfigurationSuccess({ tspConfiguration: config as any }));
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.TspConfigurationDetails));
    });

    test('getTspConfiguration failure emits getFailure, fetchError and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Detail,
            tspConfigurationActions.getTspConfiguration({ uuid: 'c-1' }),
            {
                tspConfigurations: {
                    getTspConfiguration: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.getTspConfigurationFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to get TSP Configuration details' }));
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('listTspConfigurationSearchableFields success emits searchableFieldsSuccess', async () => {
        const fields = [{ searchGroupEnum: 'g-1' }];
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.SearchableFields,
            tspConfigurationActions.listTspConfigurationSearchableFields(),
            {
                tspConfigurations: {
                    listTspConfigurationSearchableFields: () => of(fields),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(
            tspConfigurationActions.listTspConfigurationSearchableFieldsSuccess({ searchableFields: fields as any }),
        );
    });

    test('listTspConfigurationSearchableFields failure emits searchableFieldsFailure', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.SearchableFields,
            tspConfigurationActions.listTspConfigurationSearchableFields(),
            {
                tspConfigurations: {
                    listTspConfigurationSearchableFields: () => throwError(() => err),
                } as any,
            },
            1,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.listTspConfigurationSearchableFieldsFailure.type);
    });

    test('createTspConfiguration success emits createSuccess and redirect', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Create,
            tspConfigurationActions.createTspConfiguration({ tspConfigurationRequestDto: {} as any }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.createTspConfigurationSuccess.type);
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../tspconfigurations/detail/c-new' }));
    });

    test('createTspConfiguration failure emits createFailure and fetchError', async () => {
        const err = new Error('create failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Create,
            tspConfigurationActions.createTspConfiguration({ tspConfigurationRequestDto: {} as any }),
            {
                tspConfigurations: {
                    createTspConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.createTspConfigurationFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to create TSP Configuration' }));
    });

    test('updateTspConfiguration success emits updateSuccess and redirect', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Update,
            tspConfigurationActions.updateTspConfiguration({ uuid: 'c-1', tspConfigurationRequestDto: {} as any }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.updateTspConfigurationSuccess.type);
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../../tspconfigurations/detail/c-1' }));
    });

    test('updateTspConfiguration failure emits updateFailure and fetchError', async () => {
        const err = new Error('update failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Update,
            tspConfigurationActions.updateTspConfiguration({ uuid: 'c-1', tspConfigurationRequestDto: {} as any }),
            {
                tspConfigurations: {
                    updateTspConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.updateTspConfigurationFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update TSP Configuration' }));
    });

    test('deleteTspConfiguration success emits deleteSuccess and redirect', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Delete,
            tspConfigurationActions.deleteTspConfiguration({ uuid: 'c-1' }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(tspConfigurationActions.deleteTspConfigurationSuccess({ uuid: 'c-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../../tspconfigurations' }));
    });

    test('deleteTspConfiguration failure emits deleteFailure and fetchError', async () => {
        const err = new Error('delete failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Delete,
            tspConfigurationActions.deleteTspConfiguration({ uuid: 'c-1' }),
            {
                tspConfigurations: {
                    deleteTspConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.deleteTspConfigurationFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete TSP Configuration' }));
    });

    test('enableTspConfiguration success emits enableSuccess', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Enable,
            tspConfigurationActions.enableTspConfiguration({ uuid: 'c-1' }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(tspConfigurationActions.enableTspConfigurationSuccess({ uuid: 'c-1' }));
    });

    test('enableTspConfiguration failure emits enableFailure and fetchError', async () => {
        const err = new Error('enable failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Enable,
            tspConfigurationActions.enableTspConfiguration({ uuid: 'c-1' }),
            {
                tspConfigurations: {
                    enableTspConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.enableTspConfigurationFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to enable TSP Configuration' }));
    });

    test('disableTspConfiguration success emits disableSuccess', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Disable,
            tspConfigurationActions.disableTspConfiguration({ uuid: 'c-1' }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(tspConfigurationActions.disableTspConfigurationSuccess({ uuid: 'c-1' }));
    });

    test('disableTspConfiguration failure emits disableFailure and fetchError', async () => {
        const err = new Error('disable failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.Disable,
            tspConfigurationActions.disableTspConfiguration({ uuid: 'c-1' }),
            {
                tspConfigurations: {
                    disableTspConfiguration: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.disableTspConfigurationFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to disable TSP Configuration' }));
    });

    test('bulkDeleteTspConfigurations success emits bulkDeleteSuccess and alert', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.BulkDelete,
            tspConfigurationActions.bulkDeleteTspConfigurations({ uuids: ['c-1', 'c-2'] }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(tspConfigurationActions.bulkDeleteTspConfigurationsSuccess({ uuids: ['c-1', 'c-2'], errors: [] }));
        expect(emitted[1]).toEqual(alertActions.success('Selected TSP Configurations successfully deleted.'));
    });

    test('bulkDeleteTspConfigurations failure emits bulkDeleteFailure and fetchError', async () => {
        const err = new Error('bulk delete failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.BulkDelete,
            tspConfigurationActions.bulkDeleteTspConfigurations({ uuids: ['c-1'] }),
            {
                tspConfigurations: {
                    bulkDeleteTspConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.bulkDeleteTspConfigurationsFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete TSP Configurations' }));
    });

    test('bulkEnableTspConfigurations success emits bulkEnableSuccess', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.BulkEnable,
            tspConfigurationActions.bulkEnableTspConfigurations({ uuids: ['c-1', 'c-2'] }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(tspConfigurationActions.bulkEnableTspConfigurationsSuccess({ uuids: ['c-1', 'c-2'] }));
    });

    test('bulkEnableTspConfigurations failure emits bulkEnableFailure and fetchError', async () => {
        const err = new Error('bulk enable failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.BulkEnable,
            tspConfigurationActions.bulkEnableTspConfigurations({ uuids: ['c-1'] }),
            {
                tspConfigurations: {
                    bulkEnableTspConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.bulkEnableTspConfigurationsFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to enable TSP Configurations' }));
    });

    test('bulkDisableTspConfigurations success emits bulkDisableSuccess', async () => {
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.BulkDisable,
            tspConfigurationActions.bulkDisableTspConfigurations({ uuids: ['c-1', 'c-2'] }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(tspConfigurationActions.bulkDisableTspConfigurationsSuccess({ uuids: ['c-1', 'c-2'] }));
    });

    test('bulkDisableTspConfigurations failure emits bulkDisableFailure and fetchError', async () => {
        const err = new Error('bulk disable failed');
        const emitted = await runEpic(
            TspConfigurationsEpicIndex.BulkDisable,
            tspConfigurationActions.bulkDisableTspConfigurations({ uuids: ['c-1'] }),
            {
                tspConfigurations: {
                    bulkDisableTspConfigurations: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(tspConfigurationActions.bulkDisableTspConfigurationsFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to disable TSP Configurations' }));
    });
});
