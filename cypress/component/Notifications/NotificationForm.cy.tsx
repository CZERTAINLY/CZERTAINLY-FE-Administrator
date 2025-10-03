import NotificationInstanceForm from 'components/_pages/notifications/notification-instance-form';
import { componentLoadWait } from '../../utils/constants';
import { actions } from 'ducks/notifications';
import { mockMappingAttributes, mockNotificationInstanceProviders, mockNotificationProviderAttributesDescriptors } from './mockdata';
import { AttributeDescriptorModel, DataAttributeModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import '../../../src/resources/styles/theme.scss';

const NotificationFormTest = () => {
    return <NotificationInstanceForm />;
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
});
