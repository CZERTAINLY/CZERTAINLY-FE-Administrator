import cx from "classnames";
import React, { useCallback, useState, useEffect, Fragment } from "react";
import {
  Container,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
} from "reactstrap";
import { useDispatch } from "react-redux";

import { backendClient, mockClient } from "api";
import { createErrorAlertAction } from "ducks/alerts";
import { AuditLog } from "models";
import AuditLogsFilters, {
  FormValues as FilterValues,
} from "components/AuditLogsFilters";
import ObjectValues from "components/ObjectValues";
import Widget from "components/Widget";
import SortColumnHeader from "components/SortColumnHeader";
import SortTableHeader from "components/SortTableHeader";
import Spinner from "components/Spinner";

import styles from "./auditLogs.module.scss";
import { dateFormatter } from "utils/dateUtil";

const useMockSwitch = process.env.REACT_APP_USE_MOCK_API;
const useMock = useMockSwitch ? +useMockSwitch !== 0 : false;
const apiClients = useMock ? mockClient : backendClient;

function AuditLogs() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logData, setLogData] = useState<AuditLog[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<{ [key: string]: string } | undefined>(
    undefined
  );
  const [objects, setObjects] = useState<string[]>([]);
  const [operations, setOperations] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    apiClients.auditLogs.getObjects().subscribe(
      (data) => setObjects(data),
      () =>
        dispatch(
          createErrorAlertAction(
            "Failed to get list of objects for filtering",
            { type: "@@auditLogs/GET_OBJECTS_REQUEST" }
          )
        )
    );
    apiClients.auditLogs.getOperations().subscribe(
      (data) => setOperations(data),
      () =>
        dispatch(
          createErrorAlertAction(
            "Failed to get list of operations for filtering",
            { type: "@@auditLogs/GET_OPERATIONS_REQUEST" }
          )
        )
    );
    apiClients.auditLogs.getStatuses().subscribe(
      (data) => setStates(data),
      () =>
        dispatch(
          createErrorAlertAction(
            "Failed to get list of operation states for filtering",
            { type: "@@auditLogs/GET_STATES_REQUEST" }
          )
        )
    );
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    apiClients.auditLogs.getLogs(page - 1, pageSize, sort, filters).subscribe(
      (data) => {
        setLogData(data.items);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      },
      () => {
        setLoading(false);
        dispatch(
          createErrorAlertAction("Failed to get log data", {
            type: "@@auditLogs/GET_REQUEST",
          })
        );
      }
    );
  }, [page, pageSize, sort, filters, dispatch]);

  const firstPage = useCallback(() => setPage(1), [setPage]);
  const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);
  const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
  const lastPage = useCallback(
    () => setPage(totalPages),
    [setPage, totalPages]
  );
  const onPageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const lineBreakFormatter = (content: any) => {
    return <div style={{ wordBreak: "break-word" }}>{content}</div>;
  };

  const onClearFilters = useCallback(() => {
    setFilters(undefined);
  }, [setFilters]);

  const onFilters = useCallback(
    (filters: FilterValues) => {
      const filterValues = Object.entries(filters).reduce(
        (acc, [key, value]) =>
          value ? { ...acc, [key]: value.toString() } : acc,
        {}
      );
      setFilters(filterValues);
    },
    [setFilters]
  );

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
      <Widget title="Filter Audit Logs">
        <AuditLogsFilters
          operations={operations}
          operationStates={states}
          objects={objects}
          onClear={onClearFilters}
          onFilters={onFilters}
        />
      </Widget>

      <Widget title={auditLogsTitle}>
        <Table className={cx("table-hover", styles.logsTable)} size="sm">
          <SortTableHeader onSortChange={onSortChange}>
            <SortColumnHeader id="id" text={lineBreakFormatter("ID")} />
            <SortColumnHeader id="author" text={lineBreakFormatter("Author")} />
            <SortColumnHeader
              id="created"
              text={lineBreakFormatter("Created")}
            />
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
            {logData.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td>{item.id}</td>
                  <td>{lineBreakFormatter(item.author)}</td>
                  <td className={styles.dateCell}>
                    {dateFormatter(item.created)}
                  </td>
                  <td>{lineBreakFormatter(item.operationStatus)}</td>
                  <td>{lineBreakFormatter(item.origination)}</td>
                  <td>{lineBreakFormatter(item.affected)}</td>
                  <td>{lineBreakFormatter(item.objectIdentifier)}</td>
                  <td>{lineBreakFormatter(item.operation)}</td>
                  {item.additionalData ? (
                    <td
                      onClick={() =>
                        setExpandedRowId(
                          expandedRowId === item.id ? null : item.id
                        )
                      }
                    >
                      <span className={styles.showMore}>Show more...</span>
                    </td>
                  ) : (
                    <td>None</td>
                  )}
                </tr>
                <tr
                  className={cx(styles.detailRow, {
                    [styles.hidden]: expandedRowId !== item.id,
                  })}
                >
                  <td colSpan={9}>
                    <ObjectValues
                      obj={item.additionalData}
                      className={cx({
                        [styles.hidden]: expandedRowId !== item.id,
                      })}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </Table>
        <div className={styles.paginationContainer}>
          <div>
            <Label size="sm">Page size</Label>
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
            <PaginationItem disabled={page === totalPages}>
              <PaginationLink next onClick={nextPage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last onClick={lastPage} />
            </PaginationItem>
          </Pagination>
        </div>
      </Widget>
      <Spinner active={loading} />
    </Container>
  );
}

export default AuditLogs;
