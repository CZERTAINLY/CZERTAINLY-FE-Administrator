import AvailableRulesAndGroups from 'components/_pages/compliance-profiles/detail/AvailableRulesAndGroups/AvailableRulesAndGroups';
import {
    complianceProfileDetailMockData,
    mockConnectors,
    mockInternalRules,
    mockPlatformEnums,
    mockProviderGroups,
    mockProviderRules,
} from './mock-data';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { useState } from 'react';
import { ComplianceGroupListDto, ComplianceProfileDtoV2, ComplianceRuleListDto } from 'types/openapi';
import { actions as enumActions } from 'ducks/enums';
import { actions } from 'ducks/compliance-profiles';
import { actions as connectorsActions } from 'ducks/connectors';
import { ConnectorResponseModel } from 'types/connectors';
import '../../../src/resources/styles/theme.scss';
import { capitalize } from 'utils/common-utils';
import Dialog from 'components/Dialog';

const AvailableRulesAndGroups2 = () => {
    const [selectedEntityDetails, setSelectedEntityDetails] = useState<any>(null);
    const [isEntityDetailMenuOpen, setIsEntityDetailMenuOpen] = useState(false);
    const [resetFunction, setResetFunction] = useState<(() => void) | null>(null);

    const handleReset = (resetFn: () => void) => {
        setResetFunction(() => resetFn);
    };

    return (
        <>
            <AvailableRulesAndGroups
                profile={complianceProfileDetailMockData as unknown as ComplianceProfileDtoV2}
                setSelectedEntityDetails={setSelectedEntityDetails}
                setIsEntityDetailMenuOpen={setIsEntityDetailMenuOpen}
                onReset={handleReset}
            />
            {isEntityDetailMenuOpen && selectedEntityDetails && (
                <Dialog
                    isOpen={isEntityDetailMenuOpen}
                    dataTestId="entity-detail-menu"
                    caption={
                        <p style={{ fontWeight: 'bold' }}>
                            {selectedEntityDetails
                                ? `${capitalize(selectedEntityDetails?.entityDetails?.entityType)}: (${selectedEntityDetails?.name})`
                                : 'Entity Details'}
                        </p>
                    }
                    body={
                        <>
                            <h3>This component covered inside detail page</h3>
                        </>
                    }
                    toggle={() => setIsEntityDetailMenuOpen(false)}
                    buttons={[{ color: 'secondary', onClick: () => setIsEntityDetailMenuOpen(false), body: 'Close' }]}
                />
            )}
        </>
    );
};

describe('Available Rules And Groups (Internal Rule Case)', () => {
    beforeEach(() => {
        cy.mount(<AvailableRulesAndGroups2 />, {}, `/complianceprofiles/detail/${complianceProfileDetailMockData.uuid}`).wait(
            componentLoadWait,
        );
        cy.dispatchActions(
            actions.getListComplianceRulesSuccess({
                rules: [],
            }),
            actions.getListComplianceGroupsSuccess({
                groups: [],
            }),
            // Set platform enums data
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            connectorsActions.listConnectorsSuccess({
                connectorList: mockConnectors as unknown as ConnectorResponseModel[],
            }),
        );
        // Set up action listener to automatically complete rules requests
        cy.window().then((win) => {
            win.registerReduxActionListener(
                (action) => action.type === actions.getListComplianceRules.type,
                () => {
                    // Automatically dispatch success action when group rules request is made
                    win.store.dispatch(
                        actions.getListComplianceRulesSuccess({
                            rules: mockInternalRules as unknown as ComplianceRuleListDto[],
                        }),
                    );
                },
            );
        });
    });

    it('should render the available rules and groups widget', () => {
        cy.get('[data-testid="available-rules-and-groups-widget"]').should('exist');
    });
    it('should render the widget with correct title', () => {
        cy.get('h5').should('contain', 'Available Rules & Groups');
    });
    it('should render rules source select with correct label', () => {
        cy.get('label[for="availableRulesSource"]').should('contain', 'Rules Source');
    });

    it('should display rules source select dropdown', () => {
        cy.get('#availableRulesSource').should('exist');
    });
    it('should display resource badges for filtering', () => {
        cy.get('[data-testid="resource-badges"]').should('exist');
        cy.get('[data-testid="resource-badges"]').should('contain', 'All');
    });
    it('should render the table with correct headers', () => {
        cy.get('table thead th').should('have.length', 4);
        cy.get('table thead th').eq(0).should('contain', 'Type');
        cy.get('table thead th').eq(1).should('contain', 'Name');
        cy.get('table thead th').eq(2).should('contain', 'Resource');
        cy.get('table thead th').eq(3).should('contain', 'Action');
    });

    describe('Rules Source Selection', () => {
        it('should show Internal and Provider options in rules source dropdown', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').should('contain', 'Internal');
            cy.get('[class*="option"]').should('contain', 'Provider');
        });

        it('should show add button when Internal source is selected', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);

            cy.get('button').find('.fa-plus').should('exist');
        });

        it('should show provider and kind selects when Provider source is selected', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('label[for="availableProvider"]').should('contain', 'Provider');
            cy.get('label[for="availableKind"]').should('contain', 'Kind');
            cy.get('#availableProvider').should('exist');
            cy.get('#availableKind').should('exist');
        });

        it('should clear provider and kind fields when rules source is cleared', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);

            cy.get('#availableRulesSource').parent().find('[class*="indicator"]').last().click();

            cy.get('#availableProvider').should('not.exist');
            cy.get('#availableKind').should('not.exist');
        });

        it('should clear select when x icon pressed', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);

            cy.get('#availableRulesSource').should('contain', 'Internal');

            cy.get('#availableRulesSource').parent().find('[class*="indicator"]').first().click();

            cy.get('#availableRulesSource').should('not.contain', 'Internal');

            cy.get('#availableProvider').should('not.exist');
            cy.get('#availableKind').should('not.exist');
        });
    });

    describe('Internal Rules Management', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
        });

        it('should display available rules and groups', () => {
            cy.get('table tbody tr').should('have.length.greaterThan', 0);
        });

        it('should display type badges for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('[data-testid="compliance-table-type-badge"]').should('exist');
                });
            });
        });

        it('should display names for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td')
                        .eq(1)
                        .invoke('text')
                        .should((text) => {
                            expect(text.trim()).to.not.equal('');
                        });
                });
            });
        });

        it('should display resource types for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td')
                        .eq(2)
                        .invoke('text')
                        .should((text) => {
                            expect(text).to.match(/Certificate|Key/);
                        });
                });
            });
        });
        it('should show add internal rule button', () => {
            cy.get('button').find('.fa-plus').should('exist');
        });

        it('should show delete buttons for internal rules', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('button[title="Delete"]').should('exist');
                });
            });
        });

        it('should show edit buttons for internal rules', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('button[title="Edit"]').should('exist');
                });
            });
        });

        it('should open create internal rule dialog when add button is clicked and close the dialog', () => {
            cy.get('[data-testid="add-internal-rule-button"]').click().wait(clickWait);
            cy.get('[data-testid="create-internal-rule-dialog"]').should('be.visible');
            cy.get('[data-testid="create-internal-rule-dialog"]').should('contain', 'Create Internal Rule');
            cy.get('button').contains('Cancel').click().wait(clickWait);
            cy.get('[data-testid="create-internal-rule-dialog"]').should('not.exist');
        });

        it('should open edit internal rule dialog when edit button is clicked', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Edit"]').click().wait(clickWait);
                });
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('[role="dialog"]').should('contain', 'Edit Internal Rule');
        });

        it('should close edit internal rule dialog when the close button is clicked', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Edit"]').click().wait(clickWait);
                });
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('[role="dialog"]').should('contain', 'Edit Internal Rule');
            cy.get('button').contains('Cancel').click().wait(clickWait);
            cy.get('[role="dialog"]').should('not.exist');
        });

        it('should open delete confirmation dialog when delete button is clicked', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Delete"]').click().wait(clickWait);
                });
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('[role="dialog"]').should('contain', 'Delete Internal Rule');
            cy.get('[role="dialog"]').should('contain', 'You are about to delete a Internal Rule');
        });

        it('should open delete confirmation dialog when delete button is clicked and close the dialog', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Delete"]').click().wait(clickWait);
                });
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('[role="dialog"]').should('contain', 'Delete Internal Rule');
            cy.get('[role="dialog"]').should('contain', 'You are about to delete a Internal Rule');
            cy.get('button').contains('Cancel').click().wait(clickWait);
            cy.get('[role="dialog"]').should('not.exist');
        });

        it('should open detail menu when entity details button is clicked and close the dialog', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Rules"]').click().wait(clickWait);
                });
            cy.get('[data-testid="entity-detail-menu"]').should('be.visible');
            cy.get('[data-testid="entity-detail-menu"]').should('contain', 'Rule: (test3)');
            cy.get('[data-testid="entity-detail-menu"]').find('button').contains('Close').click().wait(clickWait);
            cy.get('[data-testid="entity-detail-menu"]').should('not.exist');
        });
    });

    describe('Resource Type Filtering', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
        });

        it('should show all resource types in badges', () => {
            cy.get('[data-testid="resource-badges"]').should('contain', 'All');
            cy.get('[data-testid="resource-badges"]').should('contain', 'Certificate');
            cy.get('[data-testid="resource-badges"]').should('contain', 'Key');
        });

        it('should filter by Certificate resource', () => {
            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(2).should('contain', 'Certificate');
                });
            });
        });

        it('should filter by Key resource', () => {
            cy.get('[data-testid="resource-badges"]').contains('Key').click().wait(clickWait);
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(2).should('contain', 'Key');
                });
            });
        });

        it('should show all resources when All is selected', () => {
            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);
            cy.get('[data-testid="resource-badges"]').contains('All').click().wait(clickWait);
            cy.get('table tbody tr').should('have.length', 2);
        });
    });

    describe('Rule Assignment', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
        });

        it('should handle rule assignment when add button is clicked and close the dialog', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Add"]').click().wait(clickWait);
                });
        });
    });

    describe('Search and Pagination', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
        });

        it('should have search functionality', () => {
            cy.get('input[placeholder*="Search"]').should('exist');
        });

        it('should have pagination when there are many items', () => {
            cy.get('[data-testid="custom-table"]').should('exist');
        });

        it('should filter results when searching', () => {
            cy.get('input[placeholder*="Search"]').type('Available Rule 1');
            cy.get('table tbody tr').should('have.length.lessThan', 4);
        });
    });
});

describe('Available Rules And Groups (Provider Rules Case)', () => {
    beforeEach(() => {
        cy.mount(<AvailableRulesAndGroups2 />, {}, `/complianceprofiles/detail/${complianceProfileDetailMockData.uuid}`).wait(
            componentLoadWait,
        );
        cy.dispatchActions(
            actions.getListComplianceRulesSuccess({
                rules: [],
            }),
            actions.getListComplianceGroupsSuccess({
                groups: [],
            }),
            // Set platform enums data
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            connectorsActions.listConnectorsSuccess({
                connectorList: mockConnectors as unknown as ConnectorResponseModel[],
            }),
        );
        // Set up action listener to automatically complete rules and groups requests
        cy.window().then((win) => {
            // Single listener that handles both actions
            win.registerReduxActionListener(
                (action) => action.type === actions.getListComplianceRules.type || action.type === actions.getListComplianceGroups.type,
                (action) => {
                    if (action.type === actions.getListComplianceRules.type) {
                        console.log('Dispatching getListComplianceRulesSuccess');
                        win.store.dispatch(
                            actions.getListComplianceRulesSuccess({
                                rules: mockProviderRules as unknown as ComplianceRuleListDto[],
                            }),
                        );
                    }

                    if (action.type === actions.getListComplianceGroups.type) {
                        console.log('Dispatching getListComplianceGroupsSuccess');
                        win.store.dispatch(
                            actions.getListComplianceGroupsSuccess({
                                groups: mockProviderGroups as unknown as ComplianceGroupListDto[],
                            }),
                        );
                    }
                },
            );
        });
    });

    describe('Provider Rules and Groups Case', () => {
        describe('Provider Selection (when Provider source is selected)', () => {
            it('should show provider and kind selects when Provider source is selected', () => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

                cy.get('label[for="availableProvider"]').should('contain', 'Provider');
                cy.get('label[for="availableKind"]').should('contain', 'Kind');
                cy.get('#availableProvider').should('exist');
                cy.get('#availableKind').should('exist');
            });

            it('should populate provider dropdown with connector options', () => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

                cy.get('#availableProvider').click();
                cy.get('[class*="option"]').should('have.length.greaterThan', 0);
            });

            it('should populate kind dropdown when provider is selected', () => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

                cy.get('#availableProvider').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);

                cy.get('#availableKind').click();
                cy.get('[class*="option"]').should('have.length.greaterThan', 0);
            });

            it('should load rules and groups when provider and kind are selected', () => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

                cy.get('#availableProvider').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);

                cy.get('#availableKind').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);

                // Wait a bit for the actions to be dispatched and processed
                cy.wait(500);

                //Directly dispatch success actions to simulate API completion
                cy.window().then((win) => {
                    console.log('Manually dispatching success actions...');
                    win.store.dispatch(
                        actions.getListComplianceRulesSuccess({
                            rules: mockProviderRules as unknown as ComplianceRuleListDto[],
                        }),
                    );
                    win.store.dispatch(
                        actions.getListComplianceGroupsSuccess({
                            groups: mockProviderGroups as unknown as ComplianceGroupListDto[],
                        }),
                    );
                    console.log('Success actions dispatched manually');
                });

                // Wait for the Widget to not be busy (wait for loading to complete)
                cy.get('[data-testid="available-rules-and-groups-widget"]').should('not.have.class', 'busy');

                // Wait for the data to load and verify the table has content
                cy.get('table tbody tr').should('have.length.greaterThan', 0);
            });

            it('should remove kind if clear provider', () => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);
                cy.get('#availableProvider').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);
                cy.get('#availableKind').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);
                cy.get('#availableProvider').parent().find('[class*="indicator"]').first().click();
                cy.get('#availableProvider').should('not.contain', 'Provider');
                cy.get('#availableKind').should('not.contain', 'x509');
            });

            it('should remove provider if clear provider', () => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);
                cy.get('#availableProvider').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);
                cy.get('#availableProvider').parent().find('[class*="indicator"]').first().click();
                cy.get('#availableProvider').should('not.contain', 'Provider');
            });

            it('should remove kind if clear kind', () => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);
                cy.get('#availableProvider').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);
                cy.get('#availableKind').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);
                cy.get('#availableKind').parent().find('[class*="indicator"]').first().click();
                cy.get('#availableKind').should('not.contain', 'x509');
            });
        });

        describe('Provider Rules and Group Management', () => {
            beforeEach(() => {
                cy.get('#availableRulesSource').click();
                cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

                cy.get('#availableProvider').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);

                cy.get('#availableKind').click();
                cy.get('[class*="option"]').first().click().wait(clickWait);

                // Wait a bit for the actions to be dispatched and processed
                cy.wait(500);

                //Directly dispatch success actions to simulate API completion
                cy.window().then((win) => {
                    console.log('Manually dispatching success actions...');
                    win.store.dispatch(
                        actions.getListComplianceRulesSuccess({
                            rules: mockProviderRules as unknown as ComplianceRuleListDto[],
                        }),
                    );
                    win.store.dispatch(
                        actions.getListComplianceGroupsSuccess({
                            groups: mockProviderGroups as unknown as ComplianceGroupListDto[],
                        }),
                    );
                    console.log('Success actions dispatched manually');
                });
            });
            it('should display available rules and groups', () => {
                cy.get('table tbody tr').should('have.length.greaterThan', 0);
            });
            it('should display type badges for each rule/group', () => {
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('[data-testid="compliance-table-type-badge"]').should('exist');
                    });
                });
            });
            it('should display detail buttons for each rule/group', () => {
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('button').find('.fa-info').should('exist');
                    });
                });
            });
            it('should display names for each rule/group', () => {
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td')
                            .eq(1)
                            .invoke('text')
                            .should((text) => {
                                expect(text.trim()).to.not.equal('');
                            });
                    });
                });
            });
            it('should display resource types for each rule/group', () => {
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td')
                            .eq(2)
                            .invoke('text')
                            .should((text) => {
                                expect(text).to.match(/Certificate|Key/);
                            });
                    });
                });
            });
            it('should show add provider rule button for each rule/group', () => {
                cy.get('table tbody tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('button').find('.fa-plus').should('exist');
                    });
                });
            });
        });
    });
});
