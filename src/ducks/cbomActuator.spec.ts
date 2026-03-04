import { describe, expect, test } from 'vitest';
import reducer, { actions, initialState, selectors } from './cbomActuator';

describe('cbomActuator slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('health action clears health and sets fetching true', () => {
        const dirtyState = {
            ...initialState,
            health: { status: 'UP' },
            isFetching: false,
        } as any;

        const next = reducer(dirtyState, actions.health('https://cbom-repo.otilm.com/api'));

        expect(next.health).toBeUndefined();
        expect(next.isFetching).toBe(true);
    });

    test('healthSuccess stores health payload and clears fetching', () => {
        const next = reducer(
            {
                ...initialState,
                isFetching: true,
            },
            actions.healthSuccess({ status: 'UP' }),
        );

        expect(next.health).toEqual({ status: 'UP' });
        expect(next.isFetching).toBe(false);
    });

    test('healthFailure clears fetching and keeps state stable', () => {
        const next = reducer(
            {
                ...initialState,
                health: { status: 'UP' },
                isFetching: true,
            },
            actions.healthFailure({ error: 'failed' }),
        );

        expect(next.health).toEqual({ status: 'UP' });
        expect(next.isFetching).toBe(false);
    });

    test('reset clears health and fetching', () => {
        const next = reducer(
            {
                ...initialState,
                health: { status: 'UP' },
                isFetching: true,
            },
            actions.reset(),
        );

        expect(next.health).toBeUndefined();
        expect(next.isFetching).toBe(false);
    });
});

describe('cbomActuator selectors', () => {
    test('returns health and isFetching from state', () => {
        const rootState = {
            cbomActuator: {
                health: { status: 'UP' },
                isFetching: true,
            },
        } as any;

        expect(selectors.health(rootState)).toEqual({ status: 'UP' });
        expect(selectors.isFetching(rootState)).toBe(true);
    });
});
