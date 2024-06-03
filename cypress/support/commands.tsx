import { configureStore } from '@reduxjs/toolkit';
import { mount } from 'cypress/react18';
import { reducers } from 'ducks/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

Cypress.Commands.add('mount', (component, options = {}, initialRoute = '/') => {
    const { ...mountOptions } = options;
    const reduxStore = configureStore({
        reducer: reducers,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });

    if (window.Cypress) {
        window.store = reduxStore;
    }

    const wrapped = (
        <React.Fragment>
            <Provider store={reduxStore}>
                <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>
            </Provider>
        </React.Fragment>
    );

    return mount(wrapped, mountOptions);
});
