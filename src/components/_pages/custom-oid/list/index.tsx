import { TableDataRow, TableHeader } from 'components/CustomTable';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from 'ducks/oids';
import { EntityType } from 'ducks/filters';
import PagedList from 'components/PagedList/PagedList';
import { ApiClients } from 'src/api';
import { Link } from 'react-router';
import { LockWidgetNameEnum } from 'types/user-interface';
import { SearchRequestModel } from 'types/certificate';
import { selectors as enumSelectors } from 'ducks/enums';
import { OidCategory, PlatformEnum } from 'types/openapi';

export default function CustomOIDList() {
    const dispatch = useDispatch();

    const oids = useSelector(selectors.oids);

    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = isDeleting || isUpdating;

    const oidCategoryEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.OidCategory));
    const oidsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'OID',
                sortable: true,
                sort: 'asc',
                id: 'oid',
                width: '15%',
            },
            {
                content: 'Display Name',
                align: 'center',
                sortable: true,
                id: 'oidName',
                width: '30%',
            },
            {
                content: 'Description',
                align: 'center',
                sortable: true,
                id: 'oidDescription',
                width: '40%',
            },
            {
                content: 'Category',
                align: 'center',
                sortable: true,
                id: 'category',
                width: '15%',
            },
        ],
        [],
    );
    const onListCallback = useCallback(
        (filters: SearchRequestModel) => {
            return dispatch(actions.listOIDs(filters));
        },
        [dispatch],
    );

    const oidsList: TableDataRow[] = useMemo(() => {
        return oids.map((oid) => ({
            id: oid.oid,
            columns: [
                <Link key={oid.oid} to={`./detail/${oid.oid}`}>
                    {oid.oid}
                </Link>,
                oid.displayName || '',
                oid.description || '',
                oidCategoryEnum[oid.category as OidCategory].label || '',
            ],
        }));
    }, [oids, oidCategoryEnum]);

    const onDeleteCallback = useCallback(
        (oids: string[]) => {
            return dispatch(actions.bulkDeleteOIDs({ oids: oids }));
        },
        [dispatch],
    );

    return (
        <PagedList
            entity={EntityType.OID}
            onListCallback={onListCallback}
            onDeleteCallback={onDeleteCallback}
            getAvailableFiltersApi={useCallback((apiClients: ApiClients) => apiClients.oids.getSearchableInformation(), [])}
            headers={oidsRowHeaders}
            data={oidsList}
            isBusy={isBusy}
            title="Custom OIDs"
            entityNameSingular="an OID"
            entityNamePlural="OIDs"
            filterTitle="Certificates by Compliance"
            pageWidgetLockName={LockWidgetNameEnum.EntityStore}
        />
    );
}
