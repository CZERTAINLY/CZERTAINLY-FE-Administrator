import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import Container from 'components/Container';
import Breadcrumb from 'components/Breadcrumb';

import { actions as vaultProfileActions, selectors as vaultProfileSelectors } from 'ducks/vault-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';

import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource } from 'types/openapi';
import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import { createWidgetDetailHeaders } from 'utils/widget';
import Badge from 'components/Badge';
import VaultProfileEditForm from '../edit-form';

function VaultProfileDetail() {
    const dispatch = useDispatch();

    const { vaultUuid, id: vaultProfileUuid } = useParams<{ vaultUuid: string; id: string }>();

    const profile = useSelector(vaultProfileSelectors.vaultProfile);
    const isFetchingDetail = useSelector(vaultProfileSelectors.isFetchingDetail);
    const isEnabling = useSelector(vaultProfileSelectors.isEnabling);
    const isDisabling = useSelector(vaultProfileSelectors.isDisabling);
    const isDeleting = useSelector(vaultProfileSelectors.isDeleting);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const getFreshDetails = useCallback(() => {
        if (!vaultUuid || !vaultProfileUuid) return;
        dispatch(vaultProfileActions.resetState());
        dispatch(
            vaultProfileActions.getVaultProfileDetail({
                vaultUuid,
                vaultProfileUuid,
            }),
        );
    }, [dispatch, vaultUuid, vaultProfileUuid]);

    useEffect(() => {
        getFreshDetails();
    }, [getFreshDetails]);

    const onApprove = useCallback(() => {
        if (!vaultUuid || !vaultProfileUuid) return;
        dispatch(
            vaultProfileActions.enableVaultProfile({
                vaultUuid,
                vaultProfileUuid,
            }),
        );
    }, [dispatch, vaultUuid, vaultProfileUuid]);

    const onDisapprove = useCallback(() => {
        if (!vaultUuid || !vaultProfileUuid) return;
        dispatch(
            vaultProfileActions.disableVaultProfile({
                vaultUuid,
                vaultProfileUuid,
            }),
        );
    }, [dispatch, vaultUuid, vaultProfileUuid]);

    const onDeleteConfirmed = useCallback(() => {
        if (!vaultUuid || !vaultProfileUuid) return;
        dispatch(
            vaultProfileActions.deleteVaultProfile({
                vaultUuid,
                vaultProfileUuid,
            }),
        );
        setConfirmDelete(false);
    }, [dispatch, vaultUuid, vaultProfileUuid]);

    const handleCloseEdit = useCallback(() => setIsEditOpen(false), []);

    const widgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'check',
                disabled: !profile || profile.enabled,
                tooltip: 'Approve',
                onClick: onApprove,
            },
            {
                icon: 'times',
                disabled: !profile || !profile.enabled,
                tooltip: 'Disapprove',
                onClick: onDisapprove,
            },
            {
                icon: 'pencil',
                disabled: !profile,
                tooltip: 'Edit',
                onClick: () => setIsEditOpen(true),
            },
            {
                icon: 'trash',
                disabled: !profile,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [profile, onApprove, onDisapprove],
    );

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            profile
                ? [
                      {
                          id: 'description',
                          columns: ['Description', profile.description ?? ''],
                      },
                      {
                          id: 'vault',
                          columns: [
                              'Vault',
                              profile.vaultInstance ? (
                                  <Link to={`/${Resource.Vaults.toLowerCase()}/detail/${profile.vaultInstance.uuid}`}>
                                      {profile.vaultInstance.name}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'status',
                          columns: [
                              'Status',
                              <Badge key="status" color={profile.enabled ? 'success' : 'secondary'}>
                                  {profile.enabled ? 'Enabled' : 'Disabled'}
                              </Badge>,
                          ],
                      },
                  ]
                : [],
        [profile],
    );

    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        label: getEnumLabel(resourceEnum, Resource.VaultProfiles),
                        href: `/${Resource.VaultProfiles.toLowerCase()}`,
                    },
                    { label: profile?.name ?? 'Vault Profile Details', href: '' },
                ]}
            />

            <div className="space-y-4">
                <Container className="grid gap-6 xl:grid-cols-2 items-start">
                    <Widget
                        title="Vault Details"
                        busy={isFetchingDetail || isEnabling || isDisabling || isDeleting}
                        widgetButtons={widgetButtons}
                        titleSize="large"
                        refreshAction={getFreshDetails}
                        widgetLockName={LockWidgetNameEnum.VaultDetails}
                        lockSize="large"
                    >
                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Container>

                {profile && (
                    <Container>
                        <CustomAttributeWidget
                            resource={Resource.VaultProfiles}
                            resourceUuid={profile.uuid}
                            attributes={profile.customAttributes}
                        />
                    </Container>
                )}

                <Dialog
                    isOpen={isEditOpen}
                    caption="Edit Vault Profile"
                    body={
                        profile && vaultUuid ? (
                            <VaultProfileEditForm
                                profile={profile}
                                vaultUuid={vaultUuid}
                                onCancel={handleCloseEdit}
                                onSuccess={handleCloseEdit}
                            />
                        ) : null
                    }
                    toggle={handleCloseEdit}
                    size="lg"
                />

                <Dialog
                    isOpen={confirmDelete}
                    caption="Delete Vault Profile"
                    body="You are about to delete this Vault Profile. Is this what you want to do?"
                    toggle={() => setConfirmDelete(false)}
                    icon="delete"
                    buttons={[
                        { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                        {
                            color: 'secondary',
                            variant: 'outline',
                            onClick: () => setConfirmDelete(false),
                            body: 'Cancel',
                        },
                    ]}
                />
            </div>
        </div>
    );
}

export default VaultProfileDetail;
