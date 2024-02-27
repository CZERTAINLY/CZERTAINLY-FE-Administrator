import AttributeEditor, { Props as AttributeProps } from 'components/Attributes/AttributeEditor';
import { Form } from 'react-final-form';
import { CustomAttributeModel, InfoAttributeModel } from 'types/attributes';
import { AttributeType } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';

const customAttributeEditorProps: AttributeProps = {
    id: 'test',
    attributeDescriptors: [
        {
            uuid: 'test-uuid-1',
            name: 'test-name-1',
            description: 'test-description-1',
            type: AttributeType.Data,
            contentType: 'string',
            properties: {
                label: 'Test Label 1',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            constraints: [
                {
                    description: 'Test Description 1',
                    errorMessage: 'Test Error Message 1',
                    type: 'test-type-1',
                    data: 'test-data-1',
                },
            ],
        },
        {
            uuid: 'test-uuid-2',
            name: 'test-name-2',
            description: 'test-description-2',
            content: [
                {
                    data: false,
                },
            ],
            type: AttributeType.Data,
            contentType: 'boolean',
            properties: {
                label: 'Test Label 2',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-3',
            name: 'test-name-3',
            description: 'test-description-3',
            content: [
                {
                    data: 5985,
                },
            ],
            type: AttributeType.Data,
            contentType: 'integer',
            properties: {
                label: 'Test Label 3',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-4',
            name: 'test-name-4',
            description: 'test-description-4',
            type: AttributeType.Data,
            contentType: 'credential',
            properties: {
                label: 'Test Label 4',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
    ] as CustomAttributeModel[],
};

const infoAttributeEditorProps: AttributeProps = {
    id: 'test1',
    attributeDescriptors: [
        {
            content: [{ data: 'test-data-1', reference: 'test-reference-1' }],
            contentType: 'string',
            description: 'test-description-1',
            name: 'test-name-1',
            type: 'info',
            uuid: 'test-uuid-1',
            properties: {
                label: 'Test Label 1',
                visible: true,
                group: 'test-group-1',
            },
        },
        {
            content: [{ data: 'test-data-2', reference: 'test-reference-2' }],
            contentType: 'string',
            description: 'test-description-2',
            name: 'test-name-2',
            type: 'info',
            uuid: 'test-uuid-2',
            properties: {
                label: 'Test Label 2',
                visible: true,
                group: 'test-group-2',
            },
        },
    ] as InfoAttributeModel[],
};

describe('AttributeEditor component 1', () => {
    it('should render Custom attribute editor', () => {
        cy.mount(
            <Form
                onSubmit={() => {
                    console.log('submit');
                }}
                mutators={{ ...mutators() }}
            >
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id={customAttributeEditorProps.id}
                            attributeDescriptors={customAttributeEditorProps.attributeDescriptors}
                        />
                    </form>
                )}
            </Form>,
        );
        cy.get('label').should('have.length', 4);
        // check label text
        cy.get('label').eq(0).should('contain.text', 'Test Label 1');
        cy.get('label').eq(1).should('contain.text', 'Test Label 2');
        cy.get('label').eq(2).should('contain.text', 'Test Label 3');
        cy.get('label').eq(3).should('contain.text', 'Test Label 4');

        // check input type
        cy.get('input').eq(0).should('have.attr', 'type', 'text');
        cy.get('input').eq(1).should('have.attr', 'type', 'checkbox');
        cy.get('input').eq(2).should('have.attr', 'type', 'number');
        cy.get('input').eq(3).should('have.attr', 'type', 'text');
    });
});

describe('AttributeEditor component 2', () => {
    it('should render info attribute editor', () => {
        cy.mount(
            <Form
                onSubmit={() => {
                    console.log('submit');
                }}
                mutators={{ ...mutators() }}
            >
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id={infoAttributeEditorProps.id}
                            attributeDescriptors={infoAttributeEditorProps.attributeDescriptors}
                        />
                    </form>
                )}
            </Form>,
        );

        cy.get('h5').should('have.length', 2);
        // check h5 text content
        cy.get('h5').eq(0).should('contain.text', 'test-group-1');
        cy.get('h5').eq(1).should('contain.text', 'test-group-2');

        cy.get('div').should('have.class', 'card-header');
        // check card-header text content
        cy.get('div.card-header').should('contain.text', 'Test Label 1');
        cy.get('div.card-header').should('contain.text', 'Test Label 1');

        cy.get('div').should('have.class', 'card-body');
        // check card-body text content
        cy.get('div.card-body').should('contain.text', 'test-data-2');
        cy.get('div.card-body').should('contain.text', 'test-data-2');
    });
});
