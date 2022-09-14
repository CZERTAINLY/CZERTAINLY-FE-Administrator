import { AuditLogModel } from "models";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";


export type State = {

   loadedPageNumber?: number;
   loadedPageSize?: number;
   totalPagesAvailable?: number;

   pageData: AuditLogModel[];
   isFetchingPageData: boolean;

   objects: string[];
   isFetchingObjects: boolean;

   operations: string[];
   isFetchingOperations: boolean;

   statuses: string[]
   isFetchingStatuses: boolean;
   isPurging: boolean;

};


export const initialState: State = {

   pageData: [],
   isFetchingPageData: false,

   objects: [],
   isFetchingObjects: false,

   operations: [],
   isFetchingOperations: false,

   statuses: [],
   isFetchingStatuses: false,
   isPurging: false

};


export const slice = createSlice({

   name: "auditlog",

   initialState,

   reducers: {

      listLogs: (state, action: PayloadAction<{
         page: number,
         size: number,
         sort?: string,
         filters?: { [key: string]: string }
      }>) => {

         state.pageData = [];
         state.loadedPageNumber = undefined;
         state.loadedPageSize = undefined;
         state.totalPagesAvailable = undefined;
         state.isFetchingPageData = true;

      },


      listLogsSuccess: (state, action: PayloadAction<{
         page: number,
         size: number,
         total: number,
         data: AuditLogModel[]
      }>) => {

         state.isFetchingPageData = false;
         state.loadedPageNumber = action.payload.page;
         state.pageData = action.payload.data;
         state.totalPagesAvailable = action.payload.total

      },


      listLogsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingPageData = false;

      },


      listObjects: (state, action: PayloadAction<void>) => {

         state.objects = [];
         state.isFetchingObjects = true;

      },


      listObjectsSuccess: (state, action: PayloadAction<{ objectList: string[] }>) => {

         state.objects = action.payload.objectList;
         state.isFetchingObjects = false;

      },


      listObjectsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingObjects = false;

      },


      listOperations: (state, action: PayloadAction<void>) => {

         state.operations = [];
         state.isFetchingOperations = true;

      },


      listOperationsSuccess: (state, action: PayloadAction<{ operationList: string[] }>) => {

         state.operations = action.payload.operationList;
         state.isFetchingOperations = false;

      },


      listOperationsFailure: (state, action: PayloadAction<{ errors: string | undefined }>) => {

         state.isFetchingOperations = false;

      },


      listStatuses: (state, action: PayloadAction<void>) => {

         state.statuses = [];
         state.isFetchingStatuses = true;

      },


      listStatusesSuccess: (state, action: PayloadAction<{ statusList: string[] }>) => {

         state.statuses = action.payload.statusList;
         state.isFetchingStatuses = false;

      },


      listStatusesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingStatuses = false;

      },

      purgeLogs: (state, action: PayloadAction<{ queryString: string, sort?: string, filters?: { [key: string]: string }}> ) => {

         state.isPurging = true;

      },

      purgeLogsSuccess: (state, action: PayloadAction<{sort?: string, filters?: { [key: string]: string}}>) => {

         state.isPurging = false;

      },

      purgeLogsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isPurging = false;

      }
   }


})


const state = createFeatureSelector<State>(slice.name);

const loadedPageNumber = createSelector(state, state => state.loadedPageNumber);
const loadedPageSize = createSelector(state, state => state.loadedPageSize);
const totalPagesAvailable = createSelector(state, state => state.totalPagesAvailable);

const pageData = createSelector(state, state => state.pageData);
const objects = createSelector(state, state => state.objects);
const operations = createSelector(state, state => state.operations);
const statuses = createSelector(state, state => state.statuses);

const isFetchingPageData = createSelector(state, state => state.isFetchingPageData);
const isFetchingObjects = createSelector(state, state => state.isFetchingObjects);
const isFetchingOperations = createSelector(state, state => state.isFetchingOperations);
const isFetchingStatuses = createSelector(state, state => state.isFetchingStatuses);
const isPurging = createSelector(state, state => state.isPurging);

export const selectors = {

   state,

   loadedPageNumber,
   loadedPageSize,
   totalPagesAvailable,

   pageData,
   objects,
   operations,
   statuses,

   isFetchingPageData,
   isFetchingObjects,
   isFetchingOperations,
   isFetchingStatuses,
   isPurging

}


export const actions = slice.actions;


export default slice.reducer;
