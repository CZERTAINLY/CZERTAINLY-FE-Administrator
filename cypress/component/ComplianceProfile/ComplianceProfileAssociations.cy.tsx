import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from 'ducks/reducers';
import { complianceProfileDetailMockData, mockAssociations, mockRaProfiles, mockTokenProfiles } from './mock-data';
import { ComplianceProfileDtoV2, PlatformEnum, ResourceObjectDto } from 'types/openapi/models';
import Widget from 'components/Widget';
import ProfileAssociationsDialog from 'components/_pages/compliance-profiles/detail/ProfileAssociations/ProfileAssociationsDialog';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { Link } from 'react-router';
import { getEnumLabel } from 'ducks/enums';
import { EnumItemDto } from 'types/enums';

// Mock the router since we're testing component in isolation
const MockRouter = ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>;

const ComplianceProfileAssociationsTest = () => {
    const resourceEnum: { [key: string]: EnumItemDto } = useMemo(
        () => ({
            raProfiles: { code: 'raProfiles', label: 'RA Profile' },
            tokenProfiles: { code: 'tokenProfiles', label: 'Token Profile' },
        }),
        [],
    );
    const store = configureStore({
        reducer: reducers,
        preloadedState: {
            raProfiles: {
                optionsForRaProfiles: mockRaProfiles.map((profile) => ({
                    value: profile.uuid,
                    label: profile.name,
                })),
                raProfiles: mockRaProfiles,
                isFetchingList: false,
                isFetchingDetail: false,
            } as any,
            tokenProfiles: {
                optionsForTokenProfiles: mockTokenProfiles.map((profile) => ({
                    value: profile.uuid,
                    label: profile.name,
                })),
                tokenProfiles: mockTokenProfiles,
                isFetchingList: false,
                isFetchingDetail: false,
            } as any,
            enums: {
                platformEnums: resourceEnum,
            } as any,
            resource: {
                resourcesList: [
                    { resource: getEnumLabel(resourceEnum, 'raProfiles'), hasComplianceProfiles: true },
                    { resource: getEnumLabel(resourceEnum, 'tokenProfiles'), hasComplianceProfiles: true },
                ],
                resourcesWithComplianceProfiles: [{ resource: 'raProfiles' }, { resource: 'tokenProfiles' }],
                isFetchingResourcesList: false,
            } as any,
        },
    });

    const [isAssociateProfileModalOpen, setIsAssociateProfileModalOpen] = useState(false);

    const associationButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Associate Profile',
                onClick: () => {
                    setIsAssociateProfileModalOpen(true);
                },
                dataTestId: 'add-association-button',
            },
        ],
        [],
    );

    const associationHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'raProfileName',
                content: 'Name',
            },
            { id: 'resource', content: 'Resource' },
            { id: 'object', content: 'Object' },
            {
                id: 'action',
                content: 'Action',
            },
        ],
        [],
    );

    const associationData: TableDataRow[] = useMemo(
        () =>
            mockAssociations.map((associatedProfile) => ({
                id: associatedProfile.objectUuid,
                columns: [
                    <Link
                        key={associatedProfile.objectUuid}
                        to={`../../raprofiles/detail/${complianceProfileDetailMockData.uuid}/${associatedProfile.objectUuid}`}
                    >
                        {associatedProfile.name}
                    </Link>,

                    getEnumLabel(resourceEnum, associatedProfile.resource),
                    associatedProfile.objectUuid,
                    <WidgetButtons
                        key={associatedProfile.objectUuid}
                        justify="start"
                        buttons={[
                            {
                                icon: 'minus-square',
                                disabled: false,
                                tooltip: 'Remove',
                                onClick: () => {
                                    console.log('Remove');
                                },
                            },
                        ]}
                    />,
                ],
            })),
        [resourceEnum],
    );

    return (
        <Provider store={store}>
            <MockRouter>
                <Widget
                    id="compliance-profile-associations"
                    title="Associations"
                    busy={false}
                    widgetButtons={associationButtons}
                    titleSize="large"
                    lockSize="large"
                >
                    <CustomTable headers={associationHeaders} data={associationData} />
                </Widget>
                <ProfileAssociationsDialog
                    isOpen={isAssociateProfileModalOpen}
                    onClose={() => setIsAssociateProfileModalOpen(false)}
                    profile={complianceProfileDetailMockData as unknown as ComplianceProfileDtoV2}
                    associationsOfComplianceProfile={mockAssociations as unknown as ResourceObjectDto[]}
                />
            </MockRouter>
        </Provider>
    );
};

describe('ComplianceProfileAssociations', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileAssociationsTest />);
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

    it('associate button should be disabled if resource is not selected', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('button').contains('Associate').should('be.disabled');
    });

    it('should close dialog when cancel button is clicked', () => {
        cy.get('button[title="Associate Profile"]').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('be.visible');
        cy.get('button').contains('Cancel').click();
        cy.get('[data-testid="add-profile-association-dialog"]').should('not.exist');
    });
});
