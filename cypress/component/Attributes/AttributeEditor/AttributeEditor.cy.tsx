import AttributeEditor from 'components/Attributes/AttributeEditor';
import { actions as authorityActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as raProfileActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import { transformAttributeDescriptorDtoToModel } from 'ducks/transform/attributes';
import { transformAuthorityResponseDtoToModel } from 'ducks/transform/authorities';
import { transformConnectorResponseDtoToModel } from 'ducks/transform/connectors';
import { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { FunctionGroupCode, Resource } from 'types/openapi';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import {
    authorityDetailSuccessObject,
    connectorsSuccessObject,
    customAttributeEditorProps,
    dataAttributeDescriptors,
    dataCallback,
    groupAttributeDescriptors,
    groupCallbackData,
    infoAttributeEditorProps,
    raProfileDetailSuccessObject,
} from './mock-data';

describe('AttributeEditor component 1 (Custom Attribute)', () => {
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

describe('AttributeEditor component 2 (Info Attribute)', () => {
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

const DataAttributeEditorComponent = () => {
    const authorityProviders = useSelector(authoritySelectors.authorityProviders);
    const authorityProviderAttributeDescriptors = useSelector(authoritySelectors.authorityProviderAttributeDescriptors) || [];
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
            <Form
                onSubmit={() => {
                    console.log('submit');
                }}
                mutators={{ ...mutators() }}
            >
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

describe('AttributeEditor component 3 (DataAttribute)', () => {
    it('should render data attribute editor', () => {
        cy.mount(<DataAttributeEditorComponent />)
            .wait(3000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.getAuthorityDetailSuccess({
                    authority: transformAuthorityResponseDtoToModel(authorityDetailSuccessObject),
                }),
            )
            .wait(3000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.getAuthorityProviderAttributesDescriptorsSuccess({
                    attributeDescriptor: dataAttributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                }),
            )
            .wait(3000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.listAuthorityProvidersSuccess({
                    connectors: connectorsSuccessObject.map(transformConnectorResponseDtoToModel),
                }),
            )
            .wait(3000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({ callbackId: '__attributes__authority__.credential', data: dataCallback }),
            );
    });
});

const GroupAttributeEditorComponent = () => {
    const raProfileSelector = useSelector(raProfilesSelectors.raProfile);
    const raProfileAttributeDescriptors = useSelector(authoritySelectors.raProfileAttributeDescriptors);
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [raProfile, setRaProfile] = useState<RaProfileResponseModel>();

    if (!raProfileAttributeDescriptors) {
        return <></>;
    }

    return (
        <Form
            onSubmit={() => {
                console.log('submit');
            }}
            mutators={{ ...mutators() }}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <AttributeEditor
                        id="ra-profile"
                        callbackParentUuid={raProfile?.authorityInstanceUuid}
                        callbackResource={Resource.RaProfiles}
                        attributeDescriptors={raProfileAttributeDescriptors}
                        attributes={raProfile?.attributes}
                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                    />
                </form>
            )}
        </Form>
    );
};

describe('AttributeEditor component 4 (GroupAttribute)', () => {
    it('should render group attribute editor', () => {
        cy.mount(<GroupAttributeEditorComponent />);
        cy.window()
            .its('store')
            .invoke('dispatch', raProfileActions.getRaProfileDetailSuccess({ raProfile: raProfileDetailSuccessObject }))
            .wait(3000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.getRAProfilesAttributesDescriptorsSuccess({
                    authorityUuid: raProfileDetailSuccessObject.authorityInstanceUuid,
                    attributesDescriptors: groupAttributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                }),
            )
            .wait(3000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__ra-profile__.raprofile_ca_select_group',
                    data: groupCallbackData,
                }),
            );
    });
});
