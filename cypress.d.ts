import { configureStore } from '@reduxjs/toolkit';
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
            dataCy(value: string): Chainable<JQuery<HTMLElement>>;
            /**
             * Logs in via UI with given credentials and URL
             * @param url - the admin login URL
             * @param username - username to login
             * @param password - password to login
             */
            adminLogin(url: string, username: string, password: string): Chainable<void>;
        }
    }
    interface Window {
        store: typeof reduxStore;
    }
}
