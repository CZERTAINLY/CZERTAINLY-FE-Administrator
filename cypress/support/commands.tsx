import { configureStore } from '@reduxjs/toolkit';
import { mount } from 'cypress/react';
import { reduxActionWait } from '../utils/constants';
import { reducers } from 'ducks/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

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

Cypress.Commands.add('dispatchActions', (...actions) => {
    actions.forEach((action) => {
        cy.wait(reduxActionWait).window().its('store').invoke('dispatch', action);
    });
});

Cypress.Commands.add('assertValueCopiedToClipboard', (value) => {
    if (Cypress.isBrowser('firefox')) throw Error('navigator.clipboard is not available in Firefox tests');
    cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
            expect(text).to.eq(value);
        });
    });
});

Cypress.Commands.add('findExactText', { prevSubject: true }, (subject, text) => {
    return cy.wrap(subject).filter((_, el) => {
        return Cypress.$(el).text().trim() === text;
    });
});
