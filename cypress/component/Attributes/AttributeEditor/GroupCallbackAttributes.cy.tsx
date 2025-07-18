import AttributeEditor from 'components/Attributes/AttributeEditor';
import { actions as authoritiesActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as connectorActions, slice } from 'ducks/connectors';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import { actions as raProfileActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import { transformAttributeDescriptorDtoToModel, transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import { transformAuthorityResponseDtoToModel } from 'ducks/transform/authorities';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { AttributeDescriptorModel } from 'types/attributes';
import { FunctionGroupCode, Resource } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import '../../../../src/resources/styles/theme.scss';
import { callbackWait, componentLoadWait, reduxActionWait } from '../../../utils/constants';
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
    const defaultValues: GroupAttributeTestFormValues = useMemo(() => {
        const authority = raProfileSelector
            ? optionsForAuthorities.find((option) => option.value === raProfileSelector.authorityInstanceUuid)
            : undefined;
        return {
            name: editMode ? (raProfileSelector?.name ?? '') : '',
            description: editMode ? (raProfileSelector?.description ?? '') : '',
            authority: editMode ? authority : undefined,
        };
    }, [editMode, optionsForAuthorities, raProfileSelector]);
    if (!raProfileAttributeDescriptors) {
        return <></>;
    }

    return (
        <Form onSubmit={() => {}} initialValues={defaultValues} mutators={{ ...mutators<GroupAttributeTestFormValues>() }}>
            {({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit}>
                    <AttributeEditor
                        id="ra-profile"
                        callbackParentUuid={raProfileSelector?.authorityInstanceUuid ?? form.getFieldState('authority')?.value?.value}
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
            description().should('contain.text', 'Identification of the certification authority');
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
type Props = Omit<React.ComponentProps<typeof AttributeEditor>, 'id'>;

const CallbackVariationsAttributeEditorComponent = (props: Props) => {
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    return (
        <Form onSubmit={() => {}} mutators={{ ...mutators() }}>
            {({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit}>
                    <AttributeEditor
                        id="test"
                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                        {...props}
                    />
                </form>
            )}
        </Form>
    );
};

describe('Group Callback Attributes: General Tests', () => {
    function getAttributeId(fieldName: string) {
        return `__attributes__test__.${fieldName}`;
    }

    it('Should run the callback, and generate a proper mappings object for Connector callback', () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                functionGroupCode={FunctionGroupCode.AuthorityProvider}
                connectorUuid="connector-uuid"
                kind="connector-kind"
                attributeDescriptors={callbackVariationsAtributeEditorMockData.basicTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                expect(payload.callbackConnector).to.deep.equal({
                    functionGroup: FunctionGroupCode.AuthorityProvider,
                    kind: 'connector-kind',
                    uuid: 'connector-uuid',
                    requestAttributeCallback: {
                        body: {},
                        name: 'group_IntegerSelect',
                        pathVariable: { IntegerSelect: 'Option1' },
                        requestParameter: {},
                        uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3492',
                    },
                });
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.basicTest.callbackResourceSuccess,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeSelectInput(getAttributeId('IntegerSelect')).input().should('exist');
    });

    it('Should run the callback, and generate a proper mappings object for Resource callback', () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                callbackParentUuid="resource-uuid"
                callbackResource={Resource.RaProfiles}
                attributeDescriptors={callbackVariationsAtributeEditorMockData.basicTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackResource.match,
            ({ payload }) => {
                expect(payload.callbackResource).to.deep.equal({
                    parentObjectUuid: 'resource-uuid',
                    resource: Resource.RaProfiles,
                    requestAttributeCallback: {
                        body: {},
                        name: 'group_IntegerSelect',
                        pathVariable: { IntegerSelect: 'Option1' },
                        requestParameter: {},
                        uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3492',
                    },
                });
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.basicTest.callbackResourceSuccess,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeSelectInput(getAttributeId('IntegerSelect')).input().should('exist');
    });

    it('Should not run the callback, if mapping.from is unset', () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                attributeDescriptors={callbackVariationsAtributeEditorMockData.invalidMappingTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            () => {},
            true,
        );
    });

    it('Should set default value after callback is run', () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                attributeDescriptors={callbackVariationsAtributeEditorMockData.defaultValuesTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.defaultValuesTest.callbackResourceSuccess,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeInput(getAttributeId('DefaultText')).textarea().should('contain.text', 'default-content');
    });

    it(`Should be able to run the group callback fetched from another attribute's callback
        All of attributes returned by different callbacks should be visible
        `, () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                attributeDescriptors={callbackVariationsAtributeEditorMockData.nestedAttributeCallbacksTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.nestedAttributeCallbacksTest.callbackResourceSuccess1,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('IntegerSelect')).selectOption('Integer1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.nestedAttributeCallbacksTest.callbackResourceSuccess2,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeInput(getAttributeId('DefaultText')).textarea().should('contain.text', 'default-content');
        cySelectors.attributeInput(getAttributeId('DefaultBoolean')).input().should('be.checked');
    });

    it(`Should be able to run multiple callbacks
        All of attributes returned by different callbacks should be visible
        `, () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                attributeDescriptors={callbackVariationsAtributeEditorMockData.multipleAttributeCallbacksTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect1')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.multipleAttributeCallbacksTest.callbackResourceSuccess1,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect2')).selectOption('Option2').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.multipleAttributeCallbacksTest.callbackResourceSuccess2,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeSelectInput(getAttributeId('IntegerSelect1')).input().should('exist');
        cySelectors.attributeSelectInput(getAttributeId('IntegerSelect2')).input().should('exist');
    });

    it(`Should be able to run the callback with the same callbackId multiple times
        Current callback attributes should be replaced by the attributes returned by the new callback
        `, () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                attributeDescriptors={callbackVariationsAtributeEditorMockData.repeatCallbackTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.repeatCallbackTest.callbackResourceSuccess1,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeInput(getAttributeId('DefaultText')).textarea().should('contain.text', 'default-content');
        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option2').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.repeatCallbackTest.callbackResourceSuccess2,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeInput(getAttributeId('DefaultText')).textarea().should('not.exist');
        cySelectors.attributeSelectInput(getAttributeId('IntegerSelect')).input().should('exist');
    });

    it(`When the same attribute is returned by the callback second time, default descriptor value should be displayed instead of attribute value.
        `, () => {
        cy.mount(
            <CallbackVariationsAttributeEditorComponent
                attributes={callbackVariationsAtributeEditorMockData.repeatCallbackSameDescriptorTest.attributes}
                attributeDescriptors={callbackVariationsAtributeEditorMockData.repeatCallbackSameDescriptorTest.attributeDescriptors}
            />,
        ).wait(componentLoadWait);

        cy.dispatchActions(
            connectorActions.callbackSuccess({
                callbackId: getAttributeId('group_DefaultTextOrIntegerSelect'),
                data: callbackVariationsAtributeEditorMockData.repeatCallbackSameDescriptorTest.callbackResourceSuccess1,
            }),
        ).wait(reduxActionWait);

        cySelectors.attributeInput(getAttributeId('DefaultText')).textarea().should('contain.text', 'non-default');

        cy.expectActionAfter(
            () => {
                cySelectors.attributeSelectInput(getAttributeId('StringSelect')).selectOption('Option1').click().wait(callbackWait);
            },
            slice.actions.callbackConnector.match,
            ({ payload }) => {
                cy.dispatchActions(
                    connectorActions.callbackSuccess({
                        callbackId: payload.callbackId,
                        data: callbackVariationsAtributeEditorMockData.repeatCallbackSameDescriptorTest.callbackResourceSuccess1,
                    }),
                ).wait(reduxActionWait);
            },
        );
        cySelectors.attributeInput(getAttributeId('DefaultText')).textarea().should('contain.text', 'default-content');
    });

    it(`Reset the redux state that was used`, () => {
        cy.dispatchActions(connectorActions.resetState());
    });
});
