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

export default function AdministratorsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const complianceProfiles = useSelector(selectors.complianceProfiles);

    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isBulkForceDeleting = useSelector(selectors.isBulkForceDeleting);

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
}
