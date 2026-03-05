import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';
import { SearchRequestModel } from 'types/certificate';
import { SecretDetailDto, SecretDto, SecretUpdateObjectsDto, SecretVersionDto } from 'types/openapi';

export type State = {
    secrets: SecretDto[];
    secret?: SecretDetailDto;
    versions: SecretVersionDto[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingVersions: boolean;

    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isEnabling: boolean;
    isDisabling: boolean;
};

export const initialState: State = {
    secrets: [],
    versions: [],

    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingVersions: false,

    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isEnabling: false,
    isDisabling: false,
};

export const slice = createSlice({
    name: 'secrets',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        clearSecret: (state, action: PayloadAction<void>) => {
            state.secret = undefined;
            state.versions = [];
        },

        listSecrets: (state, action: PayloadAction<SearchRequestModel>) => {
            state.secrets = [];
            state.isFetchingList = true;
        },

        listSecretsSuccess: (state, action: PayloadAction<{ secrets: SecretDto[] }>) => {
            state.secrets = action.payload.secrets;
            state.isFetchingList = false;
        },

        listSecretsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        getSecretDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.secret = undefined;
            state.isFetchingDetail = true;
        },

        getSecretDetailSuccess: (state, action: PayloadAction<{ secret: SecretDetailDto }>) => {
            state.secret = action.payload.secret;
            state.isFetchingDetail = false;
        },

        getSecretDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        getSecretVersions: (state, action: PayloadAction<{ uuid: string }>) => {
            state.versions = [];
            state.isFetchingVersions = true;
        },

        getSecretVersionsSuccess: (state, action: PayloadAction<{ versions: SecretVersionDto[] }>) => {
            state.versions = action.payload.versions;
            state.isFetchingVersions = false;
        },

        getSecretVersionsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingVersions = false;
        },

        createSecret: (state, action: PayloadAction<void>) => {
            state.isCreating = true;
        },

        createSecretSuccess: (state, action: PayloadAction<{ secret: SecretDetailDto }>) => {
            state.isCreating = false;
            state.secret = action.payload.secret;
        },

        createSecretFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        updateSecret: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isUpdating = true;
        },

        updateSecretSuccess: (state, action: PayloadAction<{ secret: SecretDetailDto }>) => {
            state.isUpdating = false;
            state.secret = action.payload.secret;
        },

        updateSecretFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        updateSecretObjects: (state, action: PayloadAction<{ uuid: string; update: SecretUpdateObjectsDto }>) => {
            state.isUpdating = true;
        },

        updateSecretObjectsSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isUpdating = false;
        },

        updateSecretObjectsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        deleteSecret: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
        },

        deleteSecretSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;
            state.secrets = state.secrets.filter((s) => s.uuid !== action.payload.uuid);
            if (state.secret?.uuid === action.payload.uuid) {
                state.secret = undefined;
                state.versions = [];
            }
        },

        deleteSecretFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },

        enableSecret: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        enableSecretSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;
            state.secrets = state.secrets.map((secret) => (secret.uuid === action.payload.uuid ? { ...secret, enabled: true } : secret));
            if (state.secret?.uuid === action.payload.uuid) {
                state.secret = { ...state.secret, enabled: true };
            }
        },

        enableSecretFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableSecret: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = true;
        },

        disableSecretSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDisabling = false;
            state.secrets = state.secrets.map((secret) => (secret.uuid === action.payload.uuid ? { ...secret, enabled: false } : secret));
            if (state.secret?.uuid === action.payload.uuid) {
                state.secret = { ...state.secret, enabled: false };
            }
        },

        disableSecretFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDisabling = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const secrets = createSelector(state, (state) => state.secrets);
const secret = createSelector(state, (state) => state.secret);
const versions = createSelector(state, (state) => state.versions);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isFetchingVersions = createSelector(state, (state) => state.isFetchingVersions);

const isCreating = createSelector(state, (state) => state.isCreating);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isEnabling = createSelector(state, (state) => state.isEnabling);
const isDisabling = createSelector(state, (state) => state.isDisabling);

export const selectors = {
    state,

    secrets,
    secret,
    versions,

    isFetchingList,
    isFetchingDetail,
    isFetchingVersions,

    isCreating,
    isUpdating,
    isDeleting,
    isEnabling,
    isDisabling,
};

export const actions = slice.actions;

export default slice.reducer;
