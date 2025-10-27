import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as profileApprovalActions, selectors as profileApprovalSelectors } from 'ducks/approval-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import { ApproverType, ProfileApprovalStepModel } from 'types/approval-profiles';
import { PlatformEnum, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { createWidgetDetailHeaders } from 'utils/widget';
import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';

const ApprovalProfileDetails = () => {
    const dispatch = useDispatch();
    const { id, version } = useParams();
    const navigate = useNavigate();

    const profileApprovalDetail = useSelector(profileApprovalSelectors.profileApprovalDetail);
    const isFetchingDetail = useSelector(profileApprovalSelectors.isFetchingDetail);
    const deleteErrorMessage = useSelector(profileApprovalSelectors.deleteErrorMessage);
    const isDeleting = useSelector(profileApprovalSelectors.isDeleting);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const isBusy = useMemo(() => isFetchingDetail || isDeleting, [isFetchingDetail, isDeleting]);

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
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [onEditClick],
    );

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

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

    const getApprovalType = (approvalProfileStep: ProfileApprovalStepModel) => {
        if (approvalProfileStep.userUuid) {
            return ApproverType.User;
        }
        if (approvalProfileStep.roleUuid) {
            return ApproverType.Role;
        }
        if (approvalProfileStep.groupUuid) {
            return ApproverType.Group;
        }
    };

    const renderApproverRedirect = useCallback((approvalProfileStep: ProfileApprovalStepModel) => {
        if (approvalProfileStep.userUuid) {
            return <Link to={`../users/detail/${approvalProfileStep.userUuid}`}>{approvalProfileStep.username}</Link>;
        }
        if (approvalProfileStep.roleUuid) {
            return <Link to={`../roles/detail/${approvalProfileStep.roleUuid}`}>{approvalProfileStep.roleName}</Link>;
        }
        if (approvalProfileStep.groupUuid) {
            return <Link to={`../groups/detail/${approvalProfileStep.groupUuid}`}>{approvalProfileStep.roleName}</Link>;
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
        <div>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.ApprovalProfiles)} Inventory`, href: '/approvalprofiles' },
                    { label: profileApprovalDetail?.name || 'Approval Profile Details', href: '' },
                ]}
            />
            <Container className="md:grid grid-cols-2 items-start">
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
                <Widget title="Approval Profile Steps" busy={isBusy} widgetLockName={LockWidgetNameEnum.ApprovalProfileDetails}>
                    <CustomTable headers={stepsHeaders} data={stepsRows} />
                </Widget>
            </Container>
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
        </div>
    );
};

export default ApprovalProfileDetails;
