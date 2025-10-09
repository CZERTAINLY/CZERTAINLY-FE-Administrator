import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from 'ducks/reducers';
import { complianceProfileDetailMockData, mockAssociations } from './mock-data';
import Widget from 'components/Widget';
import CustomTable from 'components/CustomTable';
import { createWidgetDetailHeaders } from 'utils/widget';
import { LockWidgetNameEnum } from 'types/user-interface';
import { WidgetButtonProps } from 'components/WidgetButtons';
import Dialog from 'components/Dialog';

// Mock the router since we're testing component in isolation
const MockRouter = ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>;

const detailData = [
    {
        id: 'uuid',
        columns: ['UUID', complianceProfileDetailMockData.uuid],
    },
    {
        id: 'name',
        columns: ['Name', complianceProfileDetailMockData.name],
    },
    {
        id: 'description',
        columns: ['Description', complianceProfileDetailMockData.description || ''],
    },
];

// Mock the compliance profile detail widget component
const ComplianceProfileDetailsTest = () => {
    const store = configureStore({
        reducer: reducers,
        preloadedState: {
            complianceProfiles: {
                complianceProfile: complianceProfileDetailMockData as any,
                isFetchingDetail: false,
                isFetchingGroupRules: false,
                deleteErrorMessage: '',
                associationsOfComplianceProfile: [],
            } as any,
        },
    });
    const [complianceCheck, setComplianceCheck] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const detailHeaders = createWidgetDetailHeaders();

    const buttons: WidgetButtonProps[] = [
        {
            icon: 'gavel',
            disabled: false,
            tooltip: 'Check Compliance',
            onClick: () => {
                setComplianceCheck(true);
            },
        },
        {
            icon: 'trash',
            disabled: false,
            tooltip: 'Delete',
            onClick: () => {
                setConfirmDelete(true);
            },
        },
    ];

    return (
        <Provider store={store}>
            <MockRouter>
                <Widget
                    id="compliance-profile-details"
                    title="Compliance Profile Details"
                    busy={false}
                    widgetButtons={buttons}
                    titleSize="large"
                    refreshAction={() => {
                        console.log('Refresh action called');
                    }}
                    widgetLockName={LockWidgetNameEnum.ComplianceProfileDetails}
                    lockSize="large"
                >
                    <CustomTable headers={detailHeaders} data={detailData} />
                </Widget>
                <Dialog
                    isOpen={complianceCheck}
                    caption={`Initiate Compliance Check`}
                    body={'Initiate the compliance check for the Compliance Profile?'}
                    toggle={() => setComplianceCheck(false)}
                    buttons={[
                        { color: 'primary', onClick: () => setComplianceCheck(false), body: 'Yes' },
                        { color: 'secondary', onClick: () => setComplianceCheck(false), body: 'Cancel' },
                    ]}
                />
                <Dialog
                    isOpen={confirmDelete}
                    caption="Delete Compliance Profile"
                    body="You are about to delete a Compliance Profile. Is this what you want to do?"
                    toggle={() => setConfirmDelete(false)}
                    buttons={[
                        { color: 'danger', onClick: () => console.log('Delete compliance profile'), body: 'Yes, delete' },
                        { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    ]}
                />
            </MockRouter>
        </Provider>
    );
};

// Test component with associations
const ComplianceProfileDetailsWithAssociationsTest = () => {
    const store = configureStore({
        reducer: reducers,
        preloadedState: {
            complianceProfiles: {
                complianceProfile: complianceProfileDetailMockData as any,
                isFetchingDetail: false,
                isFetchingGroupRules: false,
                associationsOfComplianceProfile: mockAssociations,
            } as any,
        },
    });

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
    const detailHeaders = createWidgetDetailHeaders();

    const buttons: WidgetButtonProps[] = [
        {
            icon: 'trash',
            disabled: false,
            tooltip: 'Delete',
            onClick: () => {
                setConfirmDelete(true);
            },
        },
    ];

    return (
        <Provider store={store}>
            <MockRouter>
                <Widget
                    id="compliance-profile-details-with-associations"
                    title="Compliance Profile Details"
                    busy={false}
                    widgetButtons={buttons}
                    titleSize="large"
                    refreshAction={() => {
                        console.log('Refresh action called');
                    }}
                    widgetLockName={LockWidgetNameEnum.ComplianceProfileDetails}
                    lockSize="large"
                >
                    <CustomTable headers={detailHeaders} data={detailData} />
                </Widget>
                <Dialog
                    isOpen={confirmDelete}
                    caption="Delete Compliance Profile"
                    body="You are about to delete a Compliance Profile. Is this what you want to do?"
                    toggle={() => setConfirmDelete(false)}
                    buttons={[
                        {
                            color: 'danger',
                            onClick: () => {
                                setConfirmDelete(false);
                                setDeleteErrorMessage('Delete compliance profile');
                            },
                            body: 'Yes, delete',
                        },
                        { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    ]}
                />
                <Dialog
                    isOpen={deleteErrorMessage.length > 0}
                    caption="Delete Compliance Profile Force"
                    body={
                        <>
                            Failed to delete the Compliance Profile that has dependent objects. Please find the details below:
                            <br />
                            <br />
                            {deleteErrorMessage}
                        </>
                    }
                    toggle={() => setDeleteErrorMessage('')}
                    buttons={[
                        { color: 'danger', onClick: () => setDeleteErrorMessage(''), body: 'Force' },
                        { color: 'secondary', onClick: () => setDeleteErrorMessage(''), body: 'Cancel' },
                    ]}
                />
            </MockRouter>
        </Provider>
    );
};

export default ComplianceProfileDetailsTest;

describe('ComplianceProfileDetails Widget', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileDetailsTest />);
    });

    it('should render the compliance profile details widget', () => {
        cy.get('[id="compliance-profile-details"]').should('exist');
    });

    it('should display the correct widget title', () => {
        cy.get('[id="compliance-profile-details"]').should('contain', 'Compliance Profile Details');
    });

    it('should render the custom table with correct headers', () => {
        cy.get('[data-testid="custom-table"]').should('exist');
        cy.get('th').should('contain', 'Property');
        cy.get('th').should('contain', 'Value');
    });

    it('should display compliance profile data correctly', () => {
        // Check UUID
        cy.get('td').should('contain', 'UUID');
        cy.get('td').should('contain', complianceProfileDetailMockData.uuid);

        // Check Name
        cy.get('td').should('contain', 'Name');
        cy.get('td').should('contain', complianceProfileDetailMockData.name);

        // Check Description
        cy.get('td').should('contain', 'Description');
        cy.get('td').should('contain', complianceProfileDetailMockData.description);
    });

    it('should render widget buttons', () => {
        cy.get('#compliance-profile-details').should('exist');
        cy.get('[data-testid="refresh-icon"]').should('exist');
    });

    it('should render custom widget buttons', () => {
        cy.get('button[title="Check Compliance"]').should('exist');
        cy.get('button[title="Delete"]').should('exist');
    });

    it('should render refresh-icon', () => {
        cy.get('[data-testid="refresh-icon"]').should('exist');
    });

    it('should call refresh action when refresh button is clicked', () => {
        cy.window().then((win) => {
            cy.stub(win.console, 'log').as('consoleLog');
        });
        cy.get('[data-testid="refresh-icon"]').click();
        cy.get('@consoleLog').should('have.been.calledWith', 'Refresh action called');
    });

    it('should open compliance check dialog and close it on cancel', () => {
        cy.get('button[title="Check Compliance"]').click();
        cy.contains('Initiate Compliance Check').should('exist');
        cy.contains('Initiate the compliance check for the Compliance Profile?').should('exist');
        cy.contains('Yes').should('exist');
        cy.contains('Cancel').should('exist');
        cy.contains('Cancel').click();
        cy.contains('Initiate Compliance Check').should('not.exist');
    });

    it('should open compliance check dialog and close it on yes', () => {
        cy.get('button[title="Check Compliance"]').click();
        cy.contains('Initiate Compliance Check').should('exist');
        cy.contains('Initiate the compliance check for the Compliance Profile?').should('exist');
        cy.contains('Yes').should('exist');
        cy.contains('Cancel').should('exist');
        cy.contains('Yes').click();
        cy.contains('Initiate Compliance Check').should('not.exist');
    });

    it('should open delete confirmation dialog and close it on cancel', () => {
        cy.get('button[title="Delete"]').click();
        cy.contains('Delete Compliance Profile').should('exist');
        cy.contains('You are about to delete a Compliance Profile. Is this what you want to do?').should('exist');
        cy.contains('Yes, delete').should('exist');
        cy.contains('Cancel').should('exist');
        cy.contains('Cancel').click();
        cy.contains('Delete Compliance Profile').should('not.exist');
    });

    it('should not show loading state when not fetching', () => {
        cy.get('[id="compliance-profile-details"]').should('not.have.class', 'busy');
    });
});

// Test with associations
describe('ComplianceProfileDetails Widget - With Associations', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileDetailsWithAssociationsTest />);
    });

    it('should open delete confirmation dialog and close it on yes', () => {
        cy.get('button[title="Delete"]').click();
        cy.contains('Delete Compliance Profile').should('exist');
        cy.contains('You are about to delete a Compliance Profile. Is this what you want to do?').should('exist');
        cy.contains('Yes, delete').should('exist');
        cy.contains('Cancel').should('exist');
        cy.contains('Yes, delete').click();
        cy.contains('Delete Compliance Profile Force').should('exist');
        cy.contains('Force').should('exist');
        cy.contains('Cancel').should('exist');
        cy.contains('Force').click();
    });
});
