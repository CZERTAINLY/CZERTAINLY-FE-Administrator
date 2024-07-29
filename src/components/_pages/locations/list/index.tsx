import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Container } from 'reactstrap';

import { EntityType } from 'ducks/filters';
import { actions, selectors } from 'ducks/locations';
import { selectors as pagingSelectors } from 'ducks/paging';

import { ApiClients } from 'api';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import StatusBadge from 'components/StatusBadge';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';

function LocationList() {
    const dispatch = useDispatch();

    const locations = useSelector(selectors.locations);

    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.LOCATION));

    const isBusy = isDeleting || isUpdating;

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

    return (
        <Container className="themed-container" fluid>
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
                additionalButtons={buttons}
                pageWidgetLockName={LockWidgetNameEnum.LocationsStore}
            />
        </Container>
    );
}

export default LocationList;
