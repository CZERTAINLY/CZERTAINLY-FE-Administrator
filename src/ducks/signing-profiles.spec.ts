import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './signing-profiles';

describe('signingProfiles slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            signingProfile: { uuid: 'p-1' } as any,
            signingProfiles: [{ uuid: 'p-1' } as any],
            isFetchingList: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('setCheckedRows updates checkedRows', () => {
        const next = reducer(initialState, actions.setCheckedRows({ checkedRows: ['p-1', 'p-2'] }));
        expect(next.checkedRows).toEqual(['p-1', 'p-2']);
    });

    test('clearDeleteErrorMessages clears error fields', () => {
        const next = reducer(
            { ...initialState, deleteErrorMessage: 'some error', bulkDeleteErrorMessages: [{ message: 'err' } as any] },
            actions.clearDeleteErrorMessages(),
        );
        expect(next.deleteErrorMessage).toBe('');
        expect(next.bulkDeleteErrorMessages).toEqual([]);
    });

    test('listSigningProfiles sets isFetchingList', () => {
        const next = reducer(initialState, actions.listSigningProfiles());
        expect(next.isFetchingList).toBe(true);
    });

    test('listSigningProfilesSuccess updates list and totalItems', () => {
        const profiles = [{ uuid: 'p-1' }] as any[];
        const next = reducer(
            { ...initialState, isFetchingList: true },
            actions.listSigningProfilesSuccess({ signingProfiles: profiles, totalItems: 1 }),
        );
        expect(next.isFetchingList).toBe(false);
        expect(next.signingProfiles).toEqual(profiles);
        expect(next.signingProfilesTotalItems).toBe(1);
    });

    test('listSigningProfilesFailure clears isFetchingList', () => {
        const next = reducer({ ...initialState, isFetchingList: true }, actions.listSigningProfilesFailure({ error: 'err' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('getSigningProfile sets isFetchingDetail', () => {
        const next = reducer(initialState, actions.getSigningProfile({ uuid: 'p-1' }));
        expect(next.isFetchingDetail).toBe(true);
    });

    test('getSigningProfileSuccess sets profile detail', () => {
        const profile = { uuid: 'p-1', name: 'Profile 1' } as any;
        const next = reducer({ ...initialState, isFetchingDetail: true }, actions.getSigningProfileSuccess({ signingProfile: profile }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.signingProfile).toEqual(profile);
    });

    test('getSigningProfileFailure clears isFetchingDetail', () => {
        const next = reducer({ ...initialState, isFetchingDetail: true }, actions.getSigningProfileFailure({ error: 'err' }));
        expect(next.isFetchingDetail).toBe(false);
    });

    test('listSigningProfileSearchableFields sets isFetchingSearchableFields', () => {
        const next = reducer(initialState, actions.listSigningProfileSearchableFields());
        expect(next.isFetchingSearchableFields).toBe(true);
    });

    test('listSigningProfileSearchableFieldsSuccess sets fields', () => {
        const fields = [{ searchGroupEnum: 'grp' }] as any[];
        const next = reducer(
            { ...initialState, isFetchingSearchableFields: true },
            actions.listSigningProfileSearchableFieldsSuccess({ searchableFields: fields }),
        );
        expect(next.isFetchingSearchableFields).toBe(false);
        expect(next.searchableFields).toEqual(fields);
    });

    test('listSigningProfileSearchableFieldsFailure clears flag', () => {
        const next = reducer(
            { ...initialState, isFetchingSearchableFields: true },
            actions.listSigningProfileSearchableFieldsFailure({ error: 'err' }),
        );
        expect(next.isFetchingSearchableFields).toBe(false);
    });

    test('createSigningProfile sets isCreating', () => {
        const next = reducer(initialState, actions.createSigningProfile({ signingProfileRequestDto: {} as any }));
        expect(next.isCreating).toBe(true);
    });

    test('createSigningProfileSuccess clears isCreating', () => {
        const next = reducer(
            { ...initialState, isCreating: true },
            actions.createSigningProfileSuccess({ signingProfile: { uuid: 'p-1' } as any }),
        );
        expect(next.isCreating).toBe(false);
    });

    test('createSigningProfileFailure clears isCreating', () => {
        const next = reducer({ ...initialState, isCreating: true }, actions.createSigningProfileFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
    });

    test('updateSigningProfile sets isUpdating', () => {
        const next = reducer(initialState, actions.updateSigningProfile({ uuid: 'p-1', signingProfileRequestDto: {} as any }));
        expect(next.isUpdating).toBe(true);
    });

    test('updateSigningProfileSuccess updates detail', () => {
        const updated = { uuid: 'p-1', name: 'Updated' } as any;
        const next = reducer({ ...initialState, isUpdating: true }, actions.updateSigningProfileSuccess({ signingProfile: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.signingProfile).toEqual(updated);
    });

    test('updateSigningProfileFailure clears isUpdating', () => {
        const next = reducer({ ...initialState, isUpdating: true }, actions.updateSigningProfileFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
    });

    test('deleteSigningProfile sets isDeleting and clears deleteErrorMessage', () => {
        const next = reducer({ ...initialState, deleteErrorMessage: 'old error' }, actions.deleteSigningProfile({ uuid: 'p-1' }));
        expect(next.isDeleting).toBe(true);
        expect(next.deleteErrorMessage).toBe('');
    });

    test('deleteSigningProfileSuccess removes from list and clears detail', () => {
        const profile = { uuid: 'p-1' } as any;
        const state = { ...initialState, isDeleting: true, signingProfile: profile, signingProfiles: [profile] };
        const next = reducer(state, actions.deleteSigningProfileSuccess({ uuid: 'p-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.signingProfiles).toHaveLength(0);
        expect(next.signingProfile).toBeUndefined();
    });

    test('deleteSigningProfileFailure sets deleteErrorMessage', () => {
        const next = reducer({ ...initialState, isDeleting: true }, actions.deleteSigningProfileFailure({ error: 'delete failed' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('delete failed');
    });

    test('enableSigningProfileSuccess sets enabled=true in list and detail', () => {
        const profile = { uuid: 'p-1', enabled: false } as any;
        const state = { ...initialState, isEnabling: true, signingProfile: profile, signingProfiles: [{ ...profile }] };
        const next = reducer(state, actions.enableSigningProfileSuccess({ uuid: 'p-1' }));
        expect(next.isEnabling).toBe(false);
        expect(next.signingProfiles[0].enabled).toBe(true);
        expect(next.signingProfile?.enabled).toBe(true);
    });

    test('disableSigningProfileSuccess sets enabled=false in list and detail', () => {
        const profile = { uuid: 'p-1', enabled: true } as any;
        const state = { ...initialState, isDisabling: true, signingProfile: profile, signingProfiles: [{ ...profile }] };
        const next = reducer(state, actions.disableSigningProfileSuccess({ uuid: 'p-1' }));
        expect(next.isDisabling).toBe(false);
        expect(next.signingProfiles[0].enabled).toBe(false);
        expect(next.signingProfile?.enabled).toBe(false);
    });

    test('bulkDeleteSigningProfiles sets isBulkDeleting and clears errors', () => {
        const next = reducer(
            { ...initialState, bulkDeleteErrorMessages: [{ message: 'err' } as any] },
            actions.bulkDeleteSigningProfiles({ uuids: ['p-1'] }),
        );
        expect(next.isBulkDeleting).toBe(true);
        expect(next.bulkDeleteErrorMessages).toEqual([]);
    });

    test('bulkDeleteSigningProfilesSuccess removes items from list', () => {
        const profiles = [{ uuid: 'p-1' }, { uuid: 'p-2' }] as any[];
        const state = { ...initialState, isBulkDeleting: true, signingProfiles: profiles };
        const next = reducer(state, actions.bulkDeleteSigningProfilesSuccess({ uuids: ['p-1'], errors: [] }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.signingProfiles).toHaveLength(1);
        expect(next.signingProfiles[0].uuid).toBe('p-2');
    });

    test('bulkDeleteSigningProfilesSuccess with errors sets bulkDeleteErrorMessages', () => {
        const errors = [{ message: 'err', uuid: 'p-1', name: 'Profile 1' }] as any[];
        const profiles = [{ uuid: 'p-1' }] as any[];
        const state = { ...initialState, isBulkDeleting: true, signingProfiles: profiles };
        const next = reducer(state, actions.bulkDeleteSigningProfilesSuccess({ uuids: ['p-1'], errors }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.bulkDeleteErrorMessages).toEqual(errors);
        expect(next.signingProfiles).toHaveLength(1);
    });

    test('bulkEnableSigningProfilesSuccess sets enabled=true for matching uuids', () => {
        const profiles = [
            { uuid: 'p-1', enabled: false },
            { uuid: 'p-2', enabled: false },
        ] as any[];
        const state = { ...initialState, isBulkEnabling: true, signingProfiles: profiles };
        const next = reducer(state, actions.bulkEnableSigningProfilesSuccess({ uuids: ['p-1'] }));
        expect(next.isBulkEnabling).toBe(false);
        expect(next.signingProfiles[0].enabled).toBe(true);
        expect(next.signingProfiles[1].enabled).toBe(false);
    });

    test('bulkDisableSigningProfilesSuccess sets enabled=false for matching uuids', () => {
        const profiles = [
            { uuid: 'p-1', enabled: true },
            { uuid: 'p-2', enabled: true },
        ] as any[];
        const state = { ...initialState, isBulkDisabling: true, signingProfiles: profiles };
        const next = reducer(state, actions.bulkDisableSigningProfilesSuccess({ uuids: ['p-1'] }));
        expect(next.isBulkDisabling).toBe(false);
        expect(next.signingProfiles[0].enabled).toBe(false);
        expect(next.signingProfiles[1].enabled).toBe(true);
    });

    test('activateIlmSigningProtocol sets isActivatingIlm', () => {
        const next = reducer(
            initialState,
            actions.activateIlmSigningProtocol({
                signingProfileUuid: 'p-1',
                ilmSigningProtocolConfigurationUuid: 'ilm-1',
            }),
        );
        expect(next.isActivatingIlm).toBe(true);
    });

    test('activateIlmSigningProtocolSuccess sets ilmActivationDetails', () => {
        const details = { uuid: 'ilm-1' } as any;
        const next = reducer(
            { ...initialState, isActivatingIlm: true },
            actions.activateIlmSigningProtocolSuccess({ ilmActivationDetails: details }),
        );
        expect(next.isActivatingIlm).toBe(false);
        expect(next.ilmActivationDetails).toEqual(details);
    });

    test('deactivateIlmSigningProtocolSuccess clears ilmActivationDetails', () => {
        const details = { uuid: 'ilm-1' } as any;
        const next = reducer(
            { ...initialState, isDeactivatingIlm: true, ilmActivationDetails: details },
            actions.deactivateIlmSigningProtocolSuccess({ uuid: 'p-1' }),
        );
        expect(next.isDeactivatingIlm).toBe(false);
        expect(next.ilmActivationDetails).toBeUndefined();
    });

    test('getIlmSigningProtocolActivationDetailsSuccess sets ilmActivationDetails', () => {
        const details = { uuid: 'ilm-1' } as any;
        const next = reducer(
            { ...initialState, isFetchingIlmActivationDetails: true },
            actions.getIlmSigningProtocolActivationDetailsSuccess({ ilmActivationDetails: details }),
        );
        expect(next.isFetchingIlmActivationDetails).toBe(false);
        expect(next.ilmActivationDetails).toEqual(details);
    });

    test('activateTsp sets isActivatingTsp', () => {
        const next = reducer(initialState, actions.activateTsp({ signingProfileUuid: 'p-1', tspConfigurationUuid: 'tsp-1' }));
        expect(next.isActivatingTsp).toBe(true);
    });

    test('activateTspSuccess sets tspActivationDetails', () => {
        const details = { uuid: 'tsp-1' } as any;
        const next = reducer({ ...initialState, isActivatingTsp: true }, actions.activateTspSuccess({ tspActivationDetails: details }));
        expect(next.isActivatingTsp).toBe(false);
        expect(next.tspActivationDetails).toEqual(details);
    });

    test('deactivateTspSuccess clears tspActivationDetails', () => {
        const details = { uuid: 'tsp-1' } as any;
        const next = reducer(
            { ...initialState, isDeactivatingTsp: true, tspActivationDetails: details },
            actions.deactivateTspSuccess({ uuid: 'p-1' }),
        );
        expect(next.isDeactivatingTsp).toBe(false);
        expect(next.tspActivationDetails).toBeUndefined();
    });

    test('getTspActivationDetailsSuccess sets tspActivationDetails', () => {
        const details = { uuid: 'tsp-1' } as any;
        const next = reducer(
            { ...initialState, isFetchingTspActivationDetails: true },
            actions.getTspActivationDetailsSuccess({ tspActivationDetails: details }),
        );
        expect(next.isFetchingTspActivationDetails).toBe(false);
        expect(next.tspActivationDetails).toEqual(details);
    });

    test('getAssociatedApprovalProfilesSuccess sets associatedApprovalProfiles', () => {
        const profiles = [{ uuid: 'ap-1' }] as any[];
        const next = reducer(
            { ...initialState, isFetchingAssociatedApprovalProfiles: true },
            actions.getAssociatedApprovalProfilesSuccess({ approvalProfiles: profiles }),
        );
        expect(next.isFetchingAssociatedApprovalProfiles).toBe(false);
        expect(next.associatedApprovalProfiles).toEqual(profiles);
    });

    test('disassociateFromApprovalProfileSuccess removes from associatedApprovalProfiles', () => {
        const profiles = [{ uuid: 'ap-1' }, { uuid: 'ap-2' }] as any[];
        const state = { ...initialState, isDisassociatingApprovalProfile: true, associatedApprovalProfiles: profiles };
        const next = reducer(
            state,
            actions.disassociateFromApprovalProfileSuccess({ signingProfileUuid: 'p-1', approvalProfileUuid: 'ap-1' }),
        );
        expect(next.isDisassociatingApprovalProfile).toBe(false);
        expect(next.associatedApprovalProfiles).toHaveLength(1);
        expect(next.associatedApprovalProfiles[0].uuid).toBe('ap-2');
    });

    test('listSupportedProtocolsSuccess sets supportedProtocols', () => {
        const protocols = ['ILM', 'TSP'] as any[];
        const next = reducer(
            { ...initialState, isFetchingSupportedProtocols: true },
            actions.listSupportedProtocolsSuccess({ supportedProtocols: protocols }),
        );
        expect(next.isFetchingSupportedProtocols).toBe(false);
        expect(next.supportedProtocols).toEqual(protocols);
    });

    test('listDigitalSignaturesForSigningProfileSuccess sets digitalSignatures', () => {
        const sigs = { items: [{ uuid: 'ds-1' }], totalItems: 1 } as any;
        const next = reducer(
            { ...initialState, isFetchingDigitalSignatures: true },
            actions.listDigitalSignaturesForSigningProfileSuccess({ digitalSignatures: sigs }),
        );
        expect(next.isFetchingDigitalSignatures).toBe(false);
        expect(next.digitalSignatures).toEqual(sigs);
    });
});

describe('signingProfiles selectors', () => {
    test('selectors read all values from state', () => {
        const profile = { uuid: 'p-1' } as any;
        const profiles = [profile];
        const approvalProfiles = [{ uuid: 'ap-1' }] as any[];
        const ilmDetails = { uuid: 'ilm-1' } as any;
        const tspDetails = { uuid: 'tsp-1' } as any;
        const protocols = ['ILM'] as any[];
        const digitalSigs = { items: [], totalItems: 0 } as any;
        const fields = [{ searchGroupEnum: 'g-1' }] as any[];
        const bulkErrors = [{ message: 'err' }] as any[];

        const featureState = {
            ...initialState,
            signingProfile: profile,
            signingProfiles: profiles,
            signingProfilesTotalItems: 5,
            associatedApprovalProfiles: approvalProfiles,
            ilmActivationDetails: ilmDetails,
            tspActivationDetails: tspDetails,
            supportedProtocols: protocols,
            digitalSignatures: digitalSigs,
            searchableFields: fields,
            checkedRows: ['p-1'],
            deleteErrorMessage: 'del err',
            bulkDeleteErrorMessages: bulkErrors,
            isFetchingList: true,
            isFetchingDetail: true,
            isFetchingSearchableFields: true,
            isFetchingAssociatedApprovalProfiles: true,
            isFetchingIlmActivationDetails: true,
            isFetchingTspActivationDetails: true,
            isFetchingSupportedProtocols: true,
            isFetchingDigitalSignatures: true,
            isCreating: true,
            isDeleting: true,
            isUpdating: true,
            isEnabling: true,
            isDisabling: true,
            isBulkDeleting: true,
            isBulkEnabling: true,
            isBulkDisabling: true,
            isActivatingIlm: true,
            isDeactivatingIlm: true,
            isActivatingTsp: true,
            isDeactivatingTsp: true,
            isAssociatingApprovalProfile: true,
            isDisassociatingApprovalProfile: true,
        };

        const state = { signingProfiles: featureState } as any;

        expect(selectors.signingProfile(state)).toEqual(profile);
        expect(selectors.signingProfiles(state)).toEqual(profiles);
        expect(selectors.signingProfilesTotalItems(state)).toBe(5);
        expect(selectors.associatedApprovalProfiles(state)).toEqual(approvalProfiles);
        expect(selectors.ilmActivationDetails(state)).toEqual(ilmDetails);
        expect(selectors.tspActivationDetails(state)).toEqual(tspDetails);
        expect(selectors.supportedProtocols(state)).toEqual(protocols);
        expect(selectors.digitalSignatures(state)).toEqual(digitalSigs);
        expect(selectors.searchableFields(state)).toEqual(fields);
        expect(selectors.checkedRows(state)).toEqual(['p-1']);
        expect(selectors.deleteErrorMessage(state)).toBe('del err');
        expect(selectors.bulkDeleteErrorMessages(state)).toEqual(bulkErrors);
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isFetchingSearchableFields(state)).toBe(true);
        expect(selectors.isFetchingAssociatedApprovalProfiles(state)).toBe(true);
        expect(selectors.isFetchingIlmActivationDetails(state)).toBe(true);
        expect(selectors.isFetchingTspActivationDetails(state)).toBe(true);
        expect(selectors.isFetchingSupportedProtocols(state)).toBe(true);
        expect(selectors.isFetchingDigitalSignatures(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.isEnabling(state)).toBe(true);
        expect(selectors.isDisabling(state)).toBe(true);
        expect(selectors.isBulkDeleting(state)).toBe(true);
        expect(selectors.isBulkEnabling(state)).toBe(true);
        expect(selectors.isBulkDisabling(state)).toBe(true);
        expect(selectors.isActivatingIlm(state)).toBe(true);
        expect(selectors.isDeactivatingIlm(state)).toBe(true);
        expect(selectors.isActivatingTsp(state)).toBe(true);
        expect(selectors.isDeactivatingTsp(state)).toBe(true);
        expect(selectors.isAssociatingApprovalProfile(state)).toBe(true);
        expect(selectors.isDisassociatingApprovalProfile(state)).toBe(true);
    });
});
