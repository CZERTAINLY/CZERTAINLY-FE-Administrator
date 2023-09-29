import { configureStore } from "@reduxjs/toolkit";
import { mount } from "cypress/react18";
import { reducers } from "ducks/reducers";
import React from "react";
import { Provider } from "react-redux";

Cypress.Commands.add("mount", (component, options = {}) => {
    // Use the default store if one is not provided
    const { ...mountOptions } = options;
    const reduxStore = configureStore({
        reducer: reducers,
        // enhancers: [enhancer],
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false, // disable immutability checks because of date => should be refactored and date should not be stored in state
            }),
        // preloadedState: initialState,
    });

    // const reduxStore = configure();
    const wrapped = (
        <React.Fragment>
            <Provider store={reduxStore}>{component}</Provider>
        </React.Fragment>
    );
    return mount(wrapped, mountOptions);
});

// Cypress.Commands.add("mount", mount);

Cypress.Commands.add("dataCy", (value) => {
    return cy.get(`[data-cy=${value}]`);
});
