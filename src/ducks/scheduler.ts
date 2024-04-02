import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchRequestModel } from 'types/certificate';
import { SchedulerJobDetailModel, SchedulerJobHistoryModel, SchedulerJobModel } from 'types/scheduler';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    schedulerJob?: SchedulerJobDetailModel;
    schedulerJobs: SchedulerJobModel[];
    schedulerJobHistory: SchedulerJobHistoryModel[];

    isFetchingDetail: boolean;
    isDeleting: boolean;
    isEnabling: boolean;
};

export const initialState: State = {
    schedulerJobs: [],
    schedulerJobHistory: [],

    isFetchingDetail: false,
    isDeleting: false,
    isEnabling: false,
};

export const slice = createSlice({
    name: 'scheduler',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        listSchedulerJobs: (state, action: PayloadAction<SearchRequestModel>) => {
            state.schedulerJobs = [];
        },

        listSchedulerJobsSuccess: (state, action: PayloadAction<SchedulerJobModel[]>) => {
            state.schedulerJobs = action.payload;
        },

        listSchedulerJobHistory: (state, action: PayloadAction<{ uuid: string; pagination: SearchRequestModel }>) => {
            state.schedulerJobHistory = [];
        },

        listSchedulerJobHistorySuccess: (state, action: PayloadAction<SchedulerJobHistoryModel[]>) => {
            state.schedulerJobHistory = action.payload;
        },

        getSchedulerJobDetail: (state, action: PayloadAction<{ uuid: string }>) => {
            state.schedulerJob = undefined;
            state.isFetchingDetail = true;
        },

        getSchedulerJobDetailSuccess: (state, action: PayloadAction<SchedulerJobDetailModel>) => {
            state.isFetchingDetail = false;

            state.schedulerJob = action.payload;

            const index = state.schedulerJobs.findIndex((schedulerJob) => schedulerJob.uuid === action.payload.uuid);

            if (index >= 0) {
                state.schedulerJobs[index] = action.payload;
            } else {
                state.schedulerJobs.push(action.payload);
            }
        },

        getSchedulerJobDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        deleteSchedulerJob: (state, action: PayloadAction<{ uuid: string; redirect: boolean }>) => {
            state.isDeleting = true;
        },

        deleteSchedulerJobSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const index = state.schedulerJobs.findIndex((a) => a.uuid === action.payload.uuid);

            if (index !== -1) state.schedulerJobs.splice(index, 1);

            if (state.schedulerJob?.uuid === action.payload.uuid) state.schedulerJob = undefined;
        },

        deleteSchedulerJobFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
        },

        bulkEnableSchedulerJobs: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isEnabling = true;
        },

        bulkEnableSchedulerJobsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isEnabling = false;

            state.schedulerJobs.forEach((schedulerJob) => {
                if (action.payload.uuids.includes(schedulerJob.uuid)) schedulerJob.enabled = true;
            });
        },

        bulkEnableSchedulerJobsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        enableSchedulerJob: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        enableSchedulerJobSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const index = state.schedulerJobs.findIndex((a) => a.uuid === action.payload.uuid);

            if (index !== -1) state.schedulerJobs[index].enabled = true;

            if (state.schedulerJob?.uuid === action.payload.uuid) state.schedulerJob.enabled = true;
        },

        enableSchedulerJobFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        bulkDisableSchedulerJobs: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isEnabling = true;
        },

        bulkDisableSchedulerJobsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isEnabling = false;

            state.schedulerJobs.forEach((schedulerJob) => {
                if (action.payload.uuids.includes(schedulerJob.uuid)) schedulerJob.enabled = false;
            });
        },

        bulkDisableSchedulerJobsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },

        disableSchedulerJob: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = true;
        },

        disableSchedulerJobSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isEnabling = false;

            const index = state.schedulerJobs.findIndex((a) => a.uuid === action.payload.uuid);

            if (index !== -1) state.schedulerJobs[index].enabled = false;

            if (state.schedulerJob?.uuid === action.payload.uuid) state.schedulerJob.enabled = false;
        },

        disableSchedulerJobFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isEnabling = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const schedulerJob = createSelector(state, (state) => state.schedulerJob);
const schedulerJobs = createSelector(state, (state) => state.schedulerJobs);
const schedulerJobHistory = createSelector(state, (state) => state.schedulerJobHistory);

const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isEnabling = createSelector(state, (state) => state.isEnabling);

export const selectors = {
    state,

    schedulerJob,
    schedulerJobs,
    schedulerJobHistory,

    isFetchingDetail,
    isDeleting,
    isEnabling,
};

export const actions = slice.actions;

export default slice.reducer;
