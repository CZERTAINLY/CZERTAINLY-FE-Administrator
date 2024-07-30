import { store } from 'index';
import { createSelector } from 'reselect';
import { MessageModel } from 'types/alerts';
import { createFeatureSelector } from 'utils/ducks';
import { alertsSlice, State } from './alert-slice';

const selectState = createFeatureSelector<State>(alertsSlice.name);

const selectMessages = createSelector(selectState, (state) => state.messages);

export const selectors = {
    selectState,
    selectMessages,
};

export const actions = alertsSlice.actions;

setInterval(() => {
    const alerts = store.getState().alerts;
    alerts.messages.forEach((message: MessageModel) => {
        if (Date.now() - message.time > 17000) {
            store.dispatch(actions.hide(message.id));
        }

        if (Date.now() - message.time > 20000) {
            store.dispatch(actions.dismiss(message.id));
        }
    });
}, 1000);

export default alertsSlice.reducer;
