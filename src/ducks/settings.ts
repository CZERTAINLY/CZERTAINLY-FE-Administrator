import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";
import { SettingsPlatformModel } from "../types/settings";

export type State = {
    platformSettings?: SettingsPlatformModel;
    isFetchingPlatform: boolean;
    isUpdatingPlatform: boolean;
};

export const initialState: State = {
    isFetchingPlatform: false,
    isUpdatingPlatform: false,
};

export const slice = createSlice({
    name: "settings",
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
    },
});

const state = createFeatureSelector<State>(slice.name);

const platformSettings = createSelector(state, (state: State) => state.platformSettings);
const isFetchingPlatform = createSelector(state, (state: State) => state.isFetchingPlatform);
const isUpdatingPlatform = createSelector(state, (state: State) => state.isUpdatingPlatform);

export const selectors = {
    state,
    platformSettings,
    isFetchingPlatform,
    isUpdatingPlatform,
};

export const actions = slice.actions;

export default slice.reducer;