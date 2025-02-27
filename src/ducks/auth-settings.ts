import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AuthenticationSettingsModel,
    AuthenticationSettingsUpdateModel,
    OAuth2ProviderSettingsModel,
    OAuth2ProviderSettingsUpdateModel,
} from 'types/auth-settings';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    authenticationSettings?: AuthenticationSettingsModel;
    oauth2Provider?: OAuth2ProviderSettingsModel;

    isFetchingSettings: boolean;
    isFetchingProvider: boolean;
    isUpdatingSettings: boolean;
    isUpdatingProvider: boolean;
    isRemovingProvider: boolean;
};

export const initialState: State = {
    isFetchingSettings: false,
    isFetchingProvider: false,
    isUpdatingSettings: false,
    isUpdatingProvider: false,
    isRemovingProvider: false,
};

export const slice = createSlice({
    name: 'authSettings',

    initialState,

    reducers: {
        getAuthenticationSettings: (state, action: PayloadAction<void>) => {
            state.isFetchingSettings = true;
        },

        getAuthenticationSettingsSuccess: (state, action: PayloadAction<{ settings: AuthenticationSettingsModel }>) => {
            state.authenticationSettings = action.payload.settings;
            state.isFetchingSettings = false;
        },

        getAuthenticationSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingSettings = false;
        },

        updateAuthenticationSettings: (
            state,
            action: PayloadAction<{ authenticationSettingsUpdateModel: AuthenticationSettingsUpdateModel }>,
        ) => {
            state.isUpdatingSettings = true;
        },

        updateAuthenticationSettingsSuccess: (state, action: PayloadAction<void>) => {
            state.isUpdatingSettings = false;
        },

        updateAuthenticationSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingSettings = false;
        },

        getOAuth2ProviderSettings: (state, action: PayloadAction<{ providerName: string }>) => {
            state.isFetchingProvider = true;
        },

        getOAuth2ProviderSettingsSuccess: (state, action: PayloadAction<{ oauth2Provider: OAuth2ProviderSettingsModel }>) => {
            state.oauth2Provider = action.payload.oauth2Provider;
            state.isFetchingProvider = false;
        },

        getOAuth2ProviderSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingProvider = false;
        },

        removeOAuth2Provider: (state, action: PayloadAction<{ providerName: string }>) => {
            state.isRemovingProvider = true;
        },

        removeOAuth2ProviderSuccess: (state, action: PayloadAction<void>) => {
            state.isRemovingProvider = false;
        },

        removeOAuth2ProviderFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isRemovingProvider = false;
        },

        updateOAuth2ProviderSettings: (
            state,
            action: PayloadAction<{ providerName: string; oAuth2ProviderSettingsUpdateModel: OAuth2ProviderSettingsUpdateModel }>,
        ) => {
            state.isUpdatingProvider = true;
        },

        updateOAuth2ProviderSettingsSuccess: (state, action: PayloadAction<void>) => {
            state.isUpdatingProvider = false;
        },

        updateOAuth2ProviderSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingProvider = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const authenticationSettings = createSelector(state, (state) => state.authenticationSettings);
const oauth2Provider = createSelector(state, (state) => state.oauth2Provider);

const isFetchingSettings = createSelector(state, (state) => state.isFetchingSettings);
const isFetchingProviders = createSelector(state, (state) => state.isFetchingProvider);
const isUpdatingSettings = createSelector(state, (state) => state.isUpdatingSettings);
const isUpdatingProvider = createSelector(state, (state) => state.isUpdatingProvider);
const isRemovingProvider = createSelector(state, (state) => state.isRemovingProvider);

export const selectors = {
    state,
    authenticationSettings,
    oauth2Provider,

    isFetchingSettings,
    isFetchingProviders,
    isUpdatingSettings,
    isUpdatingProvider,
    isRemovingProvider,
};

export const actions = slice.actions;

export default slice.reducer;
