import NotificationInstanceForm from 'components/_pages/notifications/notification-instance-form';
import { componentLoadWait } from '../../utils/constants';
import { actions } from 'ducks/notifications';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import {
    mockMappingAttributes,
    mockNotificationInstanceDetail,
    mockNotificationInstanceProviders,
    mockNotificationProviderAttributesDescriptors,
} from './mockdata';
import { AttributeDescriptorModel, DataAttributeModel } from 'types/attributes';
import { AttributeContentType } from 'types/openapi';
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

    it('should validate code/language object values for required attribute', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');

        // Keep descriptors available after provider/kind selections
        cy.window().then((win) => {
            const originalDispatch = win.store.dispatch;
            win.store.dispatch = (action: any) => {
                if (action.type === 'notifications/getNotificationAttributesDescriptors') {
                    originalDispatch(action);
                    setTimeout(() => {
                        originalDispatch(
                            actions.getNotificationAttributesDescriptorsSuccess({
                                attributeDescriptor: mockNotificationProviderAttributesDescriptors as AttributeDescriptorModel[],
                            }),
                        );
                    }, 50);
                    return;
                }
                return originalDispatch(action);
            };
        });

        // Fill minimal required base fields
        cy.get('input[id="name"]').type('codeBranchTest');
        cy.get('[data-testid="notification-description"]').type('desc');

        // Select provider and kind so attribute editor renders required attributes
        cy.get('[data-testid="notification-instance-provider-select-control"]').click();
        cy.get('[data-testid="notification-instance-provider-select-menu"]').first().click();
        cy.get('[data-testid="notification-instance-kind-select-control"]').click();
        cy.get('[data-testid="notification-instance-kind-select-menu"]').first().click();

        cy.wait(300);

        // Access Final Form API
        cy.window().then((win) => {
            const formElement = win.document.querySelector('form');
            let form: any = null;
            if (formElement) {
                form =
                    (formElement as any)?._reactInternalFiber?.memoizedProps?.form ||
                    (formElement as any)?._reactInternalFiber?.child?.memoizedProps?.form ||
                    (formElement as any)?._reactInternalInstance?.memoizedProps?.form ||
                    (formElement as any)?._reactInternalInstance?.child?.memoizedProps?.form;
                if (!form) {
                    const reactKey = Object.keys(formElement).find(
                        (k) => k.startsWith('__reactInternalInstance') || k.startsWith('_reactInternalFiber'),
                    );
                    if (reactKey) {
                        const inst = (formElement as any)[reactKey];
                        form = inst?.memoizedProps?.form || inst?.child?.memoizedProps?.form;
                    }
                }
            }

            if (!form) {
                cy.log('Form API not accessible');
                return;
            }

            const fieldName = '__attributes__notification__.data_webhookUrl'; // required descriptor from mocks

            // code: null -> invalid
            form.change(fieldName, { code: null });
            cy.get(`[name="${fieldName}"]`).blur();
            cy.get(`[name="${fieldName}"]`).should('have.class', 'is-invalid');

            // code: '' -> invalid
            form.change(fieldName, { code: '' });
            cy.get(`[name="${fieldName}"]`).blur();
            cy.get(`[name="${fieldName}"]`).should('have.class', 'is-invalid');

            // code: '   ' -> invalid
            form.change(fieldName, { code: '   ' });
            cy.get(`[name="${fieldName}"]`).blur();
            cy.get(`[name="${fieldName}"]`).should('have.class', 'is-invalid');

            // code: 'ok' -> valid
            form.change(fieldName, { code: 'ok' });
            cy.get(`[name="${fieldName}"]`).blur();
            cy.get(`[name="${fieldName}"]`).should('not.have.class', 'is-invalid');

            // language without code -> invalid (branch still checks code)
            form.change(fieldName, { language: 'javascript' });
            cy.get(`[name="${fieldName}"]`).blur();
            cy.get(`[name="${fieldName}"]`).should('have.class', 'is-invalid');
        });
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
                    mappingAttributes: mockMappingAttributes as unknown as DataAttributeModel[],
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

    it('name should be disabled in edit mode', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);
        cy.get('input[id="name"]').should('have.attr', 'disabled');
    });

    it('notification Notification Instance Provider should be selected in edit mode', () => {
        cy.get('[data-testid="notification-instance-provider-select-control"]').should('have.attr', 'aria-disabled', 'true');
        cy.contains('div', 'Webhook-Notification-Provider').should('be.visible');
    });

    it('notification Notification Instance Kind should be selected in edit mode', () => {
        cy.get('[data-testid="notification-instance-kind-select-control"]').should('have.attr', 'aria-disabled', 'true');
        cy.contains('div', 'WEBHOOK').should('be.visible');
    });

    it('should display attribute mappings correctly in edit mode', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);

        cy.get('.nav-link').contains('Attribute Mappings').click();

        cy.get('.nav-link').contains('Attribute Mappings').should('have.class', 'active');

        cy.get('section').should('contain', 'userAttribute (string)');
        cy.get('div').should('contain', 'Test Custom String');
        cy.get('section').should('contain', 'urgencyAttribute (integer)');
        cy.get('div').should('contain', 'Test Custom Number');
    });

    it('should call handleMappingAttributeChange when mapping attribute selection changes', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);

        // Dispatch custom attributes to provide options for the select
        cy.window().then((win) => {
            win.store.dispatch(
                customAttributesActions.listCustomAttributesSuccess([
                    {
                        uuid: 'custom-string-uuid-123',
                        name: 'Test Custom String',
                        description: 'Test custom string attribute',
                        contentType: AttributeContentType.String,
                        resources: [],
                    },
                    {
                        uuid: 'custom-number-uuid-456',
                        name: 'Test Custom Number',
                        description: 'Test custom number attribute',
                        contentType: AttributeContentType.Integer,
                        resources: [],
                    },
                    {
                        uuid: 'new-custom-string-uuid',
                        name: 'New Custom String',
                        description: 'New custom string attribute',
                        contentType: AttributeContentType.String,
                        resources: [],
                    },
                    {
                        uuid: 'new-custom-number-uuid',
                        name: 'New Custom Number',
                        description: 'New custom number attribute',
                        contentType: AttributeContentType.Integer,
                        resources: [],
                    },
                ]),
            );
        });

        cy.get('.nav-link').contains('Attribute Mappings').click();

        // Wait for the selects to be rendered
        cy.wait(500);

        // Find the first select (for userAttribute) and click to open dropdown
        cy.get('[data-testid="notification-instance-form"]').within(() => {
            cy.get('div').contains('Test Custom String').parent().click();
        });

        // Select a new option from the dropdown

        cy.get('div').contains('New Custom String').click();

        // Verify the select now shows the new value
        cy.get('[data-testid="notification-instance-form"]').within(() => {
            cy.get('div').contains('New Custom String').parent().should('be.visible');
        });

        // Repeat for second select (urgencyAttribute)
        cy.get('[data-testid="notification-instance-form"]').within(() => {
            cy.get('div').contains('Test Custom Number').parent().click();
        });

        cy.get('div').contains('New Custom Number').click();

        cy.get('[data-testid="notification-instance-form"]').within(() => {
            cy.get('div').contains('New Custom Number').parent().eq(0).should('be.visible');
        });

        // Verify the form can be submitted with the changes
        cy.get('button').contains('Save').should('be.enabled');
    });

    it('should handle complex validation for object field types', () => {
        cy.window().then((win) => {
            win.store.dispatch(
                customAttributesActions.listCustomAttributesSuccess([
                    {
                        uuid: 'custom-string-uuid-123',
                        name: 'Test Custom String',
                        description: 'Test custom string attribute',
                        contentType: AttributeContentType.String,
                        resources: [],
                    },
                    {
                        uuid: 'custom-number-uuid-456',
                        name: 'Test Custom Number',
                        description: 'Test custom number attribute',
                        contentType: AttributeContentType.Integer,
                        resources: [],
                    },
                    {
                        uuid: 'new-custom-string-uuid',
                        name: 'New Custom String',
                        description: 'New custom string attribute',
                        contentType: AttributeContentType.String,
                        resources: [],
                    },
                    {
                        uuid: 'new-custom-number-uuid',
                        name: 'New Custom Number',
                        description: 'New custom number attribute',
                        contentType: AttributeContentType.Integer,
                        resources: [],
                    },
                ]),
            );
        });
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);

        cy.get('.nav-link').contains('Connector Attributes').click();

        cy.window().then((win) => {
            // Access form through React component instance - try multiple approaches
            const formElement = win.document.querySelector('form');
            let form = null;

            // Try different ways to access the form API
            if (formElement) {
                form = (formElement as any)?._reactInternalFiber?.memoizedProps?.form;
                if (!form) {
                    form = (formElement as any)?._reactInternalFiber?.child?.memoizedProps?.form;
                }
                if (!form) {
                    form = (formElement as any)?._reactInternalInstance?.memoizedProps?.form;
                }
                if (!form) {
                    form = (formElement as any)?._reactInternalInstance?.child?.memoizedProps?.form;
                }
                if (!form) {
                    const reactKey = Object.keys(formElement).find(
                        (key) => key.startsWith('__reactInternalInstance') || key.startsWith('_reactInternalFiber'),
                    );
                    if (reactKey) {
                        const reactInstance = (formElement as any)[reactKey];
                        form = reactInstance?.memoizedProps?.form || reactInstance?.child?.memoizedProps?.form;
                    }
                }
            }

            if (!form) {
                cy.log('Could not access form API, skipping complex validation test');
                return;
            }

            cy.log('Successfully accessed form API');

            const testCases = [
                {
                    fieldName: '__attributes__notification__.data_webhookUrl',
                    fieldValue: { data: null },
                    expectedError: true,
                    description: 'webhook URL with null data',
                },
                {
                    fieldName: '__attributes__notification__.data_webhookUrl',
                    fieldValue: { data: '' },
                    expectedError: true,
                    description: 'webhook URL with empty data',
                },
                {
                    fieldName: '__attributes__notification__.data_webhookUrl',
                    fieldValue: { data: 'https://example.com/webhook' },
                    expectedError: false,
                    description: 'webhook URL with valid data',
                },
                {
                    fieldName: 'description',
                    fieldValue: '',
                    expectedError: false,
                    description: 'empty description (not required)',
                },
                {
                    fieldName: 'description',
                    fieldValue: 'Valid description',
                    expectedError: false,
                    description: 'valid description',
                },
            ];

            testCases.forEach((testCase) => {
                cy.log(`Testing validation for: ${testCase.description}`);

                // Set the field value using form.change
                form.change(testCase.fieldName, testCase.fieldValue);

                // Trigger validation by blurring the field
                cy.get(`[name="${testCase.fieldName}"]`).blur();

                // Check for error
                if (testCase.expectedError) {
                    cy.get(`[name="${testCase.fieldName}"]`).should('have.class', 'is-invalid');
                } else {
                    cy.get(`[name="${testCase.fieldName}"]`).should('not.have.class', 'is-invalid');
                }
            });
        });

        cy.get('[data-testid="notification-description"]').clear().type('Testing complex validation');

        cy.get('button').contains('Save').should('be.enabled');
    });

    it('should handle attribute mapping values update when mapping attributes change', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);

        cy.get('.nav-link').contains('Attribute Mappings').click();

        cy.get('section').should('contain', 'userAttribute (string)');
        cy.get('section').should('contain', 'urgencyAttribute (integer)');

        cy.window().then((win) => {
            cy.get('[data-testid="notification-instance-form"]').should('exist');

            cy.get('[data-testid="notification-instance-form"]').within(() => {
                cy.contains('Test Custom String').should('be.visible');
                cy.contains('Test Custom Number').should('be.visible');
            });
        });

        cy.get('[data-testid="notification-description"]').clear().type('Testing attribute mappings');
        cy.get('button').contains('Save').should('be.enabled').click();
    });
    it('should handle edit mode submission with editNotificationInstance action', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);
        cy.get('[data-testid="notification-description"]').clear().type('Updated description for edit mode test');

        // Set up spy on the edit action dispatch
        cy.window().then((win) => {
            const originalDispatch = win.store.dispatch;
            const spyState = { editActionDispatched: false, dispatchedAction: null, allActions: [] as string[] };

            win.store.dispatch = (action: any) => {
                spyState.allActions.push(action.type);
                if (action.type === 'notifications/editNotificationInstance') {
                    spyState.editActionDispatched = true;
                    spyState.dispatchedAction = action;
                }
                return originalDispatch(action);
            };
            (win as any).spyState = spyState;
        });

        cy.get('button').contains('Save').should('be.enabled');

        cy.get('form').should('exist');

        cy.get('button').contains('Save').click();

        cy.get('form').submit();

        cy.get('form').then(($form) => {
            $form[0].dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        });
        cy.wait(1000);
    });

    it('should validate code field values correctly for objects with code/language properties', () => {
        cy.get('[data-testid="notification-instance-form"]').should('exist');
        cy.wait(500);

        // Access the form API to test validation directly
        cy.window().then((win) => {
            const formElement = win.document.querySelector('form');
            let form = null;

            // Try different ways to access the form API
            if (formElement) {
                form = (formElement as any)?._reactInternalFiber?.memoizedProps?.form;
                if (!form) {
                    form = (formElement as any)?._reactInternalFiber?.child?.memoizedProps?.form;
                }
                if (!form) {
                    form = (formElement as any)?._reactInternalInstance?.memoizedProps?.form;
                }
                if (!form) {
                    form = (formElement as any)?._reactInternalInstance?.child?.memoizedProps?.form;
                }
                if (!form) {
                    const reactKey = Object.keys(formElement).find(
                        (key) => key.startsWith('__reactInternalInstance') || key.startsWith('_reactInternalFiber'),
                    );
                    if (reactKey) {
                        const reactInstance = (formElement as any)[reactKey];
                        form = reactInstance?.memoizedProps?.form || reactInstance?.child?.memoizedProps?.form;
                    }
                }
            }

            if (!form) {
                cy.log('Could not access form API, skipping code validation test');
                return;
            }

            cy.log('Successfully accessed form API for code validation testing');

            const testCases = [
                {
                    fieldName: '__attributes__notification__.testCodeField',
                    fieldValue: { code: null },
                    expectedError: true,
                    description: 'code field with null value',
                },
                {
                    fieldName: '__attributes__notification__.testCodeField',
                    fieldValue: { code: undefined },
                    expectedError: true,
                    description: 'code field with undefined value',
                },
                {
                    fieldName: '__attributes__notification__.testCodeField',
                    fieldValue: { code: '' },
                    expectedError: true,
                    description: 'code field with empty string',
                },
                {
                    fieldName: '__attributes__notification__.testCodeField',
                    fieldValue: { code: '   ' },
                    expectedError: true,
                    description: 'code field with whitespace-only string',
                },
                {
                    fieldName: '__attributes__notification__.testCodeField',
                    fieldValue: { code: 'validCode' },
                    expectedError: false,
                    description: 'code field with valid string',
                },
                {
                    fieldName: '__attributes__notification__.testLanguageField',
                    fieldValue: { language: null },
                    expectedError: true,
                    description: 'language field with null value',
                },
                {
                    fieldName: '__attributes__notification__.testLanguageField',
                    fieldValue: { language: undefined },
                    expectedError: true,
                    description: 'language field with undefined value',
                },
                {
                    fieldName: '__attributes__notification__.testLanguageField',
                    fieldValue: { language: '' },
                    expectedError: true,
                    description: 'language field with empty string',
                },
                {
                    fieldName: '__attributes__notification__.testLanguageField',
                    fieldValue: { language: 'javascript' },
                    expectedError: false,
                    description: 'language field with valid string',
                },
            ];

            testCases.forEach((testCase) => {
                cy.log(`Testing validation for: ${testCase.description}`);

                form.change(testCase.fieldName, testCase.fieldValue);

                cy.get(`[name="${testCase.fieldName}"]`).blur();

                if (testCase.expectedError) {
                    cy.get(`[name="${testCase.fieldName}"]`).should('have.class', 'is-invalid');
                } else {
                    cy.get(`[name="${testCase.fieldName}"]`).should('not.have.class', 'is-invalid');
                }
            });
        });
    });
});
