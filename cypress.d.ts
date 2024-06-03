import { configureStore } from '@reduxjs/toolkit';
import { mount } from 'cypress/react18';
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
        }
    }
    interface Window {
        store: typeof reduxStore;
    }
}
