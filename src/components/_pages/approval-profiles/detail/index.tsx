import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as profileApprovalActions, selectors as profileApprovalSelectors } from 'ducks/approval-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { ApproverType, ProfileApprovalStepModel } from 'types/approval-profiles';
import { LockWidgetNameEnum } from 'types/user-interface';

const ApprovalProfileDetails = () => {
    const dispatch = useDispatch();
    const { id, version } = useParams();
    const navigate = useNavigate();

    const profileApprovalDetail = useSelector(profileApprovalSelectors.profileApprovalDetail);
    const isFetchingDetail = useSelector(profileApprovalSelectors.isFetchingDetail);
    const isEnabling = useSelector(profileApprovalSelectors.isEnabling);
    const deleteErrorMessage = useSelector(profileApprovalSelectors.deleteErrorMessage);
    const isDeleting = useSelector(profileApprovalSelectors.isDeleting);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const isBusy = useMemo(() => isFetchingDetail || isEnabling || isDeleting, [isFetchingDetail, isEnabling, isDeleting]);

    const getFreshData = useCallback(() => {
        if (!id) return;
        dispatch(profileApprovalActions.getApprovalProfile({ uuid: id, version: Number(version) }));
    }, [dispatch, id, version]);

    useEffect(() => {
        if (id) {
            getFreshData();
        }
    }, [id, dispatch, version, getFreshData]);

    const onDeleteConfirmed = useCallback(() => {
        if (!profileApprovalDetail) return;
        dispatch(profileApprovalActions.deleteApprovalProfile({ uuid: profileApprovalDetail.uuid }));
        setConfirmDelete(false);
    }, [profileApprovalDetail, dispatch]);

    const onEnableClick = useCallback(() => {
        if (!profileApprovalDetail) return;
        dispatch(profileApprovalActions.enableApprovalProfile({ uuid: profileApprovalDetail.uuid }));
    }, [profileApprovalDetail, dispatch]);

    const onDisableClick = useCallback(() => {
        if (!profileApprovalDetail) return;
        dispatch(profileApprovalActions.disableApprovalProfile({ uuid: profileApprovalDetail.uuid }));
    }, [profileApprovalDetail, dispatch]);

    const onEditClick = useCallback(() => {
        if (!profileApprovalDetail) return;
        navigate(`/approvalprofiles/edit/${profileApprovalDetail.uuid}`);
    }, [profileApprovalDetail, navigate]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => onEditClick(),
            },
            {
                icon: 'check',
                disabled: profileApprovalDetail?.enabled || false,
                tooltip: 'Enable',
                onClick: () => onEnableClick(),
            },
            {
                icon: 'times',
                disabled: !(profileApprovalDetail?.enabled || false),
                tooltip: 'Disable',
                onClick: () => onDisableClick(),
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [profileApprovalDetail, onDisableClick, onEnableClick, onEditClick],
    );

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
            !profileApprovalDetail
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', profileApprovalDetail.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', profileApprovalDetail.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', profileApprovalDetail.description || ''],
                      },

                      {
                          id: 'associations',
                          columns: ['Associations', profileApprovalDetail?.associations.toString() || ''],
                      },

                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={profileApprovalDetail.enabled} />],
                      },

                      {
                          id: 'expiry',
                          columns: ['Expiry (in hours)', profileApprovalDetail?.expiry ? profileApprovalDetail.expiry.toString() : ''],
                      },

                      {
                          id: 'version',
                          columns: ['Version', profileApprovalDetail?.version.toString() || ''],
                      },
                  ],
        [profileApprovalDetail],
    );

    const stepsHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'order',
                content: 'Order',
            },
            {
                id: 'description',
                content: 'Description',
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
        ],
        [],
    );

    const getApprovalType = (appovalProfileStep: ProfileApprovalStepModel) => {
        if (appovalProfileStep.userUuid) {
            return ApproverType.User;
        }
        if (appovalProfileStep.roleUuid) {
            return ApproverType.Role;
        }
        if (appovalProfileStep.groupUuid) {
            return ApproverType.Group;
        }
    };

    const renderApproverRedirect = useCallback((appovalProfileStep: ProfileApprovalStepModel) => {
        if (appovalProfileStep.userUuid) {
            return <Link to={`../users/detail/${appovalProfileStep.userUuid}`}>{appovalProfileStep.username}</Link>;
        }
        if (appovalProfileStep.roleUuid) {
            return <Link to={`../roles/detail/${appovalProfileStep.roleUuid}`}>{appovalProfileStep.roleName}</Link>;
        }
        if (appovalProfileStep.groupUuid) {
            return <Link to={`../groups/detail/${appovalProfileStep.groupUuid}`}>{appovalProfileStep.roleName}</Link>;
        }
    }, []);

    const stepsRows: TableDataRow[] = useMemo(
        () =>
            !profileApprovalDetail
                ? []
                : (profileApprovalDetail.approvalSteps || []).map((profile) => ({
                      id: profile.order,
                      columns: [
                          profile.order.toString(),

                          profile.description || '',

                          profile?.requiredApprovals ? profile.requiredApprovals.toString() : '',

                          getApprovalType(profile) || '',

                          renderApproverRedirect(profile) || '',
                      ],
                  })),
        [profileApprovalDetail, renderApproverRedirect],
    );

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        title="Approval Profile Details"
                        busy={isBusy}
                        titleSize="large"
                        widgetButtons={buttons}
                        refreshAction={getFreshData}
                        widgetLockName={LockWidgetNameEnum.ApprovalProfileDetails}
                    >
                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>
                <Col>
                    <Widget title="Approval Profile Steps" busy={isBusy} widgetLockName={LockWidgetNameEnum.ApprovalProfileDetails}>
                        <CustomTable headers={stepsHeaders} data={stepsRows} />
                    </Widget>
                </Col>
            </Row>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Approval Profile"
                body="You are about to delete Approval Profile which may have associated Approval
                  Account(s). When deleted the Approval Account(s) will be revoked."
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete Approval Profile"
                body={
                    <>
                        Failed to delete the Approval Profile that has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(profileApprovalActions.clearDeleteErrorMessages())}
                buttons={[
                    { color: 'secondary', onClick: () => dispatch(profileApprovalActions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
            />
        </Container>
    );
};

export default ApprovalProfileDetails;
