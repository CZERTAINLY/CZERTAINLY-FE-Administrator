import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    NotificationProfileDetailModel,
    NotificationProfileModel,
    NotificationProfileRequestModel,
    NotificationProfileUpdateRequestModel,
} from 'types/notification-profiles';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    notificationProfile?: NotificationProfileDetailModel;
    notificationProfiles: NotificationProfileModel[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isUpdating: boolean;
};

export const initialState: State = {
    notificationProfiles: [],
    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
};

export const slice = createSlice({
    name: 'notificationProfiles',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        listNotificationProfiles: (state, action: PayloadAction<void>) => {
            state.notificationProfiles = [];
            state.isFetchingList = true;
        },

        listNotificationProfilesSuccess: (state, action: PayloadAction<{ notificationProfiles: NotificationProfileModel[] }>) => {
            state.notificationProfiles = action.payload.notificationProfiles;
            state.isFetchingList = false;
        },

        listNotificationProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        getNotificationProfileDetail: (state, action: PayloadAction<{ uuid: string; version: number }>) => {
            state.notificationProfile = undefined;
            state.isFetchingDetail = true;
        },

        getNotificationProfileDetailSuccess: (state, action: PayloadAction<{ notificationProfile: NotificationProfileDetailModel }>) => {
            state.isFetchingDetail = false;
            state.notificationProfile = action.payload.notificationProfile;
        },

        getNotificationProfileDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        createNotificationProfile: (
            state,
            action: PayloadAction<{
                notificationProfileAddRequest: NotificationProfileRequestModel;
            }>,
        ) => {
            state.isCreating = true;
        },

        createNotificationProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isCreating = false;
        },

        createNotificationProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        updateNotificationProfile: (
            state,
            action: PayloadAction<{
                uuid: string;
                notificationProfileEditRequest: NotificationProfileUpdateRequestModel;
                redirect?: string;
            }>,
        ) => {
            state.isUpdating = true;
        },

        updateNotificationProfileSuccess: (
            state,
            action: PayloadAction<{ notificationProfile: NotificationProfileDetailModel; redirect?: string }>,
        ) => {
            state.isUpdating = false;
            state.notificationProfile = action.payload.notificationProfile;
        },

        updateNotificationProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        deleteNotificationProfile: (state, action: PayloadAction<{ uuid: string; redirect?: string }>) => {
            state.isDeleting = true;
        },

        deleteNotificationProfileSuccess: (state, action: PayloadAction<{ uuid: string; redirect?: string }>) => {
            state.isDeleting = false;

            const index = state.notificationProfiles.findIndex((raProfile) => raProfile.uuid === action.payload.uuid);
            if (index !== -1) state.notificationProfiles.splice(index, 1);

            if (state.notificationProfile?.uuid === action.payload.uuid) state.notificationProfile = undefined;
        },

        deleteNotificationProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const notificationProfile = createSelector(state, (state: State) => state.notificationProfile);
const notificationProfiles = createSelector(state, (state: State) => state.notificationProfiles);
const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);

export const selectors = {
    state,

    notificationProfile,
    notificationProfiles,

    isFetchingList,
    isFetchingDetail,
    isCreating,
    isDeleting,
    isUpdating,
};

export const actions = slice.actions;

export default slice.reducer;
