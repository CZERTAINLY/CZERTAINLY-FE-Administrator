import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './token-profiles';

describe('tokenProfiles slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            tokenProfile: { uuid: 'tp-1' } as any,
            tokenProfiles: [{ uuid: 'tp-1' } as any],
            isFetchingList: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('setCheckedRows', () => {
        const next = reducer(initialState, actions.setCheckedRows({ checkedRows: ['tp-1', 'tp-2'] }));
        expect(next.checkedRows).toEqual(['tp-1', 'tp-2']);
    });

    test('clearDeleteErrorMessages', () => {
        const next = reducer(
            { ...initialState, deleteErrorMessage: 'err', bulkDeleteErrorMessages: [{ uuid: 'tp-1' } as any] },
            actions.clearDeleteErrorMessages(),
        );
        expect(next.deleteErrorMessage).toBe('');
        expect(next.bulkDeleteErrorMessages).toEqual([]);
    });

    test('listTokenProfiles / success / failure', () => {
        let next = reducer(initialState, actions.listTokenProfiles({}));
        expect(next.isFetchingList).toBe(true);
        expect(next.tokenProfiles).toEqual([]);

        const items = [{ uuid: 'tp-1' }, { uuid: 'tp-2' }] as any[];
        next = reducer(next, actions.listTokenProfilesSuccess({ tokenProfiles: items }));
        expect(next.isFetchingList).toBe(false);
        expect(next.tokenProfiles).toEqual(items);

        next = reducer({ ...next, isFetchingList: true }, actions.listTokenProfilesFailure({ error: 'err' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('getTokenProfileDetail / success / failure', () => {
        let next = reducer(initialState, actions.getTokenProfileDetail({ tokenInstanceUuid: 't-1', uuid: 'tp-1' }));
        expect(next.isFetchingDetail).toBe(true);
        expect(next.tokenProfile).toBeUndefined();

        const profile = { uuid: 'tp-1', name: 'Profile 1' } as any;
        next = reducer(next, actions.getTokenProfileDetailSuccess({ tokenProfile: profile }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.tokenProfile).toEqual(profile);

        next = reducer({ ...next, isFetchingDetail: true }, actions.getTokenProfileDetailFailure({ error: 'err' }));
        expect(next.isFetchingDetail).toBe(false);
    });

    test('createTokenProfile / success / failure', () => {
        let next = reducer(
            initialState,
            actions.createTokenProfile({
                tokenInstanceUuid: 't-1',
                tokenProfileAddRequest: { name: 'P1' } as any,
                usesGlobalModal: false,
            }),
        );
        expect(next.isCreating).toBe(true);
        expect(next.createTokenProfileSucceeded).toBe(false);

        next = reducer(next, actions.createTokenProfileSuccess({ uuid: 'tp-1', tokenInstanceUuid: 't-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createTokenProfileSucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.createTokenProfileFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createTokenProfileSucceeded).toBe(false);
    });

    test('updateTokenProfile / success / failure', () => {
        let next = reducer(
            initialState,
            actions.updateTokenProfile({
                profileUuid: 'tp-1',
                tokenInstanceUuid: 't-1',
                tokenProfileEditRequest: {} as any,
            }),
        );
        expect(next.isUpdating).toBe(true);
        expect(next.updateTokenProfileSucceeded).toBe(false);

        const profile = { uuid: 'tp-1', name: 'Updated' } as any;
        next = reducer(next, actions.updateTokenProfileSuccess({ tokenProfile: profile }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateTokenProfileSucceeded).toBe(true);
        expect(next.tokenProfile).toEqual(profile);

        next = reducer({ ...next, isUpdating: true }, actions.updateTokenProfileFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateTokenProfileSucceeded).toBe(false);
    });

    test('enableTokenProfile / success updates list and detail / failure', () => {
        const items = [{ uuid: 'tp-1', enabled: false } as any];
        const profile = { uuid: 'tp-1', enabled: false } as any;

        let next = reducer(
            { ...initialState, tokenProfiles: items, tokenProfile: profile },
            actions.enableTokenProfile({ tokenInstanceUuid: 't-1', uuid: 'tp-1' }),
        );
        expect(next.isEnabling).toBe(true);

        next = reducer(next, actions.enableTokenProfileSuccess({ uuid: 'tp-1' }));
        expect(next.isEnabling).toBe(false);
        expect(next.tokenProfiles[0].enabled).toBe(true);
        expect(next.tokenProfile?.enabled).toBe(true);

        next = reducer({ ...next, isEnabling: true }, actions.enableTokenProfileFailure({ error: 'err' }));
        expect(next.isEnabling).toBe(false);
    });

    test('disableTokenProfile / success updates list and detail / failure', () => {
        const items = [{ uuid: 'tp-1', enabled: true } as any];
        const profile = { uuid: 'tp-1', enabled: true } as any;

        let next = reducer(
            { ...initialState, tokenProfiles: items, tokenProfile: profile },
            actions.disableTokenProfile({ tokenInstanceUuid: 't-1', uuid: 'tp-1' }),
        );
        expect(next.isDisabling).toBe(true);

        next = reducer(next, actions.disableTokenProfileSuccess({ uuid: 'tp-1' }));
        expect(next.isDisabling).toBe(false);
        expect(next.tokenProfiles[0].enabled).toBe(false);
        expect(next.tokenProfile?.enabled).toBe(false);

        next = reducer({ ...next, isDisabling: true }, actions.disableTokenProfileFailure({ error: 'err' }));
        expect(next.isDisabling).toBe(false);
    });

    test('deleteTokenProfile / success removes from list and clears detail / failure', () => {
        const items = [{ uuid: 'tp-1' } as any, { uuid: 'tp-2' } as any];
        const profile = { uuid: 'tp-1', name: 'P1' } as any;

        let next = reducer(
            { ...initialState, tokenProfiles: items, tokenProfile: profile },
            actions.deleteTokenProfile({ tokenInstanceUuid: 't-1', uuid: 'tp-1' }),
        );
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteTokenProfileSuccess({ uuid: 'tp-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.tokenProfiles).toEqual([{ uuid: 'tp-2' }]);
        expect(next.tokenProfile).toBeUndefined();

        next = reducer({ ...next, isDeleting: true }, actions.deleteTokenProfileFailure({ error: 'err' }));
        expect(next.isDeleting).toBe(false);
    });

    test('bulkDeleteTokenProfiles / success removes items / failure', () => {
        const items = [{ uuid: 'tp-1' } as any, { uuid: 'tp-2' } as any];

        let next = reducer({ ...initialState, tokenProfiles: items }, actions.bulkDeleteTokenProfiles({ uuids: ['tp-1'] }));
        expect(next.isBulkDeleting).toBe(true);
        expect(next.bulkDeleteErrorMessages).toEqual([]);

        next = reducer(next, actions.bulkDeleteTokenProfilesSuccess({ uuids: ['tp-1'] }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.tokenProfiles).toEqual([{ uuid: 'tp-2' }]);

        next = reducer({ ...next, isBulkDeleting: true }, actions.bulkDeleteTokenProfilesFailure({ error: 'err' }));
        expect(next.isBulkDeleting).toBe(false);
    });

    test('bulkEnableTokenProfiles / success sets enabled / failure', () => {
        const items = [{ uuid: 'tp-1', enabled: false } as any, { uuid: 'tp-2', enabled: false } as any];
        const profile = { uuid: 'tp-1', enabled: false } as any;

        let next = reducer(
            { ...initialState, tokenProfiles: items, tokenProfile: profile },
            actions.bulkEnableTokenProfiles({ uuids: ['tp-1'] }),
        );
        expect(next.isBulkEnabling).toBe(true);

        next = reducer(next, actions.bulkEnableTokenProfilesSuccess({ uuids: ['tp-1'] }));
        expect(next.isBulkEnabling).toBe(false);
        expect(next.tokenProfiles.find((tp) => tp.uuid === 'tp-1')?.enabled).toBe(true);
        expect(next.tokenProfiles.find((tp) => tp.uuid === 'tp-2')?.enabled).toBe(false);
        expect(next.tokenProfile?.enabled).toBe(true);

        next = reducer({ ...next, isBulkEnabling: true }, actions.bulkEnableTokenProfilesFailure({ error: 'err' }));
        expect(next.isBulkEnabling).toBe(false);
    });

    test('bulkDisableTokenProfiles / success sets disabled / failure', () => {
        const items = [{ uuid: 'tp-1', enabled: true } as any, { uuid: 'tp-2', enabled: true } as any];
        const profile = { uuid: 'tp-1', enabled: true } as any;

        let next = reducer(
            { ...initialState, tokenProfiles: items, tokenProfile: profile },
            actions.bulkDisableTokenProfiles({ uuids: ['tp-1'] }),
        );
        expect(next.isBulkDisabling).toBe(true);

        next = reducer(next, actions.bulkDisableTokenProfilesSuccess({ uuids: ['tp-1'] }));
        expect(next.isBulkDisabling).toBe(false);
        expect(next.tokenProfiles.find((tp) => tp.uuid === 'tp-1')?.enabled).toBe(false);
        expect(next.tokenProfiles.find((tp) => tp.uuid === 'tp-2')?.enabled).toBe(true);
        expect(next.tokenProfile?.enabled).toBe(false);

        next = reducer({ ...next, isBulkDisabling: true }, actions.bulkDisableTokenProfilesFailure({ error: 'err' }));
        expect(next.isBulkDisabling).toBe(false);
    });

    test('updateKeyUsage / success / failure', () => {
        const profile = { uuid: 'tp-1', usages: [] } as any;

        let next = reducer(
            { ...initialState, tokenProfile: profile },
            actions.updateKeyUsage({ tokenInstanceUuid: 't-1', uuid: 'tp-1', usage: {} as any }),
        );
        expect(next.isUpdatingKeyUsage).toBe(true);

        const usage = ['sign', 'verify'] as any[];
        next = reducer(next, actions.updateKeyUsageSuccess({ uuid: 'tp-1', usage }));
        expect(next.isUpdatingKeyUsage).toBe(false);
        expect(next.tokenProfile?.usages).toEqual(usage);

        next = reducer({ ...next, isUpdatingKeyUsage: true }, actions.updateKeyUsageFailure({ error: 'err' }));
        expect(next.isUpdatingKeyUsage).toBe(false);
    });

    test('bulkUpdateKeyUsage / success / failure', () => {
        let next = reducer(initialState, actions.bulkUpdateKeyUsage({ usage: {} as any }));
        expect(next.isBulkUpdatingKeyUsage).toBe(true);

        next = reducer(next, actions.bulkUpdateKeyUsageSuccess({}));
        expect(next.isBulkUpdatingKeyUsage).toBe(false);

        next = reducer({ ...next, isBulkUpdatingKeyUsage: true }, actions.bulkUpdateKeyUsageFailure({ error: 'err' }));
        expect(next.isBulkUpdatingKeyUsage).toBe(false);
    });
});

describe('tokenProfiles selectors', () => {
    test('selectors read values from tokenProfiles state', () => {
        const profile = { uuid: 'tp-1' } as any;
        const featureState = {
            ...initialState,
            tokenProfile: profile,
            tokenProfiles: [profile],
            checkedRows: ['tp-1'],
            isFetchingList: true,
            isFetchingDetail: true,
            isCreating: true,
            createTokenProfileSucceeded: true,
            isDeleting: true,
            isBulkDeleting: true,
            isUpdating: true,
            updateTokenProfileSucceeded: true,
            isEnabling: true,
            isBulkEnabling: true,
            isDisabling: true,
            isBulkDisabling: true,
            isUpdatingKeyUsage: true,
            isBulkUpdatingKeyUsage: true,
        };

        const state = { tokenprofiles: featureState } as any;

        expect(selectors.tokenProfile(state)).toEqual(profile);
        expect(selectors.tokenProfiles(state)).toEqual([profile]);
        expect(selectors.checkedRows(state)).toEqual(['tp-1']);
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.createTokenProfileSucceeded(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isBulkDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.updateTokenProfileSucceeded(state)).toBe(true);
        expect(selectors.isEnabling(state)).toBe(true);
        expect(selectors.isBulkEnabling(state)).toBe(true);
        expect(selectors.isDisabling(state)).toBe(true);
        expect(selectors.isBulkDisabling(state)).toBe(true);
        expect(selectors.isUpdatingKeyUsage(state)).toBe(true);
        expect(selectors.isBulkUpdatingKeyUsage(state)).toBe(true);
    });
});
