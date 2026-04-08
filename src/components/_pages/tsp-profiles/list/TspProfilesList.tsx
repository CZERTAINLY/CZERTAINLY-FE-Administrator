import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import Container from 'components/Container';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import ForceDeleteErrorTable from 'components/ForceDeleteErrorTable';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/tsp-profiles';
import { Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

export const TspProfilesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const tspProfiles = useSelector(selectors.tspProfiles);
    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isBulkEnabling = useSelector(selectors.isBulkEnabling);
    const isBulkDisabling = useSelector(selectors.isBulkDisabling);

    const isBusy = isFetching || isDeleting || isBulkDeleting || isBulkEnabling || isBulkDisabling;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [showDeleteErrors, setShowDeleteErrors] = useState<boolean>(false);

    const getFreshData = useCallback(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
        dispatch(actions.listTspProfiles());
    }, [dispatch]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    useEffect(() => {
        if (bulkDeleteErrorMessages.length > 0) {
            setShowDeleteErrors(true);
        }
    }, [bulkDeleteErrorMessages]);

    const onAddClick = useCallback(() => {
        navigate('./add');
    }, [navigate]);

    const onEnableClick = useCallback(() => {
        dispatch(actions.bulkEnableTspProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDisableClick = useCallback(() => {
        dispatch(actions.bulkDisableTspProfiles({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actions.bulkDeleteTspProfiles({ uuids: checkedRows }));
        setConfirmDelete(false);
    }, [checkedRows, dispatch]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const onCloseDeleteErrors = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        setShowDeleteErrors(false);
    }, [dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: onAddClick,
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Enable',
                onClick: onEnableClick,
            },
            {
                icon: 'times',
                disabled: checkedRows.length === 0,
                tooltip: 'Disable',
                onClick: onDisableClick,
            },
        ],
        [checkedRows, onAddClick, onEnableClick, onDisableClick],
    );

    const tableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                width: '25%',
            },
            {
                id: 'description',
                content: 'Description',
                sortable: true,
                width: '30%',
            },
            {
                id: 'defaultSigningProfile',
                content: 'Default Signing Profile',
                sortable: true,
                width: '28%',
                align: 'center',
            },
            {
                id: 'status',
                content: 'Status',
                align: 'center',
                sortable: true,
                width: '10%',
            },
        ],
        [],
    );

    const tableData: TableDataRow[] = useMemo(
        () =>
            tspProfiles.map((config) => ({
                id: config.uuid,
                columns: [
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`./detail/${config.uuid}`}>{config.name}</Link>
                    </span>,

                    <span>{config.description || ''}</span>,

                    config.defaultSigningProfile ? (
                        <Link to={`../${Resource.SigningProfiles.toLowerCase()}/detail/${config.defaultSigningProfile.uuid}`}>
                            {config.defaultSigningProfile.name}
                        </Link>
                    ) : (
                        <span>Unassigned</span>
                    ),

                    <StatusBadge enabled={config.enabled} />,
                ],
            })),
        [tspProfiles],
    );

    return (
        <Container>
            <Widget
                title="List of TSP Profiles"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfTspProfiles}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <CustomTable
                    headers={tableHeader}
                    data={tableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? 'TSP Profiles' : 'a TSP Profile'}`}
                body={`You are about to delete ${checkedRows.length > 1 ? 'TSP Profiles' : 'a TSP Profile'}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={showDeleteErrors}
                caption="Delete TSP Profiles"
                body={
                    <ForceDeleteErrorTable
                        items={bulkDeleteErrorMessages}
                        entityNameSingular="a TSP Profile"
                        entityNamePlural="TSP Profiles"
                        itemsCount={checkedRows.length}
                    />
                }
                toggle={onCloseDeleteErrors}
                buttons={[{ color: 'secondary', variant: 'outline', onClick: onCloseDeleteErrors, body: 'Close' }]}
            />
        </Container>
    );
};
