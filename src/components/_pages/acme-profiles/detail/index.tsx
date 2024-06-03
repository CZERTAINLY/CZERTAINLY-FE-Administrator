import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/acme-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';

export default function AdministratorDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const acmeProfile = useSelector(selectors.acmeProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isDisabling = useSelector(selectors.isDisabling);
    const isEnabling = useSelector(selectors.isEnabling);

    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetchingDetail || isDisabling || isEnabling, [isFetchingDetail, isDisabling, isEnabling]);

    const getFreshAcmeProfile = useCallback(() => {
        if (!id) return;
        dispatch(actions.getAcmeProfile({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshAcmeProfile();
    }, [id, getFreshAcmeProfile]);

    const onEditClick = useCallback(() => {
        navigate(`../../acmeprofiles/edit/${acmeProfile?.uuid}`);
    }, [acmeProfile, navigate]);

    const onEnableClick = useCallback(() => {
        if (!acmeProfile) return;

        dispatch(actions.enableAcmeProfile({ uuid: acmeProfile.uuid }));
    }, [acmeProfile, dispatch]);

    const onDisableClick = useCallback(() => {
        if (!acmeProfile) return;

        dispatch(actions.disableAcmeProfile({ uuid: acmeProfile.uuid }));
    }, [acmeProfile, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!acmeProfile) return;

        dispatch(actions.deleteAcmeProfile({ uuid: acmeProfile.uuid }));
        setConfirmDelete(false);
    }, [acmeProfile, dispatch]);

    const onForceDeleteAcmeProfile = useCallback(() => {
        if (!acmeProfile) return;

        dispatch(actions.bulkForceDeleteAcmeProfiles({ uuids: [acmeProfile.uuid], redirect: `../acmeprofiles` }));
    }, [acmeProfile, dispatch]);

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
                disabled: acmeProfile?.enabled || false,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: !(acmeProfile?.enabled || false),
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [acmeProfile, onEditClick, onDisableClick, onEnableClick],
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

    const acmeProfileDetailData: TableDataRow[] = useMemo(
        () =>
            !acmeProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', acmeProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', acmeProfile.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', acmeProfile.description || ''],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={acmeProfile.enabled} />],
                      },
                      {
                          id: 'websiteUrl',
                          columns: ['Website URL', acmeProfile.websiteUrl || 'N/A'],
                      },
                      {
                          id: 'retryInterval',
                          columns: ['Retry Interval', `${acmeProfile.retryInterval || 'N/A'} (seconds)`],
                      },
                      {
                          id: 'orderValidity',
                          columns: ['Order Validity', `${acmeProfile.validity || 'N/A'} (seconds)`],
                      },
                      {
                          id: 'directoryUrl',
                          columns: ['Directory URL', acmeProfile.directoryUrl || 'N/A'],
                      },
                  ],
        [acmeProfile],
    );

    const raProfileDetailData: TableDataRow[] = useMemo(
        () =>
            !acmeProfile || !acmeProfile.raProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', acmeProfile.raProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: [
                              'Name',
                              acmeProfile.raProfile?.uuid ? (
                                  <Link
                                      to={`../../raprofiles/detail/${acmeProfile.raProfile.authorityInstanceUuid}/${acmeProfile.raProfile.uuid}`}
                                  >
                                      {acmeProfile.raProfile.name}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={acmeProfile.raProfile.enabled} />],
                      },
                  ],
        [acmeProfile],
    );

    const dnsData: TableDataRow[] = useMemo(
        () =>
            !acmeProfile
                ? []
                : [
                      {
                          id: 'dnsResolverIpAddress',
                          columns: ['DNS Resolver IP Address', acmeProfile.dnsResolverIp || 'N/A'],
                      },
                      {
                          id: 'dnsResolverPort',
                          columns: ['DNS Resolver Port', acmeProfile.dnsResolverPort || 'N/A'],
                      },
                  ],
        [acmeProfile],
    );

    const termsOfServiceData: TableDataRow[] = useMemo(
        () =>
            !acmeProfile
                ? []
                : [
                      {
                          id: 'termsOfServiceUrl',
                          columns: ['Terms of Service URL', acmeProfile.termsOfServiceUrl || 'N/A'],
                      },
                      {
                          id: 'changesToTermsOfServiceUrl',
                          columns: ['Changes of Terms of Service URL', acmeProfile.termsOfServiceChangeUrl || 'N/A'],
                      },
                      {
                          id: 'disableNewOrderPlacement',
                          columns: [
                              'Disable new Order placement? (due to change in Terms Of Service)',
                              acmeProfile.termsOfServiceChangeDisable !== undefined
                                  ? acmeProfile.termsOfServiceChangeDisable
                                      ? 'Yes'
                                      : 'No'
                                  : 'N/A',
                          ],
                      },
                      {
                          id: 'requireContact',
                          columns: [
                              'Require Contact information for new Accounts?',
                              acmeProfile.requireContact !== undefined ? (acmeProfile.requireContact ? 'Yes' : 'No') : 'N/A',
                          ],
                      },
                      {
                          id: 'requireAgreement',
                          columns: [
                              'Require Agreement for new Accounts?',
                              acmeProfile.requireTermsOfService !== undefined ? (acmeProfile.requireTermsOfService ? 'Yes' : 'No') : 'N/A',
                          ],
                      },
                  ],
        [acmeProfile],
    );

    const raProfileText = useMemo(
        () => (raProfileDetailData.length > 0 ? 'RA Profile Configuration' : 'Default RA Profile not selected'),
        [raProfileDetailData],
    );

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        title="ACME Profile Details"
                        busy={isBusy}
                        widgetButtons={buttons}
                        titleSize="large"
                        refreshAction={getFreshAcmeProfile}
                        widgetLockName={LockWidgetNameEnum.ACMEProfileDetails}
                        lockSize="large"
                    >
                        <CustomTable headers={tableHeader} data={acmeProfileDetailData} />
                    </Widget>
                </Col>

                <Col>
                    <Widget title="DNS" busy={isBusy} titleSize="large">
                        <CustomTable headers={tableHeader} data={dnsData} />
                    </Widget>

                    <Widget title="Terms of Service" busy={isBusy} titleSize="large">
                        <CustomTable headers={tableHeader} data={termsOfServiceData} />
                    </Widget>
                </Col>
            </Row>

            {acmeProfile && (
                <CustomAttributeWidget
                    resource={Resource.AcmeProfiles}
                    resourceUuid={acmeProfile.uuid}
                    attributes={acmeProfile.customAttributes}
                />
            )}

            <Widget title={raProfileText} busy={isBusy} titleSize="large">
                {raProfileDetailData.length === 0 ? (
                    <></>
                ) : (
                    <>
                        <CustomTable headers={tableHeader} data={raProfileDetailData} />

                        <Row xs="1" sm="1" md="2" lg="2" xl="2">
                            <Col>
                                {acmeProfile?.issueCertificateAttributes === undefined ||
                                acmeProfile.issueCertificateAttributes.length === 0 ? (
                                    <></>
                                ) : (
                                    <Widget title="List of Attributes to Issue Certificate" busy={isBusy}>
                                        <AttributeViewer attributes={acmeProfile?.issueCertificateAttributes} />
                                    </Widget>
                                )}
                            </Col>

                            <Col>
                                {acmeProfile?.revokeCertificateAttributes === undefined ||
                                acmeProfile.revokeCertificateAttributes.length === 0 ? (
                                    <></>
                                ) : (
                                    <Widget title="List of Attributes to Revoke Certificate" busy={isBusy}>
                                        <AttributeViewer attributes={acmeProfile?.revokeCertificateAttributes} />
                                    </Widget>
                                )}
                            </Col>
                        </Row>
                    </>
                )}
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete ACME Profile"
                body="You are about to delete ACME Profile which may have associated ACME
                  Account(s). When deleted the ACME Account(s) will be revoked."
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete ACME Profile"
                body={
                    <>
                        Failed to delete the ACME Profile that has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    { color: 'danger', onClick: onForceDeleteAcmeProfile, body: 'Force' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
