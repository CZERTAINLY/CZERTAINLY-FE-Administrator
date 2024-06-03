import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import SwitchField from 'components/Input/SwitchField';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';

import { WidgetButtonProps } from 'components/WidgetButtons';
import CertificateStatus from 'components/_pages/certificates/CertificateStatus';

import { actions, selectors } from 'ducks/scep-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function ScepProfileDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const scepProfile = useSelector(selectors.scepProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isDisabling = useSelector(selectors.isDisabling);
    const isEnabling = useSelector(selectors.isEnabling);

    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetchingDetail || isDisabling || isEnabling, [isFetchingDetail, isDisabling, isEnabling]);

    const getFreshScepProfile = useCallback(() => {
        if (!id) return;
        dispatch(actions.getScepProfile({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshScepProfile();
    }, [id, getFreshScepProfile]);

    const onEditClick = useCallback(() => {
        navigate(`../../scepprofiles/edit/${scepProfile?.uuid}`);
    }, [scepProfile, navigate]);

    const onEnableClick = useCallback(() => {
        if (!scepProfile) return;

        dispatch(actions.enableScepProfile({ uuid: scepProfile.uuid }));
    }, [scepProfile, dispatch]);

    const onDisableClick = useCallback(() => {
        if (!scepProfile) return;

        dispatch(actions.disableScepProfile({ uuid: scepProfile.uuid }));
    }, [scepProfile, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!scepProfile) return;

        dispatch(actions.deleteScepProfile({ uuid: scepProfile.uuid }));
        setConfirmDelete(false);
    }, [scepProfile, dispatch]);

    const onForceDeleteScepProfile = useCallback(() => {
        if (!scepProfile) return;

        dispatch(actions.bulkForceDeleteScepProfiles({ uuids: [scepProfile.uuid], redirect: `../scepprofiles` }));
    }, [scepProfile, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'check',
                disabled: scepProfile?.enabled || false,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: !(scepProfile?.enabled || false),
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [scepProfile, onEditClick, onDisableClick, onEnableClick],
    );

    const tableHeader: TableHeader[] = useMemo(
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

    const scepProfileDetailData: TableDataRow[] = useMemo(
        () =>
            !scepProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', scepProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', scepProfile.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', scepProfile.description || ''],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={scepProfile.enabled} />],
                      },
                      {
                          id: 'renewThreshold',
                          columns: ['Renew Threshold', scepProfile.renewThreshold?.toString() || 'N/A'],
                      },
                      {
                          id: 'includeCaCertificate',
                          columns: [
                              'Include CA Certificate',
                              <Form
                                  onSubmit={() => {}}
                                  render={() => (
                                      <SwitchField
                                          disabled
                                          viewOnly={{ checked: scepProfile.includeCaCertificate }}
                                          id="includeCaCertificateSwitch"
                                          label=""
                                      />
                                  )}
                              />,
                          ],
                      },
                      {
                          id: 'includeCaCertificateChain',
                          columns: [
                              'Include CA Certificate Chain',
                              <Form
                                  onSubmit={() => {}}
                                  render={() => (
                                      <SwitchField
                                          disabled
                                          viewOnly={{ checked: scepProfile.includeCaCertificateChain }}
                                          id="includeCaCertificateChainSwitch"
                                          label=""
                                      />
                                  )}
                              />,
                          ],
                      },
                      {
                          id: 'intuneEnabled',
                          columns: [
                              'Intune Enabled',
                              <Form
                                  onSubmit={() => {}}
                                  render={() => (
                                      <SwitchField
                                          disabled
                                          viewOnly={{ checked: !!scepProfile.enableIntune }}
                                          id="intuneEnabledSwitch"
                                          label=""
                                      />
                                  )}
                              />,
                          ],
                      },
                      {
                          id: 'scepUrl',
                          columns: ['URL', scepProfile.scepUrl || 'N/A'],
                      },
                  ],
        [scepProfile],
    );

    const intuneDetailData: TableDataRow[] = useMemo(
        () =>
            !scepProfile
                ? []
                : [
                      {
                          id: 'intuneTenant',
                          columns: ['Intune Tenant', scepProfile.intuneTenant ?? ''],
                      },
                      {
                          id: 'intuneApplicationId',
                          columns: ['Intune Application ID', scepProfile.intuneApplicationId ?? ''],
                      },
                  ],
        [scepProfile],
    );

    const raProfileDetailData: TableDataRow[] = useMemo(
        () =>
            !scepProfile || !scepProfile.raProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', scepProfile.raProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: [
                              'Name',
                              scepProfile.raProfile?.uuid ? (
                                  <Link
                                      to={`../../raprofiles/detail/${scepProfile.raProfile.authorityInstanceUuid}/${scepProfile.raProfile.uuid}`}
                                  >
                                      {scepProfile.raProfile.name}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={scepProfile.raProfile.enabled} />],
                      },
                  ],
        [scepProfile],
    );

    const certificateDetailData: TableDataRow[] = useMemo(
        () =>
            !scepProfile || !scepProfile.caCertificate
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', scepProfile.caCertificate.uuid],
                      },
                      {
                          id: 'name',
                          columns: [
                              'Name',
                              scepProfile.caCertificate?.uuid ? (
                                  <Link to={`../../certificates/detail/${scepProfile.caCertificate.uuid}`}>
                                      {scepProfile.caCertificate.commonName}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <CertificateStatus status={scepProfile.caCertificate.state} />],
                      },
                  ],
        [scepProfile],
    );

    const RAProfileDetailsTitle = useMemo(
        () => (raProfileDetailData.length > 0 ? 'RA Profile Configuration' : 'Default RA Profile not selected'),
        [raProfileDetailData],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="SCEP Profile Details"
                busy={isBusy}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshScepProfile}
                widgetLockName={LockWidgetNameEnum.SCEPProfileDetails}
            >
                <CustomTable headers={tableHeader} data={scepProfileDetailData} />
            </Widget>

            {scepProfile && (
                <CustomAttributeWidget
                    resource={Resource.ScepProfiles}
                    resourceUuid={scepProfile.uuid}
                    attributes={scepProfile.customAttributes}
                />
            )}

            {scepProfile && scepProfile.enableIntune && (
                <Widget title={'Intune Configuration'} busy={isBusy}>
                    <CustomTable headers={tableHeader} data={intuneDetailData} />
                </Widget>
            )}

            <Widget title={'CA Certificate Configuration'} busy={isBusy} titleSize="large">
                {certificateDetailData.length === 0 ? (
                    <></>
                ) : (
                    <>
                        <CustomTable headers={tableHeader} data={certificateDetailData} />
                    </>
                )}
            </Widget>

            <Widget title={RAProfileDetailsTitle} busy={isBusy} titleSize="large">
                {raProfileDetailData.length === 0 ? (
                    <></>
                ) : (
                    <>
                        <CustomTable headers={tableHeader} data={raProfileDetailData} />

                        {scepProfile?.issueCertificateAttributes === undefined || scepProfile.issueCertificateAttributes.length === 0 ? (
                            <></>
                        ) : (
                            <Widget title="List of Attributes to Issue Certificate" busy={isBusy}>
                                <AttributeViewer attributes={scepProfile?.issueCertificateAttributes} />
                            </Widget>
                        )}
                    </>
                )}
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete SCEP Profile"
                body="You are about to delete SCEP Profile which may have associated SCEP
                  Account(s). When deleted the SCEP Account(s) will be revoked."
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete SCEP Profile"
                body={
                    <>
                        Failed to delete the SCEP Profile that has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    { color: 'danger', onClick: onForceDeleteScepProfile, body: 'Force' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
