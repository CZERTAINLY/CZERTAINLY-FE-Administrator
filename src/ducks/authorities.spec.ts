import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './authorities';

describe('authorities slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createAuthoritySucceeded).toBe(false);
        expect(initialState.updateAuthoritySucceeded).toBe(false);
    });

    test('createAuthority / success / failure', () => {
        let next = reducer(initialState, actions.createAuthority({} as any));
        expect(next.isCreating).toBe(true);
        expect(next.createAuthoritySucceeded).toBe(false);

        next = reducer(next, actions.createAuthoritySuccess({ uuid: 'auth-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createAuthoritySucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createAuthorityFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createAuthoritySucceeded).toBe(false);
    });

    test('updateAuthority / success / failure', () => {
        let next = reducer(initialState, actions.updateAuthority({ uuid: 'auth-1', updateAuthority: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateAuthoritySucceeded).toBe(false);

        next = reducer(next, actions.updateAuthoritySuccess({ authority: { uuid: 'auth-1' } as any }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateAuthoritySucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateAuthorityFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateAuthoritySucceeded).toBe(false);
    });
});

describe('authorities selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createAuthoritySucceeded: true,
            updateAuthoritySucceeded: true,
        } as any;

        const state = { authorities: featureState } as any;

        expect(selectors.createAuthoritySucceeded(state)).toBe(true);
        expect(selectors.updateAuthoritySucceeded(state)).toBe(true);
    });
});
