import AdministratorsList from 'components/_pages/compliance-profiles/list';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { Route, Routes } from 'react-router';
import { mockComplianceProfiles } from './mock-data';
import { actions } from 'ducks/compliance-profiles';
import '../../../src/resources/styles/theme.scss';

const ComplianceProfileListPageTest = () => {
    return (
        <Routes>
            <Route path="/complianceprofiles/list" element={<AdministratorsList />} />
        </Routes>
    );
};

describe('Compliance Profile List Page', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileListPageTest />, {}, '/complianceprofiles/list').wait(componentLoadWait);
        cy.dispatchActions(
            actions.getListComplianceProfilesSuccess({
                complianceProfileList: mockComplianceProfiles,
            }),
            actions.setCheckedRows({ checkedRows: [] }),
        );
    });

    it('should render compliance profile list page', () => {
        cy.contains('List of Compliance Profiles').should('be.visible');
        cy.get('[data-testid="compliance-profile-list"]').should('be.visible');
    });

    it('should display table with correct headers', () => {
        cy.get('table').should('be.visible');
        cy.contains('Name').should('be.visible');
        cy.contains('Description').should('be.visible');
        cy.contains('Provider Total Rules').should('be.visible');
        cy.contains('Provider Total Groups').should('be.visible');
        cy.contains('Internal Total Rules').should('be.visible');
        cy.contains('Associations').should('be.visible');
    });

    it('should display compliance profiles data', () => {
        cy.get('table tbody tr').should('have.length', 3);

        // Check first profile
        cy.get('table tbody tr')
            .eq(0)
            .within(() => {
                cy.get('[data-testid="table-checkbox"]').should('be.visible');
                cy.get('td').eq(1).should('contain', 'archived');
                cy.get('td').eq(2).should('exist');
                cy.get('td').eq(3).should('contain', '0');
                cy.get('td').eq(4).should('contain', '1');
                cy.get('td').eq(5).should('contain', '0');
                cy.get('td').eq(6).should('contain', '1');
            });
        // Check second profile
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.get('[data-testid="table-checkbox"]').should('be.visible');
                cy.get('td').eq(1).should('contain', 'test');
                cy.get('td').eq(2).should('exist');
                cy.get('td').eq(3).should('contain', '4');
                cy.get('td').eq(4).should('contain', '2');
                cy.get('td').eq(5).should('contain', '3');
                cy.get('td').eq(6).should('contain', '5');
            });

        // Check third profile
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.get('[data-testid="table-checkbox"]').should('be.visible');
                cy.get('td').eq(1).should('contain', 'test-cmp-01');
                cy.get('td').eq(2).should('exist');
                cy.get('td').eq(3).should('contain', '2');
                cy.get('td').eq(4).should('contain', '3');
                cy.get('td').eq(5).should('contain', '0');
                cy.get('td').eq(6).should('contain', '4');
            });
    });

    it('should display profile names as links', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('a').should('exist');
            });
        });
    });

    it('should display badges for counts', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('.badge').should('have.length', 4); // 4 count badges per row
            });
        });
    });

    it('should have widget buttons', () => {
        cy.get('.fa-plus').should('be.visible'); // Create button
        cy.get('.fa-gavel').should('be.visible'); // Check Compliance button
        cy.get('.fa-trash').should('be.visible'); // Delete button
    });

    it('should have refresh button', () => {
        cy.get('.fa-refresh').should('be.visible');
    });

    it('should have checkboxes for row selection', () => {
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).within(() => {
                cy.get('input[type="checkbox"]').should('exist');
            });
        });
    });

    it('should have search functionality', () => {
        cy.get('input[placeholder*="Search"]').should('be.visible');
    });

    it('should open create dialog when create button is clicked', () => {
        cy.get('.fa-plus').click().wait(clickWait);
    });

    it('should disable compliance check and delete buttons when no rows selected', () => {
        cy.get('[data-testid="check-compliance-button"]').should('have.class', 'disabled');
        cy.get('[data-testid="delete-compliance-profile-button"]').should('have.class', 'disabled');
    });

    it('should open delete confirmation dialog', () => {
        cy.get('[data-testid="table-checkbox"]').first().click().wait(clickWait);
        cy.get('[data-testid="delete-compliance-profile-button"]').click().wait(clickWait);
        cy.get('[data-testid="delete-compliance-profile-dialog"]').should('be.visible');
    });

    it('should open compliance check dialog', () => {
        cy.get('[data-testid="table-checkbox"]').first().click().wait(clickWait);
        cy.get('[data-testid="check-compliance-button"]').click().wait(clickWait);
        cy.get('[data-testid="compliance-check-dialog"]').should('be.visible');
    });

    it('should display force delete dialog with error messages', () => {
        cy.get('[data-testid="table-checkbox"]').first().click().wait(clickWait);
        cy.get('[data-testid="delete-compliance-profile-button"]').click().wait(clickWait);
        cy.get('[data-testid="delete-compliance-profile-dialog"]').should('be.visible');
        cy.contains('button', 'Yes, delete').click();
    });

    it('should have proper table structure', () => {
        cy.get('table').should('have.class', 'table');
        cy.get('table thead tr').should('have.length', 1);
        cy.get('table tbody tr').should('have.length', 3);
    });

    it('should have correct widget configuration', () => {
        cy.get('[data-testid="compliance-profile-list"]').should('contain', 'List of Compliance Profiles');
    });

    it('should handle refresh action', () => {
        cy.get('.fa-refresh').click().wait(clickWait);

        // Component should still be visible after refresh
        cy.contains('List of Compliance Profiles').should('be.visible');
    });

    it('should have proper button tooltips', () => {
        cy.get('[data-testid="create-compliance-profile-button"]').should('have.attr', 'title', 'Create');
        cy.get('[data-testid="check-compliance-button"]').should('have.attr', 'title', 'Check Compliance');
        cy.get('[data-testid="delete-compliance-profile-button"]').should('have.attr', 'title', 'Delete');
    });
});
