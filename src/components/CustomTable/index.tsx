import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { jsxInnerText } from 'utils/jsxInnerText';
import { useDispatch } from 'react-redux';
import { actions as userInterfaceActions } from 'ducks/user-interface';

import NewRowWidget, { NewRowWidgetProps } from './NewRowWidget';
import Select from 'components/Select';
import Pagination from 'components/Pagination';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';
import SimpleBar from 'simplebar-react';
import cn from 'classnames';

export interface TableHeader {
    id: string;
    content: string | React.ReactNode;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    sort?: 'asc' | 'desc';
    sortType?: 'string' | 'numeric' | 'date';
    width?: string;
}

export interface TableDataRow {
    id: number | string;
    columns: (string | React.ReactNode | React.ReactNode[])[];
    detailColumns?: (string | React.ReactNode | React.ReactNode[])[];
    options?: {
        useAccentBottomBorder?: boolean;
    };
}

interface Props {
    headers: TableHeader[];
    data: TableDataRow[];
    canSearch?: boolean;
    hasHeader?: boolean;
    hasCheckboxes?: boolean;
    hasAllCheckBox?: boolean;
    multiSelect?: boolean;
    hasPagination?: boolean;
    hasDetails?: boolean;
    checkedRows?: (number | string)[];
    paginationData?: {
        page: number;
        totalItems: number;
        pageSize: number;
        loadedPageSize: number;
        totalPages: number;
        itemsPerPageOptions: number[];
    };
    onCheckedRowsChanged?: (checkedRows: (string | number)[]) => void;
    onPageSizeChanged?: (pageSize: number) => void;
    onPageChanged?: (page: number) => void;
    newRowWidgetProps?: NewRowWidgetProps;
    columnForDetail?: string;
    detailHeaders?: TableHeader[];
}

const emptyCheckedRows: (string | number)[] = [];

function CustomTable({
    headers,
    data,
    canSearch,
    hasHeader = true,
    hasCheckboxes,
    hasAllCheckBox = true,
    multiSelect = true,
    hasPagination,
    hasDetails,
    paginationData,
    checkedRows,
    onCheckedRowsChanged,
    onPageSizeChanged,
    onPageChanged,
    newRowWidgetProps,
    detailHeaders,
    columnForDetail,
}: Props) {
    const [tblHeaders, setTblHeaders] = useState<TableHeader[]>();
    const [tblData, setTblData] = useState<TableDataRow[]>(data);
    const [tblCheckedRows, setTblCheckedRows] = useState<(string | number)[]>(checkedRows || emptyCheckedRows);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [searchKey, setSearchKey] = useState<string>('');
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [expandedRow, setExpandedRow] = useState<string | number>();
    const dispatch = useDispatch();

    const handleRowDetailClick = useCallback(
        (rowId: string | number) => {
            const row = tblData.find((r) => r.id === rowId);
            if (!row || !row.detailColumns || row.detailColumns.length === 0) {
                return;
            }

            const detailTableHeaders: TableHeader[] =
                detailHeaders && detailHeaders.length === row.detailColumns.length
                    ? detailHeaders
                    : row.detailColumns.map((_, index) => ({
                          id: `detail-${index}`,
                          content: '',
                          sortable: false,
                      }));

            const processedColumns = row.detailColumns.map((col, index) => {
                if (Array.isArray(col)) {
                    return <div key={`detail-col-${index}`}>{col}</div>;
                }
                return col;
            });

            const detailData: TableDataRow[] = [
                {
                    id: 'detail-row',
                    columns: processedColumns,
                },
            ];

            const caption = typeof row.columns[0] === 'string' ? row.columns[0] : jsxInnerText(row.columns[0] as React.ReactNode);

            dispatch(
                userInterfaceActions.showGlobalModal({
                    isOpen: true,
                    size: 'xl',
                    title: caption,
                    content: (
                        <CustomTable headers={detailTableHeaders} data={detailData} hasHeader={!!detailHeaders} hasPagination={false} />
                    ),
                    showCloseButton: true,
                }),
            );
        },
        [tblData, detailHeaders, dispatch],
    );

    useEffect(() => {
        setTblCheckedRows(checkedRows || emptyCheckedRows);
    }, [checkedRows]);

    const onPageChange = useCallback(
        (page: number) => {
            if (onPageChanged) onPageChanged(page);
            else setPage(page);
        },
        [onPageChanged, setPage],
    );

    useEffect(() => {
        setTblHeaders(headers);
    }, [headers]);

    useEffect(() => {
        if (!tblHeaders) return;

        const sortCol = tblHeaders.find((h) => h.sort);

        if (sortCol) {
            setSortColumn(sortCol.id);
            setSortOrder(sortCol.sort || 'asc');
        }
    }, [tblHeaders]);

    useEffect(
        () => {
            const filtered = searchKey
                ? [...data].filter((row) => {
                      let rowStr = '';
                      row.columns.forEach((col) => {
                          rowStr += typeof col === 'string' ? col : jsxInnerText(col as React.ReactNode);
                      });
                      return rowStr.toLowerCase().includes(searchKey.toLowerCase());
                  })
                : [...data];
            const sortCol = tblHeaders ? tblHeaders.find((h) => h.sort) : undefined;

            if (!tblHeaders || !sortCol) {
                setTblCheckedRows(tblCheckedRows.filter((row) => data.find((data) => data.id === row)));
                setTblData(filtered);
                return;
            }

            const sortColumnIndex = tblHeaders.findIndex((h) => h.sort);

            if (sortColumnIndex >= 0) {
                const sortDirection = sortCol.sort || 'asc';

                filtered.sort((a, b) => {
                    const aVal =
                        typeof a.columns[sortColumnIndex] === 'string'
                            ? (a.columns[sortColumnIndex] as string).toLowerCase()
                            : jsxInnerText(a.columns[sortColumnIndex] as React.ReactNode).toLowerCase();
                    const bVal =
                        typeof b.columns[sortColumnIndex] === 'string'
                            ? (b.columns[sortColumnIndex] as string).toLowerCase()
                            : jsxInnerText(b.columns[sortColumnIndex] as React.ReactNode).toLowerCase();

                    switch (sortCol.sortType) {
                        case 'date':
                            const aDate = new Date(aVal.replace(/ at /g, ' '));
                            const bDate = new Date(bVal.replace(/ at /g, ' '));
                            return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();

                        case 'numeric':
                            return sortDirection === 'asc' ? parseFloat(aVal) - parseFloat(bVal) : parseFloat(bVal) - parseFloat(aVal);

                        default:
                            if (aVal === bVal) return 0;
                            return aVal > bVal ? (sortDirection === 'asc' ? 1 : -1) : sortDirection === 'asc' ? -1 : 1;
                    }
                });
            }

            setTblData(filtered);
            setTblCheckedRows(tblCheckedRows.filter((row) => data.find((data) => data.id === row)));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, searchKey, sortColumn, sortOrder],
    );

    useEffect(() => {
        const totalPages = Math.ceil(tblData.length / pageSize);
        setTotalPages(totalPages);
        if (page > totalPages) setPage(totalPages - 1 < 1 ? 1 : totalPages - 1);
    }, [tblData, pageSize, page]);

    const onCheckAllCheckboxClick = useCallback(
        (value: boolean) => {
            if (!value) {
                setTblCheckedRows([]);
                if (onCheckedRowsChanged) onCheckedRowsChanged([]);
                return;
            }

            const checkedRows = tblData.map((row) => row.id);

            setTblCheckedRows(checkedRows);
            if (onCheckedRowsChanged) onCheckedRowsChanged(checkedRows);
        },
        [tblData, onCheckedRowsChanged],
    );

    const onRowToggleSelection = useCallback(
        (e: React.MouseEvent, rowId: string | number | undefined = undefined, continueAfterDetails: boolean = true) => {
            const target = e.target as HTMLElement;

            if (
                hasDetails &&
                target.localName !== 'input' &&
                target.localName !== 'button' &&
                (target.localName !== 'i' || target.hasAttribute('data-expander'))
            ) {
                if (expandedRow === rowId) {
                    setExpandedRow(undefined);
                } else {
                    setExpandedRow(rowId);
                }
                if (!continueAfterDetails) {
                    return;
                }

                return;
            }

            if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') return;

            const id = e.currentTarget.getAttribute('data-id');
            if (!id) return;

            if (!multiSelect) {
                const checkedRows: string[] = tblCheckedRows.includes(id) ? [] : [id];

                setTblCheckedRows(checkedRows);
                if (onCheckedRowsChanged) onCheckedRowsChanged(checkedRows);

                return;
            }

            const checkedRows = [...tblCheckedRows];

            if (checkedRows.includes(id)) {
                checkedRows.splice(checkedRows.indexOf(id), 1);
            } else {
                checkedRows.push(id);
            }

            setTblCheckedRows(checkedRows);
            if (onCheckedRowsChanged) onCheckedRowsChanged(checkedRows);

            e.stopPropagation();
            e.preventDefault();
        },
        [hasDetails, multiSelect, tblCheckedRows, onCheckedRowsChanged, expandedRow],
    );

    const onRowCheckboxClick = useCallback(
        (value: boolean, id: string) => {
            if (!id) return;

            if (!multiSelect) {
                const checked: string[] = tblCheckedRows.includes(id) ? [] : [id];
                setTblCheckedRows(checked);
                if (onCheckedRowsChanged) onCheckedRowsChanged(checked);
                return;
            }

            const checked = [...tblCheckedRows];

            if (value) {
                if (id && !checked.includes(id)) checked.push(id);
            } else {
                if (id && checked.includes(id)) checked.splice(checked.indexOf(id), 1);
            }

            setTblCheckedRows(checked);
            if (onCheckedRowsChanged) onCheckedRowsChanged(checked);
        },
        [multiSelect, tblCheckedRows, onCheckedRowsChanged],
    );

    const onColumnSortClick = useCallback(
        (e: React.MouseEvent<HTMLTableCellElement>) => {
            if (!tblHeaders) return;

            const sortColumn = e.currentTarget.getAttribute('data-id');

            const hdr = tblHeaders?.find((header) => header.id === sortColumn);
            if (!hdr) return;

            const column = tblHeaders?.findIndex((header) => header.id === sortColumn);
            if (column === undefined || column === -1) return;

            const sort = hdr.sort === 'asc' ? 'desc' : 'asc';

            const headers: TableHeader[] = tblHeaders.map((header) => ({
                ...header,
                sort: header.id === sortColumn ? sort : undefined,
            }));

            setTblHeaders(headers);
        },
        [tblHeaders],
    );

    const onPageSizeChange = useCallback(
        (value: string | number) => {
            if (onPageSizeChanged) {
                onPageSizeChanged(typeof value === 'string' ? parseInt(value) : value);
                return;
            }

            setPageSize(typeof value === 'string' ? parseInt(value) : value);
            setPage(1);
        },
        [onPageSizeChanged],
    );

    const checkAllChecked = useMemo(() => {
        return tblCheckedRows.length === tblData.length && tblData.length > 0;
    }, [tblData, tblCheckedRows]);

    const getSortIcon = useCallback((sort: 'asc' | 'desc' | undefined) => {
        return (
            <div className="w-[14px]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-down-up-icon lucide-arrow-down-up"
                >
                    <path d="m3 16 4 4 4-4" color={sort && sort === 'desc' ? 'var(--dark-gray-color)' : 'currentColor'} />
                    <path d="M7 20V4" color={sort && sort === 'desc' ? 'var(--dark-gray-color)' : 'currentColor'} />
                    <path d="m21 8-4-4-4 4" color={sort && sort === 'asc' ? 'var(--dark-gray-color)' : 'currentColor'} />
                    <path d="M17 4v16" color={sort && sort === 'asc' ? 'var(--dark-gray-color)' : 'currentColor'} />
                </svg>
            </div>
        );
    }, []);

    const header = useMemo(() => {
        const columns = tblHeaders ? [...tblHeaders] : [];

        if (hasCheckboxes) columns.unshift({ id: '__checkbox__', content: '', sortable: false, width: '0%' });
        return columns.map((header) => (
            <Fragment key={header.id}>
                <th
                    scope="col"
                    className={cn(
                        'p-2.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 !color-gray-500 bg-[#F8FAFC] whitespace-nowrap',
                        {
                            'cursor-pointer': header.sortable,
                        },
                    )}
                    data-id={header.id}
                    {...(header.sortable ? { onClick: onColumnSortClick } : {})}
                    style={{ ...(header.width ? { width: header.width } : {}), ...(header.align ? { textAlign: header.align } : {}) }}
                >
                    {header.id === '__checkbox__' ? (
                        hasAllCheckBox && multiSelect ? (
                            <Checkbox
                                checked={checkAllChecked}
                                onChange={(value) => onCheckAllCheckboxClick(value)}
                                id={`${header.id}__checkbox__`}
                            />
                        ) : (
                            <div>&nbsp;</div>
                        )
                    ) : header.sortable ? (
                        <div className={cn('flex items-center gap-1', { 'justify-center': header.align === 'center' })}>
                            {header.content}
                            &nbsp;
                            {getSortIcon(header.sort)}
                        </div>
                    ) : (
                        header.content
                    )}
                </th>
            </Fragment>
        ));
    }, [tblHeaders, hasCheckboxes, onColumnSortClick, hasAllCheckBox, multiSelect, checkAllChecked, onCheckAllCheckboxClick, getSortIcon]);

    const getRowStyle = useCallback((row: TableDataRow) => {
        if (!row.options) return undefined;
        const style: React.CSSProperties = {};
        if (row.options.useAccentBottomBorder) {
            Object.assign(style, { borderBottom: '1px solid' } as React.CSSProperties);
        }
        return style;
    }, []);

    const body = useMemo(() => {
        return tblData
            .filter((row, index) => {
                if (!hasPagination) return true;
                if (pageSize === 0) return true;
                return paginationData ? true : index >= (page - 1) * pageSize && index < page * pageSize;
            })
            .map((row, index) => (
                <Fragment key={row.id}>
                    <tr
                        key={`tr${row.id}`}
                        {...(hasCheckboxes || hasDetails
                            ? {
                                  onClick: (e) => {
                                      onRowToggleSelection(e, row.id, hasCheckboxes);
                                  },
                              }
                            : {})}
                        style={getRowStyle(row)}
                        data-id={row.id}
                    >
                        {hasCheckboxes && (
                            <td className="p-2.5">
                                <Checkbox
                                    checked={tblCheckedRows.includes(row.id)}
                                    onChange={(value) => {
                                        onRowCheckboxClick(value, row.id.toString());
                                    }}
                                    id={`${row.id}__checkbox__`}
                                />
                            </td>
                        )}

                        {row.columns.map((column, index) => {
                            const isFirstColumn = index === 0;
                            const shouldShowButton = hasDetails && isFirstColumn && row.detailColumns && row.detailColumns.length > 0;

                            return (
                                <td
                                    key={index}
                                    style={tblHeaders && tblHeaders[index]?.align ? { textAlign: tblHeaders[index]?.align } : {}}
                                    className="px-2.5 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200"
                                >
                                    {shouldShowButton ? (
                                        <Button
                                            variant="transparent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowDetailClick(row.id);
                                            }}
                                            className="!p-0 hover:bg-transparent text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto font-medium"
                                        >
                                            {column}
                                        </Button>
                                    ) : (
                                        <div>{column ? column : <></>}</div>
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                </Fragment>
            ));
    }, [
        tblData,
        hasPagination,
        hasDetails,
        pageSize,
        paginationData,
        page,
        hasCheckboxes,
        onRowToggleSelection,
        tblCheckedRows,
        onRowCheckboxClick,
        tblHeaders,
        getRowStyle,
        handleRowDetailClick,
    ]);

    return (
        <div data-testid="custom-table">
            {canSearch && (
                <div className="flex justify-end mb-3">
                    <div className="max-w-sm">
                        <input
                            id="search"
                            placeholder="Search"
                            onChange={(event) => setSearchKey(event.target.value)}
                            type="text"
                            className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                    </div>
                </div>
            )}
            {(hasHeader || body?.length > 0) && (
                <div className="py-2">
                    <SimpleBar forceVisible="x">
                        <div className={cn('rounded-md', { 'border border-gray-100': hasHeader })}>
                            <div className="min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 bg-white">
                                        {hasHeader && (
                                            <thead className="bg-gray-50 dark:bg-neutral-700">
                                                <tr>{header}</tr>
                                            </thead>
                                        )}
                                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">{body}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </SimpleBar>
                </div>
            )}
            {hasPagination && (
                <div className="flex justify-between items-center gap-2 mt-6">
                    <div>
                        {(paginationData ? paginationData.totalItems > 0 : (tblData?.length ?? 0) > 0) && (
                            <Select
                                id="pageSize"
                                options={(paginationData?.itemsPerPageOptions || [10, 20, 50, 100]).map((option: number) => ({
                                    label: option.toString(),
                                    value: option.toString(),
                                }))}
                                value={(paginationData ? paginationData.pageSize : pageSize).toString()}
                                onChange={onPageSizeChange}
                            />
                        )}
                    </div>

                    {(paginationData ? paginationData.totalPages > 1 : totalPages > 1) && (
                        <Pagination
                            page={paginationData?.page || page}
                            totalPages={paginationData?.totalPages || totalPages}
                            onPageChange={onPageChange}
                        />
                    )}

                    {tblData?.length ? (
                        <div className="text-sm">
                            {paginationData ? (
                                <div>
                                    Showing {(paginationData.page - 1) * paginationData.pageSize + 1} to{' '}
                                    {(paginationData.page - 1) * paginationData.pageSize + paginationData.loadedPageSize >
                                    paginationData.totalItems
                                        ? paginationData.totalItems
                                        : (paginationData.page - 1) * paginationData.pageSize + paginationData.loadedPageSize}{' '}
                                    items of {paginationData.totalItems}
                                </div>
                            ) : (
                                <div>
                                    Showing {(page - 1) * pageSize + (tblData.length > 0 ? 1 : 0)} to{' '}
                                    {(page - 1) * pageSize + pageSize > tblData.length ? tblData.length : (page - 1) * pageSize + pageSize}{' '}
                                    of {tblData.length} entries
                                </div>
                            )}

                            {searchKey && data.length - tblData.length > 0 ? (
                                <div>{data.length - tblData.length} of loaded entries filtered</div>
                            ) : (
                                <></>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm">No items to show</div>
                    )}
                </div>
            )}
            {newRowWidgetProps && (
                <NewRowWidget
                    selectHint={newRowWidgetProps.selectHint}
                    immediateAdd={newRowWidgetProps.immediateAdd}
                    isBusy={newRowWidgetProps.isBusy}
                    newItemsList={newRowWidgetProps.newItemsList}
                    onAddClick={newRowWidgetProps.onAddClick}
                />
            )}
        </div>
    );
}

export default CustomTable;
