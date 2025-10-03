import ProfileAssociations from 'components/_pages/compliance-profiles/detail/ProfileAssociations/ProfileAssociations';
import { complianceProfileDetailMockData, mockAssociations, mockPlatformEnums, mockResourceList, mockTokenProfilesList } from './mock-data';
import { ComplianceProfileDtoV2, ResourceObjectDto } from 'types/openapi/models';
import '../../../src/resources/styles/theme.scss';
import { actions as enumActions } from 'ducks/enums';
import { actions } from 'ducks/compliance-profiles';
import { actions as resourceActions } from 'ducks/resource';
import { ResourceModel } from 'types/resource';
import { TokenProfileResponseModel } from 'types/token-profiles';
import { actions as tokenProfileActions } from 'ducks/token-profiles';
import { clickWait } from '../../utils/constants';

const ComplianceProfileAssociations = () => {
    return <ProfileAssociations profile={complianceProfileDetailMockData as unknown as ComplianceProfileDtoV2} />;
};

describe('Compliance Profile Associations functionality', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileAssociations />);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            actions.getAssociationsOfComplianceProfileSuccess({
                associations: mockAssociations as unknown as ResourceObjectDto[],
            }),
            resourceActions.listResourcesSuccess({
                resourcesList: mockResourceList as unknown as ResourceModel[],
            }),
        );

        cy.window().then((win) => {
            win.registerReduxActionListener(
                (action) => action.type === actions.getAssociationsOfComplianceProfile.type,
                () => {
                    win.store.dispatch(
                        actions.getAssociationsOfComplianceProfileSuccess({
                            associations: mockAssociations as unknown as ResourceObjectDto[],
                        }),
                    );
                },
            );
        });
    });

    it('should render the associations widget with correct title', () => {
        cy.get('[id="compliance-profile-associations"]').should('exist');
    });

    it('should display associations table with correct headers', () => {
        cy.get('table thead th').should('have.length', 4);
        cy.get('table thead th').eq(0).should('contain', 'Name');
        cy.get('table thead th').eq(1).should('contain', 'Resource');
        cy.get('table thead th').eq(2).should('contain', 'Object');
        cy.get('table thead th').eq(3).should('contain', 'Action');
    });

    it('should display mock associations data in the table', () => {
        cy.get('table tbody tr').should('have.length', 1);
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('td').eq(0).should('contain', 'Custom');
                cy.get('td').eq(1).should('contain', 'RA Profile');
                cy.get('td').eq(2).should('contain', 'c08e64f5-a98b-49df-908d-b3b26f50c145');
                cy.get('td')
                    .eq(3)
                    .within(() => {
                        cy.get('button').should('have.attr', 'title', 'Remove');
                    });
            });
    });

    it('should display correct link for association name', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('a').should('have.attr', 'href').and('include', 'raprofiles/detail');
            });
    });

    it('should display correct tooltip for remove button', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('button[title="Remove"]').should('have.attr', 'title', 'Remove');
            });
    });

    it('should have proper table structure', () => {
        cy.get('table').should('exist');
        cy.get('table thead').should('exist');
        cy.get('table tbody').should('exist');
        cy.get('table thead tr').should('have.length', 1);
        cy.get('table tbody tr').should('have.length', 1);
    });

    it('should have add associations button', () => {
        cy.get('button').should('have.attr', 'title', 'Associate Profile');
    });

    it('should open dialog when associate profile button is clicked', () => {
        cy.get('button').should('have.attr', 'title', 'Associate Profile');
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.contains('Associate Profile').should('exist');
    });

    it('should close dialog when cancel button is clicked', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('button').contains('Cancel').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('not.exist');
    });

    it('should have a remove button for each association', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.get('button[title="Remove"]').should('exist');
            });
    });

    it('should display resource options in dialog', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('[data-testid="associate-profile-resource-select-control"]').click();

        cy.get('[data-testid="associate-profile-resource-select-menu"]').should('contain', 'RA Profile');
        cy.get('[data-testid="associate-profile-resource-select-menu"]').should('contain', 'Token Profile');
        cy.get('[data-testid="associate-profile-resource-profiles-select-control"]').should('not.exist');
    });

    it('should display resource profiles options in dialog', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('[data-testid="associate-profile-resource-select-control"]').click();

        cy.get('[data-testid="associate-profile-resource-select-menu"]').should('contain', 'RA Profile');
        cy.get('[data-testid="associate-profile-resource-select-menu"]').should('contain', 'Token Profile');
        cy.get('[data-testid="associate-profile-resource-profiles-select-control"]').should('not.exist');
        cy.get('[data-testid="associate-profile-resource-select-menu"]').contains('RA Profile').click();

        cy.get('[data-testid="associate-profile-resource-profiles-select-control"]').should('exist');
    });

    it('should show profiles options in dialog and able to select a profile and submit form', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('[data-testid="associate-profile-resource-select-control"]').click();
        cy.get('[data-testid="associate-profile-resource-select-menu"]').contains('Token Profile').click();
        cy.window().then((win) => {
            win.store.dispatch(
                tokenProfileActions.listTokenProfilesSuccess({
                    tokenProfiles: mockTokenProfilesList as unknown as TokenProfileResponseModel[],
                }),
            );
        });
        cy.get('[data-testid="associate-profile-resource-profiles-select-control"]').should('exist');
        cy.get('[data-testid="associate-profile-resource-profiles-select-control"]').click();
        cy.get('[data-testid="associate-profile-resource-profiles-select-menu"]').contains('TestPQCTokenProfile').click().wait(clickWait);
        cy.get('button').contains('Associate').should('be.enabled');
        cy.get('button').contains('Associate').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('not.exist');
    });

    it('should close dialog when cancel button is clicked', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('button').contains('Cancel').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('not.exist');
    });
    it('associate button should be disabled if resource is not selected', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('button').contains('Associate').should('be.disabled');
    });
});
