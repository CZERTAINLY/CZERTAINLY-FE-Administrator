import { configureStore } from '@reduxjs/toolkit';
import { mount } from 'cypress/react18';
import { reducers } from 'ducks/reducers';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

const reduxStore = configureStore({
    reducer: reducers,
    // enhancers: [enhancer],
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // disable immutability checks because of date => should be refactored and date should not be stored in state
        }),
    // preloadedState: initialState,
});
declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
            dataCy(value: string): Chainable<JQuery<HTMLElement>>;
        }
    }
    interface Window {
        store: typeof reduxStore; // Replace 'any' with the type of your Redux store
    }
}
