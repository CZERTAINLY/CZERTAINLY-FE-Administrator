import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";
import { actions as approvalActions, selectors as approvalSelectors } from "ducks/approvals";
import { actions as groupAction, selectors as groupSelectors } from "ducks/certificateGroups";

import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";
import { actions as userAction, selectors as userSelectors } from "ducks/users";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Container, Input, Row } from "reactstrap";
import { ApproverType, ProfileApprovalStepModel } from "types/approval-profiles";
import { DetailApprovalStepModel } from "types/approvals";
import { ApprovalDetailDtoStatusEnum } from "types/openapi";
import { dateFormatter } from "utils/dateUtil";

export default function ApprovalDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const approvalDetails = useSelector(approvalSelectors.approvalDetails);
    const isFetchingDetail = useSelector(approvalSelectors.isFetchingDetail);
    const groupList = useSelector(groupSelectors.certificateGroups);
    const isFetchingGroups = useSelector(groupSelectors.isFetchingList);
    const userList = useSelector(userSelectors.users);
    const isFetchingUsers = useSelector(userSelectors.isFetchingList);
    const roleList = useSelector(rolesSelectors.roles);
    const isFetchingRoles = useSelector(rolesSelectors.isFetchingList);

    const [recipientApproveDialog, setRecipientApproveDialog] = useState(false);
    const [recipientRejectDialog, setRecipientRejectDialog] = useState(false);
    const [comment, setcomment] = useState<string>();
    const isBusy = useMemo(
        () => isFetchingDetail || isFetchingGroups || isFetchingUsers || isFetchingRoles,
        [isFetchingDetail, isFetchingGroups, isFetchingUsers, isFetchingRoles],
    );

    const getFreshData = useCallback(() => {
        if (!id) return;
        dispatch(approvalActions.getApproval({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (id) {
            getFreshData();
            dispatch(userAction.list());
            dispatch(groupAction.listGroups());
            dispatch(rolesActions.list());
        }
    }, [id, dispatch, getFreshData]);

    const onApproveRecipient = useCallback(() => {
        if (!approvalDetails?.approvalUuid) return;
        dispatch(
            approvalActions.approveApprovalRecipient({
                uuid: approvalDetails?.approvalUuid,
                userApproval: {
                    comment,
                },
            }),
        );
        setRecipientApproveDialog(false);
    }, [dispatch, approvalDetails, setRecipientApproveDialog]);

    const onRejectRecipient = useCallback(() => {
        if (!approvalDetails?.approvalUuid) return;
        dispatch(
            approvalActions.rejectApprovalRecipient({
                uuid: approvalDetails?.approvalUuid,
                userApproval: {
                    comment,
                },
            }),
        );
        setRecipientApproveDialog(false);
    }, [dispatch, approvalDetails, setRecipientApproveDialog]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "check",
                disabled: approvalDetails?.status !== ApprovalDetailDtoStatusEnum.Pending,
                tooltip: "Approve",
                onClick: () => {
                    setRecipientApproveDialog(true);
                },
            },
            {
                icon: "times",
                disabled: approvalDetails?.status !== ApprovalDetailDtoStatusEnum.Pending,
                tooltip: "Reject",
                onClick: () => {
                    setRecipientRejectDialog(true);
                },
            },
        ],
        [recipientApproveDialog, recipientRejectDialog],
    );
    const getApprovalType = (approvalStep: DetailApprovalStepModel) => {
        if (approvalStep.userUuid) {
            return ApproverType.User;
        }
        if (approvalStep.roleUuid) {
            return ApproverType.Role;
        }
        if (approvalStep.groupUuid) {
            return ApproverType.Group;
        }
    };

    const getUserName = useCallback(
        (userUuid: string) => {
            return userList.find((user) => user.uuid === userUuid)?.username;
        },
        [userList],
    );

    const getRoleName = useCallback(
        (roleUuid: string) => {
            return roleList.find((role) => role.uuid === roleUuid)?.name;
        },
        [roleList],
    );

    const getGroupName = useCallback(
        (groupUuid: string) => {
            return groupList.find((group) => group.uuid === groupUuid)?.name;
        },
        [groupList],
    );

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "property",
                content: "Property",
            },
            {
                id: "value",
                content: "Value",
            },
        ],
        [],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !approvalDetails
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", approvalDetails.approvalUuid],
                      },
                      {
                          id: "name",
                          columns: [
                              "Name",
                              approvalDetails.approvalProfileUuid ? (
                                  <Link to={`/approvalprofiles/detail/${approvalDetails.approvalProfileUuid}`}>
                                      {approvalDetails.approvalProfileName}
                                  </Link>
                              ) : (
                                  ""
                              ),
                          ],
                      },
                      {
                          id: "description",
                          columns: ["Description", approvalDetails.description || ""],
                      },
                      {
                          id: "requestedBy",
                          columns: ["Requested By", getUserName(approvalDetails.creatorUuid) || ""],
                      },
                      {
                          id: "status",
                          columns: [
                              "Status",
                              <>
                                  <StatusBadge textStatus={approvalDetails.status} />
                                  <Button
                                      color="white"
                                      size="sm"
                                      className="p-0 ms-1"
                                      onClick={() => {
                                          navigate(`../../${approvalDetails.resource}/detail/${approvalDetails.objectUuid}`);
                                      }}
                                  >
                                      <i className="fa fa-circle-arrow-right"></i>
                                  </Button>
                              </>,
                          ],
                      },

                      {
                          id: "createdAt",
                          columns: ["Created At", dateFormatter(approvalDetails.createdAt)],
                      },
                      {
                          id: "closedAt",
                          columns: ["Closed At", approvalDetails.closedAt ? dateFormatter(approvalDetails.closedAt) : ""],
                      },

                      {
                          id: "action",
                          columns: ["Action", approvalDetails.resourceAction],
                      },
                      {
                          id: "resource",
                          columns: ["Resource", approvalDetails.resource || ""],
                      },

                      {
                          id: "expiry",
                          columns: ["Expiry (in hours)", approvalDetails?.expiry ? approvalDetails.expiry.toString() : ""],
                      },

                      {
                          id: "version",
                          columns: ["Version", approvalDetails?.version.toString() || ""],
                      },
                  ],
        [approvalDetails],
    );

    const stepsHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "order",
                content: "Order",
            },
            {
                id: "requiredApprovals",
                content: "Required Approvals",
            },
            {
                id: "approverType",
                content: "Approver Type",
            },
            {
                id: "selectedApprover",
                content: "Selected Approver",
            },
            {
                id: "description",
                content: "Description",
            },
        ],
        [],
    );

    const renderApproverRedirect = useCallback(
        (appovalProfileStep: ProfileApprovalStepModel) => {
            if (appovalProfileStep.userUuid) {
                return <Link to={`../users/detail/${appovalProfileStep.userUuid}`}>{getUserName(appovalProfileStep.userUuid)}</Link>;
            }
            if (appovalProfileStep.roleUuid) {
                return <Link to={`../roles/detail/${appovalProfileStep.roleUuid}`}>{getRoleName(appovalProfileStep.roleUuid)}</Link>;
            }
            if (appovalProfileStep.groupUuid) {
                return <Link to={`../groups/detail/${appovalProfileStep.groupUuid}`}>{getGroupName(appovalProfileStep.groupUuid)}</Link>;
            }
        },
        [getUserName, getRoleName, getGroupName, approvalDetails],
    );

    const renderRecipiensDetails = (approvalStep: DetailApprovalStepModel) => {
        const data = approvalStep.approvalStepRecipients.map((recipient, i) => ({
            id: recipient.approvalRecipientUuid,
            columns: [
                <Link to={`../users/detail/${approvalStep.userUuid}`}>{getUserName(recipient.userUuid)}</Link>,
                recipient.closedAt ? dateFormatter(recipient.closedAt) : "",
                <StatusBadge textStatus={recipient.status} />,
                recipient.comment || "",
            ],
        }));

        const headers = [
            {
                id: "recipient",
                content: "Recipient",
            },
            {
                id: "closedAt",
                content: "Closed At",
            },
            {
                id: "status",
                content: "Status",
            },
            {
                id: "comment",
                content: "Comment",
            },
        ];

        return <CustomTable data={data} headers={headers} />;
    };

    const stepsRows: TableDataRow[] = useMemo(
        () =>
            !approvalDetails
                ? []
                : (approvalDetails.approvalSteps || []).map((approvalStep) => ({
                      id: approvalStep.order,
                      columns: [
                          approvalStep.order.toString(),

                          approvalStep?.requiredApprovals ? approvalStep.requiredApprovals.toString() : "",

                          getApprovalType(approvalStep) || "",

                          renderApproverRedirect(approvalStep) || "",

                          approvalStep.description || "",
                      ],
                      detailColumns: [
                          <></>,
                          <></>,
                          <></>,
                          <></>,
                          <></>,
                          approvalStep.approvalStepRecipients.length ? renderRecipiensDetails(approvalStep) : "",
                      ],
                  })),
        [approvalDetails, renderApproverRedirect],
    );

    return (
        <Container className="themed-container" fluid>
            <Row>
                <Col>
                    <Widget title="Approval Details" busy={isBusy} titleSize="large" widgetButtons={buttons} refreshAction={getFreshData}>
                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Widget title="Approval Steps" busy={isBusy}>
                        <CustomTable headers={stepsHeaders} data={stepsRows} hasDetails={true} />
                    </Widget>
                </Col>
            </Row>

            <Dialog
                isOpen={recipientApproveDialog}
                body={
                    <div>
                        <span>comment:</span>
                        <Input type="textarea" value={comment} onChange={(e) => setcomment(e.currentTarget.value)} />
                    </div>
                }
                caption="Approve Recipients?"
                toggle={() => setRecipientApproveDialog(false)}
                buttons={[
                    { color: "primary", onClick: onApproveRecipient, body: "Yes, approve" },
                    { color: "secondary", onClick: () => setRecipientApproveDialog(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={recipientRejectDialog}
                caption="Reject Recipients?"
                toggle={() => setRecipientRejectDialog(false)}
                body={
                    <div>
                        <span>comment:</span>
                        <Input type="textarea" value={comment} onChange={(e) => setcomment(e.currentTarget.value)} />
                    </div>
                }
                buttons={[
                    { color: "primary", onClick: onRejectRecipient, body: "Yes, rejects" },
                    { color: "secondary", onClick: () => setRecipientRejectDialog(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
