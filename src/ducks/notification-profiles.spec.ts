import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './notification-profiles';

describe('notificationProfiles slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            notificationProfile: { uuid: 'np-1' } as any,
            notificationProfiles: [{ uuid: 'np-1' } as any],
            isFetchingList: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('listNotificationProfiles / success / failure', () => {
        let next = reducer(initialState, actions.listNotificationProfiles({ filters: [] } as any));
        expect(next.isFetchingList).toBe(true);
        expect(next.notificationProfiles).toEqual([]);

        const items = [{ uuid: 'np-1' }, { uuid: 'np-2' }] as any[];
        next = reducer(next, actions.listNotificationProfilesSuccess({ notificationProfiles: items }));
        expect(next.isFetchingList).toBe(false);
        expect(next.notificationProfiles).toEqual(items);

        next = reducer({ ...next, isFetchingList: true }, actions.listNotificationProfilesFailure({ error: 'err' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('getNotificationProfileDetail / success / failure', () => {
        let next = reducer(initialState, actions.getNotificationProfileDetail({ uuid: 'np-1', version: 1 }));
        expect(next.isFetchingDetail).toBe(true);
        expect(next.notificationProfile).toBeUndefined();

        const profile = { uuid: 'np-1', name: 'Profile 1' } as any;
        next = reducer(next, actions.getNotificationProfileDetailSuccess({ notificationProfile: profile }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.notificationProfile).toEqual(profile);

        next = reducer({ ...next, isFetchingDetail: true }, actions.getNotificationProfileDetailFailure({ error: 'err' }));
        expect(next.isFetchingDetail).toBe(false);
    });

    test('createNotificationProfile / success / failure', () => {
        let next = reducer(initialState, actions.createNotificationProfile({ notificationProfileAddRequest: { name: 'P1' } as any }));
        expect(next.isCreating).toBe(true);
        expect(next.createNotificationProfileSucceeded).toBe(false);

        next = reducer(next, actions.createNotificationProfileSuccess({ uuid: 'np-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createNotificationProfileSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createNotificationProfileFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createNotificationProfileSucceeded).toBe(false);
    });

    test('updateNotificationProfile / success / failure', () => {
        let next = reducer(
            initialState,
            actions.updateNotificationProfile({ uuid: 'np-1', notificationProfileEditRequest: { name: 'Updated' } as any }),
        );
        expect(next.isUpdating).toBe(true);
        expect(next.updateNotificationProfileSucceeded).toBe(false);

        const updated = { uuid: 'np-1', name: 'Updated' } as any;
        next = reducer(next, actions.updateNotificationProfileSuccess({ notificationProfile: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateNotificationProfileSucceeded).toBe(true);
        expect(next.notificationProfile).toEqual(updated);

        next = reducer({ ...next, isUpdating: true }, actions.updateNotificationProfileFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateNotificationProfileSucceeded).toBe(false);
    });

    test('deleteNotificationProfile / success removes from list / failure', () => {
        const items = [{ uuid: 'np-1' } as any, { uuid: 'np-2' } as any];
        const profile = { uuid: 'np-1', name: 'P1' } as any;

        let next = reducer(
            { ...initialState, notificationProfiles: items, notificationProfile: profile },
            actions.deleteNotificationProfile({ uuid: 'np-1' }),
        );
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteNotificationProfileSuccess({ uuid: 'np-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.notificationProfiles).toEqual([{ uuid: 'np-2' }]);
        expect(next.notificationProfile).toBeUndefined();

        next = reducer({ ...next, isDeleting: true }, actions.deleteNotificationProfileFailure({ error: 'err' }));
        expect(next.isDeleting).toBe(false);
    });

    test('deleteNotificationProfile success does not clear profile when uuid differs', () => {
        const items = [{ uuid: 'np-1' } as any, { uuid: 'np-2' } as any];
        const profile = { uuid: 'np-2', name: 'P2' } as any;

        const next = reducer(
            { ...initialState, notificationProfiles: items, notificationProfile: profile },
            actions.deleteNotificationProfileSuccess({ uuid: 'np-1' }),
        );
        expect(next.notificationProfile).toEqual(profile);
        expect(next.notificationProfiles).toEqual([{ uuid: 'np-2' }]);
    });
});

describe('notificationProfiles selectors', () => {
    test('selectors read values from notificationProfiles state', () => {
        const profile = { uuid: 'np-1' } as any;
        const featureState = {
            ...initialState,
            notificationProfile: profile,
            notificationProfiles: [profile],
            isFetchingList: true,
            isFetchingDetail: true,
            isCreating: true,
            createNotificationProfileSucceeded: true,
            isDeleting: true,
            isUpdating: true,
            updateNotificationProfileSucceeded: true,
        };

        const state = { notificationProfiles: featureState } as any;

        expect(selectors.notificationProfile(state)).toEqual(profile);
        expect(selectors.notificationProfiles(state)).toEqual([profile]);
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.createNotificationProfileSucceeded(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.updateNotificationProfileSucceeded(state)).toBe(true);
    });
});
