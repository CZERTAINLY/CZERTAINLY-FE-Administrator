import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";
import { AttributeRequestModel } from "../types/attributes";
import { SettingsAllResponseModel, SettingsResponseModel } from "../types/settings";

export type State = {
    settings?: SettingsResponseModel[];
    allSettings?: SettingsAllResponseModel;
    isFetching: boolean;
    isUpdating: boolean;
};

export const initialState: State = {
    isFetching: false,
    isUpdating: false,
};

export const slice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        getAllSettings: (state, action: PayloadAction<void>) => {
            state.isFetching = true;
        },

        getAllSettingsSuccess: (state, action: PayloadAction<SettingsAllResponseModel>) => {
            state.allSettings = action.payload;
            state.isFetching = false;
        },

        getAllSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetching = false;
        },

        getSettings: (state, action: PayloadAction<void>) => {
            state.settings = [];
            state.isFetching = true;
        },

        getSettingsSuccess: (state, action: PayloadAction<SettingsResponseModel[]>) => {
            state.settings = action.payload;
            state.isFetching = false;
        },

        getSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetching = false;
        },

        updateSettings: (state, action: PayloadAction<{ [key: string]: Array<AttributeRequestModel> }>) => {
            state.isUpdating = true;
        },

        updateSettingsSuccess: (state, action: PayloadAction<SettingsResponseModel[]>) => {
            state.isUpdating = false;
            state.settings = action.payload;
        },

        updateSettingsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        settingsUpdated: (state, action: PayloadAction<void>) => {
        },

    },
});

const state = createFeatureSelector<State>(slice.name);

const settings = createSelector(state, (state: State) => state.settings);
const allSettings = createSelector(state, (state: State) => state.allSettings);
const isFetching = createSelector(state, (state: State) => state.isFetching);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);

export const selectors = {
    state,
    settings,
    allSettings,
    isFetching,
    isUpdating,
};

export const actions = slice.actions;

export default slice.reducer;