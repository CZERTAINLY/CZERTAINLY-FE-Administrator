import AttributeEditor from 'components/Attributes/AttributeEditor';
import GlobalModal from 'components/GlobalModal';
import TabLayout from 'components/Layout/TabLayout';
import { actions as connectorActions, slice } from 'ducks/connectors';
import { actions as credentialActions } from 'ducks/credentials';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as entityActions, selectors as entitySelectors } from 'ducks/entities';
import { transformAttributeDescriptorDtoToModel } from 'ducks/transform/attributes';
import { transformConnectorResponseDtoToModel } from 'ducks/transform/connectors';
import { actions as userInterfaceActions } from 'ducks/user-interface';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { EntityResponseModel } from 'types/entities';
import { FunctionGroupCode } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { callbackWait, clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import { GlobalModalAttributeEditorFormValues, globalModalAttributeEditorMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';

const GlobalModalAttributeEditor = () => {
    const editMode = false;
    const [entity, setEntity] = useState<EntityResponseModel>();
    const [entityProvider, setEntityProvider] = useState<ConnectorResponseModel>();
    const entityProviderAttributeDescriptors = useSelector(entitySelectors.entityProviderAttributeDescriptors);
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const defaultValues: GlobalModalAttributeEditorFormValues = useMemo(() => {
        const entityProvider = entity?.connectorUuid ? { value: entity.connectorUuid!, label: entity.connectorName! } : undefined;

        return {
            name: editMode ? entity?.name || undefined : undefined,
            entityProvider: editMode ? entityProvider : undefined,
            storeKind: editMode ? (entity ? { value: entity?.kind, label: entity?.kind } : undefined) : undefined,
        };
    }, [editMode, entity]);

    return (
        <>
            <Form initialValues={defaultValues} onSubmit={() => {}} mutators={{ ...mutators<GlobalModalAttributeEditorFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <TabLayout
                        tabs={[
                            {
                                title: 'Connector Attributes',
                                content: (
                                    <AttributeEditor
                                        id="entity"
                                        attributeDescriptors={entityProviderAttributeDescriptors || []}
                                        attributes={entity?.attributes}
                                        connectorUuid={entityProvider?.uuid || ''}
                                        functionGroupCode={FunctionGroupCode.EntityProvider}
                                        kind={values?.storeKind?.value}
                                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                    />
                                ),
                            },
                            {
                                title: 'Custom Attributes',
                                content: (
                                    <AttributeEditor
                                        id="customEntity"
                                        attributeDescriptors={resourceCustomAttributes}
                                        attributes={entity?.customAttributes}
                                    />
                                ),
                            },
                        ]}
                    />
                )}
            </Form>
            <GlobalModal />
        </>
    );
};

describe('Global Modal AttributeEditor component', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__entity__.${fieldName}`;
    }

    before(() => {
        cy.mount(<GlobalModalAttributeEditor />).wait(componentLoadWait);
        cy.dispatchActions(
            entityActions.listEntityProvidersSuccess({
                providers: globalModalAttributeEditorMockData.connectorDtoArrayOne.map(transformConnectorResponseDtoToModel),
            }),
            customAttributesActions.listResourceCustomAttributesSuccess([]),
            entityActions.getEntityProviderAttributesDescriptorsSuccess({
                attributeDescriptor: globalModalAttributeEditorMockData.baseAttributeDtoArrayOne.map(
                    transformAttributeDescriptorDtoToModel,
                ),
            }),
        );
    });

    it(`Should fill the necessary inputs and select values
        Should open global modal and fill credential fields correctly
        Should render callback attributes after creating new credential
        Should auto fill the value dropdown in the credential select
        `, () => {
        cySelectors.attributeInput(getAttributeId('host')).input().should('exist').type('test');

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('authType')).selectOption(0).click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                console.log({ payload, data: globalModalAttributeEditorMockData.callbackSuccessObjectArrayOne });
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: getAttributeId('credential'),
                        data: globalModalAttributeEditorMockData.callbackSuccessObjectArrayOne,
                    }),
                ).wait(callbackWait);
            },
        );

        cySelectors.attributeSelectInput(getAttributeId('credential')).all(({ addNew, control }) => {
            control().click().wait(clickWait);
            addNew().should('exist').click().wait(clickWait);
        });

        cy.dispatchActions(
            userInterfaceActions.showGlobalModal({ ...globalModalAttributeEditorMockData.globalModalModelObject }),
            customAttributesActions.listCustomAttributesSuccess([]),
            credentialActions.listCredentialProvidersSuccess({
                connectors: globalModalAttributeEditorMockData.connectorDtoArrayTwo.map(transformConnectorResponseDtoToModel),
            }),
            customAttributesActions.listResourceCustomAttributesSuccess([]),
        ).wait(reduxActionWait);

        cy.get('input[name="name"]').should('exist').type('test-credential');

        cySelectors.attributeSelectInput('credentialProvider').selectOption(0).click().wait(clickWait);
        cySelectors.attributeSelectInput('storeKind').selectOption(0).click().wait(clickWait);

        cy.dispatchActions(
            credentialActions.getCredentialProviderAttributesDescriptorsSuccess({
                credentialProviderAttributesDescriptors: globalModalAttributeEditorMockData.baseAttributeDtoArrayTwo.map(
                    transformAttributeDescriptorDtoToModel,
                ),
            }),
            credentialActions.createCredentialSuccess({ uuid: '2b2c6e64-9081-4750-a062-c84be728202d' }),
            userInterfaceActions.resetState(),
            userInterfaceActions.setInitiateAttributeCallback(true),
            userInterfaceActions.setAttributeCallbackValue('testabc123'),
            connectorActions.callbackSuccess({
                callbackId: getAttributeId('credential'),
                data: globalModalAttributeEditorMockData.callbackSuccessObjectArrayTwo,
            }),
        ).wait(callbackWait);

        cySelectors.attributeSelectInput(getAttributeId('credential')).value().should('contain.text', 'testabc123');
    });
});
