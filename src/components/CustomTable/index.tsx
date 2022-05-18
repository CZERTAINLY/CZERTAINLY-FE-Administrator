import cx from "classnames";
import React, {
   useCallback,
   useState,
   Fragment,
   useEffect,
   ReactElement,
} from "react";
import {
   Input,
   Pagination,
   PaginationItem,
   PaginationLink,
   Table,
} from "reactstrap";

import SortColumnHeader from "components/SortColumnHeader";
import SortTableHeader from "components/SortTableHeader";

import styles from "./CustomTable.module.scss";
import { checkAllHandler, checkHandler } from "utils/checkbox";

export interface CustomTableHeaders {
   content: any;
   sort?: boolean;
   id?: string;
   styledContent?: ReactElement<any, any>;
   width?: string;
}

interface ColumnContent {
   id?: string;
   content?: any;
   styledContent: any;
   lineBreak?: boolean;
}

interface Rows {
   id?: string;
   column: Column;
   data?: any;
}

interface Props {
   headers: CustomTableHeaders[];
   rows: Rows[];
   checkbox?: boolean;
   checkedRows: any;
   checkedRowsFunction: Function;
   data: any;
   sourceCheckHandler?: Function;
   loadAllPages?: boolean;
}

export interface Column {
   [key: string]: ColumnContent;
}

function CustomTable({
   headers,
   rows,
   checkbox = true,
   checkedRows,
   checkedRowsFunction,
   data,
   sourceCheckHandler,
   loadAllPages = true,
}: Props) {
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [searchKey, setSearchKey] = useState<string>("");
   const [updatedHeaders, setUpdatedHeaders] = useState(headers);
   const [tableRows, setTableRows] = useState([]);
   const [pageLength, setPageLength] = useState(0);

   const firstPage = useCallback(() => setPage(1), [setPage]);
   const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);
   const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);

   const lastPage = useCallback(
      () => setPage(totalPages),
      [setPage, totalPages]
   );

   useEffect(() => {
      setTotalPages(Math.ceil(rows.length / pageSize));
   }, [rows, pageSize]);

   useEffect(() => {
      let updTableRows: any = [];

      let spliceRows = rows;
      if (searchKey) {
         spliceRows = [];
         for (let i of rows) {
            if (getMergedRowContent(i).includes(searchKey.toLowerCase())) {
               spliceRows.push(i);
            }
         }
      }
      setPageLength(spliceRows.length);
      setTotalPages(Math.ceil(spliceRows.length / pageSize));
      for (let row of spliceRows.slice(
         (page - 1) * pageSize,
         page !== totalPages
            ? page * pageSize
            : (page - 1) * pageSize + (spliceRows.length % pageSize) || pageSize
      )) {
         if (getMergedRowContent(row).includes(searchKey.toLowerCase())) {
            updTableRows.push(
               <Fragment key={row.id}>
                  <tr key={row.id}>
                     {updatedHeaders.map((header) => {
                        return (
                           <td>
                              {header.content !== "checkbox" ? (
                                 row.column[header?.content]?.styledContent ||
                                 row.column[header?.content]?.content ||
                                 null
                              ) : (
                                 <input
                                    type="checkbox"
                                    name={row.data?.uuid?.toString()}
                                    onChange={
                                       sourceCheckHandler
                                          ? () => sourceCheckHandler(row.data)
                                          : () => handleCheck(row.data)
                                    }
                                    checked={checkedRows.includes(
                                       row.data?.uuid?.toString()
                                    )}
                                 />
                              )}
                           </td>
                        );
                     })}
                  </tr>
               </Fragment>
            );
         }
      }
      setTableRows(updTableRows);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [
      rows,
      searchKey,
      checkedRows,
      page,
      pageSize,
      sourceCheckHandler,
      totalPages,
      updatedHeaders,
   ]);

   useEffect(() => {
      if (checkedRows.length === 0) {
         const ele = document.getElementById(
            "checkAllCheckBox"
         ) as HTMLInputElement;
         if (ele) {
            ele.checked = false;
         }
      } else if (checkedRows.length === rows.length) {
         const ele = document.getElementById(
            "checkAllCheckBox"
         ) as HTMLInputElement;
         if (ele) {
            ele.checked = true;
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [checkedRows]);

   useEffect(() => {
      let updatedHeaders = [...headers];
      if (checkbox) {
         updatedHeaders.unshift({
            content: "checkbox",
            sort: false,
            width: "2%",
            styledContent: (
               <input
                  id="checkAllCheckBox"
                  type="checkbox"
                  onChange={(event) =>
                     checkAllHandler(
                        event.target.checked,
                        rows,
                        searchKey,
                        pageSize,
                        page,
                        checkedRowsFunction,
                        updatedHeaders
                     )
                  }
               ></input>
            ),
         });
         setUpdatedHeaders(updatedHeaders);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data, searchKey, page, pageSize, checkedRowsFunction]);

   const handleCheck = (checkedRow: any) => {
      checkHandler(checkedRow, checkedRows, checkedRowsFunction);
   };

   const onPageSizeChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
         setPageSize(+event.target.value);
         setPage(1);
      },
      [setPageSize]
   );

   const headerRow = () => {
      return updatedHeaders.map((header) => {
         return header.sort ? (
            <SortColumnHeader
               id={header.id || header.content}
               text={header.content}
            />
         ) : (
            <th>{header.styledContent ? header.styledContent : header.content}</th>
         );
      });
   };

   const getMergedRowContent = (row: Rows) => {
      return updatedHeaders
         .map((header) => {
            return row.column[header?.content]?.content?.toLowerCase() || "";
         })
         .join();
   };

   return (
      <div>
         <div className="pull-right mt-n-xs">
            <Input
               id="search"
               placeholder="Search"
               onChange={(event) => setSearchKey(event.target.value)}
            />
         </div>
         <br />
         <br />
         <div className="table-responsive">
            <Table className={cx("table", styles.logsTable)} size="sm">
               <SortTableHeader>{headerRow()}</SortTableHeader>
               <tbody>{tableRows}</tbody>
            </Table>
         </div>
         <div className={styles.paginationContainer}>
            <div>
               <Input type="select" value={pageSize} onChange={onPageSizeChange}>
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
               </Input>
            </div>
            <Pagination size="sm" aria-label="Navigation">
               <PaginationItem>
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
               <PaginationItem>
                  <PaginationLink last onClick={lastPage} />
               </PaginationItem>
            </Pagination>
            {`Showing ${(page - 1) * pageSize + 1} to ${page !== totalPages
                  ? page * pageSize
                  : tableRows.length % pageSize || pageSize
               } of ${pageLength} entries`}
         </div>
      </div>
   );
}

export default CustomTable;
