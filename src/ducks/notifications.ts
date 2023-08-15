import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeDescriptorModel } from "types/attributes";
import { SearchRequestModel } from "types/certificate";
import { ConnectorResponseModel } from "types/connectors";
import { NotificationInstanceModel, NotificationInstanceRequestModel, NotificationModel } from "types/notifications";
import { createFeatureSelector } from "utils/ducks";

export type State = {
    overviewNotifications: NotificationModel[];
    notifications: NotificationModel[];
    notificationInstances: NotificationInstanceModel[];
    notificationInstanceDetail?: NotificationInstanceModel;
    notificationProviders?: ConnectorResponseModel[];
    notificationProviderAttributeDescriptors?: AttributeDescriptorModel[];

    isFetchingNotificationProviderAttributeDescriptors: boolean;
    isFetchingNotificationProviders: boolean;
    isFetchingNotificationInstanceDetail: boolean;
    isFetchingOverview: boolean;
    isFetchingNotificationInstances: boolean;
    isCreatingNotificationInstance: boolean;
    isDeleting: boolean;
    isMarking: boolean;
};

export const initialState: State = {
    overviewNotifications: [],
    notifications: [],
    notificationInstances: [],

    isFetchingNotificationProviderAttributeDescriptors: false,
    isFetchingNotificationProviders: false,
    isFetchingNotificationInstanceDetail: false,
    isFetchingNotificationInstances: false,
    isCreatingNotificationInstance: false,
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
        listNotificationInstancesSuccess: (state, action: PayloadAction<NotificationInstanceModel[]>) => {
            state.notificationInstances = action.payload;
            state.isFetchingNotificationInstances = false;
        },
        listNotificationInstancesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingNotificationInstances = false;
        },

        listNotificationProviders: (state, action: PayloadAction<void>) => {
            state.isFetchingNotificationProviders = true;
        },

        listNotificationProvidersSuccess: (state, action: PayloadAction<{ providers: ConnectorResponseModel[] }>) => {
            state.isFetchingNotificationProviders = false;
            state.notificationProviders = action.payload.providers;
        },

        listNotificationProvidersFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.isFetchingNotificationProviders = false;
        },

        getNotificationAttributesDescriptors: (state, action: PayloadAction<{ uuid: string; kind: string }>) => {
            state.notificationProviderAttributeDescriptors = [];
            state.isFetchingNotificationProviderAttributeDescriptors = true;
        },

        getNotificationAttributesDescriptorsSuccess: (
            state,
            action: PayloadAction<{ attributeDescriptor: AttributeDescriptorModel[] }>,
        ) => {
            state.notificationProviderAttributeDescriptors = action.payload.attributeDescriptor;
            state.isFetchingNotificationProviderAttributeDescriptors = false;
        },

        getNotificationAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingNotificationProviderAttributeDescriptors = false;
        },

        getNotificationInstance: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingNotificationInstances = true;
        },

        getNotificationInstanceSuccess: (state, action: PayloadAction<NotificationInstanceModel>) => {
            state.notificationInstanceDetail = action.payload;
            state.isFetchingNotificationInstances = false;
        },

        getNotificationInstanceFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingNotificationInstances = false;
        },

        createNotificationInstance: (state, action: PayloadAction<NotificationInstanceRequestModel>) => {
            state.isCreatingNotificationInstance = true;
        },

        createNotificationInstanceSuccess: (state, action: PayloadAction<void>) => {
            state.isCreatingNotificationInstance = false;
        },

        createNotificationInstanceFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingNotificationInstance = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const overviewNotifications = createSelector(state, (state) => state.overviewNotifications);
const notifications = createSelector(state, (state) => state.notifications);
const notificationInstances = createSelector(state, (state) => state.notificationInstances);
const notificationInstanceDetail = createSelector(state, (state) => state.notificationInstanceDetail);
const notificationInstanceProviders = createSelector(state, (state) => state.notificationProviders);
const notificationProviderAttributesDescriptors = createSelector(state, (state) => state.notificationProviderAttributeDescriptors);

const isCreatingNotificationInstance = createSelector(state, (state) => state.isCreatingNotificationInstance);
const isFetchingNotificationInstanceDetail = createSelector(state, (state) => state.isFetchingNotificationInstanceDetail);
const isFetchingNotificationInstances = createSelector(state, (state) => state.isFetchingNotificationInstances);
const isFetchingOverview = createSelector(state, (state) => state.isFetchingOverview);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isMarking = createSelector(state, (state) => state.isMarking);

export const selectors = {
    state,
    notificationInstanceDetail,
    overviewNotifications,
    notifications,
    notificationInstances,
    notificationInstanceProviders,
    notificationProviderAttributesDescriptors,

    isCreatingNotificationInstance,
    isFetchingNotificationInstanceDetail,
    isFetchingNotificationInstances,
    isFetchingOverview,
    isDeleting,
    isMarking,
};

export const actions = slice.actions;

export default slice.reducer;
