import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import { mount } from 'cypress/react';
import { reducers } from 'ducks/reducers';

const reduxStore = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
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
    }
}
