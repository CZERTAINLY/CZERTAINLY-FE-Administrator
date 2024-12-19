import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditLogItemModel } from 'types/auditLogs';
import { SearchRequestModel, SearchFilterModel } from 'types/certificate';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    auditLogs: AuditLogItemModel[];

    isFetchingPageData: boolean;
    isPurging: boolean;
    isExporting: boolean;
};

export const initialState: State = {
    auditLogs: [],
    isFetchingPageData: false,
    isPurging: false,
    isExporting: false,
};

export const slice = createSlice({
    name: 'auditlog',

    initialState,

    reducers: {
        listAuditLogs: (state, action: PayloadAction<SearchRequestModel>) => {
            state.isFetchingPageData = true;
        },

        listAuditLogsSuccess: (state, action: PayloadAction<AuditLogItemModel[]>) => {
            state.auditLogs = action.payload;
            state.isFetchingPageData = false;
        },

        listAuditLogsFailure: (state, action: PayloadAction<void>) => {
            state.isFetchingPageData = false;
        },

        purgeLogs: (state, action: PayloadAction<SearchFilterModel[]>) => {
            state.isPurging = true;
        },

        purgeLogsSuccess: (state, action: PayloadAction<void>) => {
            state.isPurging = false;
        },

        purgeLogsFailure: (state, action: PayloadAction<void>) => {
            state.isPurging = false;
        },

        exportLogs: (state, action: PayloadAction<SearchFilterModel[]>) => {
            state.isExporting = true;
        },

        exportLogsSuccess: (state, action: PayloadAction<Blob>) => {
            // Dynamically create an anchor element for download
            const downloadUrl = URL.createObjectURL(action.payload);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'auditLogs.zip';
            document.body.appendChild(a); // Temporarily add to DOM
            a.click(); // Trigger file download
            document.body.removeChild(a); // Remove the element
            URL.revokeObjectURL(downloadUrl); // Release the object URL

            state.isExporting = false;
        },

        exportLogsFailure: (state, action: PayloadAction<void>) => {
            state.isExporting = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const auditLogs = createSelector(state, (state) => state.auditLogs);

const isFetchingPageData = createSelector(state, (state) => state.isFetchingPageData);
const isPurging = createSelector(state, (state) => state.isPurging);
const isExporting = createSelector(state, (state) => state.isExporting);

export const selectors = {
    state,

    auditLogs,
    isFetchingPageData,
    isPurging,
    isExporting,
};

export const actions = slice.actions;

export default slice.reducer;
