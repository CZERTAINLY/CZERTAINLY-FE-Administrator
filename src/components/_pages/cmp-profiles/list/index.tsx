import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Container, Table } from 'reactstrap';

import { actions, selectors } from 'ducks/cmp-profiles';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { PlatformEnum } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function AdministratorsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const cmpProfiles = useSelector(selectors.cmpProfiles);

    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isUpdating = useSelector(selectors.isUpdating);
    const isBulkEnabling = useSelector(selectors.isBulkEnabling);
    const isBulkDisabling = useSelector(selectors.isBulkDisabling);
    const isBulkForceDeleting = useSelector(selectors.isBulkForceDeleting);
    const cmpCmpProfileVariantEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CmpProfileVariant));

    const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting || isBulkEnabling || isBulkDisabling || isBulkForceDeleting;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);

    const getFreshData = useCallback(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
        dispatch(actions.listCmpProfiles());
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

    const onEnableClick = useCallback(() => {
        dispatch(actions.bulkEnableCmpProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDisableClick = useCallback(() => {
        dispatch(actions.bulkDisableCmpProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actions.bulkDeleteCmpProfiles({ uuids: checkedRows }));
        setConfirmDelete(false);
    }, [checkedRows, dispatch]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const onForceDeleteConfirmed = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.bulkForceDeleteCmpProfiles({ uuids: checkedRows }));
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
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: checkedRows.length === 0,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [checkedRows, onAddClick, onEnableClick, onDisableClick],
    );

    const forceDeleteBody = useMemo(
        () => (
            <div>
                <div>Failed to delete {checkedRows.length > 1 ? 'CMP Profiles' : 'an CMP Profile'}. Please find the details below:</div>

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

    const cmpProfilesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                width: '10%',
            },
            {
                id: 'description',
                content: 'Description',
                sortable: true,
                width: '10%',
            },
            {
                id: 'raProfileName',
                content: 'RA Profile Name',
                sortable: true,
                width: '10%',
                align: 'center',
            },
            {
                id: 'cmpUrl',
                content: 'CMP URL',
                sortable: true,
                width: 'auto',
            },
            {
                id: 'variant',
                content: 'Variant',
                sortable: true,
                width: 'auto',
            },
            {
                id: 'status',
                content: 'Status',
                align: 'center',
                sortable: true,
                width: '7%',
            },
        ],
        [],
    );

    const cmpProfilesTableData: TableDataRow[] = useMemo(
        () =>
            cmpProfiles.map((cmpProfile) => ({
                id: cmpProfile.uuid,

                columns: [
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`./detail/${cmpProfile.uuid}`}>{cmpProfile.name}</Link>
                    </span>,

                    <span style={{ whiteSpace: 'nowrap' }}>{cmpProfile.description || ''}</span>,

                    cmpProfile.raProfile ? (
                        <Link to={`../raprofiles/detail/${cmpProfile?.raProfile.authorityInstanceUuid}/${cmpProfile?.raProfile.uuid}`}>
                            {cmpProfile.raProfile.name ?? 'Unassigned'}
                        </Link>
                    ) : (
                        (cmpProfile.raProfile ?? 'Unassigned')
                    ),

                    cmpProfile.cmpUrl || '',
                    <Badge color="primary">{getEnumLabel(cmpCmpProfileVariantEnum, cmpProfile.variant)}</Badge>,
                    <StatusBadge enabled={cmpProfile.enabled} />,
                ],
            })),
        [cmpProfiles, cmpCmpProfileVariantEnum],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of CMP Profiles"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfCMPProfiles}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <br />
                <CustomTable
                    headers={cmpProfilesTableHeader}
                    data={cmpProfilesTableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? 'CMP Profiles' : 'an CMP Profile'}`}
                body={`You are about to delete ${checkedRows.length > 1 ? 'CMP Profiles' : 'an CMP Profile'}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmForceDelete}
                caption={`Force Delete ${checkedRows.length > 1 ? 'CMP Profiles' : 'an CMP Profile'}`}
                body={forceDeleteBody}
                toggle={() => setConfirmForceDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onForceDeleteConfirmed, body: 'Force delete' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
