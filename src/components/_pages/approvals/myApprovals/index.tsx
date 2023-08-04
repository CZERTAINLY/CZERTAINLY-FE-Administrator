import { actions as approvalActions, selectors as approvalSelectors } from "ducks/approvals";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";

// import { selectors as profileApprovalSelector } from "ducks/approval-profiles";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";
import { ApprovalDtoStatusEnum } from "types/openapi";
import { LockWidgetNameEnum } from "types/widget-locks";
import { dateFormatter } from "utils/dateUtil";

export default function ApprovalsList() {
    const dispatch = useDispatch();

    const userApprovals = useSelector(approvalSelectors.userApprovals);
    const userApprovalsTotalItems = useSelector(approvalSelectors.userApprovalsTotalItems);

    const isFetching = useSelector(approvalSelectors.isFetchingUserList);

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [checkedRows, setCheckedRows] = useState<string[]>([]);

    const [approveApprovalDialogOpen, setApproveApprovalDialogOpen] = useState<boolean>(false);
    const [rejectApprovalDialogOpen, setRejectApprovalDialogOpen] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetching, [isFetching]);

    const onShowHistoryClick = () => {
        setShowHistory(!showHistory);
    };

    const getFreshData = useCallback(() => {
        dispatch(
            approvalActions.listUserApprovals({
                paginationRequestDto: { itemsPerPage: pageSize, pageNumber },
                approvalUserDto: { history: showHistory },
            }),
        );
    }, [dispatch, pageNumber, pageSize, showHistory]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const onApproveApprover = useCallback(() => {
        if (!checkedRows) return;
        dispatch(
            approvalActions.approveApproval({
                uuid: checkedRows[0],
            }),
        );
        setApproveApprovalDialogOpen(false);
    }, [dispatch, checkedRows]);

    const onRejectApprover = useCallback(() => {
        if (!checkedRows) return;
        dispatch(
            approvalActions.rejectApproval({
                uuid: checkedRows[0],
            }),
        );
        setRejectApprovalDialogOpen(false);
    }, [dispatch, checkedRows]);

    const selectedApprovalStatus = useMemo(() => {
        if (!checkedRows) return;
        const selectedApproval = userApprovals.find((approval) => approval.approvalUuid === checkedRows[0]);
        return selectedApproval?.status;
    }, [checkedRows, userApprovals]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "check",
                disabled: !checkedRows.length || selectedApprovalStatus !== ApprovalDtoStatusEnum.Pending,
                tooltip: "Create",
                onClick: () => {
                    setApproveApprovalDialogOpen(true);
                },
            },
            {
                icon: "times",
                disabled: !checkedRows.length || selectedApprovalStatus !== ApprovalDtoStatusEnum.Pending,
                tooltip: "Create",
                onClick: () => {
                    setRejectApprovalDialogOpen(true);
                },
            },
            {
                icon: "history",
                disabled: false,
                tooltip: `${showHistory ? "Hide" : "Show"} History`,
                onClick: () => {
                    onShowHistoryClick();
                },
            },
        ],
        [checkedRows, onShowHistoryClick, selectedApprovalStatus, showHistory],
    );
    const approvalProfilesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: "approvalUUID",
                content: "Approval UUID ",
                sort: "asc",
            },
            {
                id: "approvalProfile",
                content: "Approval Profile",
            },
            {
                id: "status",
                content: "Status",
            },
            {
                id: "resource",
                content: "Resource",
            },

            {
                id: "action",
                content: "Action",
            },

            {
                id: "createdAt",
                content: "Created At",
            },

            {
                id: "closedAt",
                content: "Closed At",
            },
        ],
        [],
    );

    const approvalProfilesTableData: TableDataRow[] = useMemo(
        () =>
            userApprovals.map((approval) => ({
                id: approval.approvalUuid,

                columns: [
                    <Link to={`./detail/${approval.approvalUuid}`}>{approval.approvalUuid}</Link>,
                    <Link to={`/approvalprofiles/detail/${approval.approvalProfileUuid}`}>{approval.approvalProfileName}</Link>,
                    <StatusBadge textStatus={approval.status} /> || "",
                    approval.resource || "",
                    approval.resourceAction || "",
                    approval.createdAt ? dateFormatter(approval.createdAt) : "",
                    approval.closedAt ? dateFormatter(approval.closedAt) : "",
                ],
            })),
        [userApprovals],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of User Approvals"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ListOfComplianceProfiles}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <br />
                <CustomTable
                    headers={approvalProfilesTableHeader}
                    data={approvalProfilesTableData}
                    hasPagination={true}
                    hasCheckboxes
                    checkedRows={checkedRows}
                    onCheckedRowsChanged={(checkedRows) => {
                        setCheckedRows(checkedRows as string[]);
                    }}
                    multiSelect={false}
                    onPageChanged={setPageNumber}
                    onPageSizeChanged={setPageSize}
                    paginationData={{
                        pageSize: pageSize,
                        totalItems: userApprovalsTotalItems || 0,
                        itemsPerPageOptions: [10, 20, 50, 100],
                        loadedPageSize: pageSize,
                        totalPages: userApprovalsTotalItems ? Math.ceil(userApprovalsTotalItems / pageSize) : 0,
                        page: pageNumber,
                    }}
                />
            </Widget>

            <Dialog
                isOpen={approveApprovalDialogOpen}
                caption="Approve the selected Approval?"
                body="Are you sure you want to approve the selected Approval?"
                toggle={() => setApproveApprovalDialogOpen(false)}
                buttons={[
                    { color: "primary", onClick: onApproveApprover, body: "Yes, approve" },
                    { color: "secondary", onClick: () => setApproveApprovalDialogOpen(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={rejectApprovalDialogOpen}
                caption="Reject the selected Approval?"
                body="Are you sure you want to reject the selected Approval?"
                toggle={() => setRejectApprovalDialogOpen(false)}
                buttons={[
                    { color: "primary", onClick: onRejectApprover, body: "Yes, reject" },
                    { color: "secondary", onClick: () => setRejectApprovalDialogOpen(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
