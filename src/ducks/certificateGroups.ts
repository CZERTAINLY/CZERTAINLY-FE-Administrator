import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CertificateGroupRequestModel, CertificateGroupResponseModel } from 'types/certificateGroups';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    checkedRows: string[];

    certificateGroup?: CertificateGroupResponseModel;
    certificateGroups: CertificateGroupResponseModel[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;

    isCreating: boolean;
    isDeleting: boolean;
    isBulkDeleting: boolean;
    isUpdating: boolean;
};

export const initialState: State = {
    checkedRows: [],
    certificateGroups: [],
    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isBulkDeleting: false,
    isUpdating: false,
};

export const slice = createSlice({
    name: 'certificateGroups',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {
            state.checkedRows = action.payload.checkedRows;
        },

        listGroups: (state, action: PayloadAction<void>) => {
            state.certificateGroups = [];
            state.isFetchingList = true;
        },

        listGroupsSuccess: (state, action: PayloadAction<{ groups: CertificateGroupResponseModel[] }>) => {
            state.certificateGroups = action.payload.groups;
            state.isFetchingList = false;
        },

        listGroupsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        getGroupDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.certificateGroup = undefined;
            state.isFetchingDetail = true;
        },

        getGroupDetailSuccess: (state, action: PayloadAction<{ group: CertificateGroupResponseModel }>) => {
            state.certificateGroup = action.payload.group;
            state.isFetchingDetail = false;
        },

        getGroupDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        createGroup: (state, action: PayloadAction<CertificateGroupRequestModel>) => {
            state.isCreating = true;
        },

        createGroupSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isCreating = false;
        },

        createGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        updateGroup: (state, action: PayloadAction<{ groupUuid: string; editGroupRequest: CertificateGroupRequestModel }>) => {
            state.isUpdating = true;
        },

        updateGroupSuccess: (state, action: PayloadAction<{ group: CertificateGroupResponseModel }>) => {
            state.isUpdating = false;
            state.certificateGroup = action.payload.group;
        },

        updateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        deleteGroup: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
        },

        deleteGroupSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const index = state.certificateGroups.findIndex((raProfile) => raProfile.uuid === action.payload.uuid);
            if (index !== -1) state.certificateGroups.splice(index, 1);

            if (state.certificateGroup?.uuid === action.payload.uuid) state.certificateGroup = undefined;
        },

        deleteGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },

        bulkDeleteGroups: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDeleting = true;
        },

        bulkDeleteGroupsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isBulkDeleting = false;

            action.payload.uuids.forEach((uuid) => {
                const index = state.certificateGroups.findIndex((group) => group.uuid === uuid);
                if (index >= 0) state.certificateGroups.splice(index, 1);
            });

            if (state.certificateGroup && action.payload.uuids.includes(state.certificateGroup.uuid)) state.certificateGroup = undefined;
        },

        bulkDeleteGroupsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

const certificateGroup = createSelector(state, (state: State) => state.certificateGroup);
const certificateGroups = createSelector(state, (state: State) => state.certificateGroups);

const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);

export const selectors = {
    state,

    checkedRows,

    certificateGroup,
    certificateGroups,

    isCreating,
    isFetchingList,
    isFetchingDetail,
    isDeleting,
    isBulkDeleting,
    isUpdating,
};

export const actions = slice.actions;

export default slice.reducer;
