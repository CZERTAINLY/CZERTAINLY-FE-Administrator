import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './globalMetadata';

describe('globalMetadata slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createGlobalMetadataSucceeded).toBe(false);
        expect(initialState.updateGlobalMetadataSucceeded).toBe(false);
    });

    test('createGlobalMetadata / success / failure', () => {
        let next = reducer(initialState, actions.createGlobalMetadata({} as any));
        expect(next.isCreating).toBe(true);
        expect(next.createGlobalMetadataSucceeded).toBe(false);

        next = reducer(next, actions.createGlobalMetadataSuccess({ uuid: 'gm-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createGlobalMetadataSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createGlobalMetadataFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createGlobalMetadataSucceeded).toBe(false);
    });

    test('updateGlobalMetadata / success / failure', () => {
        let next = reducer(initialState, actions.updateGlobalMetadata({ uuid: 'gm-1', globalMetadataUpdateRequest: {} as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateGlobalMetadataSucceeded).toBe(false);

        next = reducer(next, actions.updateGlobalMetadataSuccess({ uuid: 'gm-1' } as any));
        expect(next.isUpdating).toBe(false);
        expect(next.updateGlobalMetadataSucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateGlobalMetadataFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateGlobalMetadataSucceeded).toBe(false);
    });
});

describe('globalMetadata selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createGlobalMetadataSucceeded: true,
            updateGlobalMetadataSucceeded: true,
        } as any;

        const state = { globalMetadata: featureState } as any;

        expect(selectors.createGlobalMetadataSucceeded(state)).toBe(true);
        expect(selectors.updateGlobalMetadataSucceeded(state)).toBe(true);
    });
});
