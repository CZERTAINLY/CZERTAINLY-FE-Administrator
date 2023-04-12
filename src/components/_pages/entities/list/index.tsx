import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Container } from "reactstrap";

import { actions, selectors } from "ducks/entities";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import EntitiesFilter from "../EntitiesFilter";

function EntityList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const entities = useSelector(selectors.entities);

    const totalItems = useSelector(selectors.totalItems);
    const currentFilters = useSelector(selectors.currentFilters);
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
        dispatch(actions.listEntities({ itemsPerPage: pageSize, pageNumber, filters: currentFilters }));
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

        checkedRows.map((uuid) => dispatch(actions.deleteEntity({ uuid })));
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
                    <span className="fw-semi-bold">Entity Store</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const entitiesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Name",
                sortable: true,
                sort: "asc",
                id: "entityName",
                width: "auto",
            },
            {
                content: "Entity Provider",
                align: "center",
                sortable: true,
                id: "credentialProvider",
                width: "15%",
            },
            {
                content: "Kind",
                align: "center",
                sortable: true,
                id: "kind",
                width: "15%",
            },
        ],
        [],
    );

    const entityList: TableDataRow[] = useMemo(
        () =>
            entities.map((entity) => ({
                id: entity.uuid,

                columns: [
                    <Link to={`./detail/${entity.uuid}`}>{entity.name}</Link>,

                    <Badge color="primary">{entity.connectorName}</Badge>,

                    <Badge color="primary">{entity.kind}</Badge>,
                ],
            })),
        [entities],
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
            <Widget title={title} busy={isBusy}>
                <br />

                <EntitiesFilter />

                <CustomTable
                    headers={entitiesRowHeaders}
                    data={entityList}
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
                caption={`Delete ${checkedRows.length > 1 ? "Entities" : "an Entity"}`}
                body={`You are about to delete ${checkedRows.length > 1 ? "Entities" : "a Entity"}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}

export default EntityList;
