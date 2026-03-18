import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './scep-profiles';

describe('scep-profiles slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createScepProfileSucceeded).toBe(false);
        expect(initialState.updateScepProfileSucceeded).toBe(false);
    });

    test('createScepProfile / success / failure', () => {
        let next = reducer(initialState, actions.createScepProfile({} as any));
        expect(next.isCreating).toBe(true);
        expect(next.createScepProfileSucceeded).toBe(false);

        next = reducer(next, actions.createScepProfileSuccess({ uuid: 'scep-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createScepProfileSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createScepProfileFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createScepProfileSucceeded).toBe(false);
    });

    test('updateScepProfile / success / failure', () => {
        let next = reducer(initialState, actions.updateScepProfile({ uuid: 'scep-1', updateScepRequest: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateScepProfileSucceeded).toBe(false);

        next = reducer(next, actions.updateScepProfileSuccess({ scepProfile: { uuid: 'scep-1' } as any }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateScepProfileSucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateScepProfileFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateScepProfileSucceeded).toBe(false);
    });
});

describe('scep-profiles selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createScepProfileSucceeded: true,
            updateScepProfileSucceeded: true,
        } as any;

        const state = { scepProfiles: featureState } as any;

        expect(selectors.createScepProfileSucceeded(state)).toBe(true);
        expect(selectors.updateScepProfileSucceeded(state)).toBe(true);
    });
});
