import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';
import { StatisticsDashboardModel } from '../types/statisticsDashboard';

export type State = {
    isFetching: boolean;
    statisticsDashboard?: StatisticsDashboardModel;
};

export const initialState: State = {
    isFetching: false,
    statisticsDashboard: undefined,
};

export const slice = createSlice({
    name: 'statisticsDashboard',

    initialState,

    reducers: {
        getDashboard: (state, action: PayloadAction<void>) => {
            state.isFetching = true;
            state.statisticsDashboard = undefined;
        },

        getDashboardSuccess: (state, action: PayloadAction<{ statisticsDashboard: StatisticsDashboardModel }>) => {
            state.isFetching = false;
            state.statisticsDashboard = action.payload.statisticsDashboard;
        },

        getDashboardFailed: (state, action: PayloadAction<void>) => {
            state.isFetching = false;
        },
    },
});

const selectState = createFeatureSelector<State>(slice.name);

const statisticsDashboard = createSelector(selectState, (state) => state.statisticsDashboard);

const isFetching = createSelector(selectState, (state) => state.isFetching);

export const selectors = {
    selectState,
    statisticsDashboard,
    isFetching,
};

export const actions = slice.actions;

export default slice.reducer;
