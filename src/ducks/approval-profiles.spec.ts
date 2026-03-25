import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './approval-profiles';

describe('approval-profiles slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createApprovalProfileSucceeded).toBe(false);
        expect(initialState.updateApprovalProfileSucceeded).toBe(false);
    });

    test('createApprovalProfile / success / failure', () => {
        let next = reducer(initialState, actions.createApprovalProfile({} as any));
        expect(next.isCreating).toBe(true);
        expect(next.createApprovalProfileSucceeded).toBe(false);

        next = reducer(next, actions.createApprovalProfileSuccess({ uuid: 'ap-1' } as any));
        expect(next.isCreating).toBe(false);
        expect(next.createApprovalProfileSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createApprovalProfileFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createApprovalProfileSucceeded).toBe(false);
    });

    test('editApprovalProfile / success / failure', () => {
        let next = reducer(initialState, actions.editApprovalProfile({ uuid: 'ap-1', editProfileApproval: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateApprovalProfileSucceeded).toBe(false);

        next = reducer(next, actions.editApprovalProfileSuccess({ uuid: 'ap-1' } as any));
        expect(next.isUpdating).toBe(false);
        expect(next.updateApprovalProfileSucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.editApprovalProfileFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateApprovalProfileSucceeded).toBe(false);
    });
});

describe('approval-profiles selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createApprovalProfileSucceeded: true,
            updateApprovalProfileSucceeded: true,
        } as any;

        const state = { approvalProfiles: featureState } as any;

        expect(selectors.createApprovalProfileSucceeded(state)).toBe(true);
        expect(selectors.updateApprovalProfileSucceeded(state)).toBe(true);
    });
});
