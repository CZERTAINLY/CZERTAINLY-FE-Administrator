import AssignedRulesAndGroup from 'components/_pages/compliance-profiles/detail/AssignedRulesAndGroup/AssignedRulesAndGroup';
import AvailableRulesAndGroups from 'components/_pages/compliance-profiles/detail/AvailableRulesAndGroups/AvailableRulesAndGroups';
import ProfileAssociations from 'components/_pages/compliance-profiles/detail/ProfileAssociations/ProfileAssociations';
import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import GoBackButton from 'components/GoBackButton';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { complianceProfileDetailMockData } from './mock-data';
import { useMemo, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { ComplianceProfileDtoV2, Resource } from 'types/openapi';
import { createWidgetDetailHeaders } from 'utils/widget';

const TestComplianceProfileDetailPage = ({ withDeleteErrorMessage }: { withDeleteErrorMessage?: boolean }) => {
    const profile = complianceProfileDetailMockData as unknown as ComplianceProfileDtoV2;
    const isFetchingDetail = false;
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [complianceCheck, setComplianceCheck] = useState<boolean>(false);
    const [isEntityDetailMenuOpen, setIsEntityDetailMenuOpen] = useState(false);
    const [selectedEntityDetails, setSelectedEntityDetails] = useState<any>(null);
    let deleteErrorMessage = withDeleteErrorMessage ? 'Some error message' : '';

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'gavel',
                disabled: false,
                tooltip: 'Check Compliance',
                onClick: () => {
                    setComplianceCheck(true);
                },
                id: 'check-compliance',
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
                id: 'delete-compliance-profile',
            },
        ],
        [],
    );
    const getFreshComplianceProfileDetails = () => {};
    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !profile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', profile.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', profile.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', profile.description || ''],
                      },
                  ],
        [profile],
    );
    return (
        <Container className="themed-container" fluid>
            <GoBackButton style={{ marginBottom: '10px' }} forcedPath="/complianceprofiles" text="Compliance Profile Inventory" />
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        title="Compliance Profile Details"
                        busy={isFetchingDetail}
                        widgetButtons={buttons}
                        titleSize="large"
                        refreshAction={getFreshComplianceProfileDetails}
                        lockSize="large"
                        dataTestId="compliance-profile-details-widget"
                    >
                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>

                <Col>
                    <ProfileAssociations profile={profile} />
                    {profile && (
                        <CustomAttributeWidget
                            resource={Resource.ComplianceProfiles}
                            resourceUuid={profile.uuid}
                            attributes={profile.customAttributes}
                        />
                    )}
                </Col>
            </Row>

            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <AssignedRulesAndGroup
                        profile={profile}
                        setSelectedEntityDetails={setSelectedEntityDetails}
                        setIsEntityDetailMenuOpen={setIsEntityDetailMenuOpen}
                    />
                </Col>
                <Col>
                    <AvailableRulesAndGroups
                        profile={profile}
                        setSelectedEntityDetails={setSelectedEntityDetails}
                        setIsEntityDetailMenuOpen={setIsEntityDetailMenuOpen}
                    />
                </Col>
            </Row>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Compliance Profile"
                body="You are about to delete a Compliance Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    {
                        color: 'danger',
                        onClick: () => {
                            console.log('Yes, delete');
                            setConfirmDelete(false);
                        },
                        body: 'Yes, delete',
                    },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
                dataTestId="delete-confirmation-dialog"
            />
            <Dialog
                isOpen={complianceCheck}
                caption={`Initiate Compliance Check`}
                body={'Initiate the compliance check for the Compliance Profile?'}
                toggle={() => setComplianceCheck(false)}
                buttons={[
                    {
                        color: 'primary',
                        onClick: () => {
                            console.log('Start compliance check');
                            setComplianceCheck(false);
                        },
                        body: 'Yes',
                    },
                    { color: 'secondary', onClick: () => setComplianceCheck(false), body: 'Cancel' },
                ]}
                dataTestId="compliance-check-dialog"
            />
            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete Compliance Profile"
                body={
                    <>
                        Failed to delete the Compliance Profile that has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                buttons={[
                    {
                        color: 'danger',
                        onClick: () => {
                            console.log('Force delete');
                        },
                        body: 'Force',
                    },
                    {
                        color: 'secondary',
                        onClick: () => {
                            console.log('Cancel');
                        },
                        body: 'Cancel',
                    },
                ]}
                dataTestId="delete-error-dialog"
            />
        </Container>
    );
};

describe('TestComplianceProfileDetailPage', () => {
    context('when withDeleteErrorMessage = true', () => {
        beforeEach(() => {
            cy.mount(<TestComplianceProfileDetailPage withDeleteErrorMessage={true} />).wait(1000);
        });

        describe('Delete Error Dialog', () => {
            it('should display delete error dialog when there is an error message', () => {
                cy.get('[data-testid="delete-error-dialog"]').should('be.visible');
                cy.get('[data-testid="delete-error-dialog"]').should(
                    'contain.text',
                    'Failed to delete the Compliance Profile that has dependent objects',
                );
                cy.get('[data-testid="delete-error-dialog"]').should('contain.text', 'Some error message');
            });

            it('should have Force and Cancel buttons in error dialog', () => {
                cy.get('[data-testid="delete-error-dialog"]').within(() => {
                    cy.contains('Force').should('exist');
                    cy.contains('Cancel').should('exist');
                });
            });

            it('should log message when Force button is clicked and close modal', () => {
                cy.window().then((win) => {
                    cy.stub(win.console, 'log').as('consoleLog');
                });

                cy.get('[data-testid="delete-error-dialog"]').within(() => {
                    cy.contains('Force').click().wait(1000);
                });

                cy.get('@consoleLog').should('have.been.calledWith', 'Force delete');
            });

            it('should log message when Cancel button is clicked in error dialog and close modal', () => {
                cy.window().then((win) => {
                    cy.stub(win.console, 'log').as('consoleLog');
                });

                cy.get('[data-testid="delete-error-dialog"]').within(() => {
                    cy.contains('Cancel').click().wait(1000);
                });

                cy.get('@consoleLog').should('have.been.calledWith', 'Cancel');
            });
        });
    });

    context('when withDeleteErrorMessage = false', () => {
        beforeEach(() => {
            cy.mount(<TestComplianceProfileDetailPage withDeleteErrorMessage={false} />);
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

                cy.get('@consoleLog').should('have.been.calledWith', 'Yes, delete');
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

                cy.get('@consoleLog').should('have.been.calledWith', 'Start compliance check');
                cy.get('[data-testid="compliance-check-dialog"]').should('not.exist');
            });
        });
    });
});
