import AttributeEditor from 'components/Attributes/AttributeEditor';
import { actions as authoritiesActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { transformAttributeDescriptorDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import { transformConnectorResponseDtoToModel } from 'ducks/transform/connectors';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { AttributeConstraintType, FunctionGroupCode } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { callbackWait, clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import { ConstraintCheckAttributeTestFormValues, constraintCheckAttributeEditorMockData, constraintTypesCheckMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';

const ConstraintCheckAuthorityProviderAttributeEditorComponent = () => {
    const authorityProviderAttributeDescriptors = useSelector(authoritySelectors.authorityProviderAttributeDescriptors) || [];
    const authoritySelector = useSelector(authoritySelectors.authority);
    const [authorityProvider, setAuthorityProvider] = useState<ConnectorResponseModel>();
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const editMode = true;

    const defaultValues: ConstraintCheckAttributeTestFormValues = useMemo(
        () => ({
            name: editMode ? authoritySelector?.name || undefined : undefined,
            authorityProvider: editMode
                ? authoritySelector?.connectorUuid
                    ? { value: authoritySelector.connectorUuid!, label: authoritySelector.connectorName! }
                    : undefined
                : undefined,
            storeKind: editMode
                ? authoritySelector
                    ? { value: authoritySelector?.kind, label: authoritySelector?.kind }
                    : undefined
                : undefined,
        }),
        [editMode, authoritySelector],
    );

    return (
        <Form onSubmit={() => {}} initialValues={defaultValues} mutators={{ ...mutators<ConstraintCheckAttributeTestFormValues>() }}>
            {({ handleSubmit, form, values }) => (
                <form onSubmit={handleSubmit}>
                    <AttributeEditor
                        id="authority"
                        attributeDescriptors={authorityProviderAttributeDescriptors}
                        attributes={authoritySelector?.attributes}
                        connectorUuid={authorityProvider?.uuid || ''}
                        functionGroupCode={FunctionGroupCode.AuthorityProvider}
                        kind={undefined}
                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                    />
                </form>
            )}
        </Form>
    );
};

describe('Constraint Checks: Authority Provider AttributeEditor', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__authority__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(<ConstraintCheckAuthorityProviderAttributeEditorComponent />).wait(componentLoadWait);
        cy.dispatchActions(
            authoritiesActions.listAuthorityProvidersSuccess({
                connectors: constraintCheckAttributeEditorMockData.connectorResponseDtoArray.map(transformConnectorResponseDtoToModel),
            }),
            customAttributesActions.listResourceCustomAttributesSuccess([]),
            authoritiesActions.getAuthorityProviderAttributesDescriptorsSuccess({
                attributeDescriptor: constraintCheckAttributeEditorMockData.attributeDescriptorDtoArray.map(
                    transformAttributeDescriptorDtoToModel,
                ),
            }),
        );
    });

    it(`Should select options and render callback attributes
        Should validate incorrect input and render error text`, () => {
        cySelectors.attributeSelectInput(getAttributeId('authority_credential_type')).selectOption('Basic').click().wait(clickWait);

        cy.dispatchActions(
            connectorActions.callbackSuccess({
                callbackId: getAttributeId('authority_credential'),
                data: constraintCheckAttributeEditorMockData.callbackSuccessObjectArray,
            }),
        ).wait(callbackWait);

        cySelectors.attributeSelectInput(getAttributeId('authority_credential')).selectOption('lab01-testssh').click().wait(clickWait);

        cySelectors.attributeInput(getAttributeId('authority_server_address')).all(({ input, invalidFeedback }) => {
            input().should('exist').type('test.');
            cy.get('body').click(200, 200);
            invalidFeedback().should('exist').should('contain.text', 'Enter Valid Address');
        });
    });

    it('should reset the redux state that was used', () => {
        cy.dispatchActions(authoritiesActions.resetState(), connectorActions.resetState(), customAttributesActions.resetState());
    });
});

describe.only('Constraint Checks: Basic Checks', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__test__.${fieldName}`;
    }

    function submit() {
        cy.get('#submit-button').click().wait(clickWait);
    }
    beforeEach(() => {
        cy.mount(
            <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor id="test" attributeDescriptors={constraintTypesCheckMockData.attributeDescriptors} />
                        <button id="submit-button">Submit</button>
                    </form>
                )}
            </Form>,
        ).wait(componentLoadWait);
    });

    it(`Constraint type: Range`, () => {
        cySelectors.attributeInput(getAttributeId('Integer')).input().type('0');
        submit();
        cySelectors.attributeInput(getAttributeId('Integer')).invalidFeedback().should('contain.text', 'Value should be between 1 and 10');

        cySelectors.attributeInput(getAttributeId('Integer')).input().type('{backspace}1');
        submit();
        cySelectors
            .attributeInput(getAttributeId('Integer'))
            .invalidFeedback()
            .should('not.contain.text', 'Value should be between 1 and 10');

        cySelectors.attributeInput(getAttributeId('Integer')).input().type('{backspace}2');
        submit();
        cySelectors
            .attributeInput(getAttributeId('Integer'))
            .invalidFeedback()
            .should('not.contain.text', 'Value should be between 1 and 10');

        cySelectors.attributeInput(getAttributeId('Integer')).input().type('{backspace}10');
        submit();
        cySelectors
            .attributeInput(getAttributeId('Integer'))
            .invalidFeedback()
            .should('not.contain.text', 'Value should be between 1 and 10');
    });

    it(`Constraint type: Regex`, () => {
        cySelectors.attributeInput(getAttributeId('String')).input().type('0');
        submit();
        cySelectors.attributeInput(getAttributeId('String')).invalidFeedback().should('contain.text', 'Value must conform to /^_(.*)_$/');

        cySelectors.attributeInput(getAttributeId('String')).input().type('{backspace}_test_');
        submit();
        cySelectors
            .attributeInput(getAttributeId('String'))
            .invalidFeedback()
            .should('not.contain.text', 'Value must conform to /^_(.*)_$/');
    });

    it(`Constraint type: Required Field`, () => {
        submit();
        cySelectors.attributeSelectInput(getAttributeId('TextSelect')).invalidFeedback().should('contain.text', 'Required Field');

        cySelectors.attributeSelectInput(getAttributeId('TextSelect')).selectOption('Option1').click().wait(clickWait);
        submit();
        cySelectors.attributeSelectInput(getAttributeId('TextSelect')).invalidFeedback().should('not.contain.text', 'Required Field');
    });
});
