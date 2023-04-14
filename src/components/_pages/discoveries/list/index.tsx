import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Container } from "reactstrap";

import { actions, selectors } from "ducks/discoveries";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import DiscoveriesFilter from "../DiscoveriesFilter";
import DiscoveryStatus from "../DiscoveryStatus";

function DiscoveryList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const discoveries = useSelector(selectors.discoveries);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);

    const totalItems = useSelector(selectors.totalItems);
    const currentFilters = useSelector(selectors.currentFilters);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const isBusy = isFetching || isDeleting || isBulkDeleting;

    useEffect(() => {
        setPageNumber(1);
    }, [currentFilters]);

    useEffect(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
    }, [dispatch]);

    useEffect(() => {
        if (!currentFilters) return;
        dispatch(actions.listDiscoveries({ itemsPerPage: pageSize, pageNumber, filters: currentFilters }));
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
    }, [dispatch, currentFilters, pageSize, pageNumber]);

    const onPageSizeChanged = useCallback(
        (pageSize: number) => {
            setPageSize(pageSize);
            setPageNumber(1);
        },
        [setPageSize, setPageNumber],
    );

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const onDeleteConfirmed = useCallback(() => {
        setConfirmDelete(false);
        dispatch(actions.bulkDeleteDiscovery({ uuids: checkedRows }));
    }, [dispatch, checkedRows]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "plus",
                disabled: false,
                tooltip: "Create",
                onClick: () => {
                    onAddClick();
                },
            },
            {
                icon: "trash",
                disabled: checkedRows.length === 0,
                tooltip: "Delete",
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
        ],
        [checkedRows, onAddClick],
    );

    const title = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons} />
                </div>

                <h5 className="mt-0">
                    <span className="fw-semi-bold">Discovery Store</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const discoveriesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Name",
                sortable: true,
                sort: "asc",
                id: "discoveryName",
                width: "auto",
            },
            {
                content: "Discovery Provider",
                align: "center",
                sortable: true,
                id: "discoveryProvider",
                width: "15%",
            },
            {
                content: "Kinds",
                align: "center",
                sortable: true,
                id: "kinds",
                width: "15%",
            },
            {
                content: "Status",
                align: "center",
                sortable: true,
                id: "status",
                width: "15%",
            },
            {
                content: "Total Certificates",
                align: "center",
                sortable: true,
                sortType: "numeric",
                id: "totalCertificates",
                width: "15%",
            },
        ],
        [],
    );

    const discoveryList: TableDataRow[] = useMemo(
        () =>
            discoveries.map((discovery) => ({
                id: discovery.uuid,

                columns: [
                    <Link to={`./detail/${discovery.uuid}`}>{discovery.name}</Link>,

                    <Badge color="primary">{discovery.connectorName}</Badge>,

                    <Badge color="secondary">{discovery.kind}</Badge>,

                    <DiscoveryStatus status={discovery.status} />,

                    discovery.totalCertificatesDiscovered?.toString() || "0",
                ],
            })),
        [discoveries],
    );

    const paginationData = useMemo(
        () => ({
            page: pageNumber,
            totalItems: totalItems,
            pageSize: pageSize,
            loadedPageSize: pageSize,
            totalPages: Math.ceil(totalItems / pageSize),
            itemsPerPageOptions: [10, 20, 50, 100, 200, 500, 1000],
        }),
        [pageNumber, totalItems, pageSize],
    );

    return (
        <Container className="themed-container" fluid>
            <DiscoveriesFilter />

            <Widget title={title} busy={isBusy}>
                <br />

                <CustomTable
                    headers={discoveriesRowHeaders}
                    data={discoveryList}
                    onCheckedRowsChanged={setCheckedRows}
                    hasCheckboxes={true}
                    hasPagination={true}
                    paginationData={paginationData}
                    onPageChanged={setPageNumber}
                    onPageSizeChanged={onPageSizeChanged}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? "Discoveries" : "a Discovery"}`}
                body={`You are about to delete ${checkedRows.length > 1 ? "Discoveries" : "a Discovery"}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}

export default DiscoveryList;
