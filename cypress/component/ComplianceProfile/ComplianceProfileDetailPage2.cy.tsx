import ComplianceProfileDetail from 'components/_pages/compliance-profiles/detail';
import { clickWait, componentLoadWait } from '../../utils/constants';
import '../../../src/resources/styles/theme.scss';
import { complianceProfileDetailMockData, mockGroupRules, mockPlatformEnums, mockResourceEnum, mockAssociations } from './mock-data';
import { ComplianceProfileDtoV2, ComplianceRuleListDto, EnumItemDto, ResourceObjectDto } from 'types/openapi';
import { actions, selectors } from 'ducks/compliance-profiles';
import { actions as enumActions } from 'ducks/enums';
import { actions as filterActions, EntityType } from 'ducks/filters';
import { Routes, Route } from 'react-router';

const ComplianceProfileDetailPage2Test = () => {
    return (
        <Routes>
            <Route path="/complianceprofiles/detail/:id" element={<ComplianceProfileDetail />} />
        </Routes>
    );
};

describe('Compliance Profile Detail Page', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileDetailPage2Test />, {}, `/complianceprofiles/detail/${complianceProfileDetailMockData.uuid}`).wait(
            componentLoadWait,
        );
        cy.dispatchActions(
            // Set compliance profile data
            actions.getComplianceProfileSuccess({
                complianceProfile: complianceProfileDetailMockData as unknown as ComplianceProfileDtoV2,
            }),
            // Set platform enums data
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            // Set group rules data
            actions.getListComplianceGroupRulesSuccess({
                rules: mockGroupRules as unknown as ComplianceRuleListDto[],
            }),
            // Set associations data
            actions.getAssociationsOfComplianceProfileSuccess({
                associations: mockAssociations as unknown as ResourceObjectDto[],
            }),
            // Set available filters for conditions
            filterActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: [],
            }),
        );

        // Set up action listener to automatically complete group rules requests
        cy.window().then((win) => {
            win.registerReduxActionListener(
                (action) => action.type === actions.getListComplianceGroupRules.type,
                () => {
                    // Automatically dispatch success action when group rules request is made
                    win.store.dispatch(
                        actions.getListComplianceGroupRulesSuccess({
                            rules: mockGroupRules as unknown as ComplianceRuleListDto[],
                        }),
                    );
                },
            );
        });
    });

    describe('Group Detail menu', () => {
        beforeEach(() => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').within(() => {
                cy.get('table tbody tr')
                    .eq(6)
                    .within(() => {
                        cy.get('button[title="Rules"]').click().wait(500);
                    });
            });
        });
        it('should display the group detail menu', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('Details').should('exist');
                cy.contains('Rules').should('exist');
            });
        });

        it('Should change tab to rules', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Rules').click().wait(clickWait);
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Rules').should('exist');
            });
        });

        it('should be able to switch between tabs', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Rules').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Rules').should('exist');
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Details').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Details').should('exist');
            });
        });

        it('details tab should display the table with the correct structure', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody').should('exist');
                cy.get('table thead tr').should('have.length', 2);
                cy.get('table thead tr th').eq(0).should('contain', 'Property');
                cy.get('table thead tr th').eq(1).should('contain', 'Value');
            });
        });

        it('should display table data in the details table', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody tr').contains('UUID').should('exist');
                cy.get('table tbody tr').contains('52350996-ddb2-11ec-9d64-0242ac120002').should('exist');
                cy.get('table tbody tr').contains('Name').should('exist');
                cy.get('table tbody tr').contains("Apple's CT Policy").should('exist');
                cy.get('table tbody tr').contains('Description').should('exist');
                cy.get('table tbody tr').contains('some description').should('exist');
                cy.get('table tbody tr').contains('Status').should('exist');
                cy.get('table tbody tr').contains('Available').should('exist');
                cy.get('.badge').should('contain', 'Available');
                cy.get('table tbody tr').contains('Resource').should('exist');
                cy.get('table tbody tr').contains('Certificate').should('exist');
            });
        });

        describe('Rules tab', () => {
            beforeEach(() => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.contains('a.nav-link', 'Rules').click();
                });
            });

            it('rules tab should display the table with the correct structure', () => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.get('table tbody').should('exist');
                    cy.get('table thead tr')
                        .should('have.length', 2)
                        .eq(1)
                        .within(() => {
                            cy.get('th').eq(0).should('exist');
                            cy.get('th').eq(1).should('contain', 'Name');
                            cy.get('th').eq(2).should('contain', 'Description');
                        });
                });
            });

            it('rules tab should display the table with the correct data', () => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.get('table tbody tr').contains('Name').should('exist');
                    cy.get('table tbody tr').contains('Name').should('exist');
                    cy.get('table tbody tr').contains('Description').should('exist');
                });
            });

            it('should expand table row on click to get detail information', () => {
                cy.get('[data-testid="entity-detail-menu"]').within(() => {
                    cy.get('i[data-expander="true"]').click().wait(clickWait);

                    cy.get('[data-testid="custom-table"]')
                        .should('exist')
                        .eq(2)
                        .within(() => {
                            cy.get('thead tr th').eq(0).should('contain', 'Property');
                            cy.get('thead tr th').eq(1).should('contain', 'Value');

                            cy.get('tbody tr[data-id="uuid"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'UUID');
                                cy.get('td').eq(1).should('contain', '40f084cd-ddc1-11ec-82b0-34cff65c6ee3');
                            });

                            cy.get('tbody tr[data-id="name"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Name');
                                cy.get('td').eq(1).should('contain', 'e_basic_constraints_not_critical');
                            });

                            cy.get('tbody tr[data-id="type"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Type');
                                cy.get('td').eq(1).should('exist');
                            });

                            cy.get('tbody tr[data-id="description"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Description');
                                cy.get('td').eq(1).should('contain', 'basicConstraints MUST appear as a critical extension');
                            });

                            cy.get('tbody tr[data-id="resource"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Resource');
                                cy.get('td').eq(1).should('contain', 'Certificate');
                            });

                            cy.get('tbody tr[data-id="format"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Format');
                                cy.get('td').eq(1).should('exist');
                            });

                            cy.get('tbody tr[data-id="kind"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Kind');
                                cy.get('td').eq(1).should('contain', 'x509');
                            });

                            cy.get('tbody tr[data-id="attributes"]').within(() => {
                                cy.get('td').eq(0).should('contain', 'Attributes');
                                cy.get('td').eq(1).should('exist');
                            });
                        });
                });
            });
        });
    });

    describe('Internal Rule Detail menu', () => {
        beforeEach(() => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').within(() => {
                cy.get('table tbody tr')
                    .eq(0)
                    .within(() => {
                        cy.get('button[title="Rules"]').click().wait(clickWait);
                    });
            });
        });

        it('details tab should display the table with the correct structure', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody').should('exist');
                cy.get('table thead tr').should('have.length', 1);
                cy.get('table thead tr th').eq(0).should('contain', 'Property');
                cy.get('table thead tr th').eq(1).should('contain', 'Value');
            });
        });

        it('should display table data in the details table', () => {
            cy.get('[data-id="uuid"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'UUID');
                    cy.get('td').eq(1).should('contain', '1');
                });
            cy.get('[data-id="name"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Name');
                    cy.get('td').eq(1).should('contain', 'test');
                });
            cy.get('[data-id="description"]')
                .first()
                .within(() => {
                    cy.get('td').eq(0).should('contain', 'Description');
                    cy.get('td').eq(1).should('contain', 'test');
                });
            cy.get('table tbody tr').contains('Status').should('exist');
            cy.get('table tbody tr').contains('Available').should('exist');
            cy.get('.badge').should('contain', 'Available');
            cy.get('table tbody tr').contains('Type').should('exist');
            cy.get('table tbody tr').contains('Resource').should('exist');
            cy.get('table tbody tr').contains('Certificate').should('exist');
            cy.get('a[href*="/certificates"]').should('exist');
            cy.get('table tbody tr').contains('Format').should('exist');
        });
    });

    describe('Rule Detail menu', () => {
        beforeEach(() => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').within(() => {
                cy.get('table tbody tr')
                    .eq(3)
                    .within(() => {
                        cy.get('button[title="Rules"]').click().wait(clickWait);
                    });
            });
        });

        it('should display the group detail menu', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('Details').should('exist');
                cy.contains('Attributes').should('exist');
            });
        });
        it('Should change tab to rules', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Attributes').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Attributes').should('exist');
            });
        });
        it('should be able to switch between tabs', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Attributes').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Attributes').should('exist');
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.nav-link', 'Details').click();
            });
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.contains('a.active.nav-link', 'Details').should('exist');
            });
        });

        it('details tab should display the table with the correct structure', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody').should('exist');
                cy.get('table thead tr').should('have.length', 2);
                cy.get('table thead tr th').eq(0).should('contain', 'Property');
                cy.get('table thead tr th').eq(1).should('contain', 'Value');
            });
        });

        it('should display table data in the details table', () => {
            cy.get('[data-testid="entity-detail-menu"]').within(() => {
                cy.get('table tbody tr').contains('UUID').should('exist');
                cy.get('table tbody tr').contains('7ed00480-e706-11ec-8fea-0242ac120002').should('exist');
                cy.get('table tbody tr').contains('Name').should('exist');
                cy.get('table tbody tr').contains('cus_key_length').should('exist');
                cy.get('table tbody tr').contains('Description').should('exist');
                cy.get('table tbody tr').contains('Public Key length of the certificate should be').should('exist');
                cy.get('table tbody tr').contains('Status').should('exist');
                cy.get('table tbody tr').contains('Available').should('exist');
                cy.get('.badge').should('contain', 'Available');
                cy.get('table tbody tr').contains('Type').should('exist');
                cy.get('table tbody tr').contains('X.509').should('exist');
                cy.get('table tbody tr').contains('Resource').should('exist');
                cy.get('table tbody tr').contains('Certificate').should('exist');
                cy.get('a[href*="/certificates"]').should('exist');
                cy.get('table tbody tr').contains('Format').should('exist');
                cy.get('table tbody tr').contains('Kind').should('exist');
                cy.get('table tbody tr').contains('x509').should('exist');
                cy.get('table tbody tr').contains('Provider').should('exist');
                cy.get('table tbody tr').contains('X509-Compliance-Provider').should('exist');
                cy.get('a[href*="/connectors/detail/8d8a6610-9623-40d2-b113-444fe59579dd"]').should('exist');
            });
        });
    });

    describe('Basic Rendering', () => {
        it('should render the component without crashing', () => {
            cy.get('.themed-container').should('exist');
        });

        it('should display the go back button', () => {
            cy.get('[data-testid="go-back-button"]').should('exist');
            cy.get('[data-testid="go-back-button"]').should('contain.text', 'Compliance Profile Inventory');
        });

        it('should display the main widget with correct title', () => {
            cy.get('[data-testid="compliance-profile-details-widget"]').should('exist');
            cy.get('[data-testid="compliance-profile-details-widget"]').should('contain.text', 'Compliance Profile Details');
        });

        it('should display profile associations widget', () => {
            cy.get('[data-testid="profile-associations-widget"]').should('exist');
        });

        it('should display assigned rules and groups widget', () => {
            cy.get('[data-testid="assigned-rules-and-group-widget"]').should('exist');
        });

        it('should display available rules and groups widget', () => {
            cy.get('[data-testid="available-rules-and-groups-widget"]').should('exist');
        });
    });

    describe('Delete Confirmation Dialog', () => {
        beforeEach(() => {
            cy.get('[data-testid="delete-compliance-profile-button"]').click();
        });

        it('should display correct dialog content', () => {
            cy.get('[data-testid="delete-confirmation-dialog"]').should('be.visible');
            cy.get('[data-testid="delete-confirmation-dialog"]').should(
                'contain.text',
                'You are about to delete a Compliance Profile. Is this what you want to do?',
            );
        });

        it('should have Yes, delete and Cancel buttons', () => {
            cy.get('[data-testid="delete-confirmation-dialog"]').within(() => {
                cy.contains('Yes, delete').should('exist');
                cy.contains('Cancel').should('exist');
            });
        });

        it('should close dialog when Cancel button is clicked', () => {
            cy.get('[data-testid="delete-confirmation-dialog"]').within(() => {
                cy.contains('Cancel').click().wait(1000);
            });
            cy.get('[data-testid="delete-confirmation-dialog"]').should('not.exist');
        });

        it('should run function when delete button is clicked and close modal', () => {
            cy.window().then((win) => {
                cy.stub(win.console, 'log').as('consoleLog');
            });

            cy.get('[data-testid="delete-confirmation-dialog"]').within(() => {
                cy.contains('Yes, delete').click().wait(1000);
            });
            cy.get('[data-testid="delete-confirmation-dialog"]').should('not.exist');
        });
    });

    describe('Compliance Check Dialog', () => {
        beforeEach(() => {
            cy.get('[data-testid="check-compliance-button"]').click();
        });

        it('should display correct dialog content', () => {
            cy.get('[data-testid="compliance-check-dialog"]').should('be.visible');
            cy.get('[data-testid="compliance-check-dialog"]').should(
                'contain.text',
                'Initiate the compliance check for the Compliance Profile?',
            );
        });

        it('should have Yes and Cancel buttons', () => {
            cy.get('[data-testid="compliance-check-dialog"]').within(() => {
                cy.contains('Yes').should('exist');
                cy.contains('Cancel').should('exist');
            });
        });

        it('should close dialog when Cancel button is clicked', () => {
            cy.get('[data-testid="compliance-check-dialog"]').within(() => {
                cy.contains('Cancel').click().wait(1000);
            });
            cy.get('[data-testid="compliance-check-dialog"]').should('not.exist');
        });

        it('should run function when Yes button is clicked and close modal', () => {
            cy.window().then((win) => {
                cy.stub(win.console, 'log').as('consoleLog');
            });

            cy.get('[data-testid="compliance-check-dialog"]').within(() => {
                cy.contains('Yes').click().wait(1000);
            });
            cy.get('[data-testid="compliance-check-dialog"]').should('not.exist');
        });
    });

    describe('Delete Error Dialog', () => {
        beforeEach(() => {
            cy.get('[data-testid=compliance-profile-details-widget').within(() => {
                cy.get('[data-testid=delete-compliance-profile-button').click().wait(clickWait);
            });
        });

        it('should display delete confirmation dialog', () => {
            cy.get('[data-testid=delete-confirmation-dialog').should('be.visible');
            cy.get('[data-testid=delete-confirmation-dialog').should(
                'contain.text',
                'You are about to delete a Compliance Profile. Is this what you want to do?',
            );
        });
        it('should have Yes, delete and Cancel buttons', () => {
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').should('exist');
                cy.contains('Cancel').should('exist');
            });
        });
        it('should close dialog when Cancel button is clicked', () => {
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Cancel').click().wait(1000);
            });
            cy.get('[data-testid=delete-confirmation-dialog').should('not.exist');
        });
        it('should run function when delete button is clicked and close modal', () => {
            cy.window().then((win) => {
                cy.stub(win.console, 'log').as('consoleLog');
            });
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').click().wait(1000);
            });
            cy.get('[data-testid=delete-confirmation-dialog').should('not.exist');
        });

        it('should display delete error dialog when there is an error message', () => {
            cy.get('[data-testid=delete-confirmation-dialog').should('be.visible');
            cy.get('[data-testid=delete-confirmation-dialog').should(
                'contain.text',
                'You are about to delete a Compliance Profile. Is this what you want to do?',
            );
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').should('exist');
                cy.contains('Cancel').should('exist');
            });
            cy.get('[data-testid=delete-confirmation-dialog').within(() => {
                cy.contains('Yes, delete').click().wait(1000);
            });
        });
    });
});
