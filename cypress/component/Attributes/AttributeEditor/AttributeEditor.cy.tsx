import AttributeEditor from 'components/Attributes/AttributeEditor';
import { actions as authoritiesActions, actions as authorityActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import { actions as raProfileActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import { transformAttributeDescriptorDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import { transformAuthorityResponseDtoToModel } from 'ducks/transform/authorities';
import { transformConnectorResponseDtoToModel } from 'ducks/transform/connectors';
import { useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { FunctionGroupCode, Resource } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import {
    authoritiesSuccess,
    authorityDetailSuccessObject,
    connectorsSuccessObject,
    customAttributeEditorProps,
    dataAttributeDescriptors,
    dataCallback,
    groupAttributeDescriptors,
    groupAttributesSuccessCustomData,
    groupCallbackData,
    infoAttributeEditorProps,
    raProfileDetailSuccessObject,
} from './mock-data';

interface FormValues {
    name: string;
    description: string;
    authority: { value: any; label: string } | undefined;
}

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
        cy.get('label').eq(0).should('contain.text', 'Test property string');
        cy.get('input').eq(0).should('have.attr', 'type', 'text');
        cy.get('input').eq(0).should('have.attr', 'placeholder', 'Enter Test property string');

        cy.get('label').eq(1).should('contain.text', 'Test property boolean');
        cy.get('input').eq(1).should('have.attr', 'type', 'checkbox').should('have.attr', 'disabled');
        cy.get('input').eq(1).should('have.attr', 'placeholder', 'Enter Test property boolean');

        cy.get('label').eq(2).should('contain.text', 'Test property integer');
        cy.get('input').eq(2).should('have.attr', 'type', 'number');
        cy.get('input').eq(2).should('have.attr', 'placeholder', 'Enter Test property integer');

        cy.get('label').eq(3).should('contain.text', 'Test property drop down');
        cy.get('#react-select-2-placeholder').should('contain.text', 'Select Test property drop down');

        cy.get('label').eq(4).should('contain.text', 'Test property codeblock');
        cy.get('label').eq(5).should('contain.text', '(javascript)');
        cy.get('textarea').eq(0).should('have.attr', 'class', 'npm__react-simple-code-editor__textarea');

        cy.get('label').eq(6).should('contain.text', 'test float property');
        cy.get('input').eq(5).should('have.attr', 'type', 'number').should('have.attr', 'placeholder', 'Enter test float property');

        cy.get('label').eq(7).should('contain.text', 'test date property');
        cy.get('input').eq(6).should('have.attr', 'type', 'date');

        cy.get('label').eq(8).should('contain.text', 'test datetime property');
        cy.get('input').eq(7).should('have.attr', 'type', 'datetime-local');

        cy.get('label').eq(9).should('contain.text', 'test-property-text');
        cy.get('textarea').eq(1).should('have.attr', 'placeholder', 'Enter test-property-text');

        cy.get('label').eq(10).should('contain.text', 'test-property-time');
        cy.get('input').eq(8).should('have.attr', 'type', 'time');

        cy.get('label').eq(11).should('contain.text', 'test-property-file');
        cy.get('label').eq(12).should('contain.text', 'File content');
        cy.get('.text-muted').eq(0).should('contain.text', 'Select or Drag & Drop file to Drop Zone.');

        cy.get('input').eq(13).should('have.attr', 'type', 'hidden');

        cy.get('h5').eq(0).should('contain.text', 'test-group');
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
        cy.get('h5').eq(0).should('contain.text', 'test-group-1');
        cy.get('h5').eq(1).should('contain.text', 'test-group-2');
        cy.get('h5').eq(2).should('contain.text', 'test-group-3');
        cy.get('h5').eq(3).should('contain.text', 'test-group-4');
        cy.get('h5').eq(4).should('contain.text', 'test-group-5');

        cy.get('.card-header').eq(0).should('contain.text', 'Test Label String 1');
        cy.get('.card-header').eq(1).should('contain.text', 'Test Label Text 2');
        cy.get('.card-header').eq(2).should('contain.text', 'Test Label date 3');
        cy.get('.card-header').eq(3).should('contain.text', 'Test Label datetime 4');
        cy.get('.card-header').eq(4).should('contain.text', 'Test Label time 5');
        cy.get('.card-header').eq(5).should('contain.text', 'Test Label integer 6');
        cy.get('.card-header').eq(6).should('contain.text', 'Test Label float 7');

        cy.get('.card-header').eq(8).should('contain.text', 'test-property-file');
        cy.get('.card-header').eq(9).should('contain.text', 'Test property Credential');
        cy.get('.card-header').eq(10).should('contain.text', 'Test property secret');
        cy.get('.card-header').eq(11).should('contain.text', 'Test property Object');

        cy.get('p').eq(0).should('contain.text', 'test-data-1');
        cy.get('p').eq(1).should('contain.text', 'test-data-2');
        cy.get('p').eq(2).should('contain.text', '2022-01-01');
        cy.get('p').eq(3).should('contain.text', '2022-01-01');
        cy.get('p').eq(4).should('contain.text', '00:00:00');
        cy.get('p').eq(5).should('contain.text', '123');
        cy.get('p').eq(6).should('contain.text', '1.5');
        cy.get('p').eq(7).should('contain.text', '[object Object]');
        cy.get('p').eq(8).should('contain.text', 'test.txt');
        cy.get('p').eq(9).should('contain.text', 'test-reference-content-1, test-reference-content-2');
        cy.get('p').eq(10).should('contain.text', 'Web Server');
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
        cy.mount(<DataAttributeEditorComponent />);
        cy.wait(100)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.getAuthorityDetailSuccess({
                    authority: transformAuthorityResponseDtoToModel(authorityDetailSuccessObject),
                }),
            )
            .wait(100)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.getAuthorityProviderAttributesDescriptorsSuccess({
                    attributeDescriptor: dataAttributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                }),
            )
            .wait(100)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.listAuthorityProvidersSuccess({
                    connectors: connectorsSuccessObject.map(transformConnectorResponseDtoToModel),
                }),
            )
            .wait(100)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({ callbackId: '__attributes__authority__.credential', data: dataCallback }),
            );

        cy.get('label').eq(0).should('contain.text', 'MS-ADCS Address');
        cy.get('input').eq(0).should('have.attr', 'type', 'text');
        cy.get('input').eq(0).should('have.value', 'data.cveradar.com');
        cy.get('small').eq(0).should('contain.text', 'Address of ADCS server.');

        cy.get('label').eq(1).should('contain.text', 'HTTPS Enabled');
        cy.get('input').eq(1).should('have.attr', 'type', 'checkbox');
        cy.get('input').eq(1).should('not.be.checked');
        cy.get('small').eq(1).should('contain.text', 'Use https for connection with ADCS server');

        cy.get('label').eq(2).should('contain.text', 'Port');
        cy.get('input').eq(2).should('have.attr', 'type', 'number');
        cy.get('input').eq(2).should('have.value', '80');
        cy.get('small').eq(2).should('contain.text', 'Define WinRM port, default port for http is 5985 and for https 5986');

        cy.get('label').eq(3).should('contain.text', 'Credential');
        cy.get('input').eq(3).should('have.attr', 'type', 'text');
        cy.get('small').eq(3).should('contain.text', 'Credential for the communication');
        cy.get('div')
            .filter((index, element) => {
                return Array.from(element.classList).some((className) => className.includes('singleValue'));
            })
            .should('contain.text', 'adcs-lab02-login');
    });
});

const GroupAttributeEditorComponent = () => {
    const raProfileSelector = useSelector(raProfilesSelectors.raProfile);
    const raProfileAttributeDescriptors = useSelector(authoritySelectors.raProfileAttributeDescriptors);
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const editMode = true;
    const authorities = useSelector(authoritySelectors.authorities);

    const optionsForAuthorities = useMemo(
        () =>
            authorities.map((authority) => ({
                value: authority.uuid,
                label: authority.name,
            })),
        [authorities],
    );
    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? raProfileSelector?.name || '' : '',
            description: editMode ? raProfileSelector?.description || '' : '',
            authority: editMode
                ? raProfileSelector
                    ? optionsForAuthorities.find((option) => option.value === raProfileSelector.authorityInstanceUuid)
                    : undefined
                : undefined,
        }),
        [editMode, optionsForAuthorities, raProfileSelector], // Dependencies array
    );
    if (!raProfileAttributeDescriptors) {
        return <></>;
    }

    return (
        <Form
            onSubmit={() => {
                console.log('submit');
            }}
            initialValues={defaultValues}
            mutators={{ ...mutators<FormValues>() }}
        >
            {({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit}>
                    <AttributeEditor
                        id="ra-profile"
                        callbackParentUuid={raProfileSelector?.authorityInstanceUuid || form.getFieldState('authority')?.value?.value}
                        callbackResource={Resource.RaProfiles}
                        attributeDescriptors={raProfileAttributeDescriptors}
                        attributes={raProfileSelector?.attributes}
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
            .invoke(
                'dispatch',
                authoritiesActions.listAuthoritiesSuccess({ authorityList: authoritiesSuccess.map(transformAuthorityResponseDtoToModel) }),
            )
            .wait(100)
            .window()
            .its('store')
            .invoke('dispatch', raProfileActions.getRaProfileDetailSuccess({ raProfile: raProfileDetailSuccessObject }))
            .wait(100)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.listResourceCustomAttributesSuccess(
                    groupAttributesSuccessCustomData.map(transformCustomAttributeDtoToModel),
                ),
            )
            .wait(100)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authorityActions.getRAProfilesAttributesDescriptorsSuccess({
                    authorityUuid: raProfileDetailSuccessObject.authorityInstanceUuid,
                    attributesDescriptors: groupAttributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                }),
            )
            .wait(100)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__ra-profile__.raprofile_ca_select_group',
                    data: groupCallbackData,
                }),
            );

        cy.get('label').eq(0).should('contain.text', 'Select CA Method');
        cy.get('small').eq(0).should('contain.text', 'Select how the CA will be chosen, either by ComputerName or search');

        cy.get('label').eq(1).should('contain.text', 'Certificate Template Name');
        cy.get('small').eq(1).should('contain.text', 'Select certificate templates to use');

        cy.get('label').eq(2).should('contain.text', 'CA Name');
        cy.get('small').eq(2).should('contain.text', 'Identification of the certification authority');

        cy.get('div')
            .filter((index, element) => {
                return Array.from(element.classList).some((className) => className.includes('singleValue'));
            })
            .should('contain.text', 'Search for all available CAs')
            .should('contain.text', 'Web Server')
            .should('contain.text', 'Demo MS Sub CA');
    });
});
