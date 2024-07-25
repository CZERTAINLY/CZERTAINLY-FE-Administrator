import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Container } from 'reactstrap';

import { actions, selectors } from 'ducks/discoveries';
import { EntityType } from 'ducks/filters';

import { ApiClients } from 'api';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';
import DiscoveryStatus from '../DiscoveryStatus';

function DiscoveryList() {
    const dispatch = useDispatch();

    const discoveries = useSelector(selectors.discoveries);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isBusy = isDeleting || isBulkDeleting;

    const discoveriesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                sortable: true,
                sort: 'asc',
                id: 'discoveryName',
                width: 'auto',
            },
            {
                content: 'Discovery Provider',
                align: 'center',
                sortable: true,
                id: 'discoveryProvider',
                width: '15%',
            },
            {
                content: 'Kinds',
                align: 'center',
                sortable: true,
                id: 'kinds',
                width: '15%',
            },
            {
                content: 'Status',
                align: 'center',
                sortable: true,
                id: 'status',
                width: '15%',
            },
            {
                content: 'Total Certificates',
                align: 'center',
                sortable: true,
                sortType: 'numeric',
                id: 'totalCertificates',
                width: '15%',
            },
        ],
        [],
    );

    const discoveryList: TableDataRow[] = useMemo(
        () =>
            discoveries.map((discovery) => ({
                id: discovery.uuid,
                columns: [
                    <Link to={`./detail/${discovery.uuid}`}>{discovery.name}</Link>,
                    discovery.connectorName ? (
                        <Link to={`../connectors/detail/${discovery.connectorUuid}`}>{discovery.connectorName ?? 'Unassigned'}</Link>
                    ) : (
                        (discovery.connectorName ?? 'Unassigned')
                    ),
                    <Badge color="secondary">{discovery.kind}</Badge>,
                    <DiscoveryStatus status={discovery.status} />,
                    discovery.totalCertificatesDiscovered?.toString() || '0',
                ],
            })),
        [discoveries],
    );

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(actions.listDiscoveries(filters)), [dispatch]);

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.DISCOVERY}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids) => dispatch(actions.bulkDeleteDiscovery({ uuids }))}
                getAvailableFiltersApi={useCallback(
                    (apiClients: ApiClients) => apiClients.discoveries.getSearchableFieldInformation3(),
                    [],
                )}
                headers={discoveriesRowHeaders}
                data={discoveryList}
                isBusy={isBusy}
                title="Discovery Store"
                entityNameSingular="a Discovery"
                entityNamePlural="Discoveries"
                filterTitle="Discoveries Filter"
                pageWidgetLockName={LockWidgetNameEnum.DiscoveriesStore}
            />
        </Container>
    );
}

export default DiscoveryList;
