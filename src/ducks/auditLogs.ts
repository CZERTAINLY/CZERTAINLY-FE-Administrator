import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditLogFilterModel, AuditLogItemModel } from 'types/auditLogs';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    pageNumber: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
    exportUrl: string | undefined;

    pageData: AuditLogItemModel[];
    isFetchingPageData: boolean;

    objects: string[];
    isFetchingObjects: boolean;

    operations: string[];
    isFetchingOperations: boolean;

    statuses: string[];
    isFetchingStatuses: boolean;
    isPurging: boolean;
    isExporting: boolean;
};

export const initialState: State = {
    pageNumber: 0,
    itemsPerPage: 0,
    totalPages: 0,
    totalItems: 0,
    exportUrl: undefined,

    pageData: [],
    isFetchingPageData: false,

    objects: [],
    isFetchingObjects: false,

    operations: [],
    isFetchingOperations: false,

    statuses: [],
    isFetchingStatuses: false,
    isPurging: false,
    isExporting: false,
};

export const slice = createSlice({
    name: 'auditlog',

    initialState,

    reducers: {
        listLogs: (
            state,
            action: PayloadAction<{
                page: number;
                size: number;
                filters?: AuditLogFilterModel;
            }>,
        ) => {
            state.pageData = [];
            state.isFetchingPageData = true;
        },

        listLogsSuccess: (
            state,
            action: PayloadAction<{
                pageNumber: number;
                itemsPerPage: number;
                totalPages: number;
                totalItems: number;
                data: AuditLogItemModel[];
            }>,
        ) => {
            state.isFetchingPageData = false;
            state.pageNumber = action.payload.pageNumber;
            state.itemsPerPage = action.payload.itemsPerPage;
            state.pageData = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.totalItems = action.payload.totalItems;
        },

        listLogsFailure: (state, action: PayloadAction<void>) => {
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

        listObjectsFailure: (state, action: PayloadAction<void>) => {
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

        listStatusesFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingStatuses = false;
        },

        purgeLogs: (
            state,
            action: PayloadAction<{
                page: number;
                size: number;
                filters?: AuditLogFilterModel;
            }>,
        ) => {
            state.isPurging = true;
        },

        purgeLogsSuccess: (state, action: PayloadAction<void>) => {
            state.isPurging = false;
        },

        purgeLogsFailure: (state, action: PayloadAction<void>) => {
            state.isPurging = false;
        },

        exportLogs: (
            state,
            action: PayloadAction<{
                page: number;
                size: number;
                filters?: AuditLogFilterModel;
            }>,
        ) => {
            state.exportUrl = undefined;
            state.isExporting = true;
        },

        exportLogsSuccess: (state, action: PayloadAction<string>) => {
            state.exportUrl = action.payload;
            state.isExporting = false;
        },

        exportLogsFailure: (state, action: PayloadAction<void>) => {
            state.isExporting = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const pageNumber = createSelector(state, (state) => state.pageNumber);
const itemsPerPage = createSelector(state, (state) => state.itemsPerPage);
const totalPages = createSelector(state, (state) => state.totalPages);
const totalItems = createSelector(state, (state) => state.totalItems);
const exportUrl = createSelector(state, (state) => state.exportUrl);

const pageData = createSelector(state, (state) => state.pageData);
const objects = createSelector(state, (state) => state.objects);
const operations = createSelector(state, (state) => state.operations);
const statuses = createSelector(state, (state) => state.statuses);

const isFetchingPageData = createSelector(state, (state) => state.isFetchingPageData);
const isFetchingObjects = createSelector(state, (state) => state.isFetchingObjects);
const isFetchingOperations = createSelector(state, (state) => state.isFetchingOperations);
const isFetchingStatuses = createSelector(state, (state) => state.isFetchingStatuses);
const isPurging = createSelector(state, (state) => state.isPurging);
const isExporting = createSelector(state, (state) => state.isExporting);

export const selectors = {
    state,

    pageNumber,
    itemsPerPage,
    totalPages,
    totalItems,
    exportUrl,

    pageData,
    objects,
    operations,
    statuses,

    isFetchingPageData,
    isFetchingObjects,
    isFetchingOperations,
    isFetchingStatuses,
    isPurging,
    isExporting,
};

export const actions = slice.actions;

export default slice.reducer;
