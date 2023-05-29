import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { actions, selectors } from "ducks/certificateGroups";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { Container } from "reactstrap";
import { LockWidgetNameEnum } from "types/widget-locks";

export default function GroupList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const groups = useSelector(selectors.certificateGroups);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    useEffect(() => {
        dispatch(actions.setCheckedRows({ checkedRows: [] }));
        dispatch(actions.listGroups());
    }, [dispatch]);

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

    const onDeleteConfirmed = useCallback(() => {
        dispatch(actions.bulkDeleteGroups({ uuids: checkedRows }));
        setConfirmDelete(false);
    }, [checkedRows, dispatch]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

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
                    List of <span className="fw-semi-bold">Groups</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const groupsTableHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "name",
                content: "Name",
                sortable: true,
                sort: "asc",
                width: "15%",
            },
            {
                id: "description",
                content: "Description",
                sortable: true,
            },
        ],
        [],
    );

    const groupsTableData: TableDataRow[] = useMemo(
        () =>
            groups.map((group) => ({
                id: group.uuid,

                columns: [<Link to={`./detail/${group.uuid}`}>{group.name}</Link>, group.description || ""],
            })),
        [groups],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={title} busy={isBusy} widgetLockName={LockWidgetNameEnum.ListOfGroups}>
                <br />
                <CustomTable
                    headers={groupsTableHeaders}
                    data={groupsTableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? "Groups" : "Profile"}`}
                body={`You are about to delete ${checkedRows.length > 1 ? "a Group" : "Groups"}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
