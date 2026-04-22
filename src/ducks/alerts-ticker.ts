import type { MessageModel } from 'types/alerts';
import { actions } from './alerts';

const HIDE_AFTER_MS = 7000;
const DISMISS_AFTER_MS = 8000;

type AlertsStore = {
    getState: () => { alerts?: { messages?: MessageModel[] } };
    dispatch: (action: unknown) => void;
};

let tickerStarted = false;

export const resetTickerStarted = () => {
    tickerStarted = false;
};

export const startAlertsTicker = (store: AlertsStore) => {
    if (tickerStarted) return;
    tickerStarted = true;

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
};
