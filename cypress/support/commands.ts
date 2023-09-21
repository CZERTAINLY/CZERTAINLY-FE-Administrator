import { mount } from "cypress/react";

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
            dataCy(value: string): Chainable<JQuery<HTMLElement>>;
        }
    }
}

Cypress.Commands.add("mount", mount);

Cypress.Commands.add("dataCy", (value) => {
    return cy.get(`[data-cy=${value}]`);
});
