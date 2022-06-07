import cx from "classnames";
import React, { useCallback, useState, useEffect, useMemo, } from "react";
import { Input, Pagination, PaginationItem, PaginationLink, Table, } from "reactstrap";

import styles from "./CustomTable.module.scss";
import { jsxInnerText } from "utils/jsxInnerText";


export interface TableHeader {
   id: string;
   content: string | JSX.Element
   sortable?: boolean;
   sort?: "asc" | "desc";
   width?: string;
}

export interface TableDataRow {
   id: number | string;
   columns: (string | JSX.Element)[];
}

interface Props {
   headers: TableHeader[];
   data: TableDataRow[];
   hasCheckboxes?: boolean;
   hasPagination?: boolean;
   onCheckedRowsChanged?: (checkedRows: (string | number)[]) => void;
}


function CustomTable({
   headers,
   data,
   hasCheckboxes,
   hasPagination,
   onCheckedRowsChanged
}: Props) {

   const [tblHeaders, setTblHeaders] = useState<TableHeader[]>();
   const [tblData, setTblData] = useState<TableDataRow[]>(data);
   const [tblCheckedRows, setTblCheckedRows] = useState<(string | number)[]>([]);

   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [searchKey, setSearchKey] = useState<string>("");

   const firstPage = useCallback(() => setPage(1), [setPage]);
   const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);
   const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
   const lastPage = useCallback(() => setPage(totalPages), [setPage, totalPages]);


   useEffect(
      () => { setTblHeaders(headers); },
      [headers]
   );


   useEffect(

      () => {
         setTblData(data);
         setTblCheckedRows(tblCheckedRows.filter(row => data.find(data => data.id === row)));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [data]

   );


   useEffect(

      () => {
         setTotalPages(Math.ceil(tblData.length / pageSize))
      },
      [tblData, pageSize]

   );


   const onRowCheckboxClick = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>) => {

         const checkedRow = e.target.getAttribute("data-id");
         const checkedRows = tblData.filter(row => tblCheckedRows.includes(row.id)).map(row => row.id);

         if (e.target.checked) {
            if (checkedRow) checkedRows.push(checkedRow)
         } else {
            if (checkedRow) checkedRows.splice(checkedRows.indexOf(checkedRow), 1);
         }

         setTblCheckedRows(checkedRows);
         if (onCheckedRowsChanged) onCheckedRowsChanged(checkedRows);

      }, [tblData, tblCheckedRows, onCheckedRowsChanged]

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


   const onColumnSortClick = useCallback(

      (e: React.MouseEvent<HTMLTableCellElement>) => {

         if (!tblHeaders) return;

         const sortColumn = e.currentTarget.getAttribute("data-id");
         const hdr = tblHeaders?.find(header => header.id === sortColumn);
         if (!hdr) return;

         const sort = hdr.sort === "asc" ? "desc" : "asc";
         const column = tblHeaders?.findIndex(header => header.id === sortColumn);
         if (column === undefined || column === -1) return;

         const headers: TableHeader[] = tblHeaders.map(
            header => ({
               id: header.id,
               content: header.content,
               sortable: header.sortable,
               sort: header.id === sortColumn ? sort : undefined,
            })
         )

         const sortedData = [...tblData].sort(
            (a, b) => {
               const aVal = typeof a.columns[column] === "string" ? a.columns[column] : jsxInnerText(a.columns[column] as JSX.Element);
               const bVal = typeof b.columns[column] === "string" ? b.columns[column] : jsxInnerText(b.columns[column] as JSX.Element);
               if (aVal === bVal) return 0;
               if (aVal < bVal) return sort === "asc" ? -1 : 1;
               return sort === "asc" ? 1 : -1;
            }
         )

         setTblHeaders(headers);
         setTblData(sortedData);

      }, [tblHeaders, tblData]

   );


   const onPageSizeChange = useCallback(

      (event: React.ChangeEvent<HTMLInputElement>) => {
         setPageSize(+event.target.value);
         setPage(1);
      },
      [setPageSize]

   );


   const header = useMemo(

      () => (hasCheckboxes ? [{ id: "__checkbox__", content: "" }, ...tblHeaders || []] : tblHeaders || []).map(

         header => (

            <th key={header.id} {...(header.sortable ? { onClick: onColumnSortClick } : {})} data-id={header.id}>

               {
                  header.id === "__checkbox__" ? (

                     <input type="checkbox" checked={tblCheckedRows.length === tblData.length} onChange={onCheckAllCheckboxClick} />

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

         )

      ),
      [hasCheckboxes, tblHeaders, tblCheckedRows, tblData, onColumnSortClick, onCheckAllCheckboxClick]
   );



   const body = useMemo(

      () => (
         searchKey

            ? tblData.filter(
               row => {
                  let rowStr = "";
                  row.columns.forEach(col => rowStr += typeof col === "string" ? col : jsxInnerText(col as JSX.Element));
                  return rowStr.toLowerCase().includes(searchKey.toLowerCase());
               }
            )
            : tblData).map(

               row => (

                  <tr key={row.id}>

                     {!hasCheckboxes ? (<></>) : (
                        <td>
                           <input type="checkbox" checked={tblCheckedRows.includes(row.id)} onChange={onRowCheckboxClick} data-id={row.id} />
                        </td>
                     )}


                     {row.columns.map(
                        (column, index) => (
                           <td key={index}>{column}</td>
                        )
                     )}

                  </tr>

               )

            ),
      [tblCheckedRows, tblData, onRowCheckboxClick, hasCheckboxes, searchKey]

   );


   const pagination = tblData.length > pageSize ? (

      <Pagination size="sm" aria-label="Navigation">

         <PaginationItem disabled={page === 1}>
            <PaginationLink first onClick={firstPage} />
         </PaginationItem>

         <PaginationItem disabled={page === 1}>
            <PaginationLink previous onClick={prevPage} />
         </PaginationItem>

         <PaginationItem active>
            <PaginationLink>{page}</PaginationLink>
         </PaginationItem>

         <PaginationItem disabled={page === totalPages}>
            <PaginationLink next onClick={nextPage} />
         </PaginationItem>

         <PaginationItem disabled={page === totalPages}>
            <PaginationLink last onClick={lastPage} />
         </PaginationItem>

      </Pagination>

   ) : undefined;


   return (

      <div>
         <div className="pull-right mt-n-xs">
            <Input id="search" placeholder="Search" onChange={(event) => setSearchKey(event.target.value)} />
         </div>

         <br />
         <br />

         <div className="table-responsive">
            <Table className={cx("table", styles.logsTable)} size="sm">
               <thead><tr>{header}</tr></thead>
               <tbody>{body}</tbody>
            </Table>
         </div>


         {!hasPagination ? <></> : (

            <div className={styles.paginationContainer}>

               <div>
                  <Input type="select" value={pageSize} onChange={onPageSizeChange}>
                     <option>10</option>
                     <option>20</option>
                     <option>50</option>
                     <option>100</option>
                  </Input>
               </div>

               {pagination}

               <span>
                  {`Showing ${(page - 1) * pageSize + 1} to ${page !== totalPages ? page * pageSize : tblData.length % pageSize || pageSize} of ${tblData.length} entries`}
               </span>

            </div>

         )}

      </div>

   );
}

export default CustomTable;
