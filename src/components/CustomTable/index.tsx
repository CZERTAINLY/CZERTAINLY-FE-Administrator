import cx from "classnames";
import React, { useCallback, useState, useEffect, useMemo, Fragment, } from "react";
import { FormText, Input, Pagination, PaginationItem, PaginationLink, Table, } from "reactstrap";

import styles from "./CustomTable.module.scss";
import { jsxInnerText } from "utils/jsxInnerText";


export interface TableHeader {
   id: string;
   content: string | JSX.Element;
   align?: "left" | "center" | "right";
   sortable?: boolean;
   sort?: "asc" | "desc";
   sortType?: "string" | "numeric" | "date";
   width?: string;
}


export interface TableDataRow {
   id: number | string;
   columns: (string | JSX.Element)[];
   detailColumns?: (string | JSX.Element)[];
}


interface Props {
   headers: TableHeader[];
   data: TableDataRow[];
   canSearch?: boolean;
   hasHeader?: boolean;
   hasCheckboxes?: boolean;
   hasPagination?: boolean;
   hasDetails?: boolean;
   paginationData?: {
      page: number;
      totalItems: number;
      pageSize: number;
      totalPages: number;
      itemsPerPageOptions: number[];
   }
   onCheckedRowsChanged?: (checkedRows: (string | number)[]) => void;
   onPageSizeChanged?: (pageSize: number) => void;
   onPageChanged?: (page: number) => void;
}


function CustomTable({
   headers,
   data,
   canSearch,
   hasHeader = true,
   hasCheckboxes,
   hasPagination,
   hasDetails,
   paginationData,
   onCheckedRowsChanged,
   onPageSizeChanged,
   onPageChanged,
}: Props) {

   const [tblHeaders, setTblHeaders] = useState<TableHeader[]>();
   const [tblData, setTblData] = useState<TableDataRow[]>(data);
   const [tblCheckedRows, setTblCheckedRows] = useState<(string | number)[]>([]);

   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);

   const [searchKey, setSearchKey] = useState<string>("");
   const [sortColumn, setSortColumn] = useState<string>("");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

   const [expandedRow, setExpandedRow] = useState<string | number>();


   const firstPage = useCallback(
      () => {

         if (paginationData) {
            if (onPageChanged) onPageChanged(1);
         } else {
            setPage(1);
         }

      },
      [onPageChanged, paginationData]
   );


   const prevPage = useCallback(
      () => {

         if (paginationData) {
            if (onPageChanged) onPageChanged(paginationData.page - 1);
         } else {
            setPage(page - 1)
         }

      },
      [onPageChanged, page, paginationData]
   );


   const nextPage = useCallback(
      () => {

         if (paginationData) {
            if (onPageChanged) onPageChanged(paginationData.page + 1);
         } else {
            setPage(page + 1)
         }
      },
      [onPageChanged, page, paginationData]
   );


   const lastPage = useCallback(
      () => {

         if (paginationData) {
            if (onPageChanged) onPageChanged(paginationData.totalPages);
         } else {
            setPage(totalPages)
         }

      },
      [onPageChanged, paginationData, totalPages]
   );


   useEffect(
      () => {
         setTblHeaders(headers);
      },
      [headers]

   );


   useEffect(
      () => {

         if (!tblHeaders) return;

         const sortCol = tblHeaders.find(h => h.sort);

         if (sortCol) {
            setSortColumn(sortCol.id);
            setSortOrder(sortCol.sort || "asc");
         }
      },
      [tblHeaders]
   );


   useEffect(

      () => {

         const filtered = searchKey
            ?
            [...data].filter(
               row => {
                  let rowStr = "";
                  row.columns.forEach(col => rowStr += typeof col === "string" ? col : jsxInnerText(col as JSX.Element));
                  return rowStr.toLowerCase().includes(searchKey.toLowerCase());
               }
            )

            :
            [...data]
            ;

         const sortCol = tblHeaders ? tblHeaders.find(h => h.sort) : undefined;

         if (!tblHeaders || !sortCol) {

            setTblCheckedRows(tblCheckedRows.filter(row => data.find(data => data.id === row)));
            setTblData(filtered);
            return;

         }

         const sortColumnIndex = tblHeaders.findIndex(h => h.sort);

         if (sortColumnIndex >= 0) {

            const sortDirection = sortCol.sort || "asc";

            filtered.sort(

               (a, b) => {

                  const aVal = typeof a.columns[sortColumnIndex] === "string" ? (a.columns[sortColumnIndex] as string).toLowerCase() : jsxInnerText(a.columns[sortColumnIndex] as JSX.Element).toLowerCase();
                  const bVal = typeof b.columns[sortColumnIndex] === "string" ? (b.columns[sortColumnIndex] as string).toLowerCase() : jsxInnerText(b.columns[sortColumnIndex] as JSX.Element).toLowerCase();

                  switch (sortCol.sortType) {

                     case "date":
                        const aDate = new Date(aVal.replace(/ at /g, " "));
                        const bDate = new Date(bVal.replace(/ at /g, " "));
                        return sortDirection === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();

                     case "numeric":
                        return sortDirection === "asc" ? parseFloat(aVal) - parseFloat(bVal) : parseFloat(bVal) - parseFloat(aVal);

                     default:
                        if (aVal === bVal) return 0;
                        return aVal > bVal ? (sortDirection === "asc" ? 1 : -1) : (sortDirection === "asc" ? -1 : 1);

                  }

               }

            );
         }

         setTblData(filtered);
         setTblCheckedRows(tblCheckedRows.filter(row => data.find(data => data.id === row)));

      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [data, searchKey, sortColumn, sortOrder]

   );


   useEffect(

      () => {
         setTotalPages(Math.ceil(tblData.length / pageSize))
      },
      [tblData, pageSize]

   );

   const onCheckAllCheckboxClick = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>) => {

         if (!e.target.checked) {
            setTblCheckedRows([]);
            if (onCheckedRowsChanged) onCheckedRowsChanged([]);
            return;
         }

         const checkedRows = tblData.map(row => row.id);
         setTblCheckedRows(checkedRows);
         if (onCheckedRowsChanged) onCheckedRowsChanged(checkedRows);

      }, [tblData, onCheckedRowsChanged]

   );


   const onRowToggleSelection = useCallback(

      (e: React.MouseEvent<HTMLTableRowElement>) => {

         if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") return;

         const id = e.currentTarget.getAttribute("data-id");
         if (!id) return;

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
      [tblCheckedRows, setTblCheckedRows, onCheckedRowsChanged]

   );


   const onRowCheckboxClick = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>) => {

         const id = e.target.getAttribute("data-id");
         if (!id) return;

         const checked = [...tblCheckedRows];

         if (e.target.checked) {
            if (id && !checked.includes(id)) checked.push(id)
         } else {
            if (id && checked.includes(id)) checked.splice(checked.indexOf(id), 1);
         }

         setTblCheckedRows(checked);
         if (onCheckedRowsChanged) onCheckedRowsChanged(checked);

      }, [tblCheckedRows, onCheckedRowsChanged]

   );



   const onColumnSortClick = useCallback(

      (e: React.MouseEvent<HTMLTableCellElement>) => {

         if (!tblHeaders) return;

         const sortColumn = e.currentTarget.getAttribute("data-id");

         const hdr = tblHeaders?.find(header => header.id === sortColumn);
         if (!hdr) return;

         const column = tblHeaders?.findIndex(header => header.id === sortColumn);
         if (column === undefined || column === -1) return;

         const sort = hdr.sort === "asc" ? "desc" : "asc";

         const headers: TableHeader[] = tblHeaders.map(
            header => ({
               ...header,
               sort: header.id === sortColumn ? sort : undefined,
            })
         )

         setTblHeaders(headers);

      },
      [tblHeaders]

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
      [onPageSizeChanged]

   );


   const header = useMemo(

      () => {

         const columns = tblHeaders ? [...tblHeaders] : [];

         if (hasCheckboxes) columns.unshift({ id: "__checkbox__", content: "", sortable: false, width: "0%" });
         if (hasDetails) columns.push({ id: "details", content: "Details", sortable: false, width: "100%" });

         return columns.map(

            header => (

               <Fragment key={header.id}>

                  <th className={styles.header}
                     data-id={header.id}
                     {...(header.sortable ? { onClick: onColumnSortClick } : {})}
                     style={{ ...(header.width ? { width: header.width } : {}), ...header.align ? { textAlign: header.align } : {} }}
                  >

                     {
                        header.id === "__checkbox__" ? (

                           <input type="checkbox" checked={tblCheckedRows.length === tblData.length && tblData.length > 0} onChange={onCheckAllCheckboxClick} />

                        ) : header.sortable ? (

                           <>
                              {header.content}
                              &nbsp;
                              {header.sort === "asc"
                                 ?
                                 <>
                                    <i className="fa fa-arrow-up" />
                                    <i className="fa fa-arrow-down" style={{ opacity: 0.25 }} />
                                 </>
                                 :
                                 header.sort === "desc"
                                    ?
                                    <>
                                       <i className="fa fa-arrow-up" style={{ opacity: 0.25 }} />
                                       <i className="fa fa-arrow-down" />
                                    </>
                                    :
                                    <>
                                       <i className="fa fa-arrow-up" style={{ opacity: 0.25 }} />
                                       <i className="fa fa-arrow-down" style={{ opacity: 0.25 }} />
                                    </>
                              }
                           </>

                        ) : (

                           header.content

                        )

                     }

                  </th>


               </Fragment>


            )

         )
      },
      [hasCheckboxes, hasDetails, tblHeaders, tblCheckedRows, tblData, onColumnSortClick, onCheckAllCheckboxClick]
   );



   const body = useMemo(

      () => tblData.filter(

         (row, index) => {
            if (!hasPagination) return true;
            if (pageSize === 0) return true;
            return paginationData ? true : index >= (page - 1) * pageSize && index < page * pageSize;
         }

      ).map(

         (row, index) => (

            <Fragment key={row.id}>

               <tr {...(hasCheckboxes ? { onClick: onRowToggleSelection } : {})} data-id={row.id} >

                  {!hasCheckboxes ? (<></>) : (
                     <td>
                        <input type="checkbox" checked={tblCheckedRows.includes(row.id)} onChange={onRowCheckboxClick} data-id={row.id} />
                     </td>
                  )}

                  {row.columns.map(

                     (column, index) => (

                        <td key={index} className={styles.dataCell} style={tblHeaders && tblHeaders[index].align ? { textAlign: tblHeaders[index].align } : {}}>

                           <div>{column ? column : <>&nbsp;</>}</div>

                           {
                              row.detailColumns && row.detailColumns[index] && expandedRow === row.id ? (
                                 <div className={styles.detail}>{row.detailColumns[index]}</div>
                              ) : (
                                 <></>
                              )
                           }

                        </td>

                     )

                  )}

                  {!hasDetails ? (<></>) : (

                     <td className="w-25">

                        <div className={styles.showMore} onClick={() => expandedRow === row.id ? setExpandedRow(undefined) : setExpandedRow(row.id)}>
                           {expandedRow === row.id ? "Show less..." : "Show more..."}
                        </div>

                        {
                           row.detailColumns && row.detailColumns[headers.length] && expandedRow === row.id ? (
                              <div className={styles.detail}>{row.detailColumns[headers.length]}</div>
                           ) : (
                              <></>
                           )
                        }

                     </td>
                  )}

               </tr>

            </Fragment>


         )

      ),

      [tblData, hasPagination, pageSize, paginationData, page, hasCheckboxes, onRowToggleSelection, tblCheckedRows, onRowCheckboxClick, hasDetails, expandedRow, headers.length, tblHeaders]

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


   const canSort: boolean = useMemo(
      () => headers?.some(header => header.sortable) || false,
      [headers]
   )


   return (

      <div className={styles.customTable}>

         {
            canSearch
               ?
               <>
                  <div className="pull-right mt-n-xs">
                     <Input id="search" placeholder="Search" onChange={(event) => setSearchKey(event.target.value)} />
                  </div>
                  <br />
                  <br />
               </>

               :
               <></>
         }


         <div className="table-responsive">
            <Table className={cx("table-hover", styles.logsTable)} size="sm">
               {!hasHeader ? <></> : <thead><tr>{header}</tr></thead>}
               <tbody>{body}</tbody>
            </Table>
         </div>

         {paginationData && (canSearch || canSort) ? <div><FormText>Please note the search and sort functionality is applied only to the the single data page<br /><br /></FormText></div> : <></>}

         {!hasPagination ? <></> : (

            <div className={styles.paginationContainer}>

               <div>
                  <Input type="select" value={paginationData ? paginationData.pageSize : pageSize} onChange={onPageSizeChange}>

                     {
                        paginationData
                           ?
                           paginationData.itemsPerPageOptions.map(
                              option => <option key={option}>{option}</option>
                           )
                           :
                           <>
                              <option>10</option>
                              <option>20</option>
                              <option>50</option>
                              <option>100</option>
                           </>
                     }

                  </Input>
               </div>

               {pagination}

               <div style={{ textAlign: "right" }}>

                  {
                     paginationData
                        ?
                        <div>
                           Showing {(paginationData.page - 1) * paginationData.pageSize + 1} to {(paginationData.page - 1) * paginationData.pageSize + paginationData.pageSize > paginationData.totalItems ? paginationData.totalItems : (paginationData.page - 1) * paginationData.pageSize + paginationData.pageSize} items of {paginationData.totalItems}
                        </div>
                        :
                        <div>
                           Showing {(page - 1) * pageSize + 1} to {(page - 1) * pageSize + pageSize > tblData.length ? tblData.length : (page - 1) * pageSize + pageSize} of {tblData.length} entries
                        </div>
                  }

                  {searchKey && (data.length - tblData.length > 0) ? (<div>{data.length - tblData.length} of loaded entries filtered</div>) : <></>}

               </div>


            </div>

         )}

      </div>

   );
}

export default CustomTable;
