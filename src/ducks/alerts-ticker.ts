import { MessageModel } from 'types/alerts';
import { actions } from './alerts';

type AlertsStore = {
    getState: () => { alerts?: { messages?: MessageModel[] } };
    dispatch: (action: unknown) => void;
};

let tickerStarted = false;

export const startAlertsTicker = (store: AlertsStore) => {
    if (tickerStarted) return;
    tickerStarted = true;

    setInterval(() => {
        const alerts = store.getState().alerts;
        if (!alerts?.messages?.length) return;
        alerts.messages.forEach((message: MessageModel) => {
            if (Date.now() - message.time > 17000) {
                store.dispatch(actions.hide(message.id));
            }

            if (Date.now() - message.time > 20000) {
                store.dispatch(actions.dismiss(message.id));
            }
        });
    }, 1000);
};
