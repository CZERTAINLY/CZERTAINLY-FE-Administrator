import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './acme-profiles';

describe('acme-profiles slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createAcmeProfileSucceeded).toBe(false);
        expect(initialState.updateAcmeProfileSucceeded).toBe(false);
    });

    test('createAcmeProfile / success / failure', () => {
        let next = reducer(initialState, actions.createAcmeProfile({} as any));
        expect(next.isCreating).toBe(true);
        expect(next.createAcmeProfileSucceeded).toBe(false);

        next = reducer(next, actions.createAcmeProfileSuccess({ uuid: 'acme-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createAcmeProfileSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createAcmeProfileFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createAcmeProfileSucceeded).toBe(false);
    });

    test('updateAcmeProfile / success / failure', () => {
        let next = reducer(initialState, actions.updateAcmeProfile({ uuid: 'acme-1', updateAcmeRequest: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateAcmeProfileSucceeded).toBe(false);

        next = reducer(next, actions.updateAcmeProfileSuccess({ acmeProfile: { uuid: 'acme-1' } as any }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateAcmeProfileSucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateAcmeProfileFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateAcmeProfileSucceeded).toBe(false);
    });
});

describe('acme-profiles selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createAcmeProfileSucceeded: true,
            updateAcmeProfileSucceeded: true,
        } as any;

        const state = { acmeProfiles: featureState } as any;

        expect(selectors.createAcmeProfileSucceeded(state)).toBe(true);
        expect(selectors.updateAcmeProfileSucceeded(state)).toBe(true);
    });
});
