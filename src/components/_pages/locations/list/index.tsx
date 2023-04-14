import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Container } from "reactstrap";

import { FilterEntity, selectors as filterSelectors } from "ducks/filters";
import { actions, selectors } from "ducks/locations";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import FilterWidget from "components/FilterWidget";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

function LocationList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const locations = useSelector(selectors.locations);

    const totalItems = useSelector(selectors.totalItems);
    const currentFilters = useSelector(filterSelectors.currentFilters(FilterEntity.LOCATION));
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const isBusy = isFetching || isDeleting || isUpdating;

    useEffect(() => {
        setPageNumber(1);
    }, [currentFilters]);

    useEffect(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
    }, [dispatch]);

    useEffect(() => {
        if (!currentFilters) return;
        dispatch(actions.listLocations({ itemsPerPage: pageSize, pageNumber, filters: currentFilters }));
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

    const onEnableClick = useCallback(() => {
        for (const uuid of checkedRows) {
            dispatch(actions.enableLocation({ entityUuid: locations.find((data) => data.uuid === uuid)?.entityInstanceUuid || "", uuid }));
        }
    }, [checkedRows, dispatch, locations]);

    const onDisableClick = useCallback(() => {
        for (const uuid of checkedRows) {
            dispatch(actions.disableLocation({ entityUuid: locations.find((data) => data.uuid === uuid)?.entityInstanceUuid || "", uuid }));
        }
    }, [checkedRows, dispatch, locations]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const onDeleteConfirmed = useCallback(() => {
        setConfirmDelete(false);

        checkedRows.map((uuid) =>
            dispatch(actions.deleteLocation({ entityUuid: locations.find((data) => data.uuid === uuid)?.entityInstanceUuid || "", uuid })),
        );
    }, [dispatch, checkedRows, locations]);

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
            {
                icon: "check",
                disabled: checkedRows.length === 0,
                tooltip: "Enable",
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: "times",
                disabled: checkedRows.length === 0,
                tooltip: "Disable",
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [checkedRows.length, onAddClick, onDisableClick, onEnableClick],
    );

    const title = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons} />
                </div>

                <h5 className="mt-0">
                    <span className="fw-semi-bold">Locations Store</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const locationsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Name",
                sortable: true,
                sort: "asc",
                id: "locationName",
                width: "auto",
            },
            {
                content: "Description",
                sortable: true,
                id: "locationDescription",
                width: "auto",
            },
            {
                content: "Entity",
                sortable: true,
                id: "locationEntity",
                width: "auto",
            },
            {
                content: "Multiple Entries",
                align: "center",
                sortable: true,
                id: "multiEntries",
                width: "auto",
            },
            {
                content: "Key Management",
                align: "center",
                sortable: true,
                id: "keyMgmt",
                width: "auto",
            },
            {
                content: "Status",
                align: "center",
                sortable: true,
                id: "Status",
                width: "15%",
            },
        ],
        [],
    );

    const locationList: TableDataRow[] = useMemo(
        () =>
            locations.map((location) => ({
                id: location.uuid,

                columns: [
                    <Link to={`./detail/${location.entityInstanceUuid}/${location.uuid}`}>{location.name}</Link>,

                    location.description || "",

                    <Badge color="primary">{location.entityInstanceName}</Badge>,

                    location.supportMultipleEntries ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                    location.supportKeyManagement ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                    <StatusBadge enabled={location.enabled} />,
                ],
            })),
        [locations],
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
            <FilterWidget entity={FilterEntity.LOCATION} title="Locations Filter" />

            <Widget title={title} busy={isBusy}>
                <CustomTable
                    headers={locationsRowHeaders}
                    data={locationList}
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
                caption={`Delete ${checkedRows.length > 1 ? "Locations" : "an Location"}`}
                body={`You are about to delete ${checkedRows.length > 1 ? "Location" : "a Location"}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}

export default LocationList;
