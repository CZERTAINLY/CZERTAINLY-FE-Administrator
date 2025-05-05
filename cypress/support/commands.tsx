import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { mount } from 'cypress/react';
import { reduxActionWait } from '../utils/constants';
import { reducers } from 'ducks/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import 'cypress-file-upload';
import { reduxActionListenerMiddleware, registerReduxActionListener } from './reduxActionListenerMiddleware';

Cypress.Commands.add('mount', (component, options = {}, initialRoute = '/') => {
    const { ...mountOptions } = options;
    const reduxStore = configureStore({
        reducer: reducers,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }).concat(reduxActionListenerMiddleware),
    });

    if (window.Cypress) {
        window.store = reduxStore;
        window.registerReduxActionListener = registerReduxActionListener;
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

Cypress.Commands.add('adminLogin', (url: string, username: string, password: string) => {
    cy.visit(url);
    cy.get('button').click();
    cy.get('#username').clear().type(username);
    cy.get('#password').clear().type(password);
    cy.get('#kc-login').click();
});

Cypress.Commands.add('dispatchActions', (...actions) => {
    actions.forEach((action) => {
        cy.wait(reduxActionWait).window().its('store').invoke('dispatch', action);
    });
});
Cypress.Commands.add('expectActionAfter', (trigger, matcher, callback: any, failOnActionRun) => {
    // Create action reference for access across multiple cy command calls.
    let storedAction: AnyAction;

    // Cy commands are run sequentially
    // First an action listener is setup for storing the dispatched action
    // Then, if an action that matched the matcher was dispatched while the trigger function was running,
    //   store the reference to that action in the storedAction variable.
    // This allows to run a callback with action payload as argument, and use cy commands inside of it
    cy.window()
        .then((win) => {
            win.registerReduxActionListener(matcher, (action) => {
                storedAction = action;
            });
        })
        .then(() => {
            trigger();
        })
        .then(() => {
            if (!storedAction && !failOnActionRun) {
                throw new Error(`Expected action to be dispatched after trigger.`);
            }
            if (storedAction && failOnActionRun) {
                throw new Error(`Expected action to not be dispatched after trigger.`);
            }
            if (!failOnActionRun) {
                callback?.(storedAction);
            } else {
                callback?.(undefined);
            }
        });
});

Cypress.Commands.add('assertValueCopiedToClipboard', (value) => {
    if (Cypress.isBrowser('firefox')) throw Error('navigator.clipboard is not available in Firefox tests');
    cy.window().then((win) => {
        win.focus();
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
