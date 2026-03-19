import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './notifications';

describe('notifications slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createNotificationInstanceSucceeded).toBe(false);
        expect(initialState.updateNotificationInstanceSucceeded).toBe(false);
    });

    test('createNotificationInstance / success / failure', () => {
        let next = reducer(initialState, actions.createNotificationInstance({} as any));
        expect(next.isCreatingNotificationInstance).toBe(true);
        expect(next.createNotificationInstanceSucceeded).toBe(false);

        next = reducer(next, actions.createNotificationInstanceSuccess());
        expect(next.isCreatingNotificationInstance).toBe(false);
        expect(next.createNotificationInstanceSucceeded).toBe(true);

        next = reducer({ ...next, isCreatingNotificationInstance: true }, actions.createNotificationInstanceFailure({ error: 'err' }));
        expect(next.isCreatingNotificationInstance).toBe(false);
        expect(next.createNotificationInstanceSucceeded).toBe(false);
    });

    test('editNotificationInstance / success / failure', () => {
        let next = reducer(initialState, actions.editNotificationInstance({ uuid: 'n-1', notificationInstance: {} as any } as any));
        expect(next.isEditingNotificationInstance).toBe(true);
        expect(next.updateNotificationInstanceSucceeded).toBe(false);

        next = reducer(next, actions.editNotificationInstanceSuccess());
        expect(next.isEditingNotificationInstance).toBe(false);
        expect(next.updateNotificationInstanceSucceeded).toBe(true);

        next = reducer({ ...next, isEditingNotificationInstance: true }, actions.editNotificationInstanceFailure({ error: 'err' }));
        expect(next.isEditingNotificationInstance).toBe(false);
        expect(next.updateNotificationInstanceSucceeded).toBe(false);
    });
});

describe('notifications selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const featureState = {
            ...initialState,
            createNotificationInstanceSucceeded: true,
            updateNotificationInstanceSucceeded: true,
        } as any;

        const state = { notifications: featureState } as any;

        expect(selectors.createNotificationInstanceSucceeded(state)).toBe(true);
        expect(selectors.updateNotificationInstanceSucceeded(state)).toBe(true);
    });
});
