import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as signingProfileActions } from './signing-profiles';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as userInterfaceActions } from './user-interface';
import { actions as pagingActions } from './paging';
import { EntityType } from './filters';
import { LockWidgetNameEnum } from 'types/user-interface';

type EpicDeps = {
    apiClients: {
        signingProfiles: {
            listSigningProfiles: (args: any) => any;
            getSigningProfile: (args: any) => any;
            listSigningProfileSearchableFields: () => any;
            createSigningProfile: (args: any) => any;
            updateSigningProfile: (args: any) => any;
            deleteSigningProfile: (args: any) => any;
            enableSigningProfile: (args: any) => any;
            disableSigningProfile: (args: any) => any;
            bulkDeleteSigningProfiles: (args: any) => any;
            bulkEnableSigningProfiles: (args: any) => any;
            bulkDisableSigningProfiles: (args: any) => any;
            activateTsp: (args: any) => any;
            deactivateTsp: (args: any) => any;
            getTspActivationDetails: (args: any) => any;
            getAssociatedApprovalProfiles: (args: any) => any;
            associateWithApprovalProfile: (args: any) => any;
            disassociateFromApprovalProfile: (args: any) => any;
            listSupportedProtocols: (args: any) => any;
            listSigningCertificates: (args: any) => any;
            listSigningRecordsForSigningProfile: (args: any) => any;
        };
    };
};

enum SigningProfilesEpicIndex {
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
    ActivateTsp = 11,
    DeactivateTsp = 12,
    GetTspActivationDetails = 13,
    GetAssociatedApprovalProfiles = 14,
    AssociateWithApprovalProfile = 15,
    DisassociateFromApprovalProfile = 16,
    ListSupportedProtocols = 17,
    ListSigningCertificates = 18,
    ListSignatureAttributes = 19,
    ListSignatureFormatterConnectorAttributes = 20,
    ListSignatureFormatterConnectors = 21,
    ListSigningRecords = 22,
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
    const { default: epics } = await import('./signing-profiles-epics');

    const defaultClient = {
        listSigningProfiles: () =>
            of({
                items: [{ uuid: 'p-1', name: 'Profile 1', enabled: true }],
                totalItems: 1,
            }),
        getSigningProfile: () => of({ uuid: 'p-1', name: 'Profile 1', enabled: true }),
        listSigningProfileSearchableFields: () => of([{ searchGroupEnum: 'g-1' }]),
        createSigningProfile: () => of({ uuid: 'p-new', name: 'New Profile' }),
        updateSigningProfile: () => of({ uuid: 'p-1', name: 'Updated Profile' }),
        deleteSigningProfile: () => of(null),
        enableSigningProfile: () => of(undefined),
        disableSigningProfile: () => of(undefined),
        bulkDeleteSigningProfiles: () => of([]),
        bulkEnableSigningProfiles: () => of(undefined),
        bulkDisableSigningProfiles: () => of(undefined),
        activateTsp: () => of({ uuid: 'tsp-1' }),
        deactivateTsp: () => of(undefined),
        getTspActivationDetails: () => of({ uuid: 'tsp-1' }),
        getAssociatedApprovalProfiles: () => of([{ uuid: 'ap-1' }]),
        associateWithApprovalProfile: () => of(undefined),
        disassociateFromApprovalProfile: () => of(undefined),
        listSupportedProtocols: () => of(['TSP']),
        listSigningCertificates: () => of([{ uuid: 'c-1' }]),
        listSigningRecordsForSigningProfile: () => of({ items: [], totalItems: 0 }),
    };

    const deps: EpicDeps = {
        apiClients: {
            signingProfiles: depsOverrides.signingProfiles ? { ...defaultClient, ...depsOverrides.signingProfiles } : defaultClient,
        },
    };

    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('signingProfiles epics', () => {
    test('listSigningProfiles success emits listSuccess, pagingListSuccess and removeWidgetLock', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.List,
            signingProfileActions.listSigningProfiles({ itemsPerPage: 10, pageNumber: 1, filters: [] }),
            {},
            3,
        );

        expect(emitted[0]).toEqual(
            signingProfileActions.listSigningProfilesSuccess({
                signingProfiles: [{ uuid: 'p-1', name: 'Profile 1', enabled: true }] as any,
            }),
        );
        expect(emitted[1]).toEqual(pagingActions.listSuccess({ entity: EntityType.SIGNING_PROFILE, totalItems: 1 }));
        expect(emitted[2]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfSigningProfiles));
    });

    test('listSigningProfiles failure emits listFailure, pagingListFailure and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.List,
            signingProfileActions.listSigningProfiles({ itemsPerPage: 10, pageNumber: 1, filters: [] }),
            {
                signingProfiles: {
                    listSigningProfiles: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(signingProfileActions.listSigningProfilesFailure.type);
        expect(emitted[1]).toEqual(pagingActions.listFailure(EntityType.SIGNING_PROFILE));
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('getSigningProfile success emits getSuccess and removeWidgetLock', async () => {
        const profile = { uuid: 'p-1', name: 'Profile 1', enabled: true };
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Detail,
            signingProfileActions.getSigningProfile({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    getSigningProfile: () => of(profile),
                } as any,
            },
            2,
        );

        expect(emitted[0]).toEqual(signingProfileActions.getSigningProfileSuccess({ signingProfile: profile as any }));
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.SigningProfileDetails));
    });

    test('getSigningProfile failure emits getFailure, fetchError and insertWidgetLock', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Detail,
            signingProfileActions.getSigningProfile({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    getSigningProfile: () => throwError(() => err),
                } as any,
            },
            3,
        );

        expect(emitted[0].type).toBe(signingProfileActions.getSigningProfileFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('listSigningProfileSearchableFields success emits searchableFieldsSuccess', async () => {
        const fields = [{ searchGroupEnum: 'g-1' }];
        const emitted = await runEpic(
            SigningProfilesEpicIndex.SearchableFields,
            signingProfileActions.listSigningProfileSearchableFields(),
            {
                signingProfiles: {
                    listSigningProfileSearchableFields: () => of(fields),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.listSigningProfileSearchableFieldsSuccess({ searchableFields: fields as any }));
    });

    test('listSigningProfileSearchableFields failure emits searchableFieldsFailure', async () => {
        const err = new Error('failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.SearchableFields,
            signingProfileActions.listSigningProfileSearchableFields(),
            {
                signingProfiles: {
                    listSigningProfileSearchableFields: () => throwError(() => err),
                } as any,
            },
            1,
        );

        expect(emitted[0].type).toBe(signingProfileActions.listSigningProfileSearchableFieldsFailure.type);
    });

    test('createSigningProfile success emits createSuccess and redirect', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Create,
            signingProfileActions.createSigningProfile({ signingProfileRequestDto: {} as any }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.createSigningProfileSuccess.type);
        expect(emitted[1].type).toBe(appRedirectActions.redirect.type);
    });

    test('createSigningProfile failure emits createFailure and fetchError', async () => {
        const err = new Error('create failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Create,
            signingProfileActions.createSigningProfile({ signingProfileRequestDto: {} as any }),
            {
                signingProfiles: {
                    createSigningProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.createSigningProfileFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
    });

    test('updateSigningProfile success emits updateSuccess and redirect', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Update,
            signingProfileActions.updateSigningProfile({ uuid: 'p-1', signingProfileRequestDto: {} as any }),
            {},
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.updateSigningProfileSuccess.type);
        expect(emitted[1].type).toBe(appRedirectActions.redirect.type);
    });

    test('updateSigningProfile failure emits updateFailure and fetchError', async () => {
        const err = new Error('update failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Update,
            signingProfileActions.updateSigningProfile({ uuid: 'p-1', signingProfileRequestDto: {} as any }),
            {
                signingProfiles: {
                    updateSigningProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.updateSigningProfileFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
    });

    test('deleteSigningProfile success emits deleteSuccess and redirect', async () => {
        const emitted = await runEpic(SigningProfilesEpicIndex.Delete, signingProfileActions.deleteSigningProfile({ uuid: 'p-1' }), {}, 2);

        expect(emitted[0]).toEqual(signingProfileActions.deleteSigningProfileSuccess({ uuid: 'p-1' }));
        expect(emitted[1].type).toBe(appRedirectActions.redirect.type);
    });

    test('deleteSigningProfile failure emits deleteFailure and fetchError', async () => {
        const err = new Error('delete failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Delete,
            signingProfileActions.deleteSigningProfile({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    deleteSigningProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.deleteSigningProfileFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
    });

    test('enableSigningProfile success emits enableSuccess', async () => {
        const emitted = await runEpic(SigningProfilesEpicIndex.Enable, signingProfileActions.enableSigningProfile({ uuid: 'p-1' }), {}, 1);

        expect(emitted[0]).toEqual(signingProfileActions.enableSigningProfileSuccess({ uuid: 'p-1' }));
    });

    test('enableSigningProfile failure emits enableFailure and fetchError', async () => {
        const err = new Error('enable failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Enable,
            signingProfileActions.enableSigningProfile({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    enableSigningProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.enableSigningProfileFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
    });

    test('disableSigningProfile success emits disableSuccess', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Disable,
            signingProfileActions.disableSigningProfile({ uuid: 'p-1' }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.disableSigningProfileSuccess({ uuid: 'p-1' }));
    });

    test('disableSigningProfile failure emits disableFailure and fetchError', async () => {
        const err = new Error('disable failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.Disable,
            signingProfileActions.disableSigningProfile({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    disableSigningProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.disableSigningProfileFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
    });

    test('bulkDeleteSigningProfiles success emits bulkDeleteSuccess and alert', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.BulkDelete,
            signingProfileActions.bulkDeleteSigningProfiles({ uuids: ['p-1', 'p-2'] }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(signingProfileActions.bulkDeleteSigningProfilesSuccess({ uuids: ['p-1', 'p-2'], errors: [] }));
        expect(emitted[1].type).toBe(alertActions.success.type);
    });

    test('bulkDeleteSigningProfiles failure emits bulkDeleteFailure and fetchError', async () => {
        const err = new Error('bulk delete failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.BulkDelete,
            signingProfileActions.bulkDeleteSigningProfiles({ uuids: ['p-1'] }),
            {
                signingProfiles: {
                    bulkDeleteSigningProfiles: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.bulkDeleteSigningProfilesFailure.type);
        expect(emitted[1].type).toBe(appRedirectActions.fetchError.type);
    });

    test('bulkEnableSigningProfiles success emits bulkEnableSuccess', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.BulkEnable,
            signingProfileActions.bulkEnableSigningProfiles({ uuids: ['p-1', 'p-2'] }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.bulkEnableSigningProfilesSuccess({ uuids: ['p-1', 'p-2'] }));
    });

    test('bulkDisableSigningProfiles success emits bulkDisableSuccess', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.BulkDisable,
            signingProfileActions.bulkDisableSigningProfiles({ uuids: ['p-1', 'p-2'] }),
            {},
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.bulkDisableSigningProfilesSuccess({ uuids: ['p-1', 'p-2'] }));
    });

    test('activateTsp success emits activateTspSuccess', async () => {
        const details = { uuid: 'tsp-1' };
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ActivateTsp,
            signingProfileActions.activateTsp({ signingProfileUuid: 'p-1', tspProfileUuid: 'tsp-1' }),
            {
                signingProfiles: {
                    activateTsp: () => of(details),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.activateTspSuccess({ tspActivationDetails: details as any }));
    });

    test('activateTsp failure emits activateTspFailure and fetchError', async () => {
        const err = new Error('activate TSP failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ActivateTsp,
            signingProfileActions.activateTsp({ signingProfileUuid: 'p-1', tspProfileUuid: 'tsp-1' }),
            {
                signingProfiles: {
                    activateTsp: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.activateTspFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to activate TSP' }));
    });

    test('deactivateTsp success emits deactivateTspSuccess', async () => {
        const emitted = await runEpic(SigningProfilesEpicIndex.DeactivateTsp, signingProfileActions.deactivateTsp({ uuid: 'p-1' }), {}, 1);

        expect(emitted[0]).toEqual(signingProfileActions.deactivateTspSuccess({ uuid: 'p-1' }));
    });

    test('getTspActivationDetails success emits getTspDetailsSuccess', async () => {
        const details = { uuid: 'tsp-1' };
        const emitted = await runEpic(
            SigningProfilesEpicIndex.GetTspActivationDetails,
            signingProfileActions.getTspActivationDetails({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    getTspActivationDetails: () => of(details),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.getTspActivationDetailsSuccess({ tspActivationDetails: details as any }));
    });

    test('getAssociatedApprovalProfiles success emits getAssociatedApprovalProfilesSuccess', async () => {
        const approvalProfiles = [{ uuid: 'ap-1' }];
        const emitted = await runEpic(
            SigningProfilesEpicIndex.GetAssociatedApprovalProfiles,
            signingProfileActions.getAssociatedApprovalProfiles({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    getAssociatedApprovalProfiles: () => of(approvalProfiles),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(
            signingProfileActions.getAssociatedApprovalProfilesSuccess({ approvalProfiles: approvalProfiles as any }),
        );
    });

    test('associateWithApprovalProfile success emits associateSuccess and alert', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.AssociateWithApprovalProfile,
            signingProfileActions.associateWithApprovalProfile({ signingProfileUuid: 'p-1', approvalProfileUuid: 'ap-1' }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(
            signingProfileActions.associateWithApprovalProfileSuccess({
                signingProfileUuid: 'p-1',
                approvalProfileUuid: 'ap-1',
            }),
        );
        expect(emitted[1]).toEqual(alertActions.success('Approval Profile associated successfully.'));
    });

    test('associateWithApprovalProfile failure emits associateFailure and fetchError', async () => {
        const err = new Error('associate failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.AssociateWithApprovalProfile,
            signingProfileActions.associateWithApprovalProfile({ signingProfileUuid: 'p-1', approvalProfileUuid: 'ap-1' }),
            {
                signingProfiles: {
                    associateWithApprovalProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.associateWithApprovalProfileFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to associate Approval Profile' }));
    });

    test('disassociateFromApprovalProfile success emits disassociateSuccess and alert', async () => {
        const emitted = await runEpic(
            SigningProfilesEpicIndex.DisassociateFromApprovalProfile,
            signingProfileActions.disassociateFromApprovalProfile({ signingProfileUuid: 'p-1', approvalProfileUuid: 'ap-1' }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(
            signingProfileActions.disassociateFromApprovalProfileSuccess({
                signingProfileUuid: 'p-1',
                approvalProfileUuid: 'ap-1',
            }),
        );
        expect(emitted[1]).toEqual(alertActions.success('Approval Profile disassociated successfully.'));
    });

    test('disassociateFromApprovalProfile failure emits disassociateFailure and fetchError', async () => {
        const err = new Error('disassociate failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.DisassociateFromApprovalProfile,
            signingProfileActions.disassociateFromApprovalProfile({ signingProfileUuid: 'p-1', approvalProfileUuid: 'ap-1' }),
            {
                signingProfiles: {
                    disassociateFromApprovalProfile: () => throwError(() => err),
                } as any,
            },
            2,
        );

        expect(emitted[0].type).toBe(signingProfileActions.disassociateFromApprovalProfileFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to disassociate Approval Profile' }));
    });

    test('listSupportedProtocols success emits listSupportedProtocolsSuccess', async () => {
        const protocols = ['TSP'];
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ListSupportedProtocols,
            signingProfileActions.listSupportedProtocols({ workflowType: 'SIGNING' as any }),
            {
                signingProfiles: {
                    listSupportedProtocols: () => of(protocols),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.listSupportedProtocolsSuccess({ supportedProtocols: protocols as any }));
    });

    test('listSupportedProtocols failure emits listSupportedProtocolsFailure', async () => {
        const err = new Error('protocols failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ListSupportedProtocols,
            signingProfileActions.listSupportedProtocols({ workflowType: 'SIGNING' as any }),
            {
                signingProfiles: {
                    listSupportedProtocols: () => throwError(() => err),
                } as any,
            },
            1,
        );

        expect(emitted[0].type).toBe(signingProfileActions.listSupportedProtocolsFailure.type);
    });

    test('listSigningCertificates success emits listSigningCertificatesSuccess', async () => {
        const certs = [{ uuid: 'c-1' }];
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ListSigningCertificates,
            signingProfileActions.listSigningCertificates({ workflowType: 'SIGNING' as any }),
            {
                signingProfiles: {
                    listSigningCertificates: () => of(certs),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.listSigningCertificatesSuccess({ signingCertificates: certs as any }));
    });

    test('listSigningCertificates failure emits listSigningCertificatesFailure', async () => {
        const err = new Error('certs failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ListSigningCertificates,
            signingProfileActions.listSigningCertificates({ workflowType: 'SIGNING' as any }),
            {
                signingProfiles: {
                    listSigningCertificates: () => throwError(() => err),
                } as any,
            },
            1,
        );

        expect(emitted[0].type).toBe(signingProfileActions.listSigningCertificatesFailure.type);
    });

    test('listSigningCertificates forwards qualifiedTimestamp to API', async () => {
        const certs = [{ uuid: 'c-2' }];
        let capturedArgs: any;
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ListSigningCertificates,
            signingProfileActions.listSigningCertificates({ workflowType: 'SIGNING' as any, qualifiedTimestamp: true }),
            {
                signingProfiles: {
                    listSigningCertificates: (args: any) => {
                        capturedArgs = args;
                        return of(certs);
                    },
                } as any,
            },
            1,
        );

        expect(capturedArgs).toEqual({ signingWorkflowType: 'SIGNING', qualifiedTimestamp: true });
        expect(emitted[0]).toEqual(signingProfileActions.listSigningCertificatesSuccess({ signingCertificates: certs as any }));
    });

    test('listSigningCertificates omits qualifiedTimestamp when not provided', async () => {
        const certs = [{ uuid: 'c-3' }];
        let capturedArgs: any;
        await runEpic(
            SigningProfilesEpicIndex.ListSigningCertificates,
            signingProfileActions.listSigningCertificates({ workflowType: 'SIGNING' as any }),
            {
                signingProfiles: {
                    listSigningCertificates: (args: any) => {
                        capturedArgs = args;
                        return of(certs);
                    },
                } as any,
            },
            1,
        );

        expect(capturedArgs.qualifiedTimestamp).toBeUndefined();
    });

    test('listSigningRecordsForSigningProfile success emits listSigningRecordsSuccess', async () => {
        const response = { items: [{ uuid: 'ds-1' }], totalItems: 1 };
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ListSigningRecords,
            signingProfileActions.listSigningRecordsForSigningProfile({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    listSigningRecordsForSigningProfile: () => of(response),
                } as any,
            },
            1,
        );

        expect(emitted[0]).toEqual(signingProfileActions.listSigningRecordsForSigningProfileSuccess({ signingRecords: response as any }));
    });

    test('listSigningRecordsForSigningProfile failure emits listSigningRecordsFailure', async () => {
        const err = new Error('signing records failed');
        const emitted = await runEpic(
            SigningProfilesEpicIndex.ListSigningRecords,
            signingProfileActions.listSigningRecordsForSigningProfile({ uuid: 'p-1' }),
            {
                signingProfiles: {
                    listSigningRecordsForSigningProfile: () => throwError(() => err),
                } as any,
            },
            1,
        );

        expect(emitted[0].type).toBe(signingProfileActions.listSigningRecordsForSigningProfileFailure.type);
    });
});
