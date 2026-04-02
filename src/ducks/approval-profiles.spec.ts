import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './approval-profiles';
import { Resource } from 'types/openapi';

describe('approval-profiles slice', () => {
    test('initial state keeps success flags disabled', () => {
        expect(initialState.createApprovalProfileSucceeded).toBe(false);
        expect(initialState.updateApprovalProfileSucceeded).toBe(false);
    });

    test('resetState resets modified values to initial state', () => {
        const dirtyState = {
            ...initialState,
            isCreating: true,
            isUpdating: true,
            createApprovalProfileSucceeded: true,
            updateApprovalProfileSucceeded: true,
            deleteErrorMessage: 'err',
            totalItems: 10,
        } as any;

        const next = reducer(dirtyState, actions.resetState());
        expect(next).toEqual(initialState);
    });

    test('createApprovalProfile lifecycle', () => {
        let next = reducer(initialState, actions.createApprovalProfile({} as any));
        expect(next.profileApprovalDetail).toBeUndefined();
        expect(next.isCreating).toBe(true);
        expect(next.createApprovalProfileSucceeded).toBe(false);

        next = reducer(next, actions.createApprovalProfileSuccess({ uuid: 'ap-1' } as any));
        expect(next.isCreating).toBe(false);
        expect(next.createApprovalProfileSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createApprovalProfileFailure({ error: 'err' }));
        expect(next.profileApprovalDetail).toBeUndefined();
        expect(next.isCreating).toBe(false);
        expect(next.createApprovalProfileSucceeded).toBe(false);
    });

    test('getApprovalProfile lifecycle', () => {
        let next = reducer(initialState, actions.getApprovalProfile({ uuid: 'ap-1' }));
        expect(next.profileApprovalDetail).toBeUndefined();
        expect(next.isFetchingDetail).toBe(true);

        next = reducer(next, actions.getApprovalProfileSuccess({ uuid: 'ap-1' } as any));
        expect(next.profileApprovalDetail?.uuid).toBe('ap-1');
        expect(next.isFetchingDetail).toBe(false);

        next = reducer(next, actions.getApprovalProfileFailure({ error: 'err' }));
        expect(next.profileApprovalDetail).toBeUndefined();
        expect(next.isFetchingDetail).toBe(false);
    });

    test('listApprovalProfiles lifecycle', () => {
        let next = reducer(
            { ...initialState, profileApprovalList: [{ uuid: 'old' } as any], totalItems: 7 },
            actions.listApprovalProfiles({ pageNumber: 1, itemsPerPage: 10 }),
        );
        expect(next.profileApprovalList).toEqual([]);
        expect(next.isFetchingList).toBe(true);

        next = reducer(next, actions.listApprovalProfilesSuccess({ approvalProfiles: [{ uuid: 'ap-1' } as any], totalItems: 1 } as any));
        expect(next.profileApprovalList).toHaveLength(1);
        expect(next.totalItems).toBe(1);
        expect(next.isFetchingList).toBe(false);

        next = reducer(next, actions.listApprovalProfilesFailure({ error: 'err' }));
        expect(next.profileApprovalList).toEqual([]);
        expect(next.isFetchingList).toBe(false);
    });

    test('associated approval profiles lifecycle', () => {
        let next = reducer(
            { ...initialState, associatedApprovalProfiles: [{ uuid: 'old' } as any] },
            actions.getAssociatedApprovalProfilesForResource({ resource: Resource.Secrets, associationObjectUuid: 'sec-1' }),
        );

        expect(next.associatedApprovalProfiles).toEqual([]);
        expect(next.isFetchingAssociatedApprovalProfiles).toBe(true);

        next = reducer(next, actions.getAssociatedApprovalProfilesForResourceSuccess({ approvalProfiles: [{ uuid: 'ap-1' } as any] }));
        expect(next.associatedApprovalProfiles).toHaveLength(1);
        expect(next.isFetchingAssociatedApprovalProfiles).toBe(false);

        next = reducer(next, actions.getAssociatedApprovalProfilesForResourceFailure({ error: 'err' }));
        expect(next.associatedApprovalProfiles).toEqual([]);
        expect(next.isFetchingAssociatedApprovalProfiles).toBe(false);
    });

    test('associate and dissociate flags are toggled', () => {
        const payload = { uuid: 'ap-1', resource: Resource.Secrets, associationObjectUuid: 'sec-1' };

        let next = reducer(initialState, actions.associateApprovalProfileToResource(payload));
        expect(next.isAssociatingApprovalProfile).toBe(true);

        next = reducer(next, actions.associateApprovalProfileToResourceSuccess(payload));
        expect(next.isAssociatingApprovalProfile).toBe(false);

        next = reducer(
            { ...next, isAssociatingApprovalProfile: true },
            actions.associateApprovalProfileToResourceFailure({ error: 'err' }),
        );
        expect(next.isAssociatingApprovalProfile).toBe(false);

        next = reducer(
            { ...next, associatedApprovalProfiles: [{ uuid: 'ap-1' } as any] },
            actions.dissociateApprovalProfileFromResource(payload),
        );
        expect(next.isDissociatingApprovalProfile).toBe(true);

        next = reducer(next, actions.dissociateApprovalProfileFromResourceSuccess(payload));
        expect(next.isDissociatingApprovalProfile).toBe(false);
        expect(next.associatedApprovalProfiles).toEqual([]);

        next = reducer(
            { ...next, isDissociatingApprovalProfile: true },
            actions.dissociateApprovalProfileFromResourceFailure({ error: 'err' }),
        );
        expect(next.isDissociatingApprovalProfile).toBe(false);
    });

    test('delete lifecycle updates list and detail, failure sets error', () => {
        const current = {
            ...initialState,
            isDeleting: false,
            profileApprovalList: [{ uuid: 'ap-1' } as any, { uuid: 'ap-2' } as any],
            profileApprovalDetail: { uuid: 'ap-1' } as any,
        };

        let next = reducer(current, actions.deleteApprovalProfile({ uuid: 'ap-1' }));
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteApprovalProfileSuccess({ uuid: 'ap-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.profileApprovalList.map((p) => p.uuid)).toEqual(['ap-2']);
        expect(next.profileApprovalDetail).toBeUndefined();

        next = reducer(next, actions.deleteApprovalProfileFailure({ error: 'custom err' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('custom err');

        next = reducer(next, actions.clearDeleteErrorMessages());
        expect(next.deleteErrorMessage).toBe('');
    });

    test('editApprovalProfile lifecycle', () => {
        let next = reducer(initialState, actions.editApprovalProfile({ uuid: 'ap-1', editProfileApproval: {} as any }));
        expect(next.profileApprovalDetail).toBeUndefined();
        expect(next.isUpdating).toBe(true);
        expect(next.updateApprovalProfileSucceeded).toBe(false);

        next = reducer(next, actions.editApprovalProfileSuccess({ uuid: 'ap-1' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateApprovalProfileSucceeded).toBe(true);

        next = reducer(next, actions.editApprovalProfileFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateApprovalProfileSucceeded).toBe(false);
    });
});

describe('approval-profiles selectors', () => {
    test('selectors return values from feature slice', () => {
        const featureState = {
            ...initialState,
            profileApprovalDetail: { uuid: 'ap-1' },
            profileApprovalList: [{ uuid: 'ap-1' }],
            associatedApprovalProfiles: [{ uuid: 'ap-2' }],
            isCreating: true,
            createApprovalProfileSucceeded: true,
            isFetchingDetail: true,
            isFetchingList: true,
            isFetchingAssociatedApprovalProfiles: true,
            deleteErrorMessage: 'err',
            totalItems: 2,
            isUpdating: true,
            updateApprovalProfileSucceeded: true,
            isDeleting: true,
            isAssociatingApprovalProfile: true,
            isDissociatingApprovalProfile: true,
        } as any;

        const reduxState = { approvalProfiles: featureState } as any;

        expect(selectors.state(reduxState)).toEqual(featureState);
        expect(selectors.profileApprovalDetail(reduxState)).toEqual(featureState.profileApprovalDetail);
        expect(selectors.profileApprovalList(reduxState)).toEqual(featureState.profileApprovalList);
        expect(selectors.associatedApprovalProfiles(reduxState)).toEqual(featureState.associatedApprovalProfiles);
        expect(selectors.isCreating(reduxState)).toBe(true);
        expect(selectors.createApprovalProfileSucceeded(reduxState)).toBe(true);
        expect(selectors.isFetchingDetail(reduxState)).toBe(true);
        expect(selectors.isFetchingList(reduxState)).toBe(true);
        expect(selectors.isFetchingAssociatedApprovalProfiles(reduxState)).toBe(true);
        expect(selectors.deleteErrorMessage(reduxState)).toBe('err');
        expect(selectors.totalItems(reduxState)).toBe(2);
        expect(selectors.isUpdating(reduxState)).toBe(true);
        expect(selectors.updateApprovalProfileSucceeded(reduxState)).toBe(true);
        expect(selectors.isDeleting(reduxState)).toBe(true);
        expect(selectors.isAssociatingApprovalProfile(reduxState)).toBe(true);
        expect(selectors.isDissociatingApprovalProfile(reduxState)).toBe(true);
    });
});
