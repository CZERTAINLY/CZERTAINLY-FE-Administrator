import AttributeEditor from 'components/Attributes/AttributeEditor';
import { actions as authoritiesActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as raProfileActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import { transformAttributeDescriptorDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import { transformAuthorityResponseDtoToModel } from 'ducks/transform/authorities';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { Resource } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { callbackWait, clickWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
import { GroupAttributeTestFormValues, callbackVariationsAtributeEditorMockData, groupAttributeAtributeEditorMockData } from './mock-data';
import { cySelectors } from '../../../utils/selectors';

const GroupCallbackAttributeEditorComponent = () => {
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

describe.only('Group Attribute AttributeEditor', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__ra-profile__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(<GroupCallbackAttributeEditorComponent />).wait(componentLoadWait);
        cy.dispatchActions(
            authoritiesActions.listAuthoritiesSuccess({
                authorityList: groupAttributeAtributeEditorMockData.authorityInstanceDtoArray.map(transformAuthorityResponseDtoToModel),
            }),
            raProfileActions.getRaProfileDetailSuccess({ raProfile: groupAttributeAtributeEditorMockData.raProfileResponseModel }),
            customAttributesActions.listResourceCustomAttributesSuccess(
                groupAttributeAtributeEditorMockData.customAttributeDtoArray.map(transformCustomAttributeDtoToModel),
            ),
            authoritiesActions.getRAProfilesAttributesDescriptorsSuccess({
                authorityUuid: groupAttributeAtributeEditorMockData.raProfileResponseModel.authorityInstanceUuid ?? 'unknown',
                attributesDescriptors: groupAttributeAtributeEditorMockData.groupAttributeArray.map(transformAttributeDescriptorDtoToModel),
            }),
            connectorActions.callbackSuccess({
                callbackId: getAttributeId('raprofile_ca_select_group'),
                data: groupAttributeAtributeEditorMockData.callbackSuccessObjectArray,
            }),
        ).wait(callbackWait);
    });

    it('Should display "Select CA Method" label with correct description', () => {
        cySelectors.attributeSelectInput(getAttributeId('raprofile_select_ca_method')).all(({ label, description }) => {
            label().should('contain.text', 'Select CA Method');
            description().should('contain.text', 'Select how the CA will be chosen, either by ComputerName or search');
        });
    });

    it('Should display "Certificate Template Name" label with correct description', () => {
        cySelectors.attributeSelectInput(getAttributeId('raprofile_template_name')).all(({ label, description }) => {
            label().should('contain.text', 'Certificate Template Name');
            description().should('contain.text', 'Select certificate templates to use');
        });
    });

    it('Should display "CA Name" label and description, and renders expected selected CA and template values', () => {
        cySelectors.attributeSelectInput(getAttributeId('raprofile_ca_name')).all(({ label, description }) => {
            label().should('contain.text', 'CA Name');
            description().should('contain.text', 'Identification of the certification authority').pause();
        });

        cySelectors
            .attributeSelectInput(getAttributeId('raprofile_select_ca_method'))
            .value()
            .should('contain.text', 'Search for all available CAs');
        cySelectors.attributeSelectInput(getAttributeId('raprofile_template_name')).value().should('contain.text', 'Web Server');
        cySelectors.attributeSelectInput(getAttributeId('raprofile_ca_name')).value().should('contain.text', 'Demo MS Sub CA');
    });

    it(`Reset the redux state that was used`, () => {
        cy.dispatchActions(
            connectorActions.resetState(),
            authoritiesActions.resetState(),
            customAttributesActions.resetState(),
            raProfileActions.resetState(),
        );
    });
});

const CallbackVariationsAttributeEditorComponent = () => {
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    console.log(groupAttributeAtributeEditorMockData.groupAttributeArray.map(transformAttributeDescriptorDtoToModel));
    return (
        <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
            {({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit}>
                    <AttributeEditor
                        id="test"
                        callbackParentUuid={'test-uuid'}
                        callbackResource={Resource.RaProfiles}
                        attributeDescriptors={callbackVariationsAtributeEditorMockData.attributeDescriptors}
                        attributes={[]}
                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                    />
                </form>
            )}
        </Form>
    );
};

describe('Group Attributes Variations', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__test__.${fieldName}`;
    }

    beforeEach(() => {
        cy.mount(<CallbackVariationsAttributeEditorComponent />).wait(componentLoadWait);
        cy.dispatchActions(
            connectorActions.callbackSuccess({
                callbackId: getAttributeId('raprofile_ca_select_group'),
                data: groupAttributeAtributeEditorMockData.callbackSuccessObjectArray,
            }),
        ).wait(reduxActionWait);
    });

    it('Should do smth idk ', () => {
        cySelectors.attributeSelectInput(getAttributeId('String')).selectOption('Option1').click().wait(clickWait);

        cySelectors.attributeSelectInput(getAttributeId('Text')).input().should('have.attr', 'value', 'Basic');
    });

    it(`Reset the redux state that was used`, () => {
        cy.dispatchActions(connectorActions.resetState());
    });
});
