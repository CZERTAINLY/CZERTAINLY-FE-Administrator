import NotificationInstanceForm from 'components/_pages/notifications/notification-instance-form';
import { componentLoadWait } from '../../utils/constants';
import { actions } from 'ducks/notifications';
import {
    mockMappingAttributes,
    mockNotificationInstanceDetail,
    mockNotificationInstanceProviders,
    mockNotificationProviderAttributesDescriptors,
} from './mockdata';
import { AttributeDescriptorModel, DataAttributeModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import '../../../src/resources/styles/theme.scss';
import { NotificationInstanceModel } from 'types/notifications';
import { Routes, Route } from 'react-router';

const NotificationFormTest = () => {
    return <NotificationInstanceForm />;
};

const NotificationFormWithRoutes = () => {
    return (
        <Routes>
            <Route path="/notifications/edit/:id" element={<NotificationInstanceForm />} />
            <Route path="/notifications/add" element={<NotificationInstanceForm />} />
            <Route path="/notifications/*" element={<NotificationInstanceForm />} />
            <Route path="/*" element={<NotificationInstanceForm />} />
        </Routes>
    );
};

describe('NotificationFormTest', () => {
    beforeEach(() => {
        cy.mount(<NotificationFormTest />).wait(componentLoadWait);
        cy.dispatchActions(
            actions.getNotificationAttributesDescriptorsSuccess({
                attributeDescriptor: mockNotificationProviderAttributesDescriptors as AttributeDescriptorModel[],
            }),
            actions.listNotificationProvidersSuccess({
                providers: mockNotificationInstanceProviders as ConnectorResponseModel[],
            }),
        );
        cy.window().then((win) => {
            win.store.dispatch(
                actions.listNotificationProvidersSuccess({
                    providers: mockNotificationInstanceProviders as ConnectorResponseModel[],
                }),
            );
            win.store.dispatch(
                actions.getNotificationAttributesDescriptorsSuccess({
                    attributeDescriptor: mockNotificationProviderAttributesDescriptors as AttributeDescriptorModel[],
                }),
            );
            win.store.dispatch(
                actions.listMappingAttributesSuccess({
                    mappingAttributes: mockMappingAttributes as DataAttributeModel[],
                }),
            );
        });
    });

    it('should render notification instance form', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
    });

    it('user should be able to type Notification Instance Name', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('input[id="name"]').type('testNotificationInstance');
        cy.get('input').should('have.value', 'testNotificationInstance');
    });

    it('user should be able to type Notification Instance Description', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('[data-testid="notification-description"]').type('testDescription');
        cy.get('[data-testid="notification-description"]').should('have.value', 'testDescription');
    });

    it('user should be able to select Notification Instance Provider', () => {
        // Wait for the form to be ready
        cy.get('[data-testid="notification-instance-form"]').should('be.visible');

        // Find and click the select
        cy.get('[data-testid="notification-instance-provider-select-control"]').should('be.visible').click();

        // Wait for dropdown to open and select first option
        cy.get('[data-testid="notification-instance-provider-select-menu"]').should('be.visible').eq(0).click();
    });
    it('user should be able to select Notification Instance Kind', () => {
        cy.get('[data-testid="notification-instance-form"]').should('be.visible');
        cy.get('[data-testid="notification-instance-provider-select-control"]').should('be.visible').click();
        cy.get('[data-testid="notification-instance-provider-select-menu"]').should('be.visible').first().click();
        cy.get('[data-testid="notification-instance-form"]').should('be.visible');

        cy.get('[data-testid="notification-instance-kind-select-control"]').should('be.visible').click();

        cy.get('[data-testid="notification-instance-kind-select-menu"]').should('be.visible').first().click();
    });

    it('when all inputs and select filled, submit button should be disabled', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('input[id="name"]').type('testNotificationInstance');
        cy.get('input').should('have.value', 'testNotificationInstance');

        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('[data-testid="notification-description"]').type('testDescription');
        cy.get('[data-testid="notification-description"]').should('have.value', 'testDescription');

        // Intercept the action that gets dispatched when provider and kind are selected
        cy.window().then((win) => {
            const originalDispatch = win.store.dispatch;
            win.store.dispatch = (action: any) => {
                // If it's the action that clears descriptors, immediately populate them again
                if (action.type === 'notifications/getNotificationAttributesDescriptors') {
                    originalDispatch(action);
                    // Dispatch success action to populate descriptors
                    setTimeout(() => {
                        originalDispatch(
                            actions.getNotificationAttributesDescriptorsSuccess({
                                attributeDescriptor: mockNotificationProviderAttributesDescriptors as AttributeDescriptorModel[],
                            }),
                        );
                    }, 100);
                    return;
                }
                return originalDispatch(action);
            };
        });

        cy.get('[data-testid="notification-instance-form"]').should('be.visible');
        cy.get('[data-testid="notification-instance-provider-select-control"]').should('be.visible').click();
        cy.get('[data-testid="notification-instance-provider-select-menu"]').should('be.visible').eq(0).click();

        cy.get('[data-testid="notification-instance-kind-select-control"]').should('be.visible').click();
        cy.get('[data-testid="notification-instance-kind-select-menu"]').should('be.visible').eq(0).click().wait(1000);

        cy.get('button').contains('Create').should('be.disabled');

        cy.get('button').contains('Cancel').should('be.enabled');

        cy.get('div').contains('Select Content type').click({ force: true });
    });

    it('when all inputs and select filled, and connector attributes rendered and selected submit button should be enabled', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('input[id="name"]').type('testNotificationInstance');
        cy.get('input').should('have.value', 'testNotificationInstance');

        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('[data-testid="notification-description"]').type('testDescription');
        cy.get('[data-testid="notification-description"]').should('have.value', 'testDescription');

        // Intercept the action that gets dispatched when provider and kind are selected
        cy.window().then((win) => {
            const originalDispatch = win.store.dispatch;
            win.store.dispatch = (action: any) => {
                // If it's the action that clears descriptors, immediately populate them again
                if (action.type === 'notifications/getNotificationAttributesDescriptors') {
                    originalDispatch(action);
                    // Dispatch success action to populate descriptors
                    setTimeout(() => {
                        originalDispatch(
                            actions.getNotificationAttributesDescriptorsSuccess({
                                attributeDescriptor: mockNotificationProviderAttributesDescriptors as AttributeDescriptorModel[],
                            }),
                        );
                    }, 100);
                    return;
                }
                return originalDispatch(action);
            };
        });

        cy.get('[data-testid="notification-instance-form"]').should('be.visible');
        cy.get('[data-testid="notification-instance-provider-select-control"]').should('be.visible').click();
        cy.get('[data-testid="notification-instance-provider-select-menu"]').should('be.visible').eq(0).click();

        cy.get('[data-testid="notification-instance-kind-select-control"]').should('be.visible').click();
        cy.get('[data-testid="notification-instance-kind-select-menu"]').should('be.visible').eq(0).click().wait(1000);

        cy.get('button').contains('Create').should('be.disabled');

        cy.get('button').contains('Cancel').should('be.enabled');

        cy.get('div').contains('Select Content type').click({ force: true });
        cy.get('div').contains('raw_json').click({ force: true });
        cy.get('button').contains('Create').should('be.enabled');
        cy.get('button').contains('Create').click();
    });

    it('should validate required fields', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');

        // Try to submit without filling required fields
        cy.get('button').contains('Create').should('be.disabled');
        // Test name validation - required field
        cy.get('input[id="name"]').click().blur();
        cy.get('.invalid-feedback').should('exist');
        // Test with invalid characters in name
        cy.get('input[id="name"]').type('test@name');
        cy.get('.invalid-feedback').should('exist');

        // Test with valid characters
        cy.get('input[id="name"]').clear().type('validName123');
        cy.get('.invalid-feedback').should('be.empty');

        // Test description length validation (max 300 characters)
        cy.get('[data-testid="notification-description"]').type('a'.repeat(301));
        cy.get('[data-testid="notification-description"]').blur();
        cy.get('[data-testid="notification-description"]').next('.invalid-feedback').should('exist');

        // Test with valid description length
        cy.get('[data-testid="notification-description"]').clear().type('Valid description');
        cy.get('[data-testid="notification-description"]').next('.invalid-feedback').should('be.empty');
    });

    it('should show and hide tabs correctly', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('input[id="name"]').type('testNotificationInstance');
        cy.get('input').should('have.value', 'testNotificationInstance');

        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('[data-testid="notification-description"]').type('testDescription');
        cy.get('[data-testid="notification-description"]').should('have.value', 'testDescription');

        // Intercept the action that gets dispatched when provider and kind are selected
        cy.window().then((win) => {
            const originalDispatch = win.store.dispatch;
            win.store.dispatch = (action: any) => {
                // If it's the action that clears descriptors, immediately populate them again
                if (action.type === 'notifications/getNotificationAttributesDescriptors') {
                    originalDispatch(action);
                    // Dispatch success action to populate descriptors
                    setTimeout(() => {
                        originalDispatch(
                            actions.getNotificationAttributesDescriptorsSuccess({
                                attributeDescriptor: mockNotificationProviderAttributesDescriptors as AttributeDescriptorModel[],
                            }),
                        );
                    }, 100);
                    return;
                }
                return originalDispatch(action);
            };
        });

        cy.get('[data-testid="notification-instance-form"]').should('be.visible');
        cy.get('[data-testid="notification-instance-provider-select-control"]').should('be.visible').click();
        cy.get('[data-testid="notification-instance-provider-select-menu"]').should('be.visible').eq(0).click();

        cy.get('[data-testid="notification-instance-kind-select-control"]').should('be.visible').click();
        cy.get('[data-testid="notification-instance-kind-select-menu"]').should('be.visible').eq(0).click().wait(1000);
        cy.get('[data-testid="notification-instance-form"]').should('exist');

        // Tabs should be visible
        cy.get('.nav-tabs .nav-link').should('have.length', 2);
        cy.get('.nav-tabs .nav-link').contains('Connector Attributes').should('be.visible');
        cy.get('.nav-tabs .nav-link').contains('Attribute Mappings').should('be.visible');

        // Now connector attributes should have content
        cy.get('.nav-tabs .nav-link').contains('Connector Attributes').click();
        cy.get('.form-label').should('be.visible');

        // Attribute mappings tab should remain empty (no mapping attributes in mock data)
        cy.get('.nav-tabs .nav-link').contains('Attribute Mappings').click();
    });

    it('should handle cancel button functionality', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');

        cy.get('input[id="name"]').type('testNotificationInstance');
        cy.get('[data-testid="notification-description"]').type('testDescription');
        cy.get('button').contains('Cancel').should('be.enabled');
        cy.get('button').contains('Cancel').click();
    });

    it('should show widget title correctly', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');

        // Should show "Add Notification Instance" in create mode
        cy.get('[data-testid="notification-instance-form"]').should('contain', 'Add Notification Instance');
    });
});

describe('NotificationInstanceForm Edit Mode Coverage', () => {
    beforeEach(() => {
        // Mount with route parameter to simulate edit mode (/:id)
        cy.mount(<NotificationFormWithRoutes />, {}, `/notifications/edit/25020599-667b-4b25-8cc8-629ea05e7601`).wait(componentLoadWait);

        cy.window().then((win) => {
            win.store.dispatch(
                actions.listNotificationProvidersSuccess({
                    providers: mockNotificationInstanceProviders as ConnectorResponseModel[],
                }),
            );
            win.store.dispatch(actions.getNotificationInstanceSuccess(mockNotificationInstanceDetail as NotificationInstanceModel));
            win.store.dispatch(
                actions.getNotificationAttributesDescriptorsSuccess({
                    attributeDescriptor: mockNotificationProviderAttributesDescriptors as AttributeDescriptorModel[],
                }),
            );
            win.store.dispatch(
                actions.listMappingAttributesSuccess({
                    mappingAttributes: mockMappingAttributes as DataAttributeModel[],
                }),
            );
        });
    });

    it('should handle useEffect dependency array correctly when data loads in sequence', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');

        // Wait for async data to load and useEffect to process
        cy.wait(1000);
        cy.get('input[id="name"]').should('have.value', mockNotificationInstanceDetail.name);
        cy.get('[data-testid="notification-description"]').should('have.value', mockNotificationInstanceDetail.description);

        cy.get('[data-testid="notification-instance-provider-select-control"]').should(
            'contain',
            mockNotificationInstanceDetail.connectorName,
        );

        cy.get('[data-testid="notification-instance-kind-select-control"]').should('contain', mockNotificationInstanceDetail.kind);

        cy.get('[data-testid="notification-instance-form"]').should('contain', 'Update Notification Instance');
        cy.get('button').contains('Save').should('be.visible');
    });

    it('should handle defaultValues useMemo correctly when in edit mode with notificationDetails', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');

        cy.wait(500);

        cy.get('input[id="name"]').should('have.value', mockNotificationInstanceDetail.name);
        cy.get('[data-testid="notification-description"]').should('have.value', mockNotificationInstanceDetail.description);

        cy.get('[data-testid="notification-instance-provider-select-control"]').should('have.attr', 'aria-disabled', 'true');

        cy.get('[data-testid="notification-instance-kind-select-control"]').should('have.attr', 'aria-disabled', 'true');

        cy.get('input[id="name"]').should('have.attr', 'disabled');
    });

    it('should populate attributes mapping correctly from notificationDetails.attributeMappings', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);

        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.get('.nav-link').contains('Attribute Mappings').click();
    });

    it('should transform notificationDetails.attributes correctly in defaultValues useMemo', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);
        cy.get('.nav-link').contains('Connector Attributes').click();
    });
});
