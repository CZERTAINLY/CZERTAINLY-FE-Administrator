import { EntityType, selectors as filterSelectors } from 'ducks/filters';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ApiClients } from 'api';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import FilterWidget from 'components/FilterWidget';
import Widget from 'components/Widget';
import { IconName, WidgetButtonProps } from 'components/WidgetButtons';
import { actions, selectors } from 'ducks/paging';
import { Observable } from 'rxjs';
import { SearchFieldListModel, SearchFilterModel, SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';

interface Props {
    entity: EntityType;
    headers: TableHeader[];
    data: TableDataRow[];
    isBusy?: boolean;
    multiSelect?: boolean;
    onDeleteCallback?: (uuids: string[], filters: SearchFilterModel[]) => void;
    onListCallback: (filters: SearchRequestModel) => void;
    getAvailableFiltersApi?: (apiClients: ApiClients) => Observable<Array<SearchFieldListModel>>;
    title: string;
    filterTitle?: string;
    addHidden?: boolean;
    entityNameSingular?: string;
    entityNamePlural?: string;
    additionalButtons?: WidgetButtonProps[];
    pageWidgetLockName?: LockWidgetNameEnum;
    hideWidgetButtons?: boolean;
    hasCheckboxes?: boolean;
    hasDetails?: boolean;
}

function PagedList({
    headers,
    data,
    filterTitle,
    addHidden,
    entity,
    title,
    isBusy = false,
    multiSelect = true,
    onDeleteCallback,
    getAvailableFiltersApi,
    onListCallback,
    entityNamePlural,
    entityNameSingular,
    additionalButtons,
    pageWidgetLockName,
    hideWidgetButtons = false,
    hasCheckboxes = true,
    hasDetails = false,
}: Props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentFilters = useSelector(filterSelectors.currentFilters(entity));

    const totalItems = useSelector(selectors.totalItems(entity));
    const checkedRows = useSelector(selectors.checkedRows(entity));
    const isFetchingList = useSelector(selectors.isFetchingList(entity));

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const onCheckedRowsChanged = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ entity, checkedRows: rows as string[] }));
        },
        [dispatch, entity],
    );

    const getFreshData = useCallback(() => {
        onListCallback({ itemsPerPage: pageSize, pageNumber, filters: currentFilters });
        onCheckedRowsChanged([]);
    }, [currentFilters, pageSize, pageNumber, onListCallback, onCheckedRowsChanged]);

    const onPageSizeChanged = useCallback(
        (pageSize: number) => {
            setPageSize(pageSize);
            setPageNumber(1);
        },
        [setPageSize, setPageNumber],
    );

    const onDeleteConfirmed = useCallback(() => {
        setConfirmDelete(false);
        onDeleteCallback!(checkedRows, currentFilters);
        onCheckedRowsChanged([]);
        getFreshData();
    }, [checkedRows, onDeleteCallback, currentFilters, onCheckedRowsChanged, getFreshData]);

    useEffect(() => {
        setPageNumber(1);
    }, [currentFilters]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const buttons: WidgetButtonProps[] = useMemo(() => {
        const result = [];
        if (!addHidden) {
            result.push({
                icon: 'plus' as IconName,
                disabled: false,
                tooltip: 'Create',
                onClick: () => navigate(`./add`),
            });
        }
        if (onDeleteCallback) {
            result.push({
                icon: 'trash' as IconName,
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            });
        }
        if (additionalButtons) {
            result.push(...additionalButtons);
        }
        return result;
    }, [checkedRows, additionalButtons, navigate, addHidden, onDeleteCallback]);

    const paginationData = useMemo(
        () => ({
            page: pageNumber,
            totalItems: totalItems,
            pageSize: pageSize,
            loadedPageSize: pageSize,
            totalPages: Math.ceil(totalItems / pageSize),
            itemsPerPageOptions: [10, 20, 50, 100, 200, 500, 1000],
        }),
        [pageNumber, totalItems, pageSize],
    );

    return (
        <>
            {getAvailableFiltersApi && filterTitle && (
                <FilterWidget entity={entity} title={filterTitle} getAvailableFiltersApi={getAvailableFiltersApi} />
            )}

            <Widget
                title={title}
                busy={isBusy || isFetchingList}
                widgetLockName={pageWidgetLockName}
                refreshAction={getFreshData}
                widgetButtons={buttons}
                titleSize="large"
                hideWidgetButtons={hideWidgetButtons}
            >
                <CustomTable
                    headers={headers}
                    data={data}
                    hasCheckboxes={hasCheckboxes}
                    hasDetails={hasDetails}
                    hasPagination={true}
                    multiSelect={multiSelect}
                    paginationData={paginationData}
                    onPageChanged={setPageNumber}
                    onCheckedRowsChanged={onCheckedRowsChanged}
                    onPageSizeChanged={onPageSizeChanged}
                />
            </Widget>

            {onDeleteCallback && (
                <Dialog
                    isOpen={confirmDelete}
                    caption={`Delete ${checkedRows.length > 1 ? entityNamePlural : entityNameSingular}`}
                    body={`You are about to delete ${
                        checkedRows.length > 1 ? entityNamePlural : entityNameSingular
                    }. Is this what you want to do?`}
                    toggle={() => setConfirmDelete(false)}
                    buttons={[
                        { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                        { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    ]}
                />
            )}
        </>
    );
}

export default PagedList;
