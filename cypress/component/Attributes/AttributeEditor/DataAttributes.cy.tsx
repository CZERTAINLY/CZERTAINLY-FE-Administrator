import AttributeEditor from 'components/Attributes/AttributeEditor';
import { actions as authoritiesActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as connectorActions } from 'ducks/connectors';
import { transformAttributeDescriptorDtoToModel } from 'ducks/transform/attributes';
import { transformAuthorityResponseDtoToModel } from 'ducks/transform/authorities';
import { transformConnectorResponseDtoToModel } from 'ducks/transform/connectors';
import { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { FunctionGroupCode } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { callbackWait, clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import { dataAttributeMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';

const DataAttributeEditorComponent = () => {
    const authorityProviders = useSelector(authoritySelectors.authorityProviders);
    const authorityProviderAttributeDescriptors = useSelector(authoritySelectors.authorityProviderAttributeDescriptors) ?? [];
    const authoritySelector = useSelector(authoritySelectors.authority);
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [authorityProvider, setAuthorityProvider] = useState<ConnectorResponseModel>();

    useEffect(() => {
        if (!authorityProviders) return;
        const provider = authorityProviders.find((p) => p.uuid === authoritySelector!.connectorUuid);

        if (provider) {
            setAuthorityProvider(provider);
        }
    }, [authorityProviders, authoritySelector]);

    if (!authorityProvider?.uuid || !authoritySelector?.attributes?.length) return <></>;
    return (
        <>
            <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <AttributeEditor
                            id="authority"
                            connectorUuid={authorityProvider.uuid}
                            attributes={authoritySelector.attributes}
                            attributeDescriptors={authorityProviderAttributeDescriptors}
                            functionGroupCode={FunctionGroupCode.AuthorityProvider}
                            kind={'ADCS'}
                            groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                            setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                        />
                    </form>
                )}
            </Form>
        </>
    );
};

describe('Data Attributes', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__authority__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(<DataAttributeEditorComponent />).wait(componentLoadWait);
        cy.dispatchActions(
            authoritiesActions.getAuthorityDetailSuccess({
                authority: transformAuthorityResponseDtoToModel(dataAttributeMockData.authorityResponseDtoObject),
            }),
            authoritiesActions.getAuthorityProviderAttributesDescriptorsSuccess({
                attributeDescriptor: dataAttributeMockData.dataAttributeArray.map(transformAttributeDescriptorDtoToModel),
            }),
            authoritiesActions.listAuthorityProvidersSuccess({
                connectors: dataAttributeMockData.connectorDtoArray.map(transformConnectorResponseDtoToModel),
            }),
            connectorActions.callbackSuccess({
                callbackId: getAttributeId('credential'),
                data: dataAttributeMockData.callbackSuccessObjectArray,
            }),
        ).wait(callbackWait);
    });

    it('Should render a text input for "MS-ADCS Address" with correct label, pre-filled value, and description', () => {
        cySelectors.attributeInput(getAttributeId('address')).all(({ label, input, description }) => {
            label().should('contain.text', 'MS-ADCS Address');
            input().should('have.attr', 'type', 'text');
            input().should('have.value', 'data.cveradar.com');
            description().should('contain.text', 'Address of ADCS server.');
        });
    });

    it('Should render an unchecked checkbox for "HTTPS Enabled" with correct label and description', () => {
        cySelectors.attributeInput(getAttributeId('https')).all(({ label, input, description }) => {
            label().should('contain.text', 'HTTPS Enabled');
            input().should('have.attr', 'type', 'checkbox');
            input().should('not.be.checked');
            description().should('contain.text', 'Use https for connection with ADCS server');
        });
    });

    it('Should render a number input for "Port" with pre-filled value and relevant description', () => {
        cySelectors.attributeInput(getAttributeId('port')).all(({ label, input, description }) => {
            label().should('contain.text', 'Port');
            input().should('have.attr', 'type', 'number');
            input().should('have.value', '80');
            description().should('contain.text', 'Define WinRM port, default port for http is 5985 and for https 5986');
        });
    });

    it('Should render a select input with a selected value for "Credential" and display the correct description', () => {
        cySelectors.attributeSelectInput(getAttributeId('credential')).all(({ label, input, description, value }) => {
            label().should('contain.text', 'Credential');
            input().should('have.attr', 'type', 'text');
            description().should('contain.text', 'Credential for the communication');
            value().should('contain.text', 'adcs-lab02-login');
        });
    });

    it('Should allow updating the address, enabling HTTPS, changing the port, and selecting a new credential value', () => {
        cySelectors.attributeInput(getAttributeId('address')).input().should('have.value', 'data.cveradar.com').clear().type('test.com');
        cySelectors.attributeInput(getAttributeId('https')).input().should('not.be.checked').check();
        cySelectors.attributeInput(getAttributeId('port')).input().should('have.value', '80').clear().type('80');

        cySelectors.attributeSelectInput(getAttributeId('credential')).all(({ value, selectOption }) => {
            value().should('contain.text', 'adcs-lab02-login');
            selectOption(0).click().wait(clickWait);
        });
    });
});
