import { actions as approvalActions, selectors as approvalSelectors } from 'ducks/approvals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import TabLayout from 'components/Layout/TabLayout';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { ApprovalDtoStatusEnum } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { dateFormatter } from 'utils/dateUtil';

export default function ApprovalsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const approvals = useSelector(approvalSelectors.approvals);
    const approvalsTotalItems = useSelector(approvalSelectors.approvalsTotalItems);

    const userApprovals = useSelector(approvalSelectors.userApprovals);
    const userApprovalsTotalItems = useSelector(approvalSelectors.userApprovalsTotalItems);

    const isFetching = useSelector(approvalSelectors.isFetchingList);

    const [approveApprovalDialogOpen, setApproveApprovalDialogOpen] = useState<boolean>(false);
    const [rejectApprovalDialogOpen, setRejectApprovalDialogOpen] = useState<boolean>(false);

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [checkedRows, setCheckedRows] = useState<string[]>([]);
    const [showAllApprovals, setShowAllApprovals] = useState<boolean>(false);
    const [showHistory, setShowHistory] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetching, [isFetching]);

    const listUserApprovals = useCallback(() => {
        dispatch(
            approvalActions.listUserApprovals({
                approvalUserDto: {
                    history: showHistory,
                },
                paginationRequestDto: { itemsPerPage: pageSize, pageNumber },
            }),
        );
        setCheckedRows([]);
    }, [dispatch, pageNumber, pageSize, showHistory]);

    const listApprovals = useCallback(() => {
        dispatch(approvalActions.listApprovals({ itemsPerPage: pageSize, pageNumber }));
        setCheckedRows([]);
    }, [dispatch, pageNumber, pageSize]);

    const getFreshData = useCallback(() => {
        if (showAllApprovals) {
            listApprovals();
        } else {
            listUserApprovals();
        }
    }, [listApprovals, listUserApprovals, showAllApprovals]);

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
    }, [dispatch, checkedRows, setApproveApprovalDialogOpen]);

    const onRejectApprover = useCallback(() => {
        if (!checkedRows) return;
        dispatch(
            approvalActions.rejectApproval({
                uuid: checkedRows[0],
            }),
        );
        setRejectApprovalDialogOpen(false);
    }, [dispatch, checkedRows, setRejectApprovalDialogOpen]);

    const selectedApprovalStatus = useMemo(() => {
        if (!checkedRows) return;
        const selectedApproval = approvals.find((approval) => approval.approvalUuid === checkedRows[0]);
        return selectedApproval?.status;
    }, [checkedRows, approvals]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'check',
                disabled: !checkedRows.length || selectedApprovalStatus !== ApprovalDtoStatusEnum.Pending,
                tooltip: 'Approve',
                hidden: !showAllApprovals,
                onClick: () => {
                    setApproveApprovalDialogOpen(true);
                },
            },
            {
                icon: 'times',
                disabled: !checkedRows.length || selectedApprovalStatus !== ApprovalDtoStatusEnum.Pending,
                hidden: !showAllApprovals,
                tooltip: 'Reject',
                onClick: () => {
                    setRejectApprovalDialogOpen(true);
                },
            },
            {
                icon: 'history',
                tooltip: 'Show History',
                disabled: showAllApprovals,
                hidden: showAllApprovals,
                onClick: () => {
                    setShowHistory(!showHistory);
                },
            },
        ],
        [checkedRows, selectedApprovalStatus, showHistory, showAllApprovals],
    );

    const approvalProfilesTableHeader: TableHeader[] = useMemo(
        () => [
            {
                id: 'approvalUUID',
                content: 'Approval UUID ',
                sort: 'asc',
            },
            {
                id: 'approvalProfile',
                content: 'Approval Profile',
            },
            {
                id: 'status',
                content: 'Status',
            },
            {
                id: 'requestedBy',
                content: 'Requested By',
            },
            {
                id: 'resource',
                content: 'Resource',
            },

            {
                id: 'action',
                content: 'Action',
            },

            {
                id: 'createdAt',
                content: 'Created At',
            },

            {
                id: 'closedAt',
                content: 'Closed At',
            },
        ],
        [],
    );

    const approvalProfilesTableData: TableDataRow[] = useMemo(() => {
        const data = showAllApprovals ? approvals : userApprovals;

        return data.map((approval) => ({
            id: approval.approvalUuid,
            columns: [
                <Link to={`./detail/${approval.approvalUuid}`}>{approval.approvalUuid}</Link>,
                <Link to={`../../../approvalprofiles/detail/${approval.approvalProfileUuid}`}>{approval.approvalProfileName}</Link>,
                (
                    <>
                        <StatusBadge textStatus={approval.status} />
                        <Button
                            color="white"
                            size="sm"
                            className="p-0 ms-1"
                            onClick={() => {
                                navigate(`../../${approval.resource}/detail/${approval.objectUuid}`);
                            }}
                        >
                            <i className="fa fa-circle-arrow-right"></i>
                        </Button>
                    </>
                ) || '',
                approval.creatorUsername ? (
                    <Link to={`../users/detail/${approval.creatorUuid}`}>{approval.creatorUsername ?? 'Unassigned'}</Link>
                ) : (
                    (approval.creatorUsername ?? 'Unassigned')
                ),
                approval.resource || '',
                approval.resourceAction || '',
                approval.createdAt ? dateFormatter(approval.createdAt) : '',
                approval.closedAt ? dateFormatter(approval.closedAt) : '',
            ],
        }));
    }, [approvals, userApprovals, showAllApprovals, navigate]);

    return (
        <Container className="themed-container" fluid>
            <TabLayout
                tabs={[
                    {
                        title: 'My Approvals',
                        content: (
                            <Widget
                                title="My Approvals"
                                busy={isBusy}
                                widgetButtons={buttons}
                                titleSize="large"
                                refreshAction={listUserApprovals}
                            >
                                <br />
                                <CustomTable
                                    headers={approvalProfilesTableHeader}
                                    data={approvalProfilesTableData}
                                    hasPagination={true}
                                    hasCheckboxes={false}
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
                        ),
                        onClick: () => {
                            setShowAllApprovals(false);
                            setPageSize(10);
                            setPageNumber(1);
                        },
                    },
                    {
                        title: 'List of Approvals',
                        content: (
                            <Widget
                                title="List of Approvals"
                                busy={isBusy}
                                widgetButtons={buttons}
                                widgetLockName={LockWidgetNameEnum.ListOfApprovals}
                                titleSize="large"
                                refreshAction={listApprovals}
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
                                        totalItems: approvalsTotalItems || 0,
                                        itemsPerPageOptions: [10, 20, 50, 100],
                                        loadedPageSize: pageSize,
                                        totalPages: approvalsTotalItems ? Math.ceil(approvalsTotalItems / pageSize) : 0,
                                        page: pageNumber,
                                    }}
                                />
                            </Widget>
                        ),
                        onClick: () => {
                            setShowAllApprovals(true);
                            setPageSize(10);
                            setPageNumber(1);
                        },
                    },
                ]}
            />

            <Dialog
                isOpen={approveApprovalDialogOpen}
                caption="Accept the selected Approval?"
                body="Are you sure you want to accept the selected Approval?"
                toggle={() => setApproveApprovalDialogOpen(false)}
                buttons={[
                    { color: 'primary', onClick: onApproveApprover, body: 'Yes, approve' },
                    { color: 'secondary', onClick: () => setApproveApprovalDialogOpen(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={rejectApprovalDialogOpen}
                caption="Reject the selected Approval?"
                body="Are you sure you want to reject the selected Approval?"
                toggle={() => setRejectApprovalDialogOpen(false)}
                buttons={[
                    { color: 'primary', onClick: onRejectApprover, body: 'Yes, reject' },
                    { color: 'secondary', onClick: () => setRejectApprovalDialogOpen(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
