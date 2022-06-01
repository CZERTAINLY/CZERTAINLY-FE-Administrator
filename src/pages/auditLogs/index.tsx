import React, { useCallback, useState, useEffect, Fragment } from "react";

import { Container, Input, Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import cx from "classnames";

import { useDispatch, useSelector } from "react-redux";

import { actions as auditLogActions } from "ducks/audit";
import { selectors } from "ducks/audit";

import { AuditLogModel } from "models";

import AuditLogsFilters, { FormValues as FilterValues, } from "components/AuditLogsFilters";
import ObjectValues from "components/ObjectValues";
import Widget from "components/Widget";
import SortColumnHeader from "components/SortColumnHeader";
import SortTableHeader from "components/SortTableHeader";

import styles from "./auditLogs.module.scss";
import { dateFormatter } from "utils/dateUtil";

const defaultPageSize = 10;

function AuditLogs() {

   const dispatch = useDispatch();

   const loadedPageNumber = useSelector(selectors.loadedPageNumber);
   const totalPages = useSelector(selectors.totalPagesAvailable);
   const isFetchingPageData = useSelector(selectors.isFetchingPageData);
   const isFetchingObjects = useSelector(selectors.isFetchingObjects);
   const isFetchingOperations = useSelector(selectors.isFetchingOperations);
   const isFetchingStatuses = useSelector(selectors.isFetchingStatuses);
   const logs = useSelector(selectors.pageData);
   const objects = useSelector(selectors.objects);
   const operations = useSelector(selectors.operations);
   const states = useSelector(selectors.statuses);

   const isBusy = isFetchingPageData || isFetchingObjects || isFetchingOperations || isFetchingStatuses;
   const isFilterBusy = isFetchingObjects || isFetchingOperations || isFetchingStatuses;

   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(defaultPageSize);

   const [logData, setLogData] = useState<{ [pageIndex: number]: AuditLogModel[] }>({});
   const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

   const [sort, setSort] = useState<string | undefined>(undefined);
   const [filters, setFilters] = useState<{ [key: string]: string } | undefined>(undefined);

   const firstPage = useCallback(() => setPage(1), [setPage]);
   const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);
   const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
   const lastPage = useCallback(() => setPage(totalPages || 0), [setPage, totalPages]);


   useEffect(() => {
      dispatch(auditLogActions.listObjects());
      dispatch(auditLogActions.listOperations());
      dispatch(auditLogActions.listStatuses());
   }, [dispatch]);


   // load when anything except page changes
   useEffect(() => {
      dispatch(auditLogActions.listLogs({ page: page - 1, size: pageSize, sort, filters }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [ pageSize, sort, filters, dispatch ]);

   // load when page changes but not loaded
   useEffect(() => {
      if (logData && logData[page - 1]) return;
      dispatch(auditLogActions.listLogs({ page: page - 1, size: pageSize, sort, filters }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [ logData, page ])


   useEffect(() => {

      if (loadedPageNumber === undefined) return;

      const data = { ...logData };
      data[loadedPageNumber] = logs;

      setLogData(data);

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [logs, loadedPageNumber]);


   const onPageSizeChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
         setLogData({});
         setPageSize(+event.target.value);
         setPage(1);
      },
      [setPageSize]
   );


   const onSortChange = useCallback(
      (sortColumn: string | null, direction: string | null) => {
         if (!sortColumn || !direction) {
            setSort(undefined);
         } else {
            setSort(`${sortColumn},${direction}`);
         }
      },
      [setSort]
   );


   const onFiltersChanged = useCallback(
      (filters: FilterValues) => {
         const filterValues = Object.entries(filters).reduce(
            (acc, [key, value]) =>
               value ? { ...acc, [key]: value.toString() } : acc,
            {}
         );

         setLogData({});
         setFilters(filterValues);
      },
      [setFilters]
   );


   const onClearFilters = useCallback(() => {
      setLogData({});
      setFilters(undefined);
   }, [setFilters]);


   const lineBreakFormatter = (content: any) => {
      return <div style={{ wordBreak: "break-word" }}>{content}</div>;
   };


   const queryString = filters
      ? Object.entries(filters)
         .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
         .join("&")
      : "";


   const auditLogsTitle = (
      <div className="d-flex justify-content-between align-items-center">
         <h5>
            <span className="fw-semi-bold">Audit Logs</span>
         </h5>
         <a
            href={`/api/v1/logs/export?${queryString}`}
            className={styles.exportButton}
         >
            Export
         </a>
      </div>
   );


   return (

      <Container className="themed-container" fluid>


         <Widget title="Filter Audit Logs" busy={isFilterBusy}>

            <AuditLogsFilters
               operations={operations}
               operationStates={states}
               objects={objects}
               onClear={onClearFilters}
               onFilters={onFiltersChanged}
            />

         </Widget>


         <Widget title={auditLogsTitle} busy={isBusy}>

            <Table className={cx("table-hover", styles.logsTable)} size="sm">

               <SortTableHeader onSortChange={onSortChange}>

                  <SortColumnHeader id="id" text={lineBreakFormatter("UUID")} />
                  <SortColumnHeader id="author" text={lineBreakFormatter("Author")} />
                  <SortColumnHeader id="created" text={lineBreakFormatter("Created")} />

                  <th>
                     <strong>{lineBreakFormatter("Operation Status")}</strong>
                  </th>

                  <th>
                     <strong>{lineBreakFormatter("Origination")}</strong>
                  </th>

                  <th>
                     <strong>{lineBreakFormatter("Affected Data")}</strong>
                  </th>

                  <th>
                     <strong>{lineBreakFormatter("Object Identifier")}</strong>
                  </th>

                  <th>
                     <strong>{lineBreakFormatter("Operation")}</strong>
                  </th>

                  <th>
                     <strong>{lineBreakFormatter("Additional Data")}</strong>
                  </th>

               </SortTableHeader>

               <tbody>

                  {!logData || !logData[page - 1] ? <></> : logData[page - 1].map(

                     (item) => (

                        <Fragment key={item.id}>

                           <tr>
                              <td>{item.id}</td>
                              <td>{lineBreakFormatter(item.author)}</td>
                              <td className={styles.dateCell}>{dateFormatter(item.created)}</td>
                              <td>{lineBreakFormatter(item.operationStatus)}</td>
                              <td>{lineBreakFormatter(item.origination)}</td>
                              <td>{lineBreakFormatter(item.affected)}</td>
                              <td>{lineBreakFormatter(item.objectIdentifier)}</td>
                              <td>{lineBreakFormatter(item.operation)}</td>

                              {item.additionalData ? (

                                 <td onClick={() => setExpandedRowId(expandedRowId === item.id ? null : item.id)}>

                                    <span className={styles.showMore}>Show more...</span>

                                 </td>
                              ) : (
                                 <td>None</td>
                              )}

                           </tr>

                           <tr className={cx(styles.detailRow, { [styles.hidden]: expandedRowId !== item.id, })}>

                              <td colSpan={9}>
                                 <ObjectValues obj={item.additionalData} className={cx({ [styles.hidden]: expandedRowId !== item.id })} />
                              </td>

                           </tr>

                        </Fragment>

                     )
                  )}

               </tbody>

            </Table>

            <div className={styles.paginationContainer}>

               <div>
                  <Input type="select" value={pageSize} onChange={onPageSizeChange}>
                     <option>10</option>
                     <option>20</option>
                     <option>50</option>
                     <option>100</option>
                  </Input>
               </div>

               <Pagination size="sm" aria-label="Audit Logs navigation">

                  <PaginationItem>
                     <PaginationLink first onClick={firstPage} />
                  </PaginationItem>

                  <PaginationItem disabled={page === 1}>
                     <PaginationLink previous onClick={prevPage} />
                  </PaginationItem>

                  <PaginationItem active>
                     <PaginationLink>{page}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem disabled={page >= (totalPages || 1)}>
                     <PaginationLink next onClick={nextPage} />
                  </PaginationItem>

                  <PaginationItem>
                     <PaginationLink last onClick={lastPage} />
                  </PaginationItem>

               </Pagination>


               <span>
                  {`Showing ${page} of ${totalPages || 1} pages`}
               </span>

            </div>


         </Widget>

      </Container>

   );

}

export default AuditLogs;
