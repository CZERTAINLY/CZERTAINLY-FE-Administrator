import AttributeViewer, { Props as AttributeViewerProps } from 'components/Attributes/AttributeViewer';
import { AttributeResponseModel } from 'types/attributes';
import { AttributeContentType, AttributeType } from 'types/openapi';
import '../../../../src/resources/styles/theme.scss';

const customAttributeViewerProps: AttributeViewerProps = {
    attributes: [
        {
            contentType: AttributeContentType.String,
            label: 'Test Label 1',
            name: 'test-name-1',
            type: AttributeType.Info,
            uuid: 'test-uuid-1',
            content: [
                {
                    data: 'test-data-1',
                },
            ],
        },
        {
            contentType: AttributeContentType.Boolean,
            label: 'Test Label 2',
            name: 'test-name-2',
            type: AttributeType.Info,
            uuid: 'test-uuid-2',
            content: [
                {
                    data: true,
                },
            ],
        },
    ] as AttributeResponseModel[],
};

describe('AttributeViewer', () => {
    it('renders', () => {
        cy.mount(<AttributeViewer {...customAttributeViewerProps} />);

        cy.get('table').should('exist');
        cy.get('table>tbody>tr').should('have.length', 2);
        cy.get('table>tbody>tr>td').should('have.length', 6);

        cy.get('table>tbody>tr>td').eq(0).should('have.text', 'Test Label 1');
        cy.get('table>tbody>tr>td').eq(1).should('have.text', 'string');
        cy.get('table>tbody>tr>td').eq(2).should('have.text', 'test-data-1');

        cy.get('table>tbody>tr>td').eq(3).should('have.text', 'Test Label 2');
        cy.get('table>tbody>tr>td').eq(4).should('have.text', 'boolean');
        cy.get('table>tbody>tr>td').eq(5).should('have.text', 'true');
    });
});
