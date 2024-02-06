import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as approvalActions, selectors as approvalSelectors } from 'ducks/approvals';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Input, Row } from 'reactstrap';
import { ApproverType, ProfileApprovalStepModel } from 'types/approval-profiles';
import { DetailApprovalStepModel } from 'types/approvals';
import { ApprovalDetailDtoStatusEnum } from 'types/openapi';
import { dateFormatter } from 'utils/dateUtil';

export default function ApprovalDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const approvalDetails = useSelector(approvalSelectors.approvalDetails);
    const isFetchingDetail = useSelector(approvalSelectors.isFetchingDetail);

    const [recipientApproveDialog, setRecipientApproveDialog] = useState(false);
    const [recipientRejectDialog, setRecipientRejectDialog] = useState(false);
    const [comment, setcomment] = useState<string>();
    const isBusy = useMemo(() => isFetchingDetail, [isFetchingDetail]);

    const getFreshData = useCallback(() => {
        if (!id) return;
        dispatch(approvalActions.getApproval({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        if (id) {
            getFreshData();
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
    }, [dispatch, approvalDetails, setRecipientApproveDialog, comment]);

    const onRejectRecipient = useCallback(() => {
        if (!approvalDetails?.approvalUuid) return;
        dispatch(
            approvalActions.rejectApprovalRecipient({
                uuid: approvalDetails.approvalUuid,
                userApproval: {
                    comment,
                },
            }),
        );
        setRecipientRejectDialog(false);
    }, [dispatch, approvalDetails, comment]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'check',
                disabled: approvalDetails?.status !== ApprovalDetailDtoStatusEnum.Pending,
                tooltip: 'Approve',
                onClick: () => {
                    setRecipientApproveDialog(true);
                },
            },
            {
                icon: 'times',
                disabled: approvalDetails?.status !== ApprovalDetailDtoStatusEnum.Pending,
                tooltip: 'Reject',
                onClick: () => {
                    setRecipientRejectDialog(true);
                },
            },
        ],
        [approvalDetails],
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

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
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
                          id: 'uuid',
                          columns: ['UUID', approvalDetails.approvalUuid],
                      },
                      {
                          id: 'name',
                          columns: [
                              'Name',
                              approvalDetails.approvalProfileUuid ? (
                                  <Link to={`../../../approvalprofiles/detail/${approvalDetails.approvalProfileUuid}`}>
                                      {approvalDetails.approvalProfileName}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'description',
                          columns: ['Description', approvalDetails.description || ''],
                      },
                      {
                          id: 'requestedBy',
                          columns: ['Requested By', approvalDetails.creatorUsername || ''],
                      },
                      {
                          id: 'status',
                          columns: [
                              'Status',
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
                          id: 'createdAt',
                          columns: ['Created At', dateFormatter(approvalDetails.createdAt)],
                      },
                      {
                          id: 'closedAt',
                          columns: ['Closed At', approvalDetails.closedAt ? dateFormatter(approvalDetails.closedAt) : ''],
                      },

                      {
                          id: 'action',
                          columns: ['Action', approvalDetails.resourceAction],
                      },
                      {
                          id: 'resource',
                          columns: ['Resource', approvalDetails.resource || ''],
                      },

                      {
                          id: 'expiry',
                          columns: ['Expiry (in hours)', approvalDetails?.expiry ? approvalDetails.expiry.toString() : ''],
                      },

                      {
                          id: 'version',
                          columns: ['Version', approvalDetails?.version.toString() || ''],
                      },
                  ],
        [approvalDetails, navigate],
    );

    const stepsHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'order',
                content: 'Order',
            },
            {
                id: 'requiredApprovals',
                content: 'Required Approvals',
            },
            {
                id: 'approverType',
                content: 'Approver Type',
            },
            {
                id: 'selectedApprover',
                content: 'Selected Approver',
            },
            {
                id: 'description',
                content: 'Description',
            },
        ],
        [],
    );

    const renderApproverRedirect = useCallback((appovalProfileStep: ProfileApprovalStepModel) => {
        if (appovalProfileStep.userUuid) {
            return <Link to={`../users/detail/${appovalProfileStep.userUuid}`}>{appovalProfileStep.username}</Link>;
        }
        if (appovalProfileStep.roleUuid) {
            return <Link to={`../roles/detail/${appovalProfileStep.roleUuid}`}>{appovalProfileStep.roleUuid}</Link>;
        }
        if (appovalProfileStep.groupUuid) {
            return <Link to={`../groups/detail/${appovalProfileStep.groupUuid}`}>{appovalProfileStep.groupUuid}</Link>;
        }
    }, []);

    const renderRecipiensDetails = useCallback((approvalStep: DetailApprovalStepModel) => {
        const data = approvalStep.approvalStepRecipients.map((recipient, i) => ({
            id: recipient.approvalRecipientUuid,
            columns: [
                <Link to={`../users/detail/${approvalStep.userUuid}`}>{recipient.username}</Link>,
                recipient.closedAt ? dateFormatter(recipient.closedAt) : '',
                <StatusBadge textStatus={recipient.status} />,
                recipient.comment || '',
            ],
        }));

        const headers = [
            {
                id: 'recipient',
                content: 'Recipient',
            },
            {
                id: 'closedAt',
                content: 'Closed At',
            },
            {
                id: 'status',
                content: 'Status',
            },
            {
                id: 'comment',
                content: 'Comment',
            },
        ];

        return <CustomTable data={data} headers={headers} />;
    }, []);

    const stepsRows: TableDataRow[] = useMemo(
        () =>
            !approvalDetails
                ? []
                : (approvalDetails.approvalSteps || []).map((approvalStep) => ({
                      id: approvalStep.order,
                      columns: [
                          approvalStep.order.toString(),

                          approvalStep?.requiredApprovals ? approvalStep.requiredApprovals.toString() : '',

                          getApprovalType(approvalStep) || '',

                          renderApproverRedirect(approvalStep) || '',

                          approvalStep.description || '',
                      ],
                      detailColumns: [
                          <></>,
                          <></>,
                          <></>,
                          <></>,
                          <></>,
                          approvalStep.approvalStepRecipients.length ? renderRecipiensDetails(approvalStep) : '',
                      ],
                  })),
        [approvalDetails, renderApproverRedirect, renderRecipiensDetails],
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
                        <span>Comment (optional) :</span>
                        <Input type="textarea" value={comment} onChange={(e) => setcomment(e.currentTarget.value)} />
                    </div>
                }
                caption="Accept approval?"
                toggle={() => setRecipientApproveDialog(false)}
                buttons={[
                    { color: 'primary', onClick: onApproveRecipient, body: 'Yes, approve' },
                    { color: 'secondary', onClick: () => setRecipientApproveDialog(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={recipientRejectDialog}
                caption="Reject approval?"
                toggle={() => setRecipientRejectDialog(false)}
                body={
                    <div>
                        <span>Comment (optional) :</span>
                        <Input type="textarea" value={comment} onChange={(e) => setcomment(e.currentTarget.value)} />
                    </div>
                }
                buttons={[
                    { color: 'primary', onClick: onRejectRecipient, body: 'Yes, reject' },
                    { color: 'secondary', onClick: () => setRecipientRejectDialog(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
