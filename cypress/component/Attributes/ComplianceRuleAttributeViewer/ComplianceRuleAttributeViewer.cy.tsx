import ComplianceRuleAttributeViewer from 'components/Attributes/ComplianceRuleAttributeViewer';
import '../../../../src/resources/styles/theme.scss';
import { componentLoadWait } from '../../../utils/constants';
import { complianceRuleAttributeViewerProps } from './mock-data';

describe('Compliance Attribute Viewer', () => {
    beforeEach(() => {
        cy.mount(<ComplianceRuleAttributeViewer attributes={complianceRuleAttributeViewerProps.attributes} />).wait(componentLoadWait);
    });
    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 2);
        cy.get('tr').should('have.length', 3);
        cy.get('td').should('have.length', 4);
    });

    it('should render correct heading', () => {
        cy.get('th').eq(0).should('contain.text', 'Name');
        cy.get('th').eq(1).should('contain.text', 'Value');
    });

    it('should render correct data', () => {
        cy.get('td').eq(0).should('contain.text', 'test-name-1');
        cy.get('td').eq(1).should('contain.text', 'test-data-1');
        cy.get('td').eq(2).should('contain.text', 'test-name-2');
        cy.get('td').eq(3).should('contain.text', 'true');
    });
});

describe('Compliance Attribute Viewer with descriptors', () => {
    beforeEach(() => {
        cy.mount(
            <ComplianceRuleAttributeViewer
                attributes={complianceRuleAttributeViewerProps.attributes}
                descriptorAttributes={complianceRuleAttributeViewerProps.descriptorAttributes}
            />,
        ).wait(componentLoadWait);
    });

    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 2);
        cy.get('tr').should('have.length', 5);
        cy.get('td').should('have.length', 8);
    });

    it('should render correct heading', () => {
        cy.get('th').eq(0).should('contain.text', 'Name');
        cy.get('th').eq(1).should('contain.text', 'Value');
    });

    it('should render correct data', () => {
        cy.get('td').eq(0).should('contain.text', 'test-name-1');
        cy.get('td').eq(1).should('contain.text', 'test-data-1');
        cy.get('td').eq(2).should('contain.text', 'test-name-2');
        cy.get('td').eq(3).should('contain.text', 'true');
        cy.get('td').eq(4).should('contain.text', 'test-descriptor-name-1');
        cy.get('td').eq(5).should('contain.text', 'test-data-1');
        cy.get('td').eq(6).should('contain.text', 'test-descriptor-name-2');
        cy.get('td').eq(7).should('contain.text', 'test-data-2');
    });
});
