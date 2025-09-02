import GoBackButton from 'components/GoBackButton';
import { Routes, Route, MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mount } from 'cypress/react';
import { reducers } from '../../../src/ducks/reducers';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';

describe('<GoBackButton />', () => {
    it('renders with default text', () => {
        cy.mount(<GoBackButton />).wait(componentLoadWait);
        cy.contains('Go Back').should('exist');
    });

    it('calls custom onClick when provided', () => {
        const onClick = cy.stub().as('onClick');
        cy.mount(<GoBackButton onClick={onClick} text="Back" />).wait(componentLoadWait);
        cy.contains('Back').click().wait(clickWait);
        cy.get('@onClick').should('have.been.calledOnce');
    });

    it('navigates to arbitryPath when provided', () => {
        const TestComponent = () => (
            <Routes>
                <Route path="/start" element={<GoBackButton arbitryPath="/target" />} />
                <Route path="/target" element={<div data-testid="target">Target page</div>} />
            </Routes>
        );

        const store = configureStore({
            reducer: reducers,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        });

        const wrapped = (
            <Provider store={store}>
                <MemoryRouter initialEntries={['/start']}>
                    <TestComponent />
                </MemoryRouter>
            </Provider>
        );

        mount(wrapped).wait(componentLoadWait);
        cy.contains('Go Back').click().wait(clickWait);
        cy.get('[data-testid="target"]', { timeout: 1000 }).should('exist');
    });

    it('navigates fallbackPath if no history', () => {
        const TestComponent = () => (
            <Routes>
                <Route path="/" element={<GoBackButton fallbackPath="/dashboard" />} />
                <Route path="/dashboard" element={<div data-testid="dashboard">Dashboard</div>} />
            </Routes>
        );

        const store = configureStore({
            reducer: reducers,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        });

        const wrapped = (
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <TestComponent />
                </MemoryRouter>
            </Provider>
        );

        mount(wrapped).wait(componentLoadWait);

        // Ensure window.history.length is 1 to trigger fallback path
        cy.window().then((win) => {
            Object.defineProperty(win.history, 'length', {
                value: 1,
                writable: true,
            });
        });

        cy.contains('Go Back').click().wait(clickWait);
        cy.get('[data-testid="dashboard"]', { timeout: 1000 }).should('exist');
    });

    it('navigates back in history if available', () => {
        const TestComponent = () => (
            <Routes>
                <Route path="/first" element={<div data-testid="first">First page</div>} />
                <Route path="/second" element={<GoBackButton />} />
            </Routes>
        );

        const store = configureStore({
            reducer: reducers,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        });

        const wrapped = (
            <Provider store={store}>
                <MemoryRouter initialEntries={['/first', '/second']} initialIndex={1}>
                    <TestComponent />
                </MemoryRouter>
            </Provider>
        );

        mount(wrapped).wait(componentLoadWait);

        // Mock window.history.length to simulate having history
        cy.window().then((win) => {
            Object.defineProperty(win.history, 'length', {
                value: 2,
                writable: true,
            });
        });

        cy.contains('Go Back').click().wait(clickWait);
        cy.get('[data-testid="first"]', { timeout: 1000 }).should('exist');
    });
});
