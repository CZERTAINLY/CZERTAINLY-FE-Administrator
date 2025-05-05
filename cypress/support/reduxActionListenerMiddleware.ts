import { AnyAction, Middleware } from '@reduxjs/toolkit';

type Listener = {
    matcher: (action: AnyAction) => boolean;
    callback: (action: AnyAction) => void;
};

let listener: Listener | null;

/**
 * Middleware for listening to a single occasion of action dispatch, based on action matcher
 * Clears the listener once an action was matched
 */
export const reduxActionListenerMiddleware: Middleware = () => (next) => (action: any) => {
    const result = next(action);

    // Defer callback execution to allow the dispatched action to finish executing before running the callback
    queueMicrotask(() => {
        if (!listener) return;

        if (listener.matcher(action)) {
            listener.callback(action);
            listener = null;
        }
    });

    return result;
};

export const registerReduxActionListener = (matcher: (action: AnyAction) => boolean, callback: (action: AnyAction) => void) => {
    listener = { matcher, callback };
};
