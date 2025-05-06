import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import { actions as certificateGroupActions } from 'ducks/certificateGroups';
import { actions as connectorActions, slice } from 'ducks/connectors';
import { actions as cryptographicKeyActions, selectors as cryptographicKeysSelectors } from 'ducks/cryptographic-keys';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as tokenProfileActions } from 'ducks/token-profiles';
import { transformAttributeDescriptorDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import { transformCertificateGroupResponseDtoToModel } from 'ducks/transform/certificateGroups';
import { transformTokenProfileResponseDtoToModel } from 'ducks/transform/token-profiles';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { Resource } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { callbackWait, clickWait, componentLoadWait } from '../../../utils/constants';
import { TabAttributeFormValues, tabAttributeEditorMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';

const TabAttributeEditor = () => {
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const cryptographicKeyAttributeDescriptors = useSelector(cryptographicKeysSelectors.keyAttributeDescriptors);
    const keyDetail = useSelector(cryptographicKeysSelectors.cryptographicKey);

    const defaultValues: TabAttributeFormValues = useMemo(
        () => ({
            raProfile: null,
            pkcs10: null,
            fileName: '',
            contentType: '',
            file: '',
        }),
        [],
    );

    return (
        <Form initialValues={defaultValues} onSubmit={() => {}} mutators={{ ...mutators<TabAttributeFormValues>() }}>
            {({ handleSubmit, valid, submitting, values, form }) => (
                <form onSubmit={handleSubmit}>
                    <TabLayout
                        tabs={[
                            {
                                title: 'Connector Attributes',
                                content: (
                                    <AttributeEditor
                                        id="cryptographicKey"
                                        callbackParentUuid={
                                            keyDetail?.tokenProfileUuid ?? form.getFieldState('tokenProfile')?.value?.value.uuid ?? ''
                                        }
                                        callbackResource={Resource.Keys}
                                        attributeDescriptors={cryptographicKeyAttributeDescriptors ?? []}
                                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                    />
                                ),
                            },
                            {
                                title: 'Custom Attributes',
                                content: (
                                    <AttributeEditor
                                        id="customCryptographicKey"
                                        attributeDescriptors={resourceCustomAttributes}
                                        attributes={keyDetail?.customAttributes}
                                    />
                                ),
                            },
                        ]}
                    />
                </form>
            )}
        </Form>
    );
};

describe('Tab AttributeEditor Component', () => {
    function getAttributeIdInKeyEditor(fieldName: string) {
        return `__attributes__cryptographicKey__.${fieldName}`;
    }

    function getAttributeIdInCustomEditor(fieldName: string) {
        return `__attributes__customCryptographicKey__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(<TabAttributeEditor />).wait(componentLoadWait);
        cy.dispatchActions(
            tokenProfileActions.listTokenProfilesSuccess({
                tokenProfiles: tabAttributeEditorMockData.tokenProfileDtoArray.map(transformTokenProfileResponseDtoToModel),
            }),
            certificateGroupActions.listGroupsSuccess({
                groups: tabAttributeEditorMockData.certificateGroupSelectArray.map(transformCertificateGroupResponseDtoToModel),
            }),

            customAttributesActions.listResourceCustomAttributesSuccess(
                tabAttributeEditorMockData.customAttributeDtoArray.map(transformCustomAttributeDtoToModel),
            ),
            cryptographicKeyActions.listAttributeDescriptorsSuccess({
                uuid: '6c78130f-8aa3-4862-9a93-61329347f1bd',
                attributeDescriptors: tabAttributeEditorMockData.baseAttributeDtoArray.map(transformAttributeDescriptorDtoToModel),
            }),
        );
    });
    it(`Should fill the necessary inputs, and set necessary select values
        Should not reset state after switching the tab
        Should render callback attributes correctly
        `, () => {
        cySelectors.attributeInput(getAttributeIdInKeyEditor('data_keyAlias')).all(({ input }) => {
            input().should('have.attr', 'type', 'text');
            input().should('have.attr', 'placeholder', 'Enter Cryptographic Key Alias').type('test-key');
        });

        cy.get('.nav-link').eq(1).should('contain.text', 'Custom Attributes').click().wait(clickWait);

        cySelectors.attributeSelectInput(getAttributeIdInCustomEditor('Distribution method')).selectOption(0).click().wait(clickWait);

        cy.get('.nav-link').eq(0).should('contain.text', 'Connector Attributes').click().wait(clickWait);

        cySelectors.attributeInput(getAttributeIdInKeyEditor('data_keyAlias')).input().should('have.value', 'test-key');

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeIdInKeyEditor('data_keyAlgorithm')).selectOption(0).click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                console.log({ payload, data: tabAttributeEditorMockData.callbackSuccessObjectArray });
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: '__attributes__cryptographicKey__.group_keySpec',
                        data: tabAttributeEditorMockData.callbackSuccessObjectArray,
                    }),
                ).wait(callbackWait);
            },
        );

        cySelectors.attributeSelectInput(getAttributeIdInKeyEditor('data_rsaKeySize')).selectOption(0).click().wait(clickWait);
    });

    it(`Reset the redux state that was used`, () => {
        cy.dispatchActions(
            cryptographicKeyActions.resetState(),
            certificateGroupActions.resetState(),
            tokenProfileActions.resetState(),
            customAttributesActions.resetState(),
        );
    });
});
