import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AuthenticationSettingsModel,
    AuthenticationSettingsUpdateModel,
    OAuth2ProviderSettingsResponseModel,
    OAuth2ProviderSettingsUpdateModel,
} from 'types/auth-settings';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    authenticationSettings?: AuthenticationSettingsModel;
    oauth2Provider?: OAuth2ProviderSettingsResponseModel;

    isFetchingSettings: boolean;
    isFetchingProvider: boolean;
    isUpdatingSettings: boolean;
    isUpdatingProvider: boolean;
    isRemovingProvider: boolean;
    isCreatingProvider: boolean;
};

export const initialState: State = {
    isFetchingSettings: false,
    isFetchingProvider: false,
    isUpdatingSettings: false,
    isUpdatingProvider: false,
    isRemovingProvider: false,
    isCreatingProvider: false,
};

export const slice = createSlice({
    name: 'authSettings',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as Partial<State>)[key as keyof State] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as Partial<State>)[key as keyof State] = (initialState as any)[key]));
        },

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

        updateAuthenticationSettingsSuccess: (
            state,
            action: PayloadAction<{ authenticationSettingsUpdateModel: AuthenticationSettingsUpdateModel }>,
        ) => {
            if (!state.authenticationSettings) return;
            const authenticationSettings: AuthenticationSettingsModel = {
                ...state.authenticationSettings,
            };

            for (const provider of action.payload.authenticationSettingsUpdateModel?.oauth2Providers || []) {
                if (!authenticationSettings.oauth2Providers) {
                    authenticationSettings.oauth2Providers = {};
                }
                authenticationSettings.oauth2Providers[provider.name] = provider;
            }
            delete action.payload.authenticationSettingsUpdateModel.oauth2Providers;

            Object.assign(authenticationSettings, action.payload.authenticationSettingsUpdateModel);

            state.authenticationSettings = authenticationSettings;
            state.isUpdatingSettings = false;
        },

        updateAuthenticationSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingSettings = false;
        },

        resetOAuth2ProviderSettings: (state, action: PayloadAction<void>) => {
            state.oauth2Provider = undefined;
        },
        getOAuth2ProviderSettings: (state, action: PayloadAction<{ providerName: string }>) => {
            state.isFetchingProvider = true;
        },

        getOAuth2ProviderSettingsSuccess: (state, action: PayloadAction<{ oauth2Provider: OAuth2ProviderSettingsResponseModel }>) => {
            state.oauth2Provider = action.payload.oauth2Provider;
            state.isFetchingProvider = false;
        },

        getOAuth2ProviderSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingProvider = false;
        },

        updateOAuth2Provider: (
            state,
            action: PayloadAction<{
                providerName: string;
                oauth2ProviderSettingsUpdateModel: OAuth2ProviderSettingsUpdateModel;
            }>,
        ) => {
            state.isUpdatingProvider = true;
        },

        updateOAuth2ProviderSuccess: (state, action: PayloadAction<void>) => {
            state.isUpdatingProvider = false;
        },

        updateOAuth2ProviderFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingProvider = false;
        },

        createOAuth2Provider: (
            state,
            action: PayloadAction<{
                providerName: string;
                oauth2ProviderSettingsUpdateModel: OAuth2ProviderSettingsUpdateModel;
            }>,
        ) => {
            state.isCreatingProvider = true;
        },

        createOAuth2ProviderSuccess: (state, action: PayloadAction<void>) => {
            state.isCreatingProvider = false;
        },

        createOAuth2ProviderFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingProvider = false;
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
    },
});

const state = createFeatureSelector<State>(slice.name);

const authenticationSettings = createSelector(state, (state) => state.authenticationSettings);
const oauth2Provider = createSelector(state, (state) => state.oauth2Provider);

const isFetchingSettings = createSelector(state, (state) => state.isFetchingSettings);
const isFetchingProvider = createSelector(state, (state) => state.isFetchingProvider);
const isUpdatingSettings = createSelector(state, (state) => state.isUpdatingSettings);
const isUpdatingProvider = createSelector(state, (state) => state.isUpdatingProvider);
const isRemovingProvider = createSelector(state, (state) => state.isRemovingProvider);
const isCreatingProvider = createSelector(state, (state) => state.isCreatingProvider);

export const selectors = {
    state,
    authenticationSettings,
    oauth2Provider,

    isFetchingSettings,
    isFetchingProvider,
    isUpdatingSettings,
    isUpdatingProvider,
    isRemovingProvider,
    isCreatingProvider,
};

export const actions = slice.actions;

export default slice.reducer;
