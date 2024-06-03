import Footer from 'components/Layout/Footer';
import '../../../src/resources/styles/theme.scss';
import { componentLoadWait } from '../../utils/constants';

describe('Footer component', () => {
    it('should render footer', () => {
        cy.mount(<Footer />).wait(componentLoadWait);
        cy.get('footer').should('exist');
        cy.get('footer').should('contain', '© 2018-');
        cy.get('footer').should('contain', new Date().getFullYear());
        cy.get('footer').should('contain', 'CZERTAINLY s.r.o.');
        cy.get('a').eq(0).should('have.attr', 'href').and('include', 'https://docs.czertainly.com/docs');
        cy.get('footer').should('contain', 'Support');
        cy.get('a').eq(1).should('have.attr', 'href').and('include', 'https://czertainly.atlassian.net/servicedesk/customer/portal/1');
        cy.get('footer').should('contain', 'About Us');
        cy.get('a').eq(2).should('have.attr', 'href').and('include', 'https://www.czertainly.com');
    });
});
