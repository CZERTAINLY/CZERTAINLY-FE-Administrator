import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CertificateListResponseModel } from 'types/certificate';
import { BulkActionModel } from 'types/connectors';

import {
    // ScepProfileAddRequestModel,
    // ScepProfileEditRequestModel,
    // ScepProfileListResponseModel,
    // ScepProfileResponseModel,
    CmpProfileDetailModel,
    CmpProfileEditRequestModel,
    CmpProfileModel,
    CmpProfileRequestModel,
} from 'types/cmp-profiles';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    checkedRows: string[];

    deleteErrorMessage: string;
    bulkDeleteErrorMessages: BulkActionModel[];

    cmpProfile?: CmpProfileDetailModel;
    cmpProfiles: CmpProfileModel[];
    cmpSigningCertificates?: CertificateListResponseModel[];

    isFetchingList: boolean;
    isFetchingCertificates: boolean;
    isFetchingDetail: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isUpdating: boolean;
    isEnabling: boolean;
    isDisabling: boolean;
    isBulkDeleting: boolean;
    isBulkEnabling: boolean;
    isBulkDisabling: boolean;
    isBulkForceDeleting: boolean;
};

export const initialState: State = {
    checkedRows: [],

    cmpProfiles: [],

    deleteErrorMessage: '',
    bulkDeleteErrorMessages: [],

    isFetchingList: false,
    isFetchingCertificates: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
    isEnabling: false,
    isDisabling: false,
    isBulkDeleting: false,
    isBulkEnabling: false,
    isBulkDisabling: false,
    isBulkForceDeleting: false,
};

export const slice = createSlice({
    name: 'cmpProfiles',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {
            state.checkedRows = action.payload.checkedRows;
        },

        clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {
            state.deleteErrorMessage = '';
            state.bulkDeleteErrorMessages = [];
        },

        resetCmpProfile: (state, action: PayloadAction<void>) => {
            state.cmpProfile = undefined;
        },

        listCmpProfiles: (state, action: PayloadAction<void>) => {
            state.isFetchingList = true;
        },

        listCmpProfilesSuccess: (state, action: PayloadAction<{ cmpProfileList: CmpProfileModel[] }>) => {
            state.cmpProfiles = action.payload.cmpProfileList;
            state.isFetchingList = false;
        },

        listCmpProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        listCmpSigningCertificates: (state, action: PayloadAction<void>) => {
            state.isFetchingCertificates = true;
        },

        listCmpSigningCertificatesSuccess: (state, action: PayloadAction<{ certificates: CertificateListResponseModel[] }>) => {
            state.cmpSigningCertificates = action.payload.certificates;
            state.isFetchingCertificates = false;
        },

        listCmpSigningCertificatesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingCertificates = false;
        },

        getCmpProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingDetail = true;
        },

        getCmpProfileSuccess: (state, action: PayloadAction<{ cmpProfile: CmpProfileDetailModel }>) => {
            state.isFetchingDetail = false;

            state.cmpProfile = action.payload.cmpProfile;

            const cmpProfileIndex = state.cmpProfiles.findIndex((cmpProfile) => cmpProfile.uuid === action.payload.cmpProfile.uuid);
        },

        getCmpProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        createCmpProfile: (state, action: PayloadAction<CmpProfileRequestModel>) => {
            state.isCreating = true;
        },

        createCmpProfileSuccess: (state, action: PayloadAction<void>) => {
            state.isCreating = false;
        },

        createCmpProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        updateCmpProfile: (
            state,
            action: PayloadAction<{
                uuid: string;
                updateCmpRequest: CmpProfileEditRequestModel;
            }>,
        ) => {
            state.isUpdating = true;
        },

        updateCmpProfileSuccess: (state, action: PayloadAction<{ cmpProfile: CmpProfileDetailModel }>) => {
            state.isUpdating = false;
        },

        updateCmpProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        deleteCmpProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
            state.deleteErrorMessage = '';
        },

        deleteCmpProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const profileIndex = state.cmpProfiles.findIndex((profile) => profile.uuid === action.payload.uuid);

            if (profileIndex >= 0) state.cmpProfiles.splice(profileIndex, 1);

            if (state.cmpProfile?.uuid === action.payload.uuid) state.cmpProfile = undefined;
        },

        deleteCmpProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error || 'Unknown error';
        },

        enableCmpProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        enableCmpProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const profileIndex = state.cmpProfiles.findIndex((profile) => profile.uuid === action.payload.uuid);

            if (profileIndex >= 0) state.cmpProfiles[profileIndex].enabled = true;

            if (state.cmpProfile?.uuid === action.payload.uuid) state.cmpProfile.enabled = true;
        },

        enableCmpProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableCmpProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = true;
        },

        disableCmpProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = false;

            const profileIndex = state.cmpProfiles.findIndex((profile) => profile.uuid === action.payload.uuid);

            if (profileIndex >= 0) state.cmpProfiles[profileIndex].enabled = false;

            if (state.cmpProfile?.uuid === action.payload.uuid) state.cmpProfile.enabled = false;
        },

        disableCmpProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisabling = false;
        },

        bulkDeleteCmpProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.bulkDeleteErrorMessages = [];

            state.isBulkDeleting = true;
        },

        bulkDeleteCmpProfilesSuccess: (state, action: PayloadAction<{ uuids: string[]; errors: BulkActionModel[] }>) => {
            state.isBulkDeleting = false;
            if (action.payload.errors?.length > 0) {
                state.bulkDeleteErrorMessages = action.payload.errors;
                return;
            }

            action.payload.uuids.forEach((uuid) => {
                const profileIndex = state.cmpProfiles.findIndex((profile) => profile.uuid === uuid);
                if (profileIndex >= 0) state.cmpProfiles.splice(profileIndex, 1);
            });

            if (state.cmpProfile && action.payload.uuids.includes(state.cmpProfile.uuid)) state.cmpProfile = undefined;
        },

        bulkDeleteCmpProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },

        bulkForceDeleteCmpProfiles: (state, action: PayloadAction<{ uuids: string[]; redirect?: string }>) => {
            state.isBulkForceDeleting = true;
        },

        bulkForceDeleteCmpProfilesSuccess: (state, action: PayloadAction<{ uuids: string[]; redirect?: string }>) => {
            state.isBulkForceDeleting = false;

            action.payload.uuids.forEach((uuid) => {
                const profileIndex = state.cmpProfiles.findIndex((profile) => profile.uuid === uuid);
                if (profileIndex >= 0) state.cmpProfiles.splice(profileIndex, 1);
            });

            if (state.cmpProfile && action.payload.uuids.includes(state.cmpProfile.uuid)) state.cmpProfile = undefined;
        },

        bulkForceDeleteCmpProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkForceDeleting = false;
        },

        bulkEnableCmpProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = true;
        },

        bulkEnableCmpProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkEnabling = false;

            action.payload.uuids.forEach((uuid) => {
                const profileIndex = state.cmpProfiles.findIndex((profile) => profile.uuid === uuid);
                if (profileIndex >= 0) state.cmpProfiles[profileIndex].enabled = true;
            });

            if (state.cmpProfile && action.payload.uuids.includes(state.cmpProfile.uuid)) state.cmpProfile.enabled = true;
        },

        bulkEnableCmpProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkEnabling = false;
        },

        bulkDisableCmpProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = true;
        },

        bulkDisableCmpProfilesSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDisabling = false;

            action.payload.uuids.forEach((uuid) => {
                const profileIndex = state.cmpProfiles.findIndex((profile) => profile.uuid === uuid);
                if (profileIndex >= 0) state.cmpProfiles[profileIndex].enabled = false;
            });

            if (state.cmpProfile && action.payload.uuids.includes(state.cmpProfile.uuid)) state.cmpProfile.enabled = false;
        },

        bulkDisableCmpProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDisabling = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const cmpProfile = createSelector(state, (state) => state.cmpProfile);
const cmpProfiles = createSelector(state, (state) => state.cmpProfiles);
const cmpSigningCertificates = createSelector(state, (state) => state.cmpSigningCertificates);

const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, (state) => state.bulkDeleteErrorMessages);

const checkedRows = createSelector(state, (state) => state.checkedRows);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingCertificates = createSelector(state, (state) => state.isFetchingCertificates);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isEnabling = createSelector(state, (state) => state.isEnabling);
const isDisabling = createSelector(state, (state) => state.isDisabling);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);
const isBulkEnabling = createSelector(state, (state) => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, (state) => state.isBulkDisabling);
const isBulkForceDeleting = createSelector(state, (state) => state.isBulkForceDeleting);

export const selectors = {
    state,

    checkedRows,

    deleteErrorMessage,
    bulkDeleteErrorMessages,

    cmpProfile,
    cmpProfiles,
    cmpSigningCertificates,

    isFetchingList,
    isFetchingCertificates,
    isFetchingDetail,
    isCreating,
    isDeleting,
    isUpdating,
    isEnabling,
    isDisabling,
    isBulkDeleting,
    isBulkEnabling,
    isBulkDisabling,
    isBulkForceDeleting,
};

export const actions = slice.actions;

export default slice.reducer;
