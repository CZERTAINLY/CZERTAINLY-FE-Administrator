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
            dataCy(value: string): Chainable<JQuery<HTMLElement>>;
            dispatchActions(...actions: Array<PayloadAction<any, any>>): Chainable<void>;
            assertValueCopiedToClipboard(value: string): void;
            findExactText(text: string): Chainable<JQuery<HTMLElement>>;
        }
    }
    interface Window {
        store: typeof reduxStore;
    }
}
