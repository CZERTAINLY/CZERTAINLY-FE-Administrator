import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './discoveries';

describe('discoveries slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createDiscoverySucceeded).toBe(false);
    });

    test('createDiscovery / success / failure update flags', () => {
        let next = reducer(
            initialState,
            actions.createDiscovery({
                scheduled: false,
                request: {} as any,
            } as any),
        );
        expect(next.isCreating).toBe(true);
        expect(next.createDiscoverySucceeded).toBe(false);

        next = reducer(next, actions.createDiscoverySuccess({ uuid: 'd-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createDiscoverySucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createDiscoveryFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createDiscoverySucceeded).toBe(false);
    });
});

describe('discoveries selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createDiscoverySucceeded: true,
        } as any;

        const state = { discoveries: featureState } as any;

        expect(selectors.createDiscoverySucceeded(state)).toBe(true);
    });
});
