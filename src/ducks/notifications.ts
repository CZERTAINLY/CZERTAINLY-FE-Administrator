import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchRequestModel } from "types/certificate";
import { NotificationModel } from "types/notifications";
import { NotificationInstanceDto } from "types/openapi";
import { createFeatureSelector } from "utils/ducks";

export type State = {
    overviewNotifications: NotificationModel[];
    notifications: NotificationModel[];
    notificationInstances: NotificationInstanceDto[];

    isFetchingOverview: boolean;
    isFetchingNotificationInstances: boolean;
    isDeleting: boolean;
    isMarking: boolean;
};

export const initialState: State = {
    overviewNotifications: [],
    notifications: [],
    notificationInstances: [],

    isFetchingNotificationInstances: false,
    isFetchingOverview: false,
    isDeleting: false,
    isMarking: false,
};

export const slice = createSlice({
    name: "notifications",

    initialState,

    reducers: {
        listOverviewNotifications: (state, action: PayloadAction<void>) => {
            state.isFetchingOverview = true;
            state.overviewNotifications = [];
        },

        listOverviewNotificationsSuccess: (state, action: PayloadAction<NotificationModel[]>) => {
            state.isFetchingOverview = false;
            state.overviewNotifications = action.payload;
        },

        listOverviewNotificationsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingOverview = false;
        },

        listNotifications: (state, action: PayloadAction<{ unread: boolean; pagination: SearchRequestModel }>) => {
            state.notifications = [];
        },

        listNotificationsSuccess: (state, action: PayloadAction<NotificationModel[]>) => {
            state.notifications = action.payload;
        },

        deleteNotification: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
        },

        deleteNotificationSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const index = state.notifications.findIndex((a) => a.uuid === action.payload.uuid);
            if (index !== -1) state.notifications.splice(index, 1);
        },

        deleteNotificationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },

        markAsReadNotification: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isMarking = true;
        },

        markAsReadNotificationSuccess: (state, action: PayloadAction<NotificationModel>) => {
            state.isMarking = false;

            const index = state.notifications.findIndex((a) => a.uuid === action.payload.uuid);
            if (index !== -1) state.notifications[index].readAt = action.payload.readAt;
        },

        markAsReadNotificationFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isMarking = false;
        },
        listNotificationInstances: (state, action: PayloadAction<void>) => {
            state.isFetchingNotificationInstances = true;
            state.notificationInstances = [];
        },
        listNotificationInstancesSuccess: (state, action: PayloadAction<NotificationInstanceDto[]>) => {
            state.notificationInstances = action.payload;
            state.isFetchingNotificationInstances = false;
        },
        listNotificationInstancesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingNotificationInstances = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const overviewNotifications = createSelector(state, (state) => state.overviewNotifications);
const notifications = createSelector(state, (state) => state.notifications);
const notificationInstances = createSelector(state, (state) => state.notificationInstances);

const isFetchingNotificationInstances = createSelector(state, (state) => state.isFetchingNotificationInstances);
const isFetchingOverview = createSelector(state, (state) => state.isFetchingOverview);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isMarking = createSelector(state, (state) => state.isMarking);

export const selectors = {
    state,

    overviewNotifications,
    notifications,
    notificationInstances,

    isFetchingNotificationInstances,
    isFetchingOverview,
    isDeleting,
    isMarking,
};

export const actions = slice.actions;

export default slice.reducer;
