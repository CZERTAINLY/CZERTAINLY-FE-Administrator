describe('template spec', {}, () => {
    it('passes', () => {
        cy.visit(Cypress.env('ADMIN_URL'));
        /* ==== Generated with Cypress Studio ==== */
        cy.get('button').click();
        cy.get('#username').clear();
        cy.get('#username').type(Cypress.env('ADMIN_USERNAME'));
        cy.get('#password').clear();
        cy.get('#password').type(Cypress.env('ADMIN_PASSWORD'));
        cy.get('.submit').click();
        cy.get('.LinksGroup_headerLinkActive__qKWEL > div > .LinksGroup_menuLabel__rz1AM').should('have.text', 'Dashboard');
        cy.get('.Header_adminName__EGy0a').should('have.text', Cypress.env('ADMIN_USERNAME'));
        /* ==== End Cypress Studio ==== */
    });
});
