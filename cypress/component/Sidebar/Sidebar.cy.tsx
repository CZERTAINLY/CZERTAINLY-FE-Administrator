import Sidebar from 'components/Layout/Sidebar';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';

describe('Sidebar component', () => {
    it('should render sidebar', () => {
        cy.mount(<Sidebar />).wait(componentLoadWait);
        cy.get('nav > div').contains('Dashboard').click().wait(clickWait);
        cy.get('nav > div').contains('Connectors').click().wait(clickWait);
        cy.get('nav > div').contains('Access Control').click().wait(clickWait);
        cy.get('nav > div').contains('Profiles').click().wait(clickWait);
        cy.get('nav > div').contains('Inventory').click().wait(clickWait);
        cy.get('nav > div').contains('Protocols').click().wait(clickWait);
        cy.get('nav > div').contains('Approvals').click().wait(clickWait);
        cy.get('nav > div').contains('Scheduler').click().wait(clickWait);
        cy.get('nav > div').contains('Settings').click().wait(clickWait);
        cy.get('nav > div').contains('Audit Logs').click().wait(clickWait);
    });
});
