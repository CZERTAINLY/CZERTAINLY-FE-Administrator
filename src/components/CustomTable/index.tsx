import cx from 'classnames';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { jsxInnerText } from 'utils/jsxInnerText';

import styles from './CustomTable.module.scss';
import NewRowWidget, { NewRowWidgetProps } from './NewRowWidget';

export interface TableHeader {
    id: string;
    content: string | JSX.Element;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    sort?: 'asc' | 'desc';
    sortType?: 'string' | 'numeric' | 'date';
    width?: string;
}

export interface TableDataRow {
    id: number | string;
    columns: (string | JSX.Element | JSX.Element[])[];
    detailColumns?: (string | JSX.Element | JSX.Element[])[];
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

    useEffect(() => {
        setTblCheckedRows(checkedRows || emptyCheckedRows);
    }, [checkedRows]);

    const firstPage = useCallback(() => {
        if (paginationData) {
            if (onPageChanged) onPageChanged(1);
        } else {
            setPage(1);
        }
    }, [onPageChanged, paginationData]);

    const prevPage = useCallback(() => {
        if (paginationData) {
            if (onPageChanged) onPageChanged(paginationData.page - 1);
        } else {
            setPage(page - 1);
        }
    }, [onPageChanged, page, paginationData]);

    const nextPage = useCallback(() => {
        if (paginationData) {
            if (onPageChanged) onPageChanged(paginationData.page + 1);
        } else {
            setPage(page + 1);
        }
    }, [onPageChanged, page, paginationData]);

    const lastPage = useCallback(() => {
        if (paginationData) {
            if (onPageChanged) onPageChanged(paginationData.totalPages);
        } else {
            setPage(totalPages);
        }
    }, [onPageChanged, paginationData, totalPages]);

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
                          rowStr += typeof col === 'string' ? col : jsxInnerText(col as JSX.Element);
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
                            : jsxInnerText(a.columns[sortColumnIndex] as JSX.Element).toLowerCase();
                    const bVal =
                        typeof b.columns[sortColumnIndex] === 'string'
                            ? (b.columns[sortColumnIndex] as string).toLowerCase()
                            : jsxInnerText(b.columns[sortColumnIndex] as JSX.Element).toLowerCase();

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
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.checked) {
                setTblCheckedRows([]);
                if (onCheckedRowsChanged) onCheckedRowsChanged([]);
                return;
            }

            const ps = paginationData ? paginationData.pageSize : pageSize;
            const checkedRows = tblData.slice((page - 1) * ps, page * ps).map((row) => row.id);

            setTblCheckedRows(checkedRows);
            if (onCheckedRowsChanged) onCheckedRowsChanged(checkedRows);
        },
        [paginationData, pageSize, tblData, page, onCheckedRowsChanged],
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
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const id = e.target.getAttribute('data-id');
            if (!id) return;

            if (!multiSelect) {
                const checked: string[] = tblCheckedRows.includes(id) ? [] : [id];
                setTblCheckedRows(checked);
                if (onCheckedRowsChanged) onCheckedRowsChanged(checked);
                return;
            }

            const checked = [...tblCheckedRows];

            if (e.target.checked) {
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
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (onPageSizeChanged) {
                onPageSizeChanged(parseInt(event.target.value));
                return;
            }

            setPageSize(parseInt(event.target.value));
            setPage(1);
        },
        [onPageSizeChanged],
    );

    const checkAllChecked = useMemo(() => {
        const ps = paginationData ? paginationData.pageSize : pageSize;
        return tblCheckedRows.length === tblData.slice((page - 1) * ps, page * ps).length && tblData.length > 0;
    }, [tblData, tblCheckedRows, paginationData, pageSize, page]);

    const header = useMemo(() => {
        const columns = tblHeaders ? [...tblHeaders] : [];

        if (hasCheckboxes) columns.unshift({ id: '__checkbox__', content: '', sortable: false, width: '0%' });
        if (hasDetails) columns.unshift({ id: 'details', content: '', sortable: false, width: '1%' });
        return columns.map((header) => (
            <Fragment key={header.id}>
                <th
                    className={styles.header}
                    data-id={header.id}
                    {...(header.sortable ? { onClick: onColumnSortClick } : {})}
                    style={{ ...(header.width ? { width: header.width } : {}), ...(header.align ? { textAlign: header.align } : {}) }}
                >
                    {header.id === '__checkbox__' ? (
                        hasAllCheckBox && multiSelect ? (
                            <input
                                id={`${header.id}__checkbox__`}
                                type="checkbox"
                                checked={checkAllChecked}
                                onChange={onCheckAllCheckboxClick}
                            />
                        ) : (
                            <>&nbsp;</>
                        )
                    ) : header.sortable ? (
                        <>
                            {header.content}
                            &nbsp;
                            {header.sort === 'asc' ? (
                                <>
                                    <i className="fa fa-arrow-up" />
                                    <i className="fa fa-arrow-down" style={{ opacity: 0.25 }} />
                                </>
                            ) : header.sort === 'desc' ? (
                                <>
                                    <i className="fa fa-arrow-up" style={{ opacity: 0.25 }} />
                                    <i className="fa fa-arrow-down" />
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-arrow-up" style={{ opacity: 0.25 }} />
                                    <i className="fa fa-arrow-down" style={{ opacity: 0.25 }} />
                                </>
                            )}
                        </>
                    ) : (
                        header.content
                    )}
                </th>
            </Fragment>
        ));
    }, [tblHeaders, hasCheckboxes, hasDetails, onColumnSortClick, hasAllCheckBox, multiSelect, checkAllChecked, onCheckAllCheckboxClick]);

    const body = useMemo(
        () =>
            tblData
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
                            data-id={row.id}
                        >
                            {!hasDetails ? (
                                <></>
                            ) : !row.detailColumns || row.detailColumns.length === 0 ? (
                                <td></td>
                            ) : (
                                <td id="show-detail-more-column" key="show-detail-more-column">
                                    {expandedRow === row.id ? (
                                        <i className="fa fa-caret-up" data-expander="true" />
                                    ) : (
                                        <i className="fa fa-caret-down" data-expander="true" />
                                    )}
                                </td>
                            )}
                            {!hasCheckboxes ? (
                                <></>
                            ) : (
                                <td>
                                    <input
                                        id={`${row.id}__checkbox__`}
                                        type="checkbox"
                                        checked={tblCheckedRows.includes(row.id)}
                                        onChange={onRowCheckboxClick}
                                        data-id={row.id}
                                    />
                                </td>
                            )}

                            {row.columns.map((column, index) => (
                                <td
                                    key={index}
                                    className={styles.dataCell}
                                    style={tblHeaders && tblHeaders[index]?.align ? { textAlign: tblHeaders[index]?.align } : {}}
                                >
                                    <div>{column ? column : <></>}</div>
                                </td>
                            ))}
                        </tr>

                        {!hasDetails ? (
                            <></>
                        ) : (
                            <tr key={`trd${row.id}`}>
                                {row.detailColumns && expandedRow === row.id ? (
                                    row.detailColumns.length === 1 ? (
                                        <td
                                            colSpan={row.columns.length + (hasCheckboxes ? 1 : 0) + (hasDetails ? 1 : 0)}
                                            className={styles.detailCell}
                                        >
                                            {row.detailColumns[0]}
                                        </td>
                                    ) : (
                                        row.detailColumns.map((e, index) => {
                                            return (
                                                <td key={index}>
                                                    <div>{e}</div>
                                                </td>
                                            );
                                        })
                                    )
                                ) : (
                                    <></>
                                )}
                            </tr>
                        )}
                    </Fragment>
                )),

        [
            tblData,
            hasPagination,
            pageSize,
            paginationData,
            page,
            hasCheckboxes,
            onRowToggleSelection,
            tblCheckedRows,
            onRowCheckboxClick,
            hasDetails,
            expandedRow,
            tblHeaders,
        ],
    );

    const pagination = (paginationData ? paginationData.totalItems > paginationData.pageSize : tblData.length > pageSize) ? (
        <Pagination size="sm" aria-label="Navigation">
            <PaginationItem disabled={(paginationData ? paginationData.page : page) === 1}>
                <PaginationLink first onClick={firstPage} />
            </PaginationItem>

            <PaginationItem disabled={(paginationData ? paginationData.page : page) === 1}>
                <PaginationLink previous onClick={prevPage} />
            </PaginationItem>

            <PaginationItem active>
                <PaginationLink>{paginationData ? paginationData.page : page}</PaginationLink>
            </PaginationItem>

            <PaginationItem disabled={paginationData ? paginationData.page === paginationData.totalPages : page === totalPages}>
                <PaginationLink next onClick={nextPage} />
            </PaginationItem>

            <PaginationItem disabled={paginationData ? paginationData.page === paginationData.totalPages : page === totalPages}>
                <PaginationLink last onClick={lastPage} />
            </PaginationItem>
        </Pagination>
    ) : undefined;

    return (
        <div className={styles.customTable}>
            {canSearch ? (
                <>
                    <div className="fa-pull-right mt-n-xs">
                        <Input id="search" placeholder="Search" onChange={(event) => setSearchKey(event.target.value)} />
                    </div>
                    <br />
                    <br />
                </>
            ) : (
                <></>
            )}
            <div className="table-responsive">
                <Table className={cx('table-hover', styles.logsTable)} size="sm">
                    {!hasHeader ? (
                        <></>
                    ) : (
                        <thead>
                            <tr>{header}</tr>
                        </thead>
                    )}
                    <tbody>{body}</tbody>
                </Table>
            </div>
            {!hasPagination ? (
                <></>
            ) : (
                <div className={styles.paginationContainer}>
                    <div>
                        {tblData?.length ? (
                            <Input type="select" value={paginationData ? paginationData.pageSize : pageSize} onChange={onPageSizeChange}>
                                {paginationData ? (
                                    paginationData.itemsPerPageOptions.map((option) => <option key={option}>{option}</option>)
                                ) : (
                                    <>
                                        <option>10</option>
                                        <option>20</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </>
                                )}
                            </Input>
                        ) : (
                            <></>
                        )}
                    </div>

                    {pagination}

                    {tblData?.length ? (
                        <div style={{ textAlign: 'right' }}>
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
                        <div>No items to show</div>
                    )}
                </div>
            )}
            {newRowWidgetProps && (
                <NewRowWidget
                    selectHint={newRowWidgetProps.selectHint}
                    immidiateAdd={newRowWidgetProps.immidiateAdd}
                    isBusy={newRowWidgetProps.isBusy}
                    newItemsList={newRowWidgetProps.newItemsList}
                    onAddClick={newRowWidgetProps.onAddClick}
                />
            )}
        </div>
    );
}

export default CustomTable;
