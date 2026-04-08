import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import Container from 'components/Container';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import ForceDeleteErrorTable from 'components/ForceDeleteErrorTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/time-quality-configurations';
import { LockWidgetNameEnum } from 'types/user-interface';

export const TimeQualityConfigurationsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const timeQualityConfigurations = useSelector(selectors.timeQualityConfigurations);
    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);

    const isBusy = isFetching || isDeleting || isBulkDeleting;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [showDeleteErrors, setShowDeleteErrors] = useState<boolean>(false);

    const getFreshData = useCallback(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
        dispatch(actions.listTimeQualityConfigurations());
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

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actions.bulkDeleteTimeQualityConfigurations({ uuids: checkedRows }));
        setConfirmDelete(false);
    }, [checkedRows, dispatch]);

    const setCheckedRowsHandler = useCallback(
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
        ],
        [checkedRows, onAddClick],
    );

    const tableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                width: '35%',
            },
            {
                id: 'ntpServers',
                content: 'NTP Servers',
                sortable: false,
                width: '50%',
            },
        ],
        [],
    );

    const tableData: TableDataRow[] = useMemo(
        () =>
            timeQualityConfigurations.map((config) => ({
                id: config.uuid,
                columns: [
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`./detail/${config.uuid}`}>{config.name}</Link>
                    </span>,

                    <span className="text-sm text-gray-600">{config.ntpServers?.join(', ') || '—'}</span>,
                ],
            })),
        [timeQualityConfigurations],
    );

    return (
        <Container>
            <Widget
                title="List of Time Quality Configurations"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfTimeQualityConfigurations}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <CustomTable
                    headers={tableHeader}
                    data={tableData}
                    onCheckedRowsChanged={setCheckedRowsHandler}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? 'Time Quality Configurations' : 'a Time Quality Configuration'}`}
                body={`You are about to delete ${checkedRows.length > 1 ? 'Time Quality Configurations' : 'a Time Quality Configuration'}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={showDeleteErrors}
                caption="Delete Time Quality Configurations"
                body={
                    <ForceDeleteErrorTable
                        items={bulkDeleteErrorMessages}
                        entityNameSingular="a Time Quality Configuration"
                        entityNamePlural="Time Quality Configurations"
                        itemsCount={checkedRows.length}
                    />
                }
                toggle={onCloseDeleteErrors}
                buttons={[{ color: 'secondary', variant: 'outline', onClick: onCloseDeleteErrors, body: 'Close' }]}
            />
        </Container>
    );
};
