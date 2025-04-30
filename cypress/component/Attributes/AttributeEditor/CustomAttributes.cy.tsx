import AttributeEditor from 'components/Attributes/AttributeEditor';
import { Form } from 'react-final-form';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait, fixtures } from '../../../utils/constants';
import { customAttributeEditorMockData, customNonRequiredAttributeEditorMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';

describe('Custom Attributes General Tests', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__${customAttributeEditorMockData.id}__.${fieldName}`;
    }
    beforeEach(() => {
        cy.mount(
            <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id={customAttributeEditorMockData.id}
                            attributeDescriptors={customAttributeEditorMockData.attributeDescriptors}
                        />
                    </form>
                )}
            </Form>,
        ).wait(componentLoadWait);
    });

    it('Should render a text input with correct label, placeholder, and description for "Test property string"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-1')).all(({ label, input, description }) => {
            label().should('contain.text', 'Test property string');
            input().should('have.attr', 'type', 'text');
            input().should('have.attr', 'placeholder', 'Enter Test property string');
            description().should('contain.text', 'test-description-string-1');
        });
    });

    it('Should render a disabled checkbox input with correct label, placeholder, and description for "Test property boolean"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-2')).all(({ label, input, description }) => {
            label().should('contain.text', 'Test property boolean');
            input().should('have.attr', 'type', 'checkbox').should('have.attr', 'disabled');
            input().should('have.attr', 'placeholder', 'Enter Test property boolean');
            description().should('contain.text', 'test-description-boolean-2');
        });
    });

    it('Should render a number input with correct label, placeholder, and description for "Test property integer"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-3')).all(({ label, input, description }) => {
            label().should('contain.text', 'Test property integer');
            input().should('have.attr', 'type', 'number');
            input().should('have.attr', 'placeholder', 'Enter Test property integer');
            description().should('contain.text', 'test-description-integer-3');
        });
    });

    it('Should render a select input with correct label, placeholder, and description for "Test property drop down"', () => {
        cySelectors.attributeSelectInput(getAttributeId('test-name-4')).all(({ label, placeholder, description }) => {
            label().should('contain.text', 'Test property drop down');
            placeholder().should('contain.text', 'Select Test property drop down');
            description().should('contain.text', 'test-description-drop-down-4');
        });
    });

    it('Should render a textarea input with code editor styling for "Test property codeblock"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-5.codeTextArea')).all(({ label, textarea }) => {
            label().should('contain.text', 'Test property codeblock');
            textarea().should('have.attr', 'class', 'npm__react-simple-code-editor__textarea');
        });
    });

    it('Should render a number input with correct label and placeholder for "test float property"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-6')).all(({ label, input }) => {
            label().should('contain.text', 'test float property');
            input().should('have.attr', 'type', 'number');
            input().should('have.attr', 'placeholder', 'Enter test float property');
        });
    });

    it('Should render a date input with correct label for "test date property"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-7')).all(({ label, input }) => {
            label().should('contain.text', 'test date property');
            input().should('have.attr', 'type', 'date');
        });
    });

    it('Should render a datetime-local input with correct label for "test datetime property"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-8')).all(({ label, input }) => {
            label().should('contain.text', 'test datetime property');
            input().should('have.attr', 'type', 'datetime-local');
        });
    });

    it('Should render a textarea input with correct placeholder for "test-property-text"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-9')).all(({ label, textarea }) => {
            label().should('contain.text', 'test-property-text *');
            textarea().should('have.attr', 'placeholder', 'Enter test-property-text');
        });
    });

    it('Should render a time input with correct label for "test-property-time"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-10')).all(({ label, input }) => {
            label().should('contain.text', 'test-property-time *');
            input().should('have.attr', 'type', 'time');
        });
    });

    it('Should render a file input with appropriate labels and placeholders for "test-property-file"', () => {
        cySelectors.attributeFileInput(getAttributeId('test-name-11')).all(({ input, label, selectFile, mimeInput, fileNameInput }) => {
            label().should('contain.text', 'test-property-file');
            input().should('have.attr', 'placeholder', 'Select or drag & drop test-property-file File');
            selectFile(fixtures.exampleJson);
            mimeInput().should('have.attr', 'value', 'application/json');
            fileNameInput().should('have.attr', 'value', fixtures.exampleJson);
        });
    });

    it('File input should allow drag and drop for file selection', () => {
        cySelectors.attributeFileInput(getAttributeId('test-name-11')).all(({ dragAndDropFile, fileNameInput }) => {
            dragAndDropFile('example.json');
            fileNameInput().should('have.attr', 'value', fixtures.exampleJson);
        });
    });

    it('Should render a hidden input for "test-name-12"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-12'), 'hidden').input().should('have.attr', 'type', 'hidden');
    });

    it('Should render a group heading with text "test-group"', () => {
        cySelectors.attributeInput(getAttributeId('test-name-6')).groupLabel().should('contain.text', 'test-group');
    });
});

describe('Non-Required Custom Attributes Selection', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__${customNonRequiredAttributeEditorMockData.id}__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(
            <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id={customAttributeEditorMockData.id}
                            attributes={customNonRequiredAttributeEditorMockData.attributes}
                            attributeDescriptors={customNonRequiredAttributeEditorMockData.attributeDescriptors}
                        />
                    </form>
                )}
            </Form>,
        ).wait(componentLoadWait);
    });

    it(`After selection non required attributes should be removed from selection dropdown
        When all non required attributes were selected, selection dropdown should be invisible
        `, () => {
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('Test property integer 3').should('exist').click().wait(clickWait);
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('Test property integer 3').should('not.exist');
        cy.get('body').click(200, 200);
        cySelectors.selectInput('selectAddCustomAttribute').all(({ control, options }) => {
            control().click().wait(clickWait);
            options().then((options) => {
                cy.get('body').click(200, 200);
                for (let i = 0; i < options.length; i++) {
                    cySelectors.selectInput('selectAddCustomAttribute').selectOption(0).should('exist').click().wait(clickWait);
                }
            });
        });

        cySelectors.selectInput('selectAddCustomAttribute').input().should('not.exist');
    });

    it(`Required attributes should be visible
        Non required attributes without a value should be initially invisible
        Non required attributes with a value should be visible
        Non required attributes should be visible after being selected in the dropdown menu
        `, () => {
        cySelectors.attributeInput(getAttributeId('test-name-1')).input().should('exist');
        cySelectors.attributeInput(getAttributeId('test-name-2')).input().should('exist');
        cySelectors.attributeInput(getAttributeId('test-name-3')).input().should('not.exist');

        cySelectors.selectInput('selectAddCustomAttribute').selectOption('Test property integer 3').click().wait(clickWait);

        cySelectors.attributeInput(getAttributeId('test-name-3')).input().should('exist');
    });

    it(`Non required attributes should render value correctly, if a value is present`, () => {
        cySelectors.attributeInput(getAttributeId('test-name-2')).input().should('have.value', 'test-content');
        cySelectors.attributeInput(getAttributeId('test-name-4')).input().should('be.checked');
        cySelectors.attributeSelectInput(getAttributeId('test-name-5')).value().should('contain.text', 'test-content-1');
        cySelectors.attributeSelectInput(getAttributeId('test-name-6'), 'multi').all(({ values }) => {
            values('test-content-1').value().should('exist');
            values('test-content-2').value().should('exist');
        });
    });

    it(`Non required attributes with default values should render the values, when selected.`, () => {
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('Test property boolean 8').click().wait(clickWait);
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('Test property string 9').click().wait(clickWait);
        cySelectors.attributeInput(getAttributeId('test-name-8')).input().should('be.checked');
        cySelectors.attributeInput(getAttributeId('test-name-9')).input().should('have.value', 'default-string');
    });
});
