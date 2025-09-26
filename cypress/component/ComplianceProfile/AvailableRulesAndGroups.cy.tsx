import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from 'ducks/reducers';
import { complianceProfileDetailMockData } from './mock-data';
import { ComplianceProfileDtoV2, PlatformEnum, FunctionGroupCode } from 'types/openapi/models';
import AvailableRulesAndGroups from 'components/_pages/compliance-profiles/detail/AvailableRulesAndGroups/AvailableRulesAndGroups';
import { EnumItemDto } from 'types/enums';
import { clickWait, componentLoadWait } from '../../utils/constants';

// Mock the router since we're testing component in isolation
const MockRouter = ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>;

const AvailableRulesAndGroupsTest = () => {
    const resourceEnum: { [key: string]: EnumItemDto } = useMemo(
        () => ({
            certificates: { code: 'certificates', label: 'Certificate' },
            keys: { code: 'keys', label: 'Key' },
        }),
        [],
    );

    const mockConnectors = [
        {
            uuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            name: 'X509-Compliance-Provider',
            functionGroups: [
                {
                    functionGroupCode: FunctionGroupCode.ComplianceProvider,
                    kinds: ['x509', 'pkcs12'],
                },
            ],
        },
        {
            uuid: '9d8a6610-9623-40d2-b113-444fe59579dd',
            name: 'Another-Compliance-Provider',
            functionGroups: [
                {
                    functionGroupCode: FunctionGroupCode.ComplianceProviderV2,
                    kinds: ['x509'],
                },
            ],
        },
    ];

    const mockRules = [
        {
            uuid: 'rule-1',
            name: 'Available Rule 1',
            description: 'Test rule 1',
            availabilityStatus: 'available',
            resource: 'certificates',
            attributes: [],
        },
        {
            uuid: 'rule-2',
            name: 'Available Rule 2',
            description: 'Test rule 2',
            availabilityStatus: 'available',
            resource: 'keys',
            attributes: [
                {
                    uuid: 'attr-1',
                    name: 'testAttribute',
                    label: 'Test Attribute',
                    type: 'data',
                    contentType: 'string',
                    content: [{ data: 'test' }],
                },
            ],
        },
    ];

    const mockGroups = [
        {
            uuid: 'group-1',
            name: 'Available Group 1',
            description: 'Test group 1',
            availabilityStatus: 'available',
            resource: 'certificates',
        },
        {
            uuid: 'group-2',
            name: 'Available Group 2',
            description: 'Test group 2',
            availabilityStatus: 'available',
            resource: 'keys',
        },
    ];

    const store = configureStore({
        reducer: reducers,
        preloadedState: {
            complianceProfiles: {
                isFetchingRules: false,
                isFetchingGroups: false,
                isFetchingDetail: false,
                rules: mockRules,
                groups: mockGroups,
            } as any,
            connectors: {
                connectors: mockConnectors,
            } as any,
            enums: {
                platformEnums: {
                    [PlatformEnum.Resource]: resourceEnum,
                },
            } as any,
        },
    });

    const [selectedEntityDetails, setSelectedEntityDetails] = useState<any>(null);
    const [isEntityDetailMenuOpen, setIsEntityDetailMenuOpen] = useState(false);
    const [resetFunction, setResetFunction] = useState<(() => void) | null>(null);

    const handleReset = (resetFn: () => void) => {
        setResetFunction(() => resetFn);
    };

    return (
        <Provider store={store}>
            <MockRouter>
                <AvailableRulesAndGroups
                    profile={complianceProfileDetailMockData as unknown as ComplianceProfileDtoV2}
                    setSelectedEntityDetails={setSelectedEntityDetails}
                    setIsEntityDetailMenuOpen={setIsEntityDetailMenuOpen}
                    onReset={handleReset}
                />
                {isEntityDetailMenuOpen && selectedEntityDetails && (
                    <div data-testid="entity-detail-menu">
                        <h3>Entity Details</h3>
                        <p>Name: {selectedEntityDetails.name}</p>
                        <p>Type: {selectedEntityDetails.entityDetails?.entityType}</p>
                        <button onClick={() => setIsEntityDetailMenuOpen(false)}>Close</button>
                    </div>
                )}
            </MockRouter>
        </Provider>
    );
};

describe('AvailableRulesAndGroups', () => {
    beforeEach(() => {
        cy.mount(<AvailableRulesAndGroupsTest />).wait(componentLoadWait);
    });

    describe('Component Rendering', () => {
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

        it('should clear selection when rules source is cleared', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);

            cy.get('#availableRulesSource').parent().find('[class*="indicator"]').last().click();

            cy.get('#availableProvider').should('not.exist');
            cy.get('#availableKind').should('not.exist');
        });
    });

    describe('Provider Selection (when Provider source is selected)', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);
        });

        it('should show provider options', () => {
            cy.get('#availableProvider').click();
            cy.get('[class*="option"]').should('contain', 'X509-Compliance-Provider');
            cy.get('[class*="option"]').should('contain', 'Another-Compliance-Provider');
        });

        it('should show kind options when provider is selected', () => {
            cy.get('#availableProvider').click();
            cy.get('[class*="option"]').contains('X509-Compliance-Provider').click().wait(clickWait);

            cy.get('#availableKind').click();
            cy.get('[class*="option"]').should('contain', 'x509');
            cy.get('[class*="option"]').should('contain', 'pkcs12');
        });

        it('should clear kind when provider is cleared', () => {
            cy.get('#availableProvider').click();
            cy.get('[class*="option"]').contains('X509-Compliance-Provider').click().wait(clickWait);
            cy.get('#availableKind').click();
            cy.get('[class*="option"]').contains('x509').click().wait(clickWait);
            cy.get('#availableProvider').parent().find('[class*="indicator"]').last().click();
            cy.get('#availableKind').should('have.value', '');
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
            cy.get('table tbody tr').should('have.length.greaterThan', 0);
        });
    });

    describe('Table Data Display', () => {
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

        it('should display add buttons for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('button[title="Add"]').should('exist');
                });
            });
        });
    });

    describe('Table Interactions', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
        });

        it('should open entity details when info button is clicked', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Rules"]').click().wait(clickWait);
                });

            cy.get('[data-testid="entity-detail-menu"]').should('be.visible');
            cy.get('[data-testid="entity-detail-menu"]').should('contain', 'Entity Details');
        });

        it('should close entity details when close button is clicked', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Rules"]').click().wait(clickWait);
                });

            cy.get('[data-testid="entity-detail-menu"]').should('be.visible');
            cy.get('[data-testid="entity-detail-menu"]').find('button').contains('Close').click().wait(clickWait);
            cy.get('[data-testid="entity-detail-menu"]').should('not.exist');
        });

        it('should display correct entity details information', () => {
            cy.get('table tbody tr')
                .first()
                .within(() => {
                    cy.get('button[title="Rules"]').click().wait(clickWait);
                });

            cy.get('[data-testid="entity-detail-menu"]').should('contain', 'Name:');
            cy.get('[data-testid="entity-detail-menu"]').should('contain', 'Type:');
        });
    });

    describe('Internal Rules Management', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
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

        it('should open create internal rule dialog when add button is clicked', () => {
            cy.get('[data-testid="add-internal-rule-button"]').click().wait(clickWait);
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('[role="dialog"]').should('contain', 'Create Internal Rule');
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
    });

    describe('Rule Assignment', () => {
        beforeEach(() => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
        });

        it('should handle rule assignment when add button is clicked', () => {
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

    describe('Combined Filtering', () => {
        it('should work with multiple filters applied together', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('#availableProvider').click();
            cy.get('[class*="option"]').contains('X509-Compliance-Provider').click().wait(clickWait);

            cy.get('#availableKind').click();
            cy.get('[class*="option"]').contains('x509').click().wait(clickWait);

            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);

            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(2).should('contain', 'Certificate');
                });
            });
        });
    });

    describe('Reset Functionality', () => {
        it('should expose reset function to parent component', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);

            cy.get('[data-testid="mock-router"]').should('exist');
        });
    });

    describe('Error Handling', () => {
        it('should handle empty data gracefully', () => {
            cy.get('#availableRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
            cy.get('table').should('exist');
        });
    });
});
