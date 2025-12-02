import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import Badge from 'components/Badge';

import { EntityType } from 'ducks/filters';
import { actions, selectors } from 'ducks/locations';
import { selectors as pagingSelectors } from 'ducks/paging';

import { ApiClients } from '../../../../api';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import LocationForm from '../form';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';

function LocationList() {
    const dispatch = useDispatch();

    const locations = useSelector(selectors.locations);

    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);
    const isCreating = useSelector(selectors.isCreating);

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.LOCATION));

    const isBusy = isDeleting || isUpdating;

    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [editingLocationId, setEditingLocationId] = useState<string | undefined>(undefined);
    const [editingEntityId, setEditingEntityId] = useState<string | undefined>(undefined);

    const onEnableClick = useCallback(() => {
        for (const uuid of checkedRows) {
            dispatch(actions.enableLocation({ entityUuid: locations.find((data) => data.uuid === uuid)?.entityInstanceUuid || '', uuid }));
        }
    }, [checkedRows, dispatch, locations]);

    const onDisableClick = useCallback(() => {
        for (const uuid of checkedRows) {
            dispatch(actions.disableLocation({ entityUuid: locations.find((data) => data.uuid === uuid)?.entityInstanceUuid || '', uuid }));
        }
    }, [checkedRows, dispatch, locations]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
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
        [checkedRows.length, onDisableClick, onEnableClick],
    );

    const locationsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                sortable: true,
                sort: 'asc',
                id: 'locationName',
                width: 'auto',
            },
            {
                content: 'Description',
                sortable: true,
                id: 'locationDescription',
                width: 'auto',
            },
            {
                content: 'Entity',
                sortable: true,
                id: 'locationEntity',
                width: 'auto',
            },
            {
                content: 'Multiple Entries',
                align: 'center',
                sortable: true,
                id: 'multiEntries',
                width: 'auto',
            },
            {
                content: 'Key Management',
                align: 'center',
                sortable: true,
                id: 'keyMgmt',
                width: 'auto',
            },
            {
                content: 'Status',
                align: 'center',
                sortable: true,
                id: 'Status',
                width: '15%',
            },
        ],
        [],
    );

    const locationList: TableDataRow[] = useMemo(
        () =>
            locations.map((location) => ({
                id: location.uuid,
                columns: [
                    <Link to={`./detail/${location.entityInstanceUuid}/${location.uuid}`}>{location.name}</Link>,
                    location.description || '',
                    location.entityInstanceName ? (
                        <Link to={`../entities/detail/${location.entityInstanceUuid}`}>{location.entityInstanceName ?? 'Unassigned'}</Link>
                    ) : (
                        (location.entityInstanceName ?? 'Unassigned')
                    ),
                    location.supportMultipleEntries ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,
                    location.supportKeyManagement ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,
                    <StatusBadge enabled={location.enabled} />,
                ],
            })),
        [locations],
    );

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(actions.listLocations(filters)), [dispatch]);

    const wasCreating = useRef(isCreating);
    const wasUpdating = useRef(isUpdating);

    useEffect(() => {
        if (wasCreating.current && !isCreating) {
            setIsAddModalOpen(false);
            onListCallback({ itemsPerPage: 10, pageNumber: 1, filters: [] });
        }
        wasCreating.current = isCreating;
    }, [isCreating, onListCallback]);

    useEffect(() => {
        if (wasUpdating.current && !isUpdating) {
            setEditingLocationId(undefined);
            setEditingEntityId(undefined);
            onListCallback({ itemsPerPage: 10, pageNumber: 1, filters: [] });
        }
        wasUpdating.current = isUpdating;
    }, [isUpdating, onListCallback]);

    const handleOpenAddModal = useCallback(() => {
        setIsAddModalOpen(true);
    }, []);

    const handleCloseAddModal = useCallback(() => {
        setIsAddModalOpen(false);
        setEditingLocationId(undefined);
        setEditingEntityId(undefined);
    }, []);

    const createButton: WidgetButtonProps = useMemo(
        () => ({
            icon: 'plus',
            disabled: false,
            tooltip: 'Create',
            onClick: handleOpenAddModal,
        }),
        [handleOpenAddModal],
    );

    const allButtons: WidgetButtonProps[] = useMemo(() => [createButton, ...buttons], [createButton, buttons]);

    return (
        <>
            <PagedList
                entity={EntityType.LOCATION}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids) =>
                    uuids.map((uuid) =>
                        dispatch(
                            actions.deleteLocation({
                                entityUuid: locations.find((data) => data.uuid === uuid)?.entityInstanceUuid || '',
                                uuid,
                            }),
                        ),
                    )
                }
                getAvailableFiltersApi={useCallback((apiClients: ApiClients) => apiClients.locations.getSearchableFieldInformation(), [])}
                headers={locationsRowHeaders}
                data={locationList}
                isBusy={isBusy}
                title="Locations Store"
                entityNameSingular="a Location"
                entityNamePlural="Locations"
                filterTitle="Locations Filter"
                additionalButtons={allButtons}
                addHidden
                pageWidgetLockName={LockWidgetNameEnum.LocationsStore}
            />

            <Dialog
                isOpen={isAddModalOpen || !!editingLocationId}
                toggle={handleCloseAddModal}
                caption={editingLocationId ? 'Edit Location' : 'Create Location'}
                size="xl"
                body={
                    <LocationForm
                        locationId={editingLocationId}
                        entityId={editingEntityId}
                        onCancel={handleCloseAddModal}
                        onSuccess={handleCloseAddModal}
                    />
                }
            />
        </>
    );
}

export default LocationList;
