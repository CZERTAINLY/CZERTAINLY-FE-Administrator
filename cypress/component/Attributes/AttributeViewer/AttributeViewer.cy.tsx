import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import GlobalModal from 'components/GlobalModal';
import '../../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../../utils/constants';
import { attributeViewerProps } from './mock-data';

describe('AttributeViewer without Metadata', () => {
    beforeEach(() => {
        cy.mount(<AttributeViewer attributes={attributeViewerProps.attributes} />).wait(componentLoadWait);
    });
    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 4);
        cy.get('tr').should('have.length', 4);
        cy.get('td').should('have.length', 12);
    });

    it('should render correct heading', () => {
        cy.get('th').eq(0).should('contain.text', 'Name');
        cy.get('th').eq(1).should('contain.text', 'Content Type');
        cy.get('th').eq(2).should('contain.text', 'Content');
        cy.get('th').eq(3).should('contain.text', 'Actions');
    });

    it('should render correct data', () => {
        cy.get('td').eq(0).should('contain.text', 'Test Label 1');
        cy.get('td').eq(1).should('contain.text', 'string');
        cy.get('td').eq(2).should('contain.text', 'test-attribute-data-1');
        cy.get('td').eq(3).find('i.fa.fa-copy').should('exist');
        cy.get('td').eq(4).should('contain.text', 'Test Label 2');
        cy.get('td').eq(5).should('contain.text', 'boolean');
        cy.get('td').eq(6).should('contain.text', 'true');
        cy.get('td').eq(7).find('i.fa.fa-copy').should('exist');
        cy.get('td').eq(8).should('contain.text', 'Test Label 3');
        cy.get('td').eq(9).should('contain.text', 'codeblock');
        cy.get('td').eq(10).should('contain.text', 'html');
        cy.get('td').eq(11).find('i.fa.fa-copy').should('exist');
    });

    it(`🟢 check for clickable info icon for codeblock
        🟢 should open a modal on clicking the code block icon
        🟢 close the code block modal`, () => {
        cy.get('.fa-info').eq(0).click().wait(clickWait);
        cy.get('.modal-content').should('be.visible');
        cy.get('button').filter(':contains("Cancel")').click().wait(clickWait);
    });

    it(`should allow sorting of data
        🟢 check ascending and descending sorting for first column
        🟢 check ascending and descending sorting for second colum
        🟢 check ascending and descending sorting for third column`, () => {
        cy.get('.fa-arrow-up').eq(0).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(0).click().wait(clickWait);

        cy.get('.fa-arrow-up').eq(1).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(1).click().wait(clickWait);

        cy.get('.fa-arrow-up').eq(2).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(2).click().wait(clickWait);
    });
});

describe('AttributeViewer with Metadata', () => {
    beforeEach(() => {
        cy.mount(
            <>
                <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={attributeViewerProps.metadata} />
                <GlobalModal />
            </>,
        ).wait(componentLoadWait);
    });

    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 3);
        cy.get('tr').should('have.length', 5);
        cy.get('td').should('have.length', 6);
    });

    it(`should open first connector details
        🟢 check for correct heading
        🟢 check for correct number of rows,columns and data elements
        🟢 check for correct data
        🟢 check ascending and descending sorting for first column
        🟢 check ascending and descending sorting for second colum
        🟢 check ascending and descending sorting for third column`, () => {
        cy.get('.fa-caret-down').eq(0).click().wait(clickWait);
        cy.get('th').eq(2).should('contain.text', 'Source Object');
        cy.get('th').eq(3).should('contain.text', 'Name');
        cy.get('th').eq(4).should('contain.text', 'Content Type');
        cy.get('th').eq(5).should('contain.text', 'Content');

        cy.get('td').eq(3).should('contain.text', 'CA Name');
        cy.get('td').eq(5).should('contain.text', 'string');
        cy.get('td').eq(6).should('contain.text', 'Demo MS Sub CA');

        cy.get('td').eq(7).find('i.fa.fa-copy').should('exist');
        cy.get('td').eq(8).should('contain.text', 'Certificate Template Name');
        cy.get('td').eq(9).should('contain.text', 'string');
        cy.get('td').eq(10).should('contain.text', 'WebServer');

        cy.get('.fa-arrow-up').eq(1).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(1).click().wait(clickWait);

        cy.get('.fa-arrow-up').eq(2).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(2).click().wait(clickWait);

        cy.get('.fa-arrow-up').eq(3).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(3).click().wait(clickWait);

        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);
    });

    it(`should open second connector details
    🟢 check for correct heading
    🟢 check for correct number of rows,columns and data elements
    🟢 check for correct data
    🟢 check ascending and descending sorting for first column
    🟢 check ascending and descending sorting for second colum
    🟢 check ascending and descending sorting for third column`, () => {
        cy.get('.fa-caret-down').eq(1).click().wait(clickWait);
        cy.get('th').eq(2).should('contain.text', 'Source Object');
        cy.get('th').eq(3).should('contain.text', 'Name');
        cy.get('th').eq(4).should('contain.text', 'Content Type');
        cy.get('th').eq(5).should('contain.text', 'Content');

        cy.get('td').eq(6).should('contain.text', 'Discovery Source');
        cy.get('td').eq(7).should('contain.text', 'Discovery Source');
        cy.get('td').eq(8).should('contain.text', 'string');

        cy.get('td').eq(8).should('contain.text', 'string');
        cy.get('td').eq(9).should('contain.text', 'ADCS-through-proxy');
        cy.get('td').eq(10).find('i.fa.fa-copy').should('exist');

        if (!Cypress.isBrowser('firefox')) {
            cy.get('td').eq(10).find('i.fa.fa-copy').should('exist').click().wait(clickWait);
        }
        cy.get('td').eq(11).should('contain.text', 'Discovery Source');

        cy.get('.fa-arrow-up').eq(1).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(1).click().wait(clickWait);

        cy.get('.fa-arrow-up').eq(2).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(2).click().wait(clickWait);

        cy.get('.fa-arrow-up').eq(3).click().wait(clickWait);
        cy.get('.fa-arrow-down').eq(3).click().wait(clickWait);

        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);

        cy.get('.fa-arrow-up').eq(0).click().wait(clickWait);
    });

    it(`should check if source object table is opened in modal`, () => {
        cy.get('.fa-caret-down').eq(0).click().wait(clickWait);
        cy.get('.fa-info').eq(0).click().wait(clickWait);

        cy.get('.modal-content').should('be.visible');
        cy.get('button').filter(':contains("Close")').click().wait(clickWait);
    });
});
