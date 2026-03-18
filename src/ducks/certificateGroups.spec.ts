import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './certificateGroups';

describe('certificateGroups slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createGroupSucceeded).toBe(false);
        expect(initialState.updateGroupSucceeded).toBe(false);
    });

    test('createGroup / success / failure', () => {
        let next = reducer(initialState, actions.createGroup({} as any));
        expect(next.isCreating).toBe(true);
        expect(next.createGroupSucceeded).toBe(false);

        next = reducer(next, actions.createGroupSuccess({ uuid: 'g-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createGroupSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createGroupFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createGroupSucceeded).toBe(false);
    });

    test('updateGroup / success / failure', () => {
        let next = reducer(initialState, actions.updateGroup({ groupUuid: 'g-1', editGroupRequest: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateGroupSucceeded).toBe(false);

        next = reducer(next, actions.updateGroupSuccess({ group: { uuid: 'g-1' } as any }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateGroupSucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateGroupFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateGroupSucceeded).toBe(false);
    });
});

describe('certificateGroups selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createGroupSucceeded: true,
            updateGroupSucceeded: true,
        } as any;

        const state = { certificateGroups: featureState } as any;

        expect(selectors.createGroupSucceeded(state)).toBe(true);
        expect(selectors.updateGroupSucceeded(state)).toBe(true);
    });
});
