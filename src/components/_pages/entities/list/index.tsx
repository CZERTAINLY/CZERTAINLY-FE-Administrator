import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Container } from 'reactstrap';

import { actions, selectors } from 'ducks/entities';

import { ApiClients } from 'api';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import { EntityType } from 'ducks/filters';
import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';

function EntityList() {
    const dispatch = useDispatch();

    const entities = useSelector(selectors.entities);

    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = isDeleting || isUpdating;

    const entitiesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                sortable: true,
                sort: 'asc',
                id: 'entityName',
                width: 'auto',
            },
            {
                content: 'Entity Provider',
                align: 'center',
                sortable: true,
                id: 'credentialProvider',
                width: '15%',
            },
            {
                content: 'Kind',
                align: 'center',
                sortable: true,
                id: 'kind',
                width: '15%',
            },
        ],
        [],
    );

    const entityList: TableDataRow[] = useMemo(
        () =>
            entities.map((entity) => ({
                id: entity.uuid,
                columns: [
                    <Link to={`./detail/${entity.uuid}`}>{entity.name}</Link>,
                    entity.connectorName ? (
                        <Link to={`../connectors/detail/${entity.connectorUuid}`}>{entity.connectorName ?? 'Unassigned'}</Link>
                    ) : (
                        (entity.connectorName ?? 'Unassigned')
                    ),
                    <Badge color="primary">{entity.kind}</Badge>,
                ],
            })),
        [entities],
    );

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(actions.listEntities(filters)), [dispatch]);

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.ENTITY}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids) => uuids.map((uuid) => dispatch(actions.deleteEntity({ uuid })))}
                getAvailableFiltersApi={useCallback((apiClients: ApiClients) => apiClients.entities.getSearchableFieldInformation2(), [])}
                headers={entitiesRowHeaders}
                data={entityList}
                isBusy={isBusy}
                title="Entity Store"
                entityNameSingular="an Entity"
                entityNamePlural="Entities"
                filterTitle="Entities Filter"
                pageWidgetLockName={LockWidgetNameEnum.EntityStore}
            />
        </Container>
    );
}

export default EntityList;
