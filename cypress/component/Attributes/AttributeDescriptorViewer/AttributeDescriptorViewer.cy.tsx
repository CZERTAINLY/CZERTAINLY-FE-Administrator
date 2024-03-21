import AttributeDescriptorViewer from 'components/Attributes/AttributeDescriptorViewer';
import '../../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../../utils/constants';
import { dataAttributeDescriptorProps, groupAttributeDescriptorProps, infoAttributeDescriptorProps } from './mock-data';

describe('Info  Attribute Descriptor Viewer', () => {
    beforeEach(() => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={infoAttributeDescriptorProps.attributeDescriptors} />).wait(
            componentLoadWait,
        );
    });

    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 6);
        cy.get('tr').should('have.length', 5);
        cy.get('td').should('have.length', 12);
    });

    it('should render correct heading', () => {
        cy.get('th').eq(1).should('contain.text', 'Label/Name');
        cy.get('th').eq(2).should('contain.text', 'Type');
        cy.get('th').eq(3).should('contain.text', 'Required');
        cy.get('th').eq(4).should('contain.text', 'Description');
        cy.get('th').eq(5).should('contain.text', 'Default Value');
    });

    it('should render correct data', () => {
        cy.get('td').eq(1).should('contain.text', 'Test Label 1');
        cy.get('td').eq(2).should('contain.text', 'info');
        cy.get('td').eq(3).should('contain.text', 'n/a');
        cy.get('td').eq(4).should('contain.text', 'test-description-1');
        cy.get('td').eq(5).should('contain.text', 'test-data-1');
        cy.get('td').eq(7).should('contain.text', 'Test Label 2');
        cy.get('td').eq(8).should('contain.text', 'info');
        cy.get('td').eq(9).should('contain.text', 'n/a');
        cy.get('td').eq(10).should('contain.text', 'test-description-2');
        cy.get('td').eq(11).should('contain.text', 'test-data-2');
    });

    it(`🟢 should show details of first row when clicked
        🟢 should have valid details
        🟢 should close the details of first row`, () => {
        cy.get('.fa-caret-down').eq(0).click().wait(clickWait);
        cy.get('td').eq(12).should('contain.text', 'Name');
        cy.get('td').eq(13).should('contain.text', 'test-name-1');
        cy.get('td').eq(14).should('contain.text', 'Description');
        cy.get('td').eq(15).should('contain.text', 'test-description-1');
        cy.get('td').eq(16).should('contain.text', 'Label');
        cy.get('td').eq(17).should('contain.text', 'Test Label 1');
        cy.get('td').eq(18).should('contain.text', 'Group');
        cy.get('td').eq(19).should('contain.text', 'test-group-1');
        cy.get('td').eq(20).should('contain.text', 'Content Type');
        cy.get('td').eq(21).should('contain.text', 'string');
        cy.get('td').eq(22).should('contain.text', 'Defaults');
        cy.get('td').eq(23).should('contain.text', 'test-data-1');
        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);
    });

    it(`🟢 should show details of second row when clicked
        🟢 should have valid details
        🟢 should close the details of second row
    `, () => {
        cy.get('.fa-caret-down').eq(1).click().wait(clickWait);
        cy.get('td').eq(18).should('contain.text', 'Name');
        cy.get('td').eq(19).should('contain.text', 'test-name-2');
        cy.get('td').eq(20).should('contain.text', 'Description');
        cy.get('td').eq(21).should('contain.text', 'test-description-2');
        cy.get('td').eq(22).should('contain.text', 'Label');
        cy.get('td').eq(23).should('contain.text', 'Test Label 2');
        cy.get('td').eq(24).should('contain.text', 'Group');
        cy.get('td').eq(25).should('contain.text', 'test-group-2');
        cy.get('td').eq(26).should('contain.text', 'Content Type');
        cy.get('td').eq(27).should('contain.text', 'string');
        cy.get('td').eq(28).should('contain.text', 'Defaults');
        cy.get('td').eq(29).should('contain.text', 'test-data-2');
        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);
    });
});

describe('Data Attribute Descriptor Viewer', () => {
    beforeEach(() => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={dataAttributeDescriptorProps.attributeDescriptors} />).wait(
            componentLoadWait,
        );
    });

    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 6);
        cy.get('tr').should('have.length', 5);
        cy.get('td').should('have.length', 12);
    });

    it('should render correct heading', () => {
        cy.get('th').eq(1).should('contain.text', 'Label/Name');
        cy.get('th').eq(2).should('contain.text', 'Type');
        cy.get('th').eq(3).should('contain.text', 'Required');
        cy.get('th').eq(4).should('contain.text', 'Description');
        cy.get('th').eq(5).should('contain.text', 'Default Value');
    });

    it('should render correct data', () => {
        cy.get('td').eq(1).should('contain.text', 'HTTPS Enabled');
        cy.get('td').eq(2).should('contain.text', 'data');
        cy.get('td').eq(3).should('contain.text', 'No');
        cy.get('td').eq(4).should('contain.text', 'Use https for connection with ADCS server');
        cy.get('td').eq(5).should('contain.text', 'false');
        cy.get('td').eq(7).should('contain.text', 'Port');
        cy.get('td').eq(8).should('contain.text', 'data');
        cy.get('td').eq(9).should('contain.text', 'Yes');
        cy.get('td').eq(10).should('contain.text', 'Define WinRM port, default port for http is 5985 and for https 5986.');
        cy.get('td').eq(11).should('contain.text', '5985');
    });

    it(`🟢 should show details of first row when clicked
        🟢 should have valid details
        🟢 should close the details of first row`, () => {
        cy.get('.fa-caret-down').eq(0).click().wait(clickWait);
        cy.get('td').eq(11).should('contain.text', 'Name');
        cy.get('td').eq(13).should('contain.text', 'https');
        cy.get('td').eq(14).should('contain.text', 'Description');
        cy.get('td').eq(15).should('contain.text', 'Use https for connection with ADCS server');
        cy.get('td').eq(16).should('contain.text', 'Label');
        cy.get('td').eq(17).should('contain.text', 'HTTPS Enabled');
        cy.get('td').eq(18).should('contain.text', 'Group');
        cy.get('td').eq(19).should('contain.text', 'Not set');
        cy.get('td').eq(20).should('contain.text', 'Content Type');
        cy.get('td').eq(21).should('contain.text', 'boolean');
        cy.get('td').eq(22).should('contain.text', 'Required');
        cy.get('td').eq(23).should('contain.text', 'No');
        cy.get('td').eq(24).should('contain.text', 'Read Only');
        cy.get('td').eq(25).should('contain.text', 'No');
        cy.get('td').eq(26).should('contain.text', 'List');
        cy.get('td').eq(27).should('contain.text', 'No');
        cy.get('td').eq(28).should('contain.text', 'Multiple Values');
        cy.get('td').eq(29).should('contain.text', 'No');
        cy.get('td').eq(30).should('contain.text', 'Validation Regex');
        cy.get('td').eq(31).should('contain.text', 'Not set');
        cy.get('td').eq(32).should('contain.text', 'Defaults');
        cy.get('td').eq(33).should('contain.text', 'false');
        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);
    });

    it(`🟢 should show details of second row when clicked
        🟢 should have valid details
        🟢 should close the details of first row`, () => {
        cy.get('.fa-caret-down').eq(1).click().wait(clickWait);
        cy.get('td').eq(18).should('contain.text', 'Name');
        cy.get('td').eq(19).should('contain.text', 'port');
        cy.get('td').eq(20).should('contain.text', 'Description');
        cy.get('td').eq(21).should('contain.text', 'Define WinRM port, default port for http is 5985 and for https 5986.');
        cy.get('td').eq(22).should('contain.text', 'Label');
        cy.get('td').eq(23).should('contain.text', 'Port');
        cy.get('td').eq(24).should('contain.text', 'Group');
        cy.get('td').eq(25).should('contain.text', 'Not set');
        cy.get('td').eq(26).should('contain.text', 'Content Type');
        cy.get('td').eq(27).should('contain.text', 'integer');
        cy.get('td').eq(28).should('contain.text', 'Required');
        cy.get('td').eq(29).should('contain.text', 'Yes');
        cy.get('td').eq(30).should('contain.text', 'Read Only');
        cy.get('td').eq(31).should('contain.text', 'No');
        cy.get('td').eq(32).should('contain.text', 'List');
        cy.get('td').eq(33).should('contain.text', 'No');
        cy.get('td').eq(34).should('contain.text', 'Multiple Values');
        cy.get('td').eq(35).should('contain.text', 'No');
        cy.get('td').eq(36).should('contain.text', 'Validation Regex');
        cy.get('td').eq(37).should('contain.text', 'Not set');
        cy.get('td').eq(38).should('contain.text', 'Defaults');
        cy.get('td').eq(39).should('contain.text', '5985');
        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);
    });
});

describe('Group Attribute Descriptor Viewer', () => {
    beforeEach(() => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={groupAttributeDescriptorProps.attributeDescriptors} />).wait(
            componentLoadWait,
        );
    });

    it('should render correct number of rows,columns and data elements', () => {
        cy.get('th').should('have.length', 6);
        cy.get('tr').should('have.length', 5);
        cy.get('td').should('have.length', 12);
    });

    it('should render correct heading', () => {
        cy.get('th').eq(1).should('contain.text', 'Label/Name');
        cy.get('th').eq(2).should('contain.text', 'Type');
        cy.get('th').eq(3).should('contain.text', 'Required');
        cy.get('th').eq(4).should('contain.text', 'Description');
        cy.get('th').eq(5).should('contain.text', 'Default Value');
    });

    it('should render correct data', () => {
        cy.get('td').eq(1).should('contain.text', 'raprofile_ca_select_group');
        cy.get('td').eq(2).should('contain.text', 'group');
        cy.get('td').eq(3).should('contain.text', 'n/a');
        cy.get('td').eq(4).should('contain.text', 'For identification of select CA method');
        cy.get('td').eq(5).should('contain.text', '');
        cy.get('td').eq(7).should('contain.text', 'raprofile_template_name');
        cy.get('td').eq(8).should('contain.text', 'group');
        cy.get('td').eq(9).should('contain.text', 'n/a');
        cy.get('td').eq(10).should('contain.text', 'Select certificate templates to use');
        cy.get('td').eq(11).should('contain.text', '');
    });

    it(`🟢 should show details of first row when clicked
        🟢 should have valid details
        🟢 should close the details of first row`, () => {
        cy.get('.fa-caret-down').eq(0).click().wait(clickWait);
        cy.get('td').eq(12).should('contain.text', 'Name');
        cy.get('td').eq(13).should('contain.text', 'raprofile_ca_select_group');
        cy.get('td').eq(14).should('contain.text', 'Description');
        cy.get('td').eq(15).should('contain.text', 'For identification of select CA method');
        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);
    });

    it(`🟢 should show details of second row when clicked
        🟢 should have valid details
        🟢 should close the details of second row`, () => {
        cy.get('.fa-caret-down').eq(1).click().wait(clickWait);
        cy.get('td').eq(18).should('contain.text', 'Name');
        cy.get('td').eq(19).should('contain.text', 'raprofile_template_name');
        cy.get('td').eq(20).should('contain.text', 'Description');
        cy.get('td').eq(21).should('contain.text', 'Select certificate templates to use');
        cy.get('.fa-caret-up').eq(0).click().wait(clickWait);
    });
});
