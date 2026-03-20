import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './customAttributes';

describe('customAttributes slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createCustomAttributeSucceeded).toBe(false);
        expect(initialState.updateCustomAttributeSucceeded).toBe(false);
    });

    test('createCustomAttribute / success / failure', () => {
        let next = reducer(initialState, actions.createCustomAttribute({} as any));
        expect(next.isCreating).toBe(true);
        expect(next.createCustomAttributeSucceeded).toBe(false);

        next = reducer(next, actions.createCustomAttributeSuccess({ uuid: 'ca-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createCustomAttributeSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createCustomAttributeFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createCustomAttributeSucceeded).toBe(false);
    });

    test('updateCustomAttribute / success / failure', () => {
        let next = reducer(initialState, actions.updateCustomAttribute({ uuid: 'ca-1', customAttributeUpdateRequest: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateCustomAttributeSucceeded).toBe(false);

        next = reducer(next, actions.updateCustomAttributeSuccess({ uuid: 'ca-1' } as any));
        expect(next.isUpdating).toBe(false);
        expect(next.updateCustomAttributeSucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateCustomAttributeFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateCustomAttributeSucceeded).toBe(false);
    });
});

describe('customAttributes selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createCustomAttributeSucceeded: true,
            updateCustomAttributeSucceeded: true,
        } as any;

        const state = { customAttributes: featureState } as any;

        expect(selectors.createCustomAttributeSucceeded(state)).toBe(true);
        expect(selectors.updateCustomAttributeSucceeded(state)).toBe(true);
    });
});
