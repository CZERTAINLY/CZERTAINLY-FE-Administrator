import { resetSliceState } from 'ducks/reducerUtils';
import type { AppState } from 'ducks';
import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CertificateGroupRequestModel, CertificateGroupResponseModel, GroupUserModel } from 'types/certificateGroups';

export type State = {
    checkedRows: string[];

    certificateGroup?: CertificateGroupResponseModel;
    certificateGroups: CertificateGroupResponseModel[];

    groupUsers: GroupUserModel[];
    groupUsersUuid?: string;

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isFetchingGroupUsers: boolean;

    isCreating: boolean;
    createGroupSucceeded: boolean;
    isDeleting: boolean;
    isBulkDeleting: boolean;
    isUpdating: boolean;
    updateGroupSucceeded: boolean;
};

export const initialState: State = {
    checkedRows: [],
    certificateGroups: [],
    groupUsers: [],
    isFetchingList: false,
    isFetchingDetail: false,
    isFetchingGroupUsers: false,
    isCreating: false,
    createGroupSucceeded: false,
    isDeleting: false,
    isBulkDeleting: false,
    isUpdating: false,
    updateGroupSucceeded: false,
};

export const slice = createSlice({
    name: 'certificateGroups',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            resetSliceState(state, initialState);
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
            if (state.certificateGroup?.uuid !== action.payload.uuid) {
                state.certificateGroup = undefined;
            }
            state.isFetchingDetail = true;
        },

        getGroupDetailSuccess: (state, action: PayloadAction<{ group: CertificateGroupResponseModel }>) => {
            state.certificateGroup = action.payload.group;
            state.isFetchingDetail = false;
        },

        getGroupDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        getGroupUsers: (state, action: PayloadAction<{ uuid: string }>) => {
            if (state.groupUsersUuid !== action.payload.uuid) {
                state.groupUsers = [];
                state.groupUsersUuid = action.payload.uuid;
            }
            state.isFetchingGroupUsers = true;
        },

        getGroupUsersSuccess: (state, action: PayloadAction<{ uuid: string; users: GroupUserModel[] }>) => {
            if (state.groupUsersUuid === action.payload.uuid) {
                state.groupUsers = action.payload.users;
            }
            state.isFetchingGroupUsers = false;
        },

        getGroupUsersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingGroupUsers = false;
        },

        createGroup: (state, action: PayloadAction<CertificateGroupRequestModel>) => {
            state.isCreating = true;
            state.createGroupSucceeded = false;
        },

        createGroupSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isCreating = false;
            state.createGroupSucceeded = true;
        },

        createGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
            state.createGroupSucceeded = false;
        },

        updateGroup: (state, action: PayloadAction<{ groupUuid: string; editGroupRequest: CertificateGroupRequestModel }>) => {
            state.isUpdating = true;
            state.updateGroupSucceeded = false;
        },

        updateGroupSuccess: (state, action: PayloadAction<{ group: CertificateGroupResponseModel }>) => {
            state.isUpdating = false;
            state.certificateGroup = action.payload.group;
            state.updateGroupSucceeded = true;
        },

        updateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
            state.updateGroupSucceeded = false;
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

const state = (reduxStore: AppState): State => reduxStore?.[slice.name];

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

const certificateGroup = createSelector(state, (state: State) => state.certificateGroup);
const certificateGroups = createSelector(state, (state: State) => state.certificateGroups);
const groupUsers = createSelector(state, (state: State) => state.groupUsers);

const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isFetchingGroupUsers = createSelector(state, (state: State) => state.isFetchingGroupUsers);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const createGroupSucceeded = createSelector(state, (state: State) => state.createGroupSucceeded);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);
const updateGroupSucceeded = createSelector(state, (state: State) => state.updateGroupSucceeded);

export const selectors = {
    state,

    checkedRows,

    certificateGroup,
    certificateGroups,
    groupUsers,

    isCreating,
    createGroupSucceeded,
    isFetchingList,
    isFetchingDetail,
    isFetchingGroupUsers,
    isDeleting,
    isBulkDeleting,
    isUpdating,
    updateGroupSucceeded,
};

export const actions = slice.actions;

export default slice.reducer;
