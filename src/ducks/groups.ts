import { GroupModel } from "models";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";

export type State = {

    checkedRows: string[];
 
    group?: GroupModel;
    groups: GroupModel[];
 
    isFetchingList: boolean;
    isFetchingDetail: boolean;
    
    isCreating: boolean;
    isDeleting: boolean;
    isBulkDeleting: boolean;
    isUpdating: boolean;
 };

 export const initialState: State = {
    checkedRows: [],
    groups: [],
    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isBulkDeleting: false,
    isUpdating: false,
    };

export const slice = createSlice({

    name: "groups",
    
    initialState,
    
    reducers: {
        resetState: (state, action: PayloadAction<void>) => {

            state = initialState;
   
         },
   
   
         setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {
   
            state.checkedRows = action.payload.checkedRows;
   
         },

         listGroups: (state, action: PayloadAction<void>) => {
   
            state.groups = [];
            state.isFetchingList = true;
         },

        listGroupsSuccess: (state, action: PayloadAction<{ groups: GroupModel[] }>) => {
                   
            state.groups = action.payload.groups;
            state.isFetchingList = false;
         },

        listGroupsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
                   
            state.isFetchingList = false;
         },

         getGroupDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.group = undefined;
            state.isFetchingDetail = true;
         },

        getGroupDetailSuccess: (state, action: PayloadAction<{ group: GroupModel }>) => {
            state.group = action.payload.group;
            state.isFetchingDetail = false;
         },
        
        getGroupDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
         },
        
         createGroup: (state, action: PayloadAction<{ name: string, description?: string }>) => {
            state.isCreating = true;
         },

        createGroupSuccess: (state, action: PayloadAction<{ uuid: string}>) => {
            state.isCreating = false;
        },

        createGroupFailure: (state, action: PayloadAction<{ error: string  | undefined }>) => {
            state.isCreating = false;
        },

        updateGroup: (state, action: PayloadAction<{ groupUuid: string, name: string, description?: string }>) => {
            state.isUpdating = true;
         },

         updateGroupSuccess: (state, action: PayloadAction<{ group: GroupModel }>) => {
            state.isUpdating = false;
            state.group = action.payload.group;
        },

        updateGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdating = false;
        },

        deleteGroup: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
         },
   
   
         deleteGroupSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
   
            state.isDeleting = false;
   
            const index = state.groups.findIndex(raProfile => raProfile.uuid === action.payload.uuid);
            if (index !== -1) state.groups.splice(index, 1);
   
            if (state.group?.uuid === action.payload.uuid) state.group = undefined;
   
         },
   
   
         deleteGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
   
            state.isDeleting = false;
   
         },

         bulkDeleteGroups: (state, action: PayloadAction<{ uuids: string[] }>) => {

            state.isBulkDeleting = true;
   
         },
   
   
         bulkDeleteGroupsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
   
            state.isBulkDeleting = false;
   
            action.payload.uuids.forEach(
   
               uuid => {
                  const index = state.groups.findIndex(group => group.uuid === uuid);
                  if (index >= 0) state.groups.splice(index, 1);
               }
   
            );
   
            if (state.group && action.payload.uuids.includes(state.group.uuid)) state.group = undefined;
   
         },
   
   
         bulkDeleteGroupsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
   
            state.isBulkDeleting = false;
   
         }
    }
});


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

const group = createSelector(state, (state: State) => state.group);
const groups = createSelector(state, (state: State) => state.groups);

const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);

export const selectors = {

   state,

   checkedRows,

   group,
   groups,

   isCreating,
   isFetchingList,
   isFetchingDetail,
   isDeleting,
   isBulkDeleting,
   isUpdating,
};


export const actions = slice.actions;


export default slice.reducer;