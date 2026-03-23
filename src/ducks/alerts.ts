import { createSelector } from 'reselect';
import { alertsSlice, State } from './alert-slice';

const selectState = (reduxStore: any): State => reduxStore?.[alertsSlice.name];

const selectMessages = createSelector(selectState, (state) => state?.messages ?? []);

export const selectors = {
    selectState,
    selectMessages,
};

export const actions = alertsSlice.actions;

export default alertsSlice.reducer;
