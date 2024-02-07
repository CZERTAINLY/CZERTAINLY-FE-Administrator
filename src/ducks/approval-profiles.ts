import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    ProfileApprovalDetailModel,
    ProfileApprovalModel,
    ProfileApprovalRequestModel,
    ProfileApprovalResponseModel,
} from 'types/approval-profiles';
import { UuidDto } from 'types/openapi';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    profileApprovalDetail?: ProfileApprovalDetailModel;
    profileApprovalList: ProfileApprovalModel[];
    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isEnabling: boolean;
    isCreating: boolean;
    deleteErrorMessage: string;
    totalItems?: number;
};

export const initialState: State = {
    profileApprovalDetail: undefined,
    isUpdating: false,
    profileApprovalList: [],
    isFetchingList: false,
    isFetchingDetail: false,
    isDeleting: false,
    isEnabling: false,
    isCreating: false,
    deleteErrorMessage: '',
    totalItems: undefined,
};

export const slice = createSlice({
    name: 'approvalProfiles',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        createApprovalProfile: (state, action: PayloadAction<ProfileApprovalRequestModel>) => {
            state.profileApprovalDetail = undefined;
            state.isCreating = true;
        },

        createApprovalProfileSuccess: (state, action: PayloadAction<UuidDto>) => {
            state.isCreating = false;
        },

        createApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.profileApprovalDetail = undefined;
            state.isCreating = false;
        },

        getApprovalProfile: (state, action: PayloadAction<{ uuid: string; version?: number }>) => {
            state.profileApprovalDetail = undefined;
            state.isFetchingDetail = true;
        },

        getApprovalProfileSuccess: (state, action: PayloadAction<ProfileApprovalDetailModel>) => {
            state.profileApprovalDetail = action.payload;
            state.isFetchingDetail = false;
        },

        getApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.profileApprovalDetail = undefined;
            state.isFetchingDetail = false;
        },

        listApprovalProfiles: (state, action: PayloadAction<{ itemsPerPage: number; pageNumber: number } | undefined>) => {
            state.profileApprovalList = [];
            state.isFetchingList = true;
        },

        listApprovalProfilesSuccess: (state, action: PayloadAction<ProfileApprovalResponseModel>) => {
            state.profileApprovalList = action.payload?.approvalProfiles || [];
            state.totalItems = action.payload?.totalItems || 0;
            state.isFetchingList = false;
        },

        listApprovalProfilesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.profileApprovalList = [];
            state.isFetchingList = false;
        },

        enableApprovalProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        enableApprovalProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const profileIndex = state.profileApprovalList.findIndex((profile) => profile.uuid === action.payload.uuid);

            if (profileIndex >= 0) state.profileApprovalList[profileIndex].enabled = true;

            if (state.profileApprovalDetail?.uuid === action.payload.uuid) state.profileApprovalDetail.enabled = true;
        },
        enableApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableApprovalProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },
        disableApprovalProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const profileIndex = state.profileApprovalList.findIndex((profile) => profile.uuid === action.payload.uuid);

            if (profileIndex >= 0) state.profileApprovalList[profileIndex].enabled = false;

            if (state.profileApprovalDetail?.uuid === action.payload.uuid) state.profileApprovalDetail.enabled = false;
        },
        disableApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },
        deleteApprovalProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
        },

        deleteApprovalProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const profileIndex = state.profileApprovalList.findIndex((profile) => profile.uuid === action.payload.uuid);

            if (profileIndex >= 0) state.profileApprovalList.splice(profileIndex, 1);

            if (state.profileApprovalDetail?.uuid === action.payload.uuid) state.profileApprovalDetail = undefined;
        },

        deleteApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error || 'Unknown error';
        },

        editApprovalProfile: (state, action: PayloadAction<{ uuid: string; editProfileApproval: ProfileApprovalRequestModel }>) => {
            state.profileApprovalDetail = undefined;
            state.isUpdating = true;
        },
        editApprovalProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isUpdating = false;
        },
        editApprovalProfileFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {
            state.deleteErrorMessage = '';
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const profileApprovalDetail = createSelector(state, (state) => state.profileApprovalDetail);
const profileApprovalList = createSelector(state, (state) => state.profileApprovalList);
const isCreating = createSelector(state, (state) => state.isCreating);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isEnabling = createSelector(state, (state) => state.isEnabling);
const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);
const totalItems = createSelector(state, (state) => state.totalItems);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isDeleting = createSelector(state, (state) => state.isDeleting);

export const selectors = {
    state,
    profileApprovalDetail,
    profileApprovalList,
    isCreating,
    isFetchingDetail,
    isEnabling,
    deleteErrorMessage,
    totalItems,
    isUpdating,
    isDeleting,
    isFetchingList,
};

export const actions = slice.actions;

export default slice.reducer;
