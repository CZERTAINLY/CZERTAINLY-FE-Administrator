import { describe, expect, test } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as approvalProfileActions } from './approval-profiles';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';
import { Resource } from 'types/openapi';

type EpicDeps = {
    apiClients: {
        approvalProfiles: {
            getApprovalProfile: (args: any) => any;
            createApprovalProfile: (args: any) => any;
            listApprovalProfiles: (args: any) => any;
            deleteApprovalProfile: (args: any) => any;
            editApprovalProfile: (args: any) => any;
            getAssociatedApprovalProfiles1: (args: any) => any;
            associateApprovalProfile: (args: any) => any;
            disassociateApprovalProfile: (args: any) => any;
        };
    };
};

enum ApprovalProfilesEpicIndex {
    Get = 0,
    Create = 1,
    List = 2,
    Delete = 3,
    Edit = 4,
    GetAssociated = 5,
    Associate = 6,
    Dissociate = 7,
}

async function runEpic(
    epicIndex: number,
    action: any,
    depsOverrides: Partial<EpicDeps['apiClients']['approvalProfiles']> = {},
    takeCount = 1,
): Promise<UnknownAction[]> {
    const { default: epics } = await import('./approval-profiles-epics');

    const defaultApprovalProfiles = {
        getApprovalProfile: () => of({ uuid: 'ap-1', approvalSteps: [] }),
        createApprovalProfile: () => of({ uuid: 'ap-1' }),
        listApprovalProfiles: () => of({ approvalProfiles: [{ uuid: 'ap-1' }], totalItems: 1 }),
        deleteApprovalProfile: () => of(undefined),
        editApprovalProfile: () => of(undefined),
        getAssociatedApprovalProfiles1: () => of([{ uuid: 'ap-1' }]),
        associateApprovalProfile: () => of(undefined),
        disassociateApprovalProfile: () => of(undefined),
    };

    const deps: EpicDeps = {
        apiClients: {
            approvalProfiles: {
                ...defaultApprovalProfiles,
                ...depsOverrides,
            },
        },
    };

    const epic = (epics as any)[epicIndex];
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('approvalProfiles epics', () => {
    test('getApprovalProfile success emits success and removeWidgetLock', async () => {
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Get,
            approvalProfileActions.getApprovalProfile({ uuid: 'ap-1', version: 2 }),
            {
                getApprovalProfile: ({ uuid, version }: { uuid: string; version?: number }) => {
                    expect(uuid).toBe('ap-1');
                    expect(version).toBe(2);
                    return of({ uuid, version, approvalSteps: [] });
                },
            },
            2,
        );

        expect(emitted[0].type).toBe(approvalProfileActions.getApprovalProfileSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ApprovalProfileDetails));
    });

    test('getApprovalProfile failure emits failure and insertWidgetLock', async () => {
        const err = new Error('get failed');
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Get,
            approvalProfileActions.getApprovalProfile({ uuid: 'ap-1' }),
            {
                getApprovalProfile: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0].type).toBe(approvalProfileActions.getApprovalProfileFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('createApprovalProfile success emits success and redirect', async () => {
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Create,
            approvalProfileActions.createApprovalProfile({ name: 'Profile 1', approvalSteps: [] } as any),
            {},
            2,
        );

        expect(emitted[0]).toEqual(approvalProfileActions.createApprovalProfileSuccess({ uuid: 'ap-1' } as any));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '/approvalprofiles/detail/ap-1' }));
    });

    test('createApprovalProfile failure emits fetchError and create failure', async () => {
        const err = new Error('create failed');
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Create,
            approvalProfileActions.createApprovalProfile({ name: 'Profile 1', approvalSteps: [] } as any),
            {
                createApprovalProfile: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to create approvalprofile' }));
        expect(emitted[1].type).toBe(approvalProfileActions.createApprovalProfileFailure.type);
    });

    test('listApprovalProfiles success emits success and removeWidgetLock', async () => {
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.List,
            approvalProfileActions.listApprovalProfiles({ pageNumber: 1, itemsPerPage: 20 }),
            {
                listApprovalProfiles: ({ itemsPerPage, pageNumber }: { itemsPerPage: number; pageNumber: number }) => {
                    expect(itemsPerPage).toBe(20);
                    expect(pageNumber).toBe(1);
                    return of({ approvalProfiles: [{ uuid: 'ap-1' }], totalItems: 1 });
                },
            },
            2,
        );

        expect(emitted[0].type).toBe(approvalProfileActions.listApprovalProfilesSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfApprovalProfiles));
    });

    test('listApprovalProfiles failure emits insertWidgetLock and failure', async () => {
        const err = new Error('list failed');
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.List,
            approvalProfileActions.listApprovalProfiles({ pageNumber: 1, itemsPerPage: 20 }),
            {
                listApprovalProfiles: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].type).toBe(approvalProfileActions.listApprovalProfilesFailure.type);
    });

    test('deleteApprovalProfile success emits success and redirect', async () => {
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Delete,
            approvalProfileActions.deleteApprovalProfile({ uuid: 'ap-1' }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(approvalProfileActions.deleteApprovalProfileSuccess({ uuid: 'ap-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '/approvalprofiles' }));
    });

    test('deleteApprovalProfile failure emits fetchError and failure', async () => {
        const err = new Error('delete failed');
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Delete,
            approvalProfileActions.deleteApprovalProfile({ uuid: 'ap-1' }),
            {
                deleteApprovalProfile: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete approval profile' }));
        expect(emitted[1].type).toBe(approvalProfileActions.deleteApprovalProfileFailure.type);
    });

    test('editApprovalProfile success emits success and redirect', async () => {
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Edit,
            approvalProfileActions.editApprovalProfile({ uuid: 'ap-1', editProfileApproval: { name: 'Profile 1' } as any }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(approvalProfileActions.editApprovalProfileSuccess({ uuid: 'ap-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '/approvalprofiles/detail/ap-1' }));
    });

    test('editApprovalProfile failure emits fetchError and current failure branch action type', async () => {
        const err = new Error('edit failed');
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Edit,
            approvalProfileActions.editApprovalProfile({ uuid: 'ap-1', editProfileApproval: { name: 'Profile 1' } as any }),
            {
                editApprovalProfile: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update approval profile' }));
        expect(emitted[1].type).toBe(approvalProfileActions.editApprovalProfile.type);
    });

    test('getAssociatedApprovalProfilesForResource success emits success and removeWidgetLock', async () => {
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.GetAssociated,
            approvalProfileActions.getAssociatedApprovalProfilesForResource({
                resource: Resource.Secrets,
                associationObjectUuid: 'sec-1',
            }),
            {
                getAssociatedApprovalProfiles1: ({
                    resource,
                    associationObjectUuid,
                }: {
                    resource: Resource;
                    associationObjectUuid: string;
                }) => {
                    expect(resource).toBe(Resource.Secrets);
                    expect(associationObjectUuid).toBe('sec-1');
                    return of([{ uuid: 'ap-1' }]);
                },
            },
            2,
        );

        expect(emitted[0].type).toBe(approvalProfileActions.getAssociatedApprovalProfilesForResourceSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfApprovalProfiles));
    });

    test('getAssociatedApprovalProfilesForResource failure emits insertWidgetLock and failure', async () => {
        const err = new Error('associated failed');
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.GetAssociated,
            approvalProfileActions.getAssociatedApprovalProfilesForResource({
                resource: Resource.Secrets,
                associationObjectUuid: 'sec-1',
            }),
            {
                getAssociatedApprovalProfiles1: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(emitted[1].type).toBe(approvalProfileActions.getAssociatedApprovalProfilesForResourceFailure.type);
    });

    test('associateApprovalProfileToResource success emits success and refresh associated list action', async () => {
        const payload = { uuid: 'ap-1', resource: Resource.Secrets, associationObjectUuid: 'sec-1' };
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Associate,
            approvalProfileActions.associateApprovalProfileToResource(payload),
            {},
            2,
        );

        expect(emitted[0]).toEqual(approvalProfileActions.associateApprovalProfileToResourceSuccess(payload));
        expect(emitted[1]).toEqual(
            approvalProfileActions.getAssociatedApprovalProfilesForResource({
                resource: Resource.Secrets,
                associationObjectUuid: 'sec-1',
            }),
        );
    });

    test('associateApprovalProfileToResource failure emits fetchError and failure', async () => {
        const err = new Error('associate failed');
        const payload = { uuid: 'ap-1', resource: Resource.Secrets, associationObjectUuid: 'sec-1' };
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Associate,
            approvalProfileActions.associateApprovalProfileToResource(payload),
            {
                associateApprovalProfile: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to associate Approval Profile' }));
        expect(emitted[1].type).toBe(approvalProfileActions.associateApprovalProfileToResourceFailure.type);
    });

    test('dissociateApprovalProfileFromResource success emits success and refresh associated list action', async () => {
        const payload = { uuid: 'ap-1', resource: Resource.Secrets, associationObjectUuid: 'sec-1' };
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Dissociate,
            approvalProfileActions.dissociateApprovalProfileFromResource(payload),
            {},
            2,
        );

        expect(emitted[0]).toEqual(approvalProfileActions.dissociateApprovalProfileFromResourceSuccess(payload));
        expect(emitted[1]).toEqual(
            approvalProfileActions.getAssociatedApprovalProfilesForResource({
                resource: Resource.Secrets,
                associationObjectUuid: 'sec-1',
            }),
        );
    });

    test('dissociateApprovalProfileFromResource failure emits fetchError and failure', async () => {
        const err = new Error('dissociate failed');
        const payload = { uuid: 'ap-1', resource: Resource.Secrets, associationObjectUuid: 'sec-1' };
        const emitted = await runEpic(
            ApprovalProfilesEpicIndex.Dissociate,
            approvalProfileActions.dissociateApprovalProfileFromResource(payload),
            {
                disassociateApprovalProfile: () => throwError(() => err),
            },
            2,
        );

        expect(emitted[0]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to disassociate Approval Profile' }));
        expect(emitted[1].type).toBe(approvalProfileActions.dissociateApprovalProfileFromResourceFailure.type);
    });
});
