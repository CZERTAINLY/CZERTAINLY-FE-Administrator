import AttributeEditor from 'components/Attributes/AttributeEditor';
import GlobalModal from 'components/GlobalModal';
import TabLayout from 'components/Layout/TabLayout';
import { actions as authoritiesActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as certificateGroupActions } from 'ducks/certificateGroups';
import { selectors as certificateSelectors } from 'ducks/certificates';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as credentialActions } from 'ducks/credentials';
import { actions as cryptographicKeyActions, selectors as cryptographicKeysSelectors } from 'ducks/cryptographic-keys';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as entityActions, selectors as entitySelectors } from 'ducks/entities';
import { actions as raProfileActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import { actions as tokenProfileActions } from 'ducks/token-profiles';
import { transformAttributeDescriptorDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import { transformAuthorityResponseDtoToModel } from 'ducks/transform/authorities';
import { transformCertificateGroupResponseDtoToModel } from 'ducks/transform/certificateGroups';
import { transformConnectorResponseDtoToModel } from 'ducks/transform/connectors';
import { transformTokenProfileResponseDtoToModel } from 'ducks/transform/token-profiles';
import { actions as userInterfaceActions } from 'ducks/user-interface';
import { useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { EntityResponseModel } from 'types/entities';
import { FunctionGroupCode, Resource } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { callbackWait, clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import {
    ConstraintCheckAttributeTestFormValues,
    GlobalModalAttributeEditorFormValues,
    GroupAttributeTestFormValues,
    TabAttributeFormValues,
    constraintCheckAttributeEditorMockData,
    customAttributeEditorMockData,
    dataAttributeMockData,
    globalModalAttributeEditorMockData,
    groupAttributeAtributeEditorMockData,
    infoAttributeEditorMockData,
    tabAttributeEditorMockData,
} from './mock-data';

describe('Custom AttributeEditor component', () => {
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

    it(`🟢 Label should be "Test property string"
        🟢 Input must be of type text
        🟢 Input placeholder must be "Enter Test property string"
        🟢 Description must be "test-description-string-1"`, () => {
        cy.get('label').eq(0).should('contain.text', 'Test property string');
        cy.get('input').eq(0).should('have.attr', 'type', 'text');
        cy.get('input').eq(0).should('have.attr', 'placeholder', 'Enter Test property string');
        cy.get('small').eq(0).should('contain.text', 'test-description-string-1');
    });

    it(`🟢 Label should be "Test property boolean"
        🟢 Input must be of type checkbox
        🟢 Input must be disabled
        🟢 Input placeholder must be "Enter Test property boolean"
        🟢 Description must be "test-description-boolean-2"`, () => {
        cy.get('label').eq(1).should('contain.text', 'Test property boolean');
        cy.get('input').eq(1).should('have.attr', 'type', 'checkbox').should('have.attr', 'disabled');
        cy.get('input').eq(1).should('have.attr', 'placeholder', 'Enter Test property boolean');
        cy.get('small').eq(1).should('contain.text', 'test-description-boolean-2');
    });

    it(`🟢 Label should be "Test property integer"
        🟢 Input must be of type number
        🟢 Input placeholder must be "Enter Test property integer"
        🟢 Description must be "test-description-integer-3"`, () => {
        cy.get('label').eq(2).should('contain.text', 'Test property integer');
        cy.get('input').eq(2).should('have.attr', 'type', 'number');
        cy.get('input').eq(2).should('have.attr', 'placeholder', 'Enter Test property integer');
        cy.get('small').eq(2).should('contain.text', 'test-description-integer-3');
    });

    it(`🟢 Label should be "Test property drop down"
        🟢 Dropdown Input placeholder must be "Select Test property drop down
        🟢 Description must be "test-description-drop-down-4"`, () => {
        cy.get('label').eq(3).should('contain.text', 'Test property drop down');
        cy.get('#react-select-5-placeholder').should('contain.text', 'Select Test property drop down');
        cy.get('small').eq(3).should('contain.text', 'test-description-drop-down-4');
    });

    it(`🟢 Input label should be "Test property codeblock"
        🟢 Input must be of type textarea
        🟢 Input class must be "npm__react-simple-code-editor__textarea"`, () => {
        cy.get('label').eq(4).should('contain.text', 'Test property codeblock');
        cy.get('textarea').eq(0).should('have.attr', 'class', 'npm__react-simple-code-editor__textarea');
    });

    it(`🟢 Input label should be "test float property"
        🟢 Input must be of type number
        🟢 Input placeholder must be "Enter test float property"`, () => {
        cy.get('label').eq(5).should('contain.text', 'test float property');
        cy.get('input').eq(5).should('have.attr', 'type', 'number').should('have.attr', 'placeholder', 'Enter test float property');
    });

    it(`🟢 Input label should be "test date property"
        🟢 Input must be of type date`, () => {
        cy.get('label').eq(6).should('contain.text', 'test date property');
        cy.get('input').eq(6).should('have.attr', 'type', 'date');
    });

    it(`🟢 Input label should be "test datetime property"
        🟢 Input must be of type datetime-local`, () => {
        cy.get('label').eq(7).should('contain.text', 'test datetime property');
        cy.get('input').eq(7).should('have.attr', 'type', 'datetime-local');
    });

    it(`🟢 Input label should be "test-property-text"
        🟢 Input placeholder must be "Enter test-property-text"`, () => {
        cy.get('label').eq(8).should('contain.text', 'test-property-text');
        cy.get('textarea').eq(1).should('have.attr', 'placeholder', 'Enter test-property-text');
    });

    it(`🟢 Input label should be "test-property-time"
        🟢 Input must be of type time`, () => {
        cy.get('label').eq(9).should('contain.text', 'test-property-time');
        cy.get('input').eq(8).should('have.attr', 'type', 'time');
    });

    it(`🟢 Input label should be "test-property-file"
        🟢 Input must have a label "File content"
        🟢 Dropdown Input must have a placeholder "Select or Drag & Drop file to Drop Zone."
        🟢 Dropdown Input must have a placeholder "File not selected"
        `, () => {
        cy.get('label').eq(10).should('contain.text', 'test-property-file');
        cy.get('label').eq(11).should('contain.text', 'File content');
        cy.get('.text-muted').eq(10).should('contain.text', 'Select or Drag & Drop file to Drop Zone.');
        cy.get('input').eq(9).should('have.attr', 'placeholder', 'Select or drag & drop test-property-file File');
        cy.get('input').eq(10).should('have.attr', 'placeholder', 'File not selected');
    });

    it(`🟢 Input must be of type hidden`, () => {
        cy.get('input').eq(13).should('have.attr', 'type', 'hidden');
    });

    it(`🟢 h5 should contain "test-group"`, () => {
        cy.get('h5').eq(0).should('contain.text', 'test-group');
    });
});

describe('Info Attribute AttributeEditor', () => {
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
    it(`🟢 h5 must contain "test-group-1"
        🟢 card-header must contain "Test Label String 1"
        🟢 card data must contain "test-data-1"
        🟢 card-header must contain "Test Label Text 2"
        🟢 p must contain "test-data-2"`, () => {
        cy.get('h5').eq(0).should('contain.text', 'test-group-1');
        cy.get('.card-header').eq(0).should('contain.text', 'Test Label String 1');
        cy.get('p').eq(0).should('contain.text', 'test-data-1');
        cy.get('.card-header').eq(1).should('contain.text', 'Test Label Text 2');
        cy.get('p').eq(1).should('contain.text', 'test-data-2');
    });

    it(`🟢 h5 must contain "test-group-2"
        🟢 card-header must contain "Test Label date 3"
        🟢 p must contain "2022-01-01"
        🟢 card-header must contain "Test Label datetime 4"
        🟢 p must contain "2022-01-01"
        🟢 card-header must contain "Test Label time 5"
        🟢 p must contain "00:00:00"`, () => {
        cy.get('h5').eq(1).should('contain.text', 'test-group-2');
        cy.get('.card-header').eq(2).should('contain.text', 'Test Label date 3');
        cy.get('p').eq(2).should('contain.text', '2022-01-01');
        cy.get('.card-header').eq(3).should('contain.text', 'Test Label datetime 4');
        cy.get('p').eq(3).should('contain.text', '2022-01-01');
        cy.get('.card-header').eq(4).should('contain.text', 'Test Label time 5');
        cy.get('p').eq(4).should('contain.text', '00:00:00');
    });

    it(`🟢 h5 must contain "test-group-3"
        🟢 card-header must contain "Test Label integer 6"
        🟢 p must contain "123"
        🟢 card-header must contain "Test Label float 7"
        🟢 p must contain "1.5"`, () => {
        cy.get('h5').eq(2).should('contain.text', 'test-group-3');
        cy.get('.card-header').eq(5).should('contain.text', 'Test Label integer 6');
        cy.get('p').eq(5).should('contain.text', '123');
        cy.get('.card-header').eq(6).should('contain.text', 'Test Label float 7');
        cy.get('p').eq(6).should('contain.text', '1.5');
    });

    it(`🟢 h5 must contain "test-group-4"
        🟢 card-header must contain "test-property-file"
        🟢 p must contain "test.txt"
        🟢 card-header must contain "test-property-file"
        🟢 p must contai "test.txt"
        `, () => {
        cy.get('h5').eq(3).should('contain.text', 'test-group-4');
        cy.get('.card-header').eq(7).should('contain.text', 'test-property-codeblock');
        cy.get('p').eq(7).should('contain.text', '[object Object]');
        cy.get('.card-header').eq(8).should('contain.text', 'test-property-file');
        cy.get('p').eq(8).should('contain.text', 'test.txt');
    });

    it(`🟢 h5 must contain "test-group-5"
        🟢 card-header must contain "Test property Credential"
        🟢 p must contain "test-reference-content-1, test-reference-content-2"
        🟢 card-header must contain "Test property secret"
        🟢 p must contain "Web Server"`, () => {
        cy.get('h5').eq(4).should('contain.text', 'test-group-5');
        cy.get('.card-header').eq(9).should('contain.text', 'Test property Credential');
        cy.get('p').eq(9).should('contain.text', 'test-reference-content-1, test-reference-content-2');
        cy.get('.card-header').eq(10).should('contain.text', 'Test property secret');
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

describe('Data Attribute AttributeEditor', () => {
    beforeEach(() => {
        cy.mount(<DataAttributeEditorComponent />).wait(componentLoadWait);
        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authoritiesActions.getAuthorityDetailSuccess({
                    authority: transformAuthorityResponseDtoToModel(dataAttributeMockData.authorityResponseDtoObject),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authoritiesActions.getAuthorityProviderAttributesDescriptorsSuccess({
                    attributeDescriptor: dataAttributeMockData.dataAttributeArray.map(transformAttributeDescriptorDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authoritiesActions.listAuthorityProvidersSuccess({
                    connectors: dataAttributeMockData.connectorDtoArray.map(transformConnectorResponseDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__authority__.credential',
                    data: dataAttributeMockData.callbackSuccessObjectArray,
                }),
            )
            .wait(callbackWait);
    });

    it(`🟢 Label should be "MS-ADCS Address"
        🟢 Input must be of type text
        🟢 Input value must be "data.cveradar.com"
        🟢 Description must be "Address of ADCS server."`, () => {
        cy.get('label').eq(0).should('contain.text', 'MS-ADCS Address');
        cy.get('input').eq(0).should('have.attr', 'type', 'text');
        cy.get('input').eq(0).should('have.value', 'data.cveradar.com');
        cy.get('small').eq(0).should('contain.text', 'Address of ADCS server.');
    });

    it(`🟢 Label should be "HTTPS Enabled"
        🟢 Input must be of type checkbox
        🟢 Input must not be checked
        🟢 Description must be "Use https for connection with ADCS server"`, () => {
        cy.get('label').eq(1).should('contain.text', 'HTTPS Enabled');
        cy.get('input').eq(1).should('have.attr', 'type', 'checkbox');
        cy.get('input').eq(1).should('not.be.checked');
        cy.get('small').eq(1).should('contain.text', 'Use https for connection with ADCS server');
    });

    it(`🟢 Label should be "Port"
        🟢 Input must be of type number
        🟢 Input value must be "80"
        🟢 Description must be "Define WinRM port, default port for http is 5985 and for https 5986"`, () => {
        cy.get('label').eq(2).should('contain.text', 'Port');
        cy.get('input').eq(2).should('have.attr', 'type', 'number');
        cy.get('small').eq(2).should('contain.text', 'Define WinRM port, default port for http is 5985 and for https 5986');
    });

    it(`🟢 Label should be "Credential"
        🟢 Input must be of type text
        🟢 Description must be "Credential for the communication"
        🟢 Input must contain "adcs-lab02-login"`, () => {
        cy.get('label').eq(3).should('contain.text', 'Credential');
        cy.get('input').eq(3).should('have.attr', 'type', 'text');
        cy.get('small').eq(3).should('contain.text', 'Credential for the communication');
        cy.get('div')
            .filter((index, element) => {
                return Array.from(element.classList).some((className) => className.includes('singleValue'));
            })
            .should('contain.text', 'adcs-lab02-login');
    });

    it(`🟢 Update text value in first input
        🟢 Check the checkbox
        🟢 Update the number value
        🟢 Update the selected value from the dropdown`, () => {
        cy.get('input').eq(0).should('have.value', 'data.cveradar.com').clear().type('test.com');
        cy.get('input').eq(1).should('not.be.checked').check();
        cy.get('input').eq(2).should('have.value', '80').type('80');
        cy.get('#react-select-19-live-region').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-19-option-0').should('exist').click().wait(clickWait);
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
    const defaultValues: GroupAttributeTestFormValues = useMemo(
        () => ({
            name: editMode ? raProfileSelector?.name || '' : '',
            description: editMode ? raProfileSelector?.description || '' : '',
            authority: editMode
                ? raProfileSelector
                    ? optionsForAuthorities.find((option) => option.value === raProfileSelector.authorityInstanceUuid)
                    : undefined
                : undefined,
        }),
        [editMode, optionsForAuthorities, raProfileSelector],
    );
    if (!raProfileAttributeDescriptors) {
        return <></>;
    }

    return (
        <Form onSubmit={() => {}} initialValues={defaultValues} mutators={{ ...mutators<GroupAttributeTestFormValues>() }}>
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

describe('Group Attribute AttributeEditor', () => {
    beforeEach(() => {
        cy.mount(<GroupAttributeEditorComponent />).wait(componentLoadWait);
        cy.window()
            .its('store')
            .invoke(
                'dispatch',
                authoritiesActions.listAuthoritiesSuccess({
                    authorityList: groupAttributeAtributeEditorMockData.authorityInstanceDtoArray.map(transformAuthorityResponseDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                raProfileActions.getRaProfileDetailSuccess({ raProfile: groupAttributeAtributeEditorMockData.raProfileResponseModel }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.listResourceCustomAttributesSuccess(
                    groupAttributeAtributeEditorMockData.customAttributeDtoArray.map(transformCustomAttributeDtoToModel),
                ),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authoritiesActions.getRAProfilesAttributesDescriptorsSuccess({
                    authorityUuid: groupAttributeAtributeEditorMockData.raProfileResponseModel.authorityInstanceUuid,
                    attributesDescriptors: groupAttributeAtributeEditorMockData.groupAttributeArray.map(
                        transformAttributeDescriptorDtoToModel,
                    ),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__ra-profile__.raprofile_ca_select_group',
                    data: groupAttributeAtributeEditorMockData.callbackSuccessObjectArray,
                }),
            )
            .wait(callbackWait);
    });

    it(`🟢 Label should be "Select CA Method"
        🟢 Small must contain "Select how the CA will be chosen, either by ComputerName or search"`, () => {
        cy.get('label').eq(0).should('contain.text', 'Select CA Method');
        cy.get('small').eq(0).should('contain.text', 'Select how the CA will be chosen, either by ComputerName or search');
    });

    it(`🟢 Label should be "Certificate Template Name"
        🟢 Small must contain "Select certificate templates to use"`, () => {
        cy.get('label').eq(1).should('contain.text', 'Certificate Template Name');
        cy.get('small').eq(1).should('contain.text', 'Select certificate templates to use');
    });

    it(`🟢 Label should be "CA Name"
        🟢 Small must contain "Identification of the certification authority"
        🟢 div must contain "Search for all available CAs"
        🟢 div must contain "Web Server"
        🟢 div must contain "Demo MS Sub CA"`, () => {
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

    it(`🟢 Reset the redux state that was used`, () => {
        cy.window()
            .its('store')
            .invoke('dispatch', connectorActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', authoritiesActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', raProfileActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store');
    });
});

const ConstraintCheckAttributeEditorComponent = () => {
    const authorityProviderAttributeDescriptors = useSelector(authoritySelectors.authorityProviderAttributeDescriptors) || [];
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const authoritySelector = useSelector(authoritySelectors.authority);
    const [authorityProvider, setAuthorityProvider] = useState<ConnectorResponseModel>();
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const editMode = true;

    const defaultValues: ConstraintCheckAttributeTestFormValues = useMemo(
        () => ({
            name: editMode ? authoritySelector?.name || undefined : undefined,
            authorityProvider: editMode
                ? authoritySelector
                    ? { value: authoritySelector.connectorUuid, label: authoritySelector.connectorName }
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

describe('Contstraint Check AttributeEditor', () => {
    beforeEach(() => {
        cy.mount(<ConstraintCheckAttributeEditorComponent />).wait(componentLoadWait);
        cy.window()
            .its('store')
            .invoke(
                'dispatch',
                authoritiesActions.listAuthorityProvidersSuccess({
                    connectors: constraintCheckAttributeEditorMockData.connectorResponseDtoArray.map(transformConnectorResponseDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.listResourceCustomAttributesSuccess([]))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                authoritiesActions.getAuthorityProviderAttributesDescriptorsSuccess({
                    attributeDescriptor: constraintCheckAttributeEditorMockData.attributeDescriptorDtoArray.map(
                        transformAttributeDescriptorDtoToModel,
                    ),
                }),
            );
    });

    it(`🟢 Select first option of the dropdown
        🟢 Select first option of the next dropdown
        🟢 Type incorrect input and verify the validation check`, () => {
        cy.get('#react-select-32-live-region').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-32-option-0').should('exist').should('contain.text', 'Basic').click().wait(clickWait);

        cy.window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__authority__.authority_credential',
                    data: constraintCheckAttributeEditorMockData.callbackSuccessObjectArray,
                }),
            )
            .wait(callbackWait);

        cy.get('#react-select-33-live-region').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-33-option-0').should('exist').should('contain.text', 'lab01-testssh').click().wait(clickWait);

        cy.get('input[name="__attributes__authority__.authority_server_address"]').should('exist').type('test.');
        cy.get('body').click(200, 200);
        cy.get('.invalid-feedback').should('exist').should('contain.text', 'Enter Valid Address');

        it('should reset the redux state that was used', () => {
            cy.window()
                .its('store')
                .invoke('dispatch', authoritiesActions.resetState())
                .window()
                .its('store')
                .invoke('dispatch', connectorActions.resetState())
                .window()
                .its('store')
                .invoke('dispatch', customAttributesActions.resetState());
        });
    });
});

const TabAttributeEditor = () => {
    const issuanceAttributeDescriptors = useSelector(certificateSelectors.issuanceAttributes);
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
                                            keyDetail?.tokenProfileUuid || form.getFieldState('tokenProfile')?.value?.value.uuid || ''
                                        }
                                        callbackResource={Resource.Keys}
                                        attributeDescriptors={cryptographicKeyAttributeDescriptors || []}
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

describe('Tabbed AttributeEditor component', () => {
    beforeEach(() => {
        cy.mount(<TabAttributeEditor />).wait(componentLoadWait);
        cy.window()
            .its('store')
            .invoke(
                'dispatch',
                tokenProfileActions.listTokenProfilesSuccess({
                    tokenProfiles: tabAttributeEditorMockData.tokenProfileDtoArray.map(transformTokenProfileResponseDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                certificateGroupActions.listGroupsSuccess({
                    groups: tabAttributeEditorMockData.certificateGroupSelectArray.map(transformCertificateGroupResponseDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.listResourceCustomAttributesSuccess(
                    tabAttributeEditorMockData.customAttributeDtoArray.map(transformCustomAttributeDtoToModel),
                ),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                cryptographicKeyActions.listAttributeDescriptorsSuccess({
                    uuid: '6c78130f-8aa3-4862-9a93-61329347f1bd',
                    attributeDescriptors: tabAttributeEditorMockData.baseAttributeDtoArray.map(transformAttributeDescriptorDtoToModel),
                }),
            );
    });

    it(`🟢 Enter value in first input
        🟢 Select custom attribute tab
        🟢 Click the first dropdown
        🟢 Click the first option of the dropdown
        🟢 Click the connector attribute tab
        🟢 Click the first dropdown
        🟢 Click the first option of the dropdown
        🟢 Click the next dropdown
        🟢 Click the first option of the dropdown`, () => {
        cy.get('input').eq(0).should('have.attr', 'type', 'text');
        cy.get('input').eq(0).should('have.attr', 'placeholder', 'Enter Cryptographic Key Alias').type('test-key');

        cy.get('.nav-link').eq(1).should('contain.text', 'Custom Attributes').click().wait(clickWait);

        // cy.get('#react-select-35-live-region').should('exist').click().wait(clickWait);
        cy.get('#react-select-35-live-region').should('exist').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-35-option-0').should('exist').click().wait(clickWait);

        cy.get('.nav-link').eq(0).should('contain.text', 'Connector Attributes').click().wait(clickWait);

        // cy.get('#react-select-36-live-region').should('exist').click().wait(clickWait);
        cy.get('#react-select-36-live-region').should('exist').siblings('div').eq(0).click().wait(clickWait);

        cy.get('#react-select-36-option-0').should('exist').click().wait(clickWait);

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__cryptographicKey__.group_keySpec',
                    data: tabAttributeEditorMockData.callbackSuccessObjectArray,
                }),
            )
            .wait(callbackWait);

        // cy.get('#react-select-37-live-region').should('exist').click().wait(clickWait);
        cy.get('#react-select-37-live-region').should('exist').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-37-option-0').should('exist').click().wait(clickWait);
    });

    it(`🟢 Reset the redux state that was used`, () => {
        cy.window()
            .its('store')
            .invoke('dispatch', cryptographicKeyActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', certificateGroupActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', tokenProfileActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.resetState());
    });
});

const GlobalModalAttributeEditor = () => {
    const editMode = false;
    const entitySelector = useSelector(entitySelectors.entity);
    const [entity, setEntity] = useState<EntityResponseModel>();
    const [entityProvider, setEntityProvider] = useState<ConnectorResponseModel>();
    const entityProviderAttributeDescriptors = useSelector(entitySelectors.entityProviderAttributeDescriptors);
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const defaultValues: GlobalModalAttributeEditorFormValues = useMemo(
        () => ({
            name: editMode ? entity?.name || undefined : undefined,
            entityProvider: editMode ? (entity ? { value: entity.connectorUuid, label: entity.connectorName } : undefined) : undefined,
            storeKind: editMode ? (entity ? { value: entity?.kind, label: entity?.kind } : undefined) : undefined,
        }),
        [editMode, entity],
    );

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
    before(() => {
        cy.mount(<GlobalModalAttributeEditor />).wait(componentLoadWait);
        cy.window()
            .its('store')
            .invoke(
                'dispatch',
                entityActions.listEntityProvidersSuccess({
                    providers: globalModalAttributeEditorMockData.connectorDtoArrayOne.map(transformConnectorResponseDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.listResourceCustomAttributesSuccess([]))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                entityActions.getEntityProviderAttributesDescriptorsSuccess({
                    attributeDescriptor: globalModalAttributeEditorMockData.baseAttributeDtoArrayOne.map(
                        transformAttributeDescriptorDtoToModel,
                    ),
                }),
            );
    });

    it(`🟢 Enter value in first input
        🟢 Click the first dropdown
        🟢 Click the first option of the dropdown
        🟢 Click the next dropdown
        🟢 Click the add button
        🟢 Enter value in the first input of global modal
        🟢 Click the first dropdown of global modal
        🟢 Click the first option of global modal dropdown
        🟢 The value must be auto filled in the next dropdown
        `, () => {
        cy.get('input[name="__attributes__entity__.host"]').should('exist').type('test');
        // cy.get('#react-select-40-input').should('exist').click().wait(clickWait);
        cy.get('#react-select-40-live-region').should('exist').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-40-option-0').should('exist').click().wait(clickWait);
        cy.window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__entity__.credential',
                    data: globalModalAttributeEditorMockData.callbackSuccessObjectArrayOne,
                }),
            )
            .wait(callbackWait);
        // cy.get('#react-select-41-input').should('exist').click().wait(clickWait);
        cy.get('#react-select-41-live-region').should('exist').siblings('div').eq(0).click().wait(clickWait);
        cy.get('.fa-add').should('exist').click().wait(clickWait);

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', userInterfaceActions.showGlobalModal({ ...globalModalAttributeEditorMockData.globalModalModelObject }))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.listCustomAttributesSuccess([]))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                credentialActions.listCredentialProvidersSuccess({
                    connectors: globalModalAttributeEditorMockData.connectorDtoArrayTwo.map(transformConnectorResponseDtoToModel),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', customAttributesActions.listResourceCustomAttributesSuccess([]))
            .wait(reduxActionWait);

        cy.get('input[name="name"]').should('exist').type('test-credential');
        // cy.get('#react-select-42-input').should('exist').click().wait(clickWait);
        cy.get('#react-select-42-live-region').should('exist').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-42-option-0').should('exist').click().wait(clickWait);

        // cy.get('#react-select-43-input').should('exist').click().wait(clickWait);
        cy.get('#react-select-43-live-region').should('exist').siblings('div').eq(0).click().wait(clickWait);
        cy.get('#react-select-43-option-1').should('exist').click().wait(clickWait);

        cy.wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                credentialActions.getCredentialProviderAttributesDescriptorsSuccess({
                    credentialProviderAttributesDescriptors: globalModalAttributeEditorMockData.baseAttributeDtoArrayTwo.map(
                        transformAttributeDescriptorDtoToModel,
                    ),
                }),
            )
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', credentialActions.createCredentialSuccess({ uuid: '2b2c6e64-9081-4750-a062-c84be728202d' }))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', userInterfaceActions.resetState())
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', userInterfaceActions.setInitiateAttributeCallback(true))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke('dispatch', userInterfaceActions.setAttributeCallbackValue('testabc123'))
            .wait(reduxActionWait)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                connectorActions.callbackSuccess({
                    callbackId: '__attributes__entity__.credential',
                    data: globalModalAttributeEditorMockData.callbackSuccessObjectArrayTwo,
                }),
            )
            .wait(callbackWait);
    });
});
