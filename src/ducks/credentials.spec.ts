import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './credentials';

describe('credentials slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createCredentialSucceeded).toBe(false);
        expect(initialState.updateCredentialSucceeded).toBe(false);
    });

    test('createCredential / success / failure', () => {
        let next = reducer(initialState, actions.createCredential({ credentialRequest: {} as any } as any));
        expect(next.isCreating).toBe(true);
        expect(next.createCredentialSucceeded).toBe(false);

        next = reducer(next, actions.createCredentialSuccess({ uuid: 'cred-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createCredentialSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createCredentialFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createCredentialSucceeded).toBe(false);
    });

    test('updateCredential / success / failure', () => {
        let next = reducer(initialState, actions.updateCredential({ uuid: 'cred-1', credentialRequest: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateCredentialSucceeded).toBe(false);

        next = reducer(next, actions.updateCredentialSuccess({ credential: { uuid: 'cred-1' } as any }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateCredentialSucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateCredentialFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateCredentialSucceeded).toBe(false);
    });
});

describe('credentials selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createCredentialSucceeded: true,
            updateCredentialSucceeded: true,
        } as any;

        const state = { credentials: featureState } as any;

        expect(selectors.createCredentialSucceeded(state)).toBe(true);
        expect(selectors.updateCredentialSucceeded(state)).toBe(true);
    });
});
