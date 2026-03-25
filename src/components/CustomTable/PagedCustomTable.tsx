import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { actions as tablePaginationActions, selectors as tablePaginationSelectors } from 'ducks/table-pagination';

interface Props {
    headers: TableHeader[];
    data: TableDataRow[];
    totalItems?: number;
    onReloadData: (pageSize: number, pageNumber: number) => void;
    stateKey?: string;
    tableStateKey?: string;
}

export default function PagedCustomTable({ headers, data, totalItems, onReloadData, stateKey, tableStateKey }: Props) {
    const dispatch = useDispatch();
    const location = useLocation();
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const prevPageNumber = useRef(0);
    const paginationHydratedKeyRef = useRef<string | undefined>(undefined);

    const paginationStateRouteKey = useMemo(() => {
        if (stateKey) {
            return stateKey;
        }

        if (typeof window !== 'undefined' && window.location.hash.startsWith('#/')) {
            return window.location.hash.slice(1).split('?')[0];
        }

        return `${location.pathname}${location.search}`;
    }, [location.pathname, location.search, stateKey]);

    const paginationStateStorageKey = useMemo(() => `paged-custom-table-pagination:${paginationStateRouteKey}`, [paginationStateRouteKey]);
    const selectPaginationState = useMemo(
        () => tablePaginationSelectors.pagination(paginationStateStorageKey),
        [paginationStateStorageKey],
    );
    const persistedPaginationState = useSelector(selectPaginationState);

    useEffect(() => {
        if (paginationHydratedKeyRef.current === paginationStateStorageKey) {
            return;
        }

        paginationHydratedKeyRef.current = paginationStateStorageKey;
        setPageNumber(persistedPaginationState.page);
        setPageSize(persistedPaginationState.pageSize);
    }, [paginationStateStorageKey, persistedPaginationState.page, persistedPaginationState.pageSize]);

    useEffect(() => {
        if (persistedPaginationState.page === pageNumber && persistedPaginationState.pageSize === pageSize) {
            return;
        }

        dispatch(
            tablePaginationActions.setPagination({
                key: paginationStateStorageKey,
                page: pageNumber,
                pageSize,
            }),
        );
    }, [dispatch, pageNumber, pageSize, paginationStateStorageKey, persistedPaginationState.page, persistedPaginationState.pageSize]);

    useEffect(() => {
        if (pageNumber !== 1 && prevPageNumber.current === pageNumber) {
            setPageNumber(1);
        } else {
            prevPageNumber.current = pageNumber;
            onReloadData(pageSize, pageNumber);
        }
    }, [pageSize, pageNumber, onReloadData]);

    const paginationData = useMemo(
        () => ({
            page: pageNumber,
            totalItems: totalItems ?? 0,
            pageSize: pageSize,
            loadedPageSize: pageSize,
            totalPages: Math.ceil((totalItems ?? 0) / pageSize),
            itemsPerPageOptions: [10, 20, 50, 100, 200, 500, 1000],
        }),
        [pageNumber, totalItems, pageSize],
    );

    return (
        <div data-testid="paged-custom-table">
            <CustomTable
                headers={headers}
                data={data}
                paginationStateKey={tableStateKey}
                hasPagination={true}
                paginationData={paginationData}
                onPageChanged={setPageNumber}
                onPageSizeChanged={setPageSize}
            />
        </div>
    );
}
