import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import { mount } from 'cypress/react';
import { registerReduxActionListener } from 'cypress/support/reduxActionListenerMiddleware';
import { reducers } from 'ducks/reducers';

const reduxStore = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

type ExtractActionFromMatcher<M extends (action: AnyAction) => action is AnyAction> = M extends (action: any) => action is infer A
    ? A
    : never;

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
            /**
             * Logs in via UI with given credentials and URL.
             * @param url - The admin login URL.
             * @param username - Username to login.
             * @param password - Password to login.
             */
            adminLogin(url: string, username: string, password: string): Chainable<void>;

            /**
             * Dispatches one or more Redux actions directly to the app's store.
             * @param actions - One or more Redux actions to dispatch.
             */
            dispatchActions(...actions: Array<PayloadAction<any, any>>): Chainable<void>;

            /**
             * Listens for a Redux action to be dispatched that matches the provided matcher.
             * @param matcher - A Redux Toolkit action matcher (e.g. `slice.actions.myAction.match`).
             * @param callback - Callback to run when the action is dispatched. Typed to the matched action.
             */
            /**
             * Runs a Cypress chain and waits for a Redux action to be dispatched as a result.
             * Fails the test if no matching action is dispatched.
             * @param trigger - Cypress commands that should cause the action to dispatch.
             * @param matcher - A Redux action matcher (e.g., slice.actions.someAction.match).
             * @param callback - Callback invoked after the matched action is dispatched.
             * @param failOnActionRun - If set, the test is failed if an action is matched,
             */
            expectActionAfter<M extends (action: AnyAction) => action is AnyAction>(
                trigger: () => void,
                matcher: M,
                callback?: (action: ExtractActionFromMatcher<M>) => void,
                failOnActionRun?: false,
            ): Chainable<void>;

            expectActionAfter<M extends (action: AnyAction) => action is AnyAction>(
                trigger: () => void,
                matcher: M,
                callback?: (action: undefined) => void,
                failOnActionRun: true,
            ): Chainable<void>;

            /**
             * Asserts that the given value has been copied to the clipboard.
             * @param value - The value expected to be in the clipboard.
             */
            assertValueCopiedToClipboard(value: string): void;

            /**
             * Finds an element that exactly matches the given text content.
             * @param text - The exact text content to search for.
             * @returns A Cypress Chainable containing the matching element(s).
             */
            findExactText(text: string): Chainable<JQuery<HTMLElement>>;
        }
    }
    interface Window {
        store: typeof reduxStore;
        registerReduxActionListener: typeof registerReduxActionListener;
    }
}
