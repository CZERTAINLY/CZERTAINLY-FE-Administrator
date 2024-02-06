import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationSettingsDto } from 'types/openapi';
import { createFeatureSelector } from 'utils/ducks';
import { SettingsPlatformModel } from '../types/settings';

export type State = {
    platformSettings?: SettingsPlatformModel;
    isFetchingPlatform: boolean;
    isUpdatingPlatform: boolean;
    isUpdatingNotificationsSetting: boolean;
    notificationsSettings?: NotificationSettingsDto;
    isFetchingNotificationsSetting: boolean;
};

export const initialState: State = {
    isFetchingPlatform: false,
    isUpdatingPlatform: false,
    isUpdatingNotificationsSetting: false,
    isFetchingNotificationsSetting: false,
};

export const slice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        getPlatformSettings: (state, action: PayloadAction<void>) => {
            state.isFetchingPlatform = true;
        },

        getPlatformSettingsSuccess: (state, action: PayloadAction<SettingsPlatformModel>) => {
            state.platformSettings = action.payload;
            state.isFetchingPlatform = false;
        },

        getPlatformSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingPlatform = false;
        },

        updatePlatformSettings: (state, action: PayloadAction<SettingsPlatformModel>) => {
            state.isUpdatingPlatform = true;
        },

        updatePlatformSettingsSuccess: (state, action: PayloadAction<SettingsPlatformModel>) => {
            state.isUpdatingPlatform = false;
            state.platformSettings = action.payload;
        },

        updatePlatformSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingPlatform = false;
        },

        getNotificationsSettings: (state, action: PayloadAction<void>) => {
            state.isFetchingNotificationsSetting = true;
        },

        getNotificationsSettingsSuccess: (state, action: PayloadAction<NotificationSettingsDto>) => {
            state.notificationsSettings = action.payload;
            state.isFetchingNotificationsSetting = false;
        },

        getNotificationsSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingNotificationsSetting = false;
        },

        updateNotificationsSettings: (state, action: PayloadAction<NotificationSettingsDto>) => {
            state.isUpdatingNotificationsSetting = true;
        },

        updateNotificationsSettingsSuccess: (state, action: PayloadAction<NotificationSettingsDto>) => {
            state.isUpdatingNotificationsSetting = false;
            state.notificationsSettings = action.payload;
        },

        updateNotificationsSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingNotificationsSetting = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const platformSettings = createSelector(state, (state: State) => state.platformSettings);
const isFetchingPlatform = createSelector(state, (state: State) => state.isFetchingPlatform);
const isUpdatingPlatform = createSelector(state, (state: State) => state.isUpdatingPlatform);
const notificationsSettings = createSelector(state, (state: State) => state.notificationsSettings);
const isFetchingNotificationsSetting = createSelector(state, (state: State) => state.isFetchingNotificationsSetting);
const isUpdatingNotificationsSetting = createSelector(state, (state: State) => state.isUpdatingNotificationsSetting);

export const selectors = {
    state,
    platformSettings,
    isFetchingPlatform,
    isUpdatingPlatform,
    notificationsSettings,
    isFetchingNotificationsSetting,
    isUpdatingNotificationsSetting,
};

export const actions = slice.actions;

export default slice.reducer;
