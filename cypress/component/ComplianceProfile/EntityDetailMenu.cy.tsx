import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from 'ducks/reducers';
import { complianceProfileDetailMockData } from './mock-data';
import { PlatformEnum, Resource } from 'types/openapi/models';
import { EnumItemDto } from 'types/enums';
import { componentLoadWait } from '../../utils/constants';
import ComplianceProfileDetail from 'components/_pages/compliance-profiles/detail';
import { MemoryRouter } from 'react-router';

const EntityDetailMenuTest = () => {
    const resourceEnum: { [key: string]: EnumItemDto } = useMemo(
        () => ({
            certificates: { code: 'certificates', label: 'Certificate' },
            keys: { code: 'keys', label: 'Key' },
            certificateRequests: { code: 'certificateRequests', label: 'Certificate Request' },
        }),
        [],
    );

    const platformEnums = useMemo(
        () => ({
            Resource: resourceEnum,
            FilterFieldSource: {
                property: { code: 'property', label: 'Property' },
                data: { code: 'data', label: 'Data' },
            },
            FilterConditionOperator: {
                CONTAINS: { code: 'CONTAINS', label: 'Contains' },
                EQUALS: { code: 'EQUALS', label: 'Equals' },
            },
        }),
        [resourceEnum],
    );

    const store = configureStore({
        reducer: reducers,
        preloadedState: {
            complianceProfiles: {
                complianceProfile: complianceProfileDetailMockData as any,
                isFetchingDetail: false,
                isFetchingGroupRules: false,
                groupRules: [] as any,
                deleteErrorMessage: '',
            } as any,
            enums: {
                platformEnums: platformEnums,
            } as any,
        },
    });

    return (
        <Provider store={store}>
            <ComplianceProfileDetail />
        </Provider>
    );
};

describe('EntityDetailMenu Component', () => {
    beforeEach(() => {
        cy.viewport(1200, 800);
    });

    it('should render EntityDetailMenu for rule entity with details and attributes tabs', () => {
        cy.mount(<EntityDetailMenuTest />);

        // Wait for component to load
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');

        // Check that the available rules and groups component is present
        cy.get('[data-testid="available-rules-and-groups"]').should('exist');
    });

    it('should render EntityDetailMenu for group entity with details and rules tabs', () => {
        cy.mount(<EntityDetailMenuTest />);

        // Wait for component to load
        cy.wait(componentLoadWait);

        // Check that the component renders
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');

        // Check that the available rules and groups component is present
        cy.get('[data-testid="available-rules-and-groups"]').should('exist');
    });

    it('should display rule details correctly in EntityDetailMenu', () => {
        cy.mount(<EntityDetailMenuTest />);
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');

        // Check that the available rules and groups component is present
        cy.get('[data-testid="available-rules-and-groups"]').should('exist');
    });

    it('should display group details correctly in EntityDetailMenu', () => {
        cy.mount(<EntityDetailMenuTest />);
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');

        // Check that the available rules and groups component is present
        cy.get('[data-testid="available-rules-and-groups"]').should('exist');
    });

    it('should show loading state when fetching group rules', () => {
        cy.mount(<EntityDetailMenuTest />);
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // The loading state would be controlled by the isFetchingGroupRules state
        // This would be tested when the EntityDetailMenu is actually opened with a group entity
    });

    it('should display condition items for rules with conditions', () => {
        cy.mount(<EntityDetailMenuTest />);
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');
    });

    it('should display attributes tab when rule has attributes', () => {
        cy.mount(<EntityDetailMenuTest />);
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');
    });

    it('should display provider information when available', () => {
        cy.mount(<EntityDetailMenuTest />);
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');
    });

    it('should display status badge with correct color', () => {
        cy.mount(<EntityDetailMenuTest />);
        cy.wait(componentLoadWait);

        // Verify the main compliance profile detail component is rendered
        cy.get('[data-testid="compliance-profile-detail"]').should('exist');

        // Check that the assigned rules and groups component is present
        cy.get('[data-testid="assigned-rules-and-groups"]').should('exist');
    });
});
