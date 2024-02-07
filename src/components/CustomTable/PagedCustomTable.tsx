import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
    headers: TableHeader[];
    data: TableDataRow[];
    totalItems?: number;
    onReloadData: (pageSize: number, pageNumber: number) => void;
}

export default function PagedCustomTable({ headers, data, totalItems, onReloadData }: Props) {
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const prevPageNumber = useRef(0);

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
        <CustomTable
            headers={headers}
            data={data}
            hasPagination={true}
            paginationData={paginationData}
            onPageChanged={setPageNumber}
            onPageSizeChanged={setPageSize}
        />
    );
}
