import cx from "classnames";
import React, { useCallback, useState, Fragment, useEffect, ReactElement, } from "react";
import { Input, Pagination, PaginationItem, PaginationLink, Table, } from "reactstrap";

import SortColumnHeader from "components/SortColumnHeader";
import SortTableHeader from "components/SortTableHeader";

import styles from "./CustomTable.module.scss";
import { checkAllHandler, checkHandler } from "utils/checkbox";


export interface CustomTableHeaderColumn {
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

interface Column {
   [key: string]: ColumnContent;
}

interface Row {
   id?: string;
   column: Column;
   data?: any;
}

interface Props {
   headers: CustomTableHeaderColumn[];
   rows: Row[];
   checkbox?: boolean;
   checkedRows: any;
   onCheckedRowsChanged: Function;
   data: any;
   sourceCheckHandler?: Function;
}


function CustomTable({
   headers,
   rows,
   checkbox = true,
   checkedRows,
   onCheckedRowsChanged: checkedRowsFunction,
   data,
   sourceCheckHandler,
}: Props) {


   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [searchKey, setSearchKey] = useState<string>("");
   const [updatedHeaders, setUpdatedHeaders] = useState(headers);
   const [tableRows, setTableRows] = useState<JSX.Element[]>([]);
   const [pageLength, setPageLength] = useState(0);


   const firstPage = useCallback(() => setPage(1), [setPage]);
   const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);
   const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
   const lastPage = useCallback(() => setPage(totalPages), [setPage, totalPages]);


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


   useEffect(

      () => {
         setTotalPages(Math.ceil(rows.length / pageSize))
      }

      , [rows, pageSize]

   );


   useEffect(

      () => {

         let updatedHeaders = [...headers];

         if (!checkbox) return;

         updatedHeaders.unshift({
            content: "checkbox",
            sort: false,
            width: "2%",
            styledContent: (

               <input
                  id="checkAllCheckBox"
                  type="checkbox"
                  checked={checkedRows.length === tableRows.length && tableRows.length > 0}
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
               />

            ),
         });

         setUpdatedHeaders(updatedHeaders);

      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [tableRows.length, checkedRows, data, searchKey, page, pageSize, checkedRowsFunction]

   );


   useEffect(

      () => {

         let spliceRows: Row[] = rows;

         if (searchKey) spliceRows = rows.filter(row => getMergedRowContent(row).includes(searchKey.toLowerCase()));

         setPageLength(spliceRows.length);
         setTotalPages(Math.ceil(spliceRows.length / pageSize));

         spliceRows = spliceRows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

         let updTableRows = spliceRows.map(

            row => (

               <Fragment key={row.id}>

                  <tr>

                     {updatedHeaders.map(

                        header => (

                           <td key={header.id || header.content}>
                              {
                                 header.content !== "checkbox" ? (
                                    row.column[header?.content]?.styledContent || row.column[header?.content]?.content || null
                                 ) : (
                                    <input
                                       type="checkbox"
                                       name={row.data?.uuid?.toString()}
                                       onChange={sourceCheckHandler ? () => sourceCheckHandler(row.data) : () => handleCheck(row.data)}
                                       checked={checkedRows.includes(row.data?.uuid?.toString())}
                                    />

                                 )}
                           </td>

                        )
                     )}

                  </tr>

               </Fragment>

            )

         );


         setTableRows(updTableRows);

      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [rows, searchKey, checkedRows, page, pageSize, sourceCheckHandler, totalPages, updatedHeaders]
   );


   const headerRow = () => {

      return updatedHeaders.map(

         (header) => {

            return header.sort ? (
               <SortColumnHeader id={header.id || header.content} text={header.content} />
            ) : (
               <th key={header.id || header.content}>{header.styledContent ? header.styledContent : header.content}</th>
            );

         }

      );

   };


   const getMergedRowContent = (row: Row) => {

      return updatedHeaders
         .map(
            (header) => row.column[header?.content]?.content?.toLowerCase() || ""
         )
         .join();

   };


   const pagination = rows.length > pageSize ? (

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

            {pagination}

            <span>
               {`Showing ${(page - 1) * pageSize + 1} to ${page !== totalPages ? page * pageSize : tableRows.length % pageSize || pageSize} of ${pageLength} entries`}
            </span>


         </div>



      </div>

   );
}

export default CustomTable;
