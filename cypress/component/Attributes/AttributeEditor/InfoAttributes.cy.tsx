import AttributeEditor from 'components/Attributes/AttributeEditor';
import { Form } from 'react-final-form';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { componentLoadWait } from '../../../utils/constants';
import { infoAttributeEditorMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';

describe('Info Attributes', () => {
    beforeEach(() => {
        cy.mount(
            <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id={infoAttributeEditorMockData.id}
                            attributeDescriptors={infoAttributeEditorMockData.attributeDescriptors}
                        />
                    </form>
                )}
            </Form>,
        ).wait(componentLoadWait);
    });

    it('Should display an attribute group with correct string and text attribute info cards', () => {
        cySelectors.attributeInfoCard('test-name-1').all(({ header, body, groupLabel }) => {
            groupLabel().should('contain.text', 'test-group-1');
            header().should('contain.text', 'Test Label String 1');
            body().get('p').should('contain.text', 'test-data-1');
        });
        cySelectors.attributeInfoCard('test-name-2').all(({ header, body }) => {
            header().should('contain.text', 'Test Label Text 2');
            body().get('p').should('contain.text', 'test-data-2');
        });
    });

    it('Should display an attribute group with correct date, datetime, and time attribute info cards', () => {
        cySelectors.attributeInfoCard('test-name-3').all(({ header, body, groupLabel }) => {
            groupLabel().should('contain.text', 'test-group-2');
            header().should('contain.text', 'Test Label date 3');
            body().get('p').should('contain.text', '2022-01-01');
        });
        cySelectors.attributeInfoCard('test-name-4').all(({ header, body }) => {
            header().should('contain.text', 'Test Label datetime 4');
            body().get('p').should('contain.text', '2022-01-01');
        });
        cySelectors.attributeInfoCard('test-name-5').all(({ header, body }) => {
            header().should('contain.text', 'Test Label time 5');
            body().get('p').should('contain.text', '00:00:00');
        });
    });

    it('Should display an attribute group with correct integer and float attribute info cards', () => {
        cySelectors.attributeInfoCard('test-name-6').all(({ header, body, groupLabel }) => {
            groupLabel().should('contain.text', 'test-group-3');
            header().should('contain.text', 'Test Label integer 6');
            body().get('p').should('contain.text', '123');
        });
        cySelectors.attributeInfoCard('test-name-7').all(({ header, body }) => {
            header().should('contain.text', 'Test Label float 7');
            body().get('p').should('contain.text', '1.5');
        });
    });

    it('Should display an attribute group with correct codeblock and file attribute info cards', () => {
        cySelectors.attributeInfoCard('test-name-8').all(({ header, body, groupLabel }) => {
            groupLabel().should('contain.text', 'test-group-4');
            header().should('contain.text', 'test-property-codeblock');
            body().get('p').should('contain.text', '[object Object]');
        });
        cySelectors.attributeInfoCard('test-name-9').all(({ header, body }) => {
            header().should('contain.text', 'test-property-file');
            body().get('p').should('contain.text', 'test.txt');
        });
    });

    it('Should display an attribute group with correct credential and secret attribute info cards', () => {
        cySelectors.attributeInfoCard('test-name-10').all(({ header, body, groupLabel }) => {
            groupLabel().should('contain.text', 'test-group-5');
            header().should('contain.text', 'Test property Credential');
            body().get('p').should('contain.text', 'test-reference-content-1, test-reference-content-2');
        });
        cySelectors.attributeInfoCard('test-name-11').all(({ header, body }) => {
            header().should('contain.text', 'Test property secret');
            body().get('p').should('contain.text', 'Web Server');
        });
    });
});
