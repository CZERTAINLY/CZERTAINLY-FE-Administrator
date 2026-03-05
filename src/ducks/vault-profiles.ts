import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VaultProfileDetailDto, VaultProfileDto, VaultProfileRequestDto } from 'types/openapi';
import { SearchRequestModel } from 'types/certificate';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    vaultProfiles: VaultProfileDto[];
    vaultProfile: VaultProfileDetailDto | null;
    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isCreating: boolean;
    isDeleting: boolean;
};

export const initialState: State = {
    vaultProfiles: [],
    vaultProfile: null,
    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
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
    },
});

const state = createFeatureSelector<State>(slice.name);

const vaultProfiles = createSelector(state, (state: State) => state.vaultProfiles);
const vaultProfile = createSelector(state, (state: State) => state.vaultProfile);
const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);

export const selectors = {
    state,
    vaultProfiles,
    vaultProfile,
    isFetchingList,
    isFetchingDetail,
    isCreating,
    isDeleting,
};

export const actions = slice.actions;

export default slice.reducer;
