import { store } from '../App';
import { createSelector } from 'reselect';
import { MessageModel } from 'types/alerts';
import { alertsSlice, State } from './alert-slice';

const selectState = (reduxStore: any): State => reduxStore[alertsSlice.name];

const selectMessages = createSelector(selectState, (state) => state?.messages ?? []);

export const selectors = {
    selectState,
    selectMessages,
};

export const actions = alertsSlice.actions;

const HIDE_AFTER_MS = 7000;
const DISMISS_AFTER_MS = 8000;

setInterval(() => {
    const alerts = store.getState().alerts;
    if (!alerts?.messages?.length) return;
    alerts.messages.forEach((message: MessageModel) => {
        const age = Date.now() - message.time;

        if (age > HIDE_AFTER_MS) {
            store.dispatch(actions.hide(message.id));
        }

        if (age > DISMISS_AFTER_MS) {
            store.dispatch(actions.dismiss(message.id));
        }
    });
}, 500);

export default alertsSlice.reducer;
