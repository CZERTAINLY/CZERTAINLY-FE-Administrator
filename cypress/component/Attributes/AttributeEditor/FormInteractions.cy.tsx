import AttributeEditor from 'components/Attributes/AttributeEditor';
import { Form } from 'react-final-form';
import {
    AttributeDescriptorModel,
    AttributeRequestModel,
    AttributeResponseModel,
    CodeBlockAttributeContentModel,
    CredentialAttributeContentModel,
    FileAttributeContentModel,
    ObjectAttributeContentModel,
    SecretAttributeContentModel,
} from 'types/attributes';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait, fixtures } from '../../../utils/constants';
import { attributeContentTypesMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';
import { createInvocationInterceptor } from '../../../utils/invocationInterceptor';
import { collectFormAttributes } from 'utils/attributes/attributes';
import { base64ToUtf8 } from 'utils/common-utils';

function getAttributeId(fieldName: string) {
    return `__attributes__test__.${fieldName}`;
}
function getAttributeModel(name: string, attributes: AttributeRequestModel[]) {
    return attributes.find((attribute) => attribute.name === name);
}

interface Props {
    onSubmit: (...args: any) => void;
    attributes?: AttributeResponseModel[];
    attributeDescriptors: AttributeDescriptorModel[];
}

const FormInteractionsAttributeEditorComponent = ({ onSubmit, attributes, attributeDescriptors }: Props) => {
    return (
        <>
            <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor id="test" attributeDescriptors={attributeDescriptors} attributes={attributes} />
                        <button id="submit-button">Submit</button>
                    </form>
                )}
            </Form>
        </>
    );
};

describe('Form Interactions: Basic Fields', () => {
    const { invocationInterceptor, invocationListener } = createInvocationInterceptor('formSubmission', (formData) =>
        collectFormAttributes('test', attributeContentTypesMockData.basicFields.attributeDescriptors, formData),
    );

    function testSubmission(testFunction: (attributes: AttributeRequestModel[]) => void) {
        cy.get('#submit-button').click().wait(clickWait);
        invocationListener((args) => testFunction(args));
    }

    beforeEach(() => {
        cy.mount(
            <FormInteractionsAttributeEditorComponent
                onSubmit={invocationInterceptor}
                attributes={attributeContentTypesMockData.basicFields.attributes}
                attributeDescriptors={attributeContentTypesMockData.basicFields.attributeDescriptors}
            />,
        ).wait(componentLoadWait);
    });

    it(`Content Type: String`, () => {
        cySelectors.attributeInput(getAttributeId('String')).input().type('string');
        testSubmission((attributes) => {
            expect(getAttributeModel('String', attributes)?.content[0].data).to.equal('string');
        });
    });
    it(`Content Type: Text`, () => {
        cySelectors.attributeInput(getAttributeId('Text')).textarea().type('string');
        testSubmission((attributes) => {
            expect(getAttributeModel('Text', attributes)?.content[0].data).to.equal('string');
        });
    });

    it(`Content Type: Integer`, () => {
        cySelectors.attributeInput(getAttributeId('Integer')).input().type('string123');
        testSubmission((attributes) => {
            expect(getAttributeModel('Integer', attributes)?.content[0].data).to.equal('123');
        });
    });
    it(`Content Type: Boolean`, () => {
        cySelectors.attributeInput(getAttributeId('Boolean')).input().check();
        testSubmission((attributes) => {
            expect(getAttributeModel('Boolean', attributes)?.content[0].data).to.equal(true);
        });
    });
    it(`Content Type: Float`, () => {
        cySelectors.attributeInput(getAttributeId('Float')).input().type('string1.24');
        testSubmission((attributes) => {
            expect(getAttributeModel('Float', attributes)?.content[0].data).to.equal('1.24');
        });
    });
    it(`Content Type: Date`, () => {
        cySelectors.attributeInput(getAttributeId('Date')).input().type('2023-01-02');
        testSubmission((attributes) => {
            expect(getAttributeModel('Date', attributes)?.content[0].data).to.equal('2023-01-02');
        });
    });
    it(`Content Type: Time`, () => {
        cySelectors.attributeInput(getAttributeId('Time')).input().type('08:30');
        testSubmission((attributes) => {
            expect(getAttributeModel('Time', attributes)?.content[0].data).to.equal('08:30');
        });
    });
    it(`Content Type: Datetime`, () => {
        const localInput = '2017-06-01T08:30';
        const expectedUtc = new Date(localInput).toISOString();

        cySelectors.attributeInput(getAttributeId('DatetimeSimple')).input().type(localInput);
        testSubmission((attributes) => {
            expect(getAttributeModel('DatetimeSimple', attributes)?.content[0].data).to.equal(expectedUtc);
        });
    });

    it(`Content Type: Datetime Select;`, () => {
        const localInput = '2017-06-01T08:30';
        const expectedUtc = new Date(localInput).toISOString();

        cySelectors.attributeSelectInput(getAttributeId('DatetimeSelect')).selectOption(localInput).click().wait(clickWait);

        testSubmission((attributes) => {
            expect(getAttributeModel('DatetimeSelect', attributes)?.content[0].data).to.equal(expectedUtc);
        });
    });

    it(`Content Type: Datetime MultiSelect;`, () => {
        const localInput = '2017-06-01T08:30';
        const expectedUtc = new Date(localInput).toISOString();

        cySelectors.attributeSelectInput(getAttributeId('DatetimeMultiselect'), 'multi').selectOption(localInput).click().wait(clickWait);

        testSubmission((attributes) => {
            expect(getAttributeModel('DatetimeMultiselect', attributes)?.content[0].data).to.equal(expectedUtc);
        });
    });

    it(`Content Type: Secret`, () => {
        cySelectors.attributeInput(getAttributeId('Secret')).input().type('string');
        testSubmission((attributes) => {
            const attribute = getAttributeModel('Secret', attributes)!;
            expect((attribute.content[0] as SecretAttributeContentModel).data.secret).to.equal('string');
        });
    });

    it(`Content Type: File`, () => {
        cySelectors.attributeFileInput(getAttributeId('File')).selectFile(fixtures.exampleJson);
        testSubmission((attributes) => {
            const { content, fileName, mimeType } = (getAttributeModel('File', attributes)?.content[0] as FileAttributeContentModel).data;
            expect(content).to.equal(
                'ewogICAgIm5hbWUiOiAiVXNpbmcgZml4dHVyZXMgdG8gcmVwcmVzZW50IGRhdGEiLAogICAgImVtYWlsIjogImhlbGxvQGN5cHJlc3MuaW8iLAogICAgImJvZHkiOiAiRml4dHVyZXMgYXJlIGEgZ3JlYXQgd2F5IHRvIG1vY2sgZGF0YSBmb3IgcmVzcG9uc2VzIHRvIHJvdXRlcyIKfQo=',
            );
            expect(fileName).to.equal(fixtures.exampleJson);
            expect(mimeType).to.equal('application/json');
        });
    });

    it(`Content Type: File; With a default value`, () => {
        testSubmission((attributes) => {
            const { content, fileName, mimeType } = (getAttributeModel('DefaultFile', attributes)?.content[0] as FileAttributeContentModel)
                .data;
            expect(content).to.equal('content');
            expect(fileName).to.equal(fixtures.exampleJson);
            expect(mimeType).to.equal('application/json');
        });
    });

    it(`Content Type: File; With a set value`, () => {
        testSubmission((attributes) => {
            const { content, fileName, mimeType } = (getAttributeModel('SetFile', attributes)?.content[0] as FileAttributeContentModel)
                .data;
            expect(content).to.equal('content');
            expect(fileName).to.equal(fixtures.exampleJson);
            expect(mimeType).to.equal('application/json');
        });
    });

    it(`Content Type: Credential`, () => {
        cySelectors.attributeSelectInput(getAttributeId('Credential')).selectOption('Credential1').click().wait(clickWait);
        testSubmission((attributes) => {
            const { uuid, name } = (getAttributeModel('Credential', attributes)?.content[0] as CredentialAttributeContentModel).data;
            expect(uuid).to.equal('0bc86bea-d2cf-4ca2-ac8f-01d5d3d99c73');
            expect(name).to.equal('Credential1');
        });
    });

    it(`Content Type: Codeblock`, () => {
        cySelectors.attributeInput(getAttributeId('Codeblock.codeTextArea')).textarea().type('string');
        testSubmission((attributes) => {
            const { code } = (getAttributeModel('Codeblock', attributes)?.content[0] as CodeBlockAttributeContentModel).data;
            expect(base64ToUtf8(code)).to.equal('string');
        });
    });
    it(`Content Type: Object`, () => {
        cySelectors.attributeSelectInput(getAttributeId('Object')).selectOption('Object1').click().wait(clickWait);
        testSubmission((attributes) => {
            const data = (getAttributeModel('Object', attributes)?.content[0] as ObjectAttributeContentModel).data;
            expect((data as any).prop1).to.equal('prop1');
            expect((data as any).prop2).to.equal('prop2');
        });
    });
});

describe('Form Interactions: Custom Attributes', () => {
    const { invocationInterceptor, invocationListener } = createInvocationInterceptor('formSubmission', (formData) =>
        collectFormAttributes('test', attributeContentTypesMockData.customAttributes.attributeDescriptors, formData),
    );

    function testSubmission(testFunction: (attributes: AttributeRequestModel[]) => void) {
        cy.get('#submit-button').click().wait(clickWait);
        invocationListener((args) => testFunction(args));
    }

    beforeEach(() => {
        cy.mount(
            <FormInteractionsAttributeEditorComponent
                onSubmit={invocationInterceptor}
                attributeDescriptors={attributeContentTypesMockData.customAttributes.attributeDescriptors}
            />,
        ).wait(componentLoadWait);
    });

    it(`Should not pass non required attributes with default value, if unselected`, () => {
        testSubmission((attributes) => {
            expect(getAttributeModel('CustomString', attributes)).to.be.undefined;
        });
    });

    it(`Should pass non required attributes with default value, if selected`, () => {
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('CustomString').click().wait(clickWait);
        testSubmission((attributes) => {
            expect(getAttributeModel('CustomString', attributes)?.content[0].data).to.equal('default-content');
        });
    });

    it(`Should pass untouched required boolean attributes`, () => {
        testSubmission((attributes) => {
            expect(getAttributeModel('CustomRequiredBoolean', attributes)?.content[0].data).to.equal(false);
        });
    });

    it(`Should pass non required boolean attribute, if checked and unchecked`, () => {
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('CustomBoolean').click().wait(clickWait);
        cySelectors.attributeInput(getAttributeId('CustomBoolean')).input().check();
        cySelectors.attributeInput(getAttributeId('CustomBoolean')).input().uncheck();
        testSubmission((attributes) => {
            expect(getAttributeModel('CustomBoolean', attributes)?.content[0].data).to.equal(false);
        });
    });

    it(`Should pass multiselect attribute values`, () => {
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('CustomMultiselectText').click().wait(clickWait);
        cySelectors.attributeSelectInput(getAttributeId('CustomMultiselectText'), 'multi').all(({ selectOption, values }) => {
            selectOption('Option1').click().wait(clickWait);
            selectOption('Option2').click().wait(clickWait);
            values('Option2').delete().click().wait(clickWait);
            selectOption('Option3')
                .click()
                .wait(clickWait * 2);
        });
        testSubmission((attributes) => {
            expect(getAttributeModel('CustomMultiselectText', attributes)?.content).to.deep.include.members([
                { data: 'Option1' },
                { data: 'Option3' },
            ]);
            expect(getAttributeModel('CustomMultiselectText', attributes)?.content).to.not.deep.include.members([
                { data: 'Option2' },
                { data: 'Option4' },
            ]);
        });
    });

    it(`Should pass multiselect reference values`, () => {
        cySelectors.selectInput('selectAddCustomAttribute').selectOption('CustomMultiselectReference').click().wait(clickWait);
        cySelectors.attributeSelectInput(getAttributeId('CustomMultiselectReference'), 'multi').all(({ selectOption }) => {
            selectOption('Option1').click().wait(clickWait);
            selectOption('Option2')
                .click()
                .wait(clickWait * 2);
        });
        testSubmission((attributes) => {
            expect(getAttributeModel('CustomMultiselectReference', attributes)?.content).to.deep.include.members([
                { data: 'Option1', reference: 'Option1' },
                { data: 'Option2', reference: 'Option2' },
            ]);
        });
    });
});
