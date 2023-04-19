import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Container } from "reactstrap";

import { actions, selectors } from "ducks/entities";

import { TableDataRow, TableHeader } from "components/CustomTable";
import PagedList from "components/PagedList/PagedList";
import { EntityType } from "ducks/filters";

function EntityList() {
    const dispatch = useDispatch();

    const entities = useSelector(selectors.entities);

    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = isDeleting || isUpdating;

    const entitiesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Name",
                sortable: true,
                sort: "asc",
                id: "entityName",
                width: "auto",
            },
            {
                content: "Entity Provider",
                align: "center",
                sortable: true,
                id: "credentialProvider",
                width: "15%",
            },
            {
                content: "Kind",
                align: "center",
                sortable: true,
                id: "kind",
                width: "15%",
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
                    <Badge color="primary">{entity.connectorName}</Badge>,
                    <Badge color="primary">{entity.kind}</Badge>,
                ],
            })),
        [entities],
    );

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.ENTITY}
                listAction={actions.listEntities}
                onDeleteCallback={(uuids) => uuids.map((uuid) => dispatch(actions.deleteEntity({ uuid })))}
                getAvailableFiltersApi={useCallback((apiClients) => apiClients.entities.getSearchableFieldInformation2(), [])}
                headers={entitiesRowHeaders}
                data={entityList}
                isBusy={isBusy}
                title="Entity Store"
                entityNameSingular="an Entity"
                entityNamePlural="Entities"
                filterTitle="Entities Filter"
            />
        </Container>
    );
}

export default EntityList;
