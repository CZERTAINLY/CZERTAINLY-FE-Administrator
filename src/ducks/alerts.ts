import { createSelector } from 'reselect';
import { createFeatureSelector } from 'utils/ducks';
import { alertsSlice, State } from './alert-slice';

const selectState = createFeatureSelector<State>(alertsSlice.name);

const selectMessages = createSelector(selectState, (state) => state?.messages ?? []);

export const selectors = {
    selectState,
    selectMessages,
};

export const actions = alertsSlice.actions;

export default alertsSlice.reducer;
