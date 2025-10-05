import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from 'ducks/reducers';
import { complianceProfileDetailMockData } from './mock-data';
import { ComplianceProfileDtoV2, PlatformEnum } from 'types/openapi/models';
import AssignedRulesAndGroup from 'components/_pages/compliance-profiles/detail/AssignedRulesAndGroup/AssignedRulesAndGroup';
import { EnumItemDto } from 'types/enums';
import { clickWait, componentLoadWait } from '../../utils/constants';
import '../../../src/resources/styles/theme.scss';

// Mock the router since we're testing component in isolation
const MockRouter = ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>;

const AssignedRulesAndGroupsTest = () => {
    const resourceEnum: { [key: string]: EnumItemDto } = useMemo(
        () => ({
            certificates: { code: 'certificates', label: 'Certificate' },
            keys: { code: 'keys', label: 'Key' },
        }),
        [],
    );

    const store = configureStore({
        reducer: reducers,
        preloadedState: {
            complianceProfiles: {
                isFetchingRules: false,
                isFetchingGroups: false,
                isFetchingDetail: false,
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
                <AssignedRulesAndGroup
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

describe('AssignedRulesAndGroup', () => {
    beforeEach(() => {
        cy.mount(<AssignedRulesAndGroupsTest />).wait(componentLoadWait);
    });

    describe('Component Rendering', () => {
        it('should render the widget with correct title', () => {
            cy.get('h5').should('contain', 'Assigned Rules & Groups');
        });

        it('should render rules source select with correct label', () => {
            cy.get('label[for="assignedRulesSource"]').should('contain', 'Rules Source');
        });

        it('should display resource badges for filtering', () => {
            cy.get('[data-testid="resource-badges"]').should('exist');
            cy.get('[data-testid="resource-badges"]').should('contain', 'All');
            cy.get('[data-testid="resource-badges"]').should('contain', 'Certificate');
            cy.get('[data-testid="resource-badges"]').should('contain', 'Key');
        });

        it('should render the table with correct headers', () => {
            cy.get('table thead th').should('have.length', 5);
            cy.get('table thead th').eq(0).should('contain', 'Status');
            cy.get('table thead th').eq(1).should('contain', 'Type');
            cy.get('table thead th').eq(2).should('contain', 'Name');
            cy.get('table thead th').eq(3).should('contain', 'Resource');
            cy.get('table thead th').eq(4).should('contain', 'Action');
        });

        it('should display all assigned rules and groups in the table', () => {
            cy.get('table tbody tr').should('have.length', 7);
        });

        it('should display status badges for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('[data-testid="status-badge"]').should('exist');
                    cy.get('[data-testid="status-badge"]').should('contain', 'Available');
                });
            });
        });

        it('should display type for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('[data-testid="compliance-table-type-badge"]').should('exist');
                });
            });
        });

        it('should display rules button for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('button[title="Rules"]').should('exist');
                });
            });
        });

        it('should display remove buttons for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('button[title="Remove"]').should('exist');
                });
            });
        });

        it('should display name for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td')
                        .eq(2)
                        .invoke('text')
                        .should((text) => {
                            expect(text.trim()).to.not.equal(''); // must not be empty
                        });
                });
            });
        });
        it('should display resource for each rule/group', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td')
                        .eq(3)
                        .invoke('text')
                        .should((text) => {
                            expect(text).to.match(/Certificate|Key/);
                        });
                });
            });
        });
    });

    describe('Rules Source Filtering', () => {
        it('should filter by Internal rules source', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);

            cy.get('table tbody tr').should('have.length', 3);

            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(2).should('contain', 'test');
                });
            });
        });

        it('should filter by Provider rules source', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('table tbody tr').should('have.length', 4);

            cy.get('label[for="assignedProvider"]').should('contain', 'Provider');
            cy.get('label[for="assignedKind"]').should('contain', 'Kind');
        });

        it('should show provider options when Provider is selected', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('#assignedProvider').click();
            cy.get('[class*="option"]').should('contain', 'X509-Compliance-Provider');
        });

        it('should show kind options when Provider is selected', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('#assignedKind').click();
            cy.get('[class*="option"]').should('contain', 'x509');
        });

        it('should filter by specific provider', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('#assignedProvider').click();
            cy.get('[class*="option"]').contains('X509-Compliance-Provider').click().wait(clickWait);

            cy.get('table tbody tr').should('have.length', 4);
        });

        it('should filter by specific kind', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('#assignedKind').click();
            cy.get('[class*="option"]').contains('x509').click().wait(clickWait);

            cy.get('table tbody tr').should('have.length', 4);
        });

        it('should clear rules source selection', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);

            cy.get('#assignedRulesSource').parent().find('[data-testid="assigned-rules-source-clear-button"]').click().wait(clickWait);

            cy.get('table tbody tr').should('have.length', 7);
        });
    });

    describe('Resource Type Filtering', () => {
        it('should filter by Certificate resource', () => {
            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);
            cy.get('table tbody tr').should('have.length', 5);
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(3).should('contain', 'Certificate');
                });
            });
        });

        it('should filter by Key resource', () => {
            cy.get('[data-testid="resource-badges"]').contains('Key').click().wait(clickWait);
            cy.get('table tbody tr').should('have.length', 2);
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(3).should('contain', 'Key');
                });
            });
        });

        it('should show all resources when All is selected', () => {
            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);
            cy.get('[data-testid="resource-badges"]').contains('All').click().wait(clickWait);
            cy.get('table tbody tr').should('have.length', 7);
        });
    });

    describe('Table Interactions', () => {
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

            cy.get('[data-testid="entity-detail-menu"]').should('contain', 'Name: test');
            cy.get('[data-testid="entity-detail-menu"]').should('contain', 'Type: rule');
        });
    });

    describe('Combined Filtering', () => {
        it('should work with multiple filters applied together', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);

            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);

            cy.get('table tbody tr').should('have.length', 4);

            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(3).should('contain', 'Certificate');
                });
            });
        });

        it('should maintain filter state when switching between different filter combinations', () => {
            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Internal').click().wait(clickWait);
            cy.get('[data-testid="resource-badges"]').contains('Certificate').click().wait(clickWait);
            cy.get('table tbody tr').should('have.length', 1);

            cy.get('#assignedRulesSource').click();
            cy.get('[class*="option"]').contains('Provider').click().wait(clickWait);
            cy.get('table tbody tr').should('have.length', 4);
        });
    });

    describe('Data Display', () => {
        it('should display correct rule names from mock data', () => {
            cy.get('table tbody tr').should('contain', 'test');
            cy.get('table tbody tr').should('contain', 'test2');
            cy.get('table tbody tr').should('contain', 'test3');
            cy.get('table tbody tr').should('contain', 'cus_key_length');
            cy.get('table tbody tr').should('contain', 'e_ca_common_name_missing');
        });

        it('should display correct group names from mock data', () => {
            cy.get('table tbody tr').should('contain', 'RFC 5280');
            cy.get('table tbody tr').should('contain', "Apple's CT Policy");
        });

        it('should display correct resource types', () => {
            cy.get('table tbody tr').should('contain', 'Certificate');
            cy.get('table tbody tr').should('contain', 'Key');
        });

        it('should display correct availability status', () => {
            cy.get('table tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('[data-testid="status-badge"]').should('contain', 'Available');
                });
            });
        });
    });
});
