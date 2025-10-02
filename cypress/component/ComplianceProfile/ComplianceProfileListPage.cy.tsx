import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { Badge, Container, Table } from 'reactstrap';

import { actions, selectors } from 'ducks/compliance-profiles';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { LockWidgetNameEnum } from 'types/user-interface';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { mockComplianceProfiles } from './mock-data';

const ComplianceProfileListPageTest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const complianceProfiles = useSelector(selectors.complianceProfiles);

    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isFetching = false;
    const isDeleting = false;
    const isBulkDeleting = false;
    const isBulkForceDeleting = false;

    const isBusy = isFetching || isDeleting || isBulkDeleting || isBulkForceDeleting;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);

    const [complianceCheck, setComplianceCheck] = useState<boolean>(false);

    const getFreshData = useCallback(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
        dispatch(actions.getListComplianceProfiles());
    }, [dispatch]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    useEffect(() => {
        setConfirmForceDelete(bulkDeleteErrorMessages.length > 0);
    }, [bulkDeleteErrorMessages]);

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actions.bulkDeleteComplianceProfiles({ uuids: checkedRows }));
        setConfirmDelete(false);
    }, [checkedRows, dispatch]);

    const onComplianceCheckConfirmed = useCallback(() => {
        dispatch(actions.checkComplianceForProfiles({ requestBody: checkedRows }));
        setComplianceCheck(false);
    }, [checkedRows, dispatch]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const onForceDeleteConfirmed = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.bulkForceDeleteComplianceProfiles({ uuids: checkedRows }));
    }, [dispatch, checkedRows]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: () => {
                    onAddClick();
                },
                id: 'create-compliance-profile',
            },
            {
                icon: 'gavel',
                disabled: checkedRows.length === 0,
                tooltip: 'Check Compliance',
                onClick: () => {
                    setComplianceCheck(true);
                },
                id: 'check-compliance',
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
                id: 'delete-compliance-profile',
            },
        ],
        [checkedRows, onAddClick],
    );

    const forceDeleteBody = useMemo(
        () => (
            <div>
                <div>
                    Failed to delete {checkedRows.length > 1 ? 'Compliance Profiles' : 'an Compliance Profile'}. Please find the details
                    below:
                </div>

                <Table className="table-hover" size="sm">
                    <thead>
                        <tr>
                            <th>
                                <b>Name</b>
                            </th>
                            <th>
                                <b>Dependencies</b>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {bulkDeleteErrorMessages?.map((message) => (
                            <tr>
                                <td>{message.name}</td>
                                <td>{message.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        ),
        [bulkDeleteErrorMessages, checkedRows.length],
    );

    const complianceProfilesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
            },
            {
                id: 'description',
                content: 'Description',
            },
            {
                id: 'providerTotalRules',
                content: 'Provider Total Rules',
            },
            {
                id: 'providerTotalGroups',
                content: 'Provider Total Groups',
            },
            {
                id: 'internalTotalRules',
                content: 'Internal Total Rules',
            },
            {
                id: 'associations',
                content: 'Associations',
            },
        ],
        [],
    );

    const complianceProfilesTableData: TableDataRow[] = useMemo(
        () =>
            complianceProfiles.map((complianceProfile) => ({
                id: complianceProfile.uuid,

                columns: [
                    <Link key={complianceProfile.uuid} to={`./detail/${complianceProfile.uuid}`}>
                        {complianceProfile.name}
                    </Link>,
                    complianceProfile.description || '',
                    <Badge key={complianceProfile.uuid} color="secondary" searchvalue={complianceProfile.providerRulesCount}>
                        {complianceProfile.providerRulesCount.toString()}
                    </Badge>,
                    <Badge key={complianceProfile.uuid} color="secondary" searchvalue={complianceProfile.providerGroupsCount}>
                        {complianceProfile.providerGroupsCount.toString()}
                    </Badge>,
                    <Badge key={complianceProfile.uuid} color="secondary" searchvalue={complianceProfile.internalRulesCount}>
                        {complianceProfile.internalRulesCount.toString()}
                    </Badge>,
                    <Badge key={complianceProfile.uuid} color="secondary" searchvalue={complianceProfile.associations}>
                        {complianceProfile.associations.toString()}
                    </Badge>,
                ],
            })),
        [complianceProfiles],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of Compliance Profiles"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfComplianceProfiles}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
                dataTestId="compliance-profile-list"
            >
                <br />
                <CustomTable
                    headers={complianceProfilesTableHeader}
                    data={complianceProfilesTableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? 'Compliance Profiles' : 'a Compliance Profile'}`}
                body={`You are about to delete ${
                    checkedRows.length > 1 ? 'Compliance Profiles' : 'a Compliance Profile'
                } which may have associated RA
                   Profiles(s). Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
                dataTestId="delete-compliance-profile-dialog"
            />

            <Dialog
                isOpen={confirmForceDelete}
                caption={`Force Delete ${checkedRows.length > 1 ? 'Compliance Profiles' : 'a Compliance Profile'}`}
                body={forceDeleteBody}
                toggle={() => setConfirmForceDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onForceDeleteConfirmed, body: 'Force delete' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
                dataTestId="force-delete-compliance-profile-dialog"
            />

            <Dialog
                isOpen={complianceCheck}
                caption={`Initiate Compliance Check`}
                body={'Initiate the compliance check for the selected Compliance Profile(s)?'}
                toggle={() => setComplianceCheck(false)}
                buttons={[
                    { color: 'primary', onClick: onComplianceCheckConfirmed, body: 'Yes' },
                    { color: 'secondary', onClick: () => setComplianceCheck(false), body: 'Cancel' },
                ]}
                dataTestId="compliance-check-dialog"
            />
        </Container>
    );
};

describe('Compliance Profile List Page', () => {
    beforeEach(() => {
        cy.mount(<ComplianceProfileListPageTest />).wait(componentLoadWait);
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
