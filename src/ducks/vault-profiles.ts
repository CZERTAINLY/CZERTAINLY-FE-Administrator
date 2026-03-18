import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VaultProfileDetailDto, VaultProfileDto, VaultProfileRequestDto, VaultProfileUpdateRequestDto } from 'types/openapi';
import { SearchRequestModel } from 'types/certificate';
import type { AttributeDescriptorModel } from 'types/attributes';

export type State = {
    vaultProfiles: VaultProfileDto[];
    vaultProfile: VaultProfileDetailDto | null;

    vaultProfileAttributeDescriptors: AttributeDescriptorModel[];
    vaultProfileAttributesVaultUuid: string | null;
    isFetchingVaultProfileAttributes: boolean;

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isEnabling: boolean;
    isDisabling: boolean;
    isUpdating: boolean;
};

export const initialState: State = {
    vaultProfiles: [],
    vaultProfile: null,

    vaultProfileAttributeDescriptors: [],
    vaultProfileAttributesVaultUuid: null,
    isFetchingVaultProfileAttributes: false,

    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isEnabling: false,
    isDisabling: false,
    isUpdating: false,
};

export const slice = createSlice({
    name: 'vaultProfiles',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        getVaultProfileAttributes: (state, action: PayloadAction<{ vaultUuid: string }>) => {
            state.isFetchingVaultProfileAttributes = true;
            state.vaultProfileAttributeDescriptors = [];
            state.vaultProfileAttributesVaultUuid = action.payload.vaultUuid;
        },

        getVaultProfileAttributesSuccess: (state, action: PayloadAction<{ vaultUuid: string; attributes: AttributeDescriptorModel[] }>) => {
            if (state.vaultProfileAttributesVaultUuid === action.payload.vaultUuid) {
                state.vaultProfileAttributeDescriptors = action.payload.attributes as typeof state.vaultProfileAttributeDescriptors;
                state.vaultProfileAttributesVaultUuid = action.payload.vaultUuid;
                state.isFetchingVaultProfileAttributes = false;
            }
        },

        getVaultProfileAttributesFailure: (state, action: PayloadAction<{ vaultUuid: string }>) => {
            if (state.vaultProfileAttributesVaultUuid === action.payload.vaultUuid) {
                state.vaultProfileAttributeDescriptors = [];
                state.vaultProfileAttributesVaultUuid = null;
                state.isFetchingVaultProfileAttributes = false;
            }
        },

        listVaultProfiles: (state, _action: PayloadAction<SearchRequestModel | undefined>) => {
            state.vaultProfiles = [];
            state.isFetchingList = true;
        },

        listVaultProfilesSuccess: (state, action: PayloadAction<{ items: VaultProfileDto[] }>) => {
            state.vaultProfiles = action.payload.items;
            state.isFetchingList = false;
        },

        listVaultProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        createVaultProfile: (
            state,
            action: PayloadAction<{
                vaultUuid: string;
                request: VaultProfileRequestDto;
            }>,
        ) => {
            state.isCreating = true;
        },

        createVaultProfileSuccess: (state, action: PayloadAction<{ profile: VaultProfileDto }>) => {
            state.isCreating = false;
            state.vaultProfiles.push(action.payload.profile);
        },

        createVaultProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        deleteVaultProfile: (
            state,
            action: PayloadAction<{
                vaultUuid: string;
                vaultProfileUuid: string;
            }>,
        ) => {
            state.isDeleting = true;
        },

        deleteVaultProfileSuccess: (state, action: PayloadAction<{ vaultProfileUuid: string }>) => {
            state.isDeleting = false;
            state.vaultProfiles = state.vaultProfiles.filter((p) => p.uuid !== action.payload.vaultProfileUuid);
        },

        deleteVaultProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },

        getVaultProfileDetail: (state, _action: PayloadAction<{ vaultUuid: string; vaultProfileUuid: string }>) => {
            state.vaultProfile = null;
            state.isFetchingDetail = true;
        },

        getVaultProfileDetailSuccess: (state, action: PayloadAction<{ profile: VaultProfileDetailDto }>) => {
            state.vaultProfile = action.payload.profile;
            state.isFetchingDetail = false;
        },

        getVaultProfileDetailFailure: (state, _action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        enableVaultProfile: (state, _action: PayloadAction<{ vaultUuid: string; vaultProfileUuid: string }>) => {
            state.isEnabling = true;
        },

        enableVaultProfileSuccess: (state, action: PayloadAction<{ profile: VaultProfileDetailDto }>) => {
            state.isEnabling = false;
            if (state.vaultProfile?.uuid === action.payload.profile.uuid) {
                state.vaultProfile = action.payload.profile;
            }
        },

        enableVaultProfileFailure: (state, _action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableVaultProfile: (state, _action: PayloadAction<{ vaultUuid: string; vaultProfileUuid: string }>) => {
            state.isDisabling = true;
        },

        disableVaultProfileSuccess: (state, action: PayloadAction<{ profile: VaultProfileDetailDto }>) => {
            state.isDisabling = false;
            if (state.vaultProfile?.uuid === action.payload.profile.uuid) {
                state.vaultProfile = action.payload.profile;
            }
        },

        disableVaultProfileFailure: (state, _action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisabling = false;
        },

        updateVaultProfile: (
            state,
            _action: PayloadAction<{
                vaultUuid: string;
                vaultProfileUuid: string;
                request: VaultProfileUpdateRequestDto;
            }>,
        ) => {
            state.isUpdating = true;
        },

        updateVaultProfileSuccess: (state, action: PayloadAction<{ profile: VaultProfileDetailDto }>) => {
            state.isUpdating = false;
            if (state.vaultProfile?.uuid === action.payload.profile.uuid) {
                state.vaultProfile = action.payload.profile;
            }
        },

        updateVaultProfileFailure: (state, _action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },
    },
});

const state = (reduxStore: any): State => reduxStore?.[slice.name];

const vaultProfiles = createSelector(state, (state: State) => state.vaultProfiles);
const vaultProfile = createSelector(state, (state: State) => state.vaultProfile);
const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isEnabling = createSelector(state, (state: State) => state.isEnabling);
const isDisabling = createSelector(state, (state: State) => state.isDisabling);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);

const vaultProfileAttributeDescriptors = createSelector(state, (state: State) => state.vaultProfileAttributeDescriptors);
const vaultProfileAttributesVaultUuid = createSelector(state, (state: State) => state.vaultProfileAttributesVaultUuid);
const isFetchingVaultProfileAttributes = createSelector(state, (state: State) => state.isFetchingVaultProfileAttributes);

export const selectors = {
    state,
    vaultProfiles,
    vaultProfile,
    isFetchingList,
    isFetchingDetail,
    isCreating,
    isDeleting,
    isEnabling,
    isDisabling,
    isUpdating,
    vaultProfileAttributeDescriptors,
    vaultProfileAttributesVaultUuid,
    isFetchingVaultProfileAttributes,
};

export const actions = slice.actions;

export default slice.reducer;
