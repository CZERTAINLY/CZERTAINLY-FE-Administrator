import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import Select from 'react-select';
import React from 'react';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import Container from 'components/Container';
import Dialog from 'components/Dialog';
import SwitchWidget from 'components/SwitchWidget';
import Badge from 'components/Badge';
import CertificateStatus from '../CertificateStatus';
import Asn1Dialog from '../Asn1Dialog/Asn1Dialog';
import CertificateRenewDialog from '../CertificateRenewDialog';
import CertificateRekeyDialog from '../CertificateRekeyDialog';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { LockWidgetNameEnum } from 'types/user-interface';
import { createWidgetDetailHeaders } from 'utils/widget';
import { formatPEM } from 'utils/certificate';
import { useCopyToClipboard } from 'utils/common-hooks';
import { dateFormatter } from 'utils/dateUtil';
import { actions, selectors } from 'ducks/certificates';
import { actions as userInterfaceActions } from 'ducks/user-interface';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { selectors as groupSelectors } from 'ducks/certificateGroups';
import { selectors as userSelectors } from 'ducks/users';
import { selectors as raProfileSelectors } from 'ducks/ra-profiles';
import { CertificateDetailResponseModel } from 'types/certificate';
import {
    CertificateValidationResultDto,
    PlatformEnum,
    CertificateSubjectType,
    ComplianceStatus,
    CertificateRevocationReason,
    CertificateRequestFormat,
} from 'types/openapi';
import { CertificateState as CertStatus, CertificateProtocol, CertificateValidationStatus } from 'types/openapi';
import CertificateDownloadForm from './CertificateDownloadForm';
import { Button } from 'reactstrap';

interface SelectChangeValue {
    value: string;
    label: string;
}

interface Props {
    certificate: CertificateDetailResponseModel | undefined;
    validationResult: CertificateValidationResultDto | undefined;
    isBusy: boolean;
    getFreshCertificateDetail: () => void;
}

export default function CertificateDetailsContent({ certificate, validationResult, isBusy, getFreshCertificateDetail }: Props) {
    const dispatch = useDispatch();
    const copyToClipboard = useCopyToClipboard();

    const groupsList = useSelector(groupSelectors.certificateGroups);
    const raProfiles = useSelector(raProfileSelectors.raProfiles);
    const users = useSelector(userSelectors.users);
    const certificateRevocationReason = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateRevocationReason));
    const certificateKeyUsageEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateKeyUsage));
    const certificateProtocol = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateProtocol));
    const isArchiving = useSelector(selectors.isArchiving);
    const isUpdatingTrustedStatus = useSelector(selectors.isUpdatingTrustedStatus);
    const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
    const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
    const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [renew, setRenew] = useState(false);
    const [rekey, setRekey] = useState(false);
    const [revoke, setRevoke] = useState(false);
    const [updateGroup, setUpdateGroup] = useState(false);
    const [updateOwner, setUpdateOwner] = useState(false);
    const [updateRaProfile, setUpdateRaProfile] = useState(false);

    const [groups, setGroups] = useState<SelectChangeValue[]>([]);
    const [ownerUuid, setOwnerUuid] = useState<string>();
    const [raProfile, setRaProfile] = useState<string>();
    const [raProfileAuthorityUuid, setRaProfileAuthorityUuid] = useState<string>();
    const [revokeReason, setRevokeReason] = useState<CertificateRevocationReason>();

    const [certificateRevokeReasonOptions, setCertificateRevokeReasonOptions] = useState<{ label: string; value: string }[]>([]);
    const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
    const [raProfileOptions, setRaProfileOptions] = useState<{ label: string; value: string }[]>([]);

    const isCertificateArchived = !!certificate?.archived;

    useEffect(() => {
        if (!certificateRevocationReason) return;
        const options = Object.keys(certificateRevocationReason)
            .map((key) => ({
                value: certificateRevocationReason[key].code,
                label: certificateRevocationReason[key].label,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        setCertificateRevokeReasonOptions(options);
    }, [certificateRevocationReason]);

    useEffect(() => {
        setUserOptions(
            users.map((user) => ({
                value: user.uuid,
                label: `${user.firstName ? user.firstName + ' ' : ''}${user.lastName ? user.lastName + ' ' : ''}(${user.username})`,
            })),
        );
    }, [users]);

    useEffect(() => {
        setRaProfileOptions(
            raProfiles.map((profile) => ({ value: profile.uuid + ':#' + profile.authorityInstanceUuid, label: profile.name })),
        );
    }, [raProfiles]);

    useEffect(() => {
        const certificatePreselectedGroups = certificate?.groups?.length
            ? certificate.groups.map((group) => ({
                  value: group.uuid,
                  label: group.name,
              }))
            : [];
        setGroups(certificatePreselectedGroups);
    }, [certificate?.groups]);

    const groupOptions = useMemo(
        () =>
            groupsList.map((group) => ({
                value: group.uuid,
                label: group.name,
            })),
        [groupsList],
    );

    const certificateTitle = useMemo(
        () => (certificate?.state === CertStatus.Requested ? 'CSR Properties' : 'Certificate Properties'),
        [certificate?.state],
    );

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const onComplianceCheck = useCallback(() => {
        if (!certificate?.uuid) return;
        dispatch(actions.checkCompliance({ certificateUuids: [certificate.uuid] }));
    }, [dispatch, certificate]);

    const onDownloadClick = useCallback(() => {
        dispatch(
            userInterfaceActions.showGlobalModal({
                content: <CertificateDownloadForm />,
                isOpen: true,
                size: 'md',
                title: 'Download',
                icon: 'download',
            }),
        );
    }, [dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!certificate) return;
        dispatch(actions.deleteCertificate({ uuid: certificate.uuid }));
        setConfirmDelete(false);
    }, [certificate, dispatch]);

    const onRevoke = useCallback(() => {
        if (!certificate) return;
        dispatch(
            actions.revokeCertificate({
                uuid: certificate.uuid,
                revokeRequest: { reason: revokeReason || CertificateRevocationReason.Unspecified, attributes: [] },
                raProfileUuid: certificate.raProfile?.uuid || '',
                authorityUuid: certificate.raProfile?.authorityInstanceUuid || '',
            }),
        );
        setRevoke(false);
    }, [certificate, dispatch, revokeReason]);

    const onRenew = useCallback(
        (data: { fileContent?: string }) => {
            dispatch(
                actions.renewCertificate({
                    uuid: certificate?.uuid || '',
                    renewRequest: {
                        format: CertificateRequestFormat.Pkcs10,
                        request: data.fileContent,
                    },
                    raProfileUuid: certificate?.raProfile?.uuid || '',
                    authorityUuid: certificate?.raProfile?.authorityInstanceUuid || '',
                }),
            );
            setRenew(false);
        },
        [dispatch, certificate],
    );

    const onCancelGroupUpdate = useCallback(() => {
        setUpdateGroup(false);
        const certificatePreselectedGroups = certificate?.groups?.map((group) => ({
            value: group.uuid,
            label: group.name,
        }));
        setGroups(certificatePreselectedGroups || []);
    }, [certificate?.groups]);

    const onCancelOwnerUpdate = useCallback(() => {
        setUpdateOwner(false);
        setOwnerUuid(undefined);
    }, []);

    const onCancelRaProfileUpdate = useCallback(() => {
        setUpdateRaProfile(false);
        setRaProfile(undefined);
    }, []);

    const onUpdateGroup = useCallback(() => {
        if (!certificate || !groups) return;
        dispatch(actions.updateGroup({ uuid: certificate.uuid, updateGroupRequest: { groupUuids: groups.map((group) => group.value) } }));
        setUpdateGroup(false);
    }, [certificate, dispatch, groups]);

    const onUpdateOwner = useCallback(() => {
        if (!certificate || !ownerUuid || !users) return;
        const user = users.find((u) => u.uuid === ownerUuid);
        if (!user) return;
        dispatch(actions.updateOwner({ uuid: certificate.uuid, user, updateOwnerRequest: { ownerUuid: ownerUuid } }));
        setUpdateOwner(false);
    }, [certificate, dispatch, ownerUuid, users]);

    const onUpdateRaProfile = useCallback(() => {
        if (!certificate || !raProfile) return;
        dispatch(
            actions.updateRaProfile({
                uuid: certificate.uuid,
                updateRaProfileRequest: { raProfileUuid: raProfile },
                authorityUuid: raProfileAuthorityUuid || '',
            }),
        );
        setUpdateRaProfile(false);
    }, [certificate, dispatch, raProfile, raProfileAuthorityUuid]);

    const updateRaAndAuthorityState = useCallback((value: string) => {
        setRaProfile(value.split(':#')[0]);
        setRaProfileAuthorityUuid(value.split(':#')[1]);
    }, []);

    const switchCallback = useCallback(() => {
        if (!certificate) return;
        if (isUpdatingTrustedStatus) return;

        dispatch(
            actions.updateCertificateTrustedStatus({
                uuid: certificate.uuid,
                updateCertificateTrustedStatusRequest: {
                    trustedCa: !certificate.trustedCa,
                },
            }),
        );
    }, [certificate, isUpdatingTrustedStatus, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
            {
                icon: 'cubes',
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Requested || isCertificateArchived,
                tooltip: 'Issue',
                onClick: () => {
                    dispatch(
                        actions.issueCertificateNew({
                            certificateUuid: certificate?.uuid ?? '',
                            raProfileUuid: certificate?.raProfile?.uuid ?? '',
                            authorityUuid: certificate?.raProfile?.authorityInstanceUuid ?? '',
                        }),
                    );
                },
            },
            {
                icon: 'retweet',
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Issued || isCertificateArchived,
                tooltip: 'Renew',
                onClick: () => setRenew(true),
            },
            {
                icon: 'rekey',
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Issued || isCertificateArchived,
                tooltip: 'Rekey',
                onClick: () => setRekey(true),
            },
            {
                icon: 'minus-square',
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Issued || isCertificateArchived,
                tooltip: 'Revoke',
                onClick: () => setRevoke(true),
            },
            {
                icon: 'gavel',
                disabled: !certificate?.raProfile || !certificate?.certificateContent || isCertificateArchived,
                tooltip: 'Check Compliance',
                onClick: onComplianceCheck,
            },
            {
                icon: 'download',
                disabled: !certificate?.certificateContent,
                onClick: onDownloadClick,
            },
            {
                icon: 'copy',
                disabled: !certificate?.certificateContent,
                tooltip: 'Copy certificate content',
                onClick: () => {
                    copyToClipboard(
                        formatPEM(certificate?.certificateContent ?? ''),
                        'Certificate content was copied to clipboard',
                        'Failed to copy certificate content to clipboard',
                    );
                },
            },
            {
                icon: 'archive',
                disabled: isCertificateArchived || isArchiving,
                tooltip: 'Archive',
                onClick: () => {
                    dispatch(actions.archiveCertificate({ uuid: certificate?.uuid ?? '' }));
                },
            },
            {
                icon: 'unarchive',
                disabled: !isCertificateArchived || isArchiving,
                tooltip: 'Unarchive',
                onClick: () => {
                    dispatch(actions.unarchiveCertificate({ uuid: certificate?.uuid ?? '' }));
                },
            },
        ],
        [certificate, onComplianceCheck, dispatch, onDownloadClick, copyToClipboard, isCertificateArchived, isArchiving],
    );

    const detailData: TableDataRow[] = useMemo(() => {
        const certDetail = !certificate
            ? []
            : ([
                  {
                      id: 'commonName',
                      columns: [<span style={{ whiteSpace: 'nowrap' }}>Common Name</span>, certificate.commonName],
                  },
                  {
                      id: 'serialNumber',
                      columns: ['Serial Number', certificate.serialNumber || ''],
                  },
                  {
                      id: 'key',
                      columns: [
                          'Key',
                          certificate.key ? <Link to={`../keys/detail/${certificate.key.uuid}`}>{certificate.key.name}</Link> : '',
                      ],
                  },
                  certificate.hybridCertificate
                      ? {
                            id: 'altKey',
                            columns: [
                                'Alternative Key',
                                certificate.altKey ? (
                                    <Link to={`../keys/detail/${certificate.altKey.uuid}`}>{certificate.altKey.name}</Link>
                                ) : (
                                    ''
                                ),
                            ],
                        }
                      : null,
                  {
                      id: 'issuerCommonName',
                      columns: [
                          'Issuer Common Name',
                          certificate?.issuerCommonName && certificate?.issuerCertificateUuid ? (
                              <Link to={`../certificates/detail/${certificate.issuerCertificateUuid}`}>{certificate.issuerCommonName}</Link>
                          ) : certificate?.issuerCommonName ? (
                              certificate.issuerCommonName
                          ) : (
                              ''
                          ),
                      ],
                  },
                  {
                      id: 'issuerDN',
                      columns: ['Issuer DN', certificate.issuerDn || ''],
                  },
                  {
                      id: 'subjectDN',
                      columns: ['Subject DN', certificate.subjectDn],
                  },
                  {
                      id: 'validFrom',
                      columns: [
                          'Valid From',
                          certificate.notBefore ? <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(certificate.notBefore)}</span> : '',
                      ],
                  },
                  {
                      id: 'expiresAt',
                      columns: [
                          'Expires At',
                          certificate.notAfter ? <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(certificate.notAfter)}</span> : '',
                      ],
                  },
                  {
                      id: 'publicKeyAlgorithm',
                      columns: ['Public Key Algorithm', certificate.publicKeyAlgorithm],
                  },
                  certificate.hybridCertificate
                      ? {
                            id: 'altPublicKeyAlgorithm',
                            columns: ['Alternative Public Key Algorithm', certificate.altPublicKeyAlgorithm],
                        }
                      : null,
                  {
                      id: 'signatureAlgorithm',
                      columns: ['Signature Algorithm', certificate.signatureAlgorithm],
                  },
                  certificate.hybridCertificate
                      ? {
                            id: 'altSignatureAlgorithm',
                            columns: ['Alternative Signature Algorithm', certificate.altSignatureAlgorithm],
                        }
                      : null,
                  {
                      id: 'certState',
                      columns: ['State', <CertificateStatus status={certificate.state} />],
                  },
                  {
                      id: 'validationStatus',
                      columns: [
                          'Validation Status',
                          validationResult?.resultStatus ? (
                              <CertificateStatus status={validationResult?.resultStatus} />
                          ) : (
                              <CertificateStatus status={CertificateValidationStatus.NotChecked} />
                          ),
                      ],
                  },
                  {
                      id: 'complianceStatus',
                      columns: ['Compliance Status', <CertificateStatus status={certificate.complianceStatus || ComplianceStatus.Na} />],
                  },
                  {
                      id: 'fingerprint',
                      columns: ['Fingerprint', certificate.fingerprint || ''],
                  },
                  {
                      id: 'fingerprintAlgorithm',
                      columns: ['Fingerprint Algorithm', 'SHA256'],
                  },
                  {
                      id: 'keySize',
                      columns: ['Key Size', certificate.keySize.toString()],
                  },
                  certificate.hybridCertificate
                      ? {
                            id: 'altKeySize',
                            columns: ['Alternative Key Size', certificate.altKeySize?.toString()],
                        }
                      : null,
                  {
                      id: 'keyUsage',
                      columns: [
                          'Key Usage',
                          certificate?.keyUsage?.map(function (name) {
                              return (
                                  <div key={name} style={{ margin: '1px' }}>
                                      <Badge>{getEnumLabel(certificateKeyUsageEnum, name)}</Badge>
                                      &nbsp;
                                  </div>
                              );
                          }) || '',
                      ],
                  },
                  {
                      id: 'extendedKeyUsage',
                      columns: [
                          'Extended Key Usage',
                          certificate.extendedKeyUsage?.map(function (name) {
                              return (
                                  <div key={name} style={{ margin: '1px' }}>
                                      <Badge>{name}</Badge>
                                      &nbsp;
                                  </div>
                              );
                          }) || '',
                      ],
                  },
                  {
                      id: 'subjectType',
                      columns: [
                          'Subject Type',
                          certificate.subjectType ? <CertificateStatus status={certificate.subjectType} /> : <>n/a</>,
                      ],
                  },
                  {
                      id: 'archivationStatus',
                      columns: [
                          'Archived',
                          <Badge key="archivationStatus" color={isCertificateArchived ? 'secondary' : 'success'}>
                              {isCertificateArchived ? 'Yes' : 'No'}
                          </Badge>,
                      ],
                  },
              ].filter((el) => el !== null) as NonNullable<TableDataRow>[]);

        if (certificate?.state !== CertStatus.Requested) {
            certDetail.push({
                id: 'asn1structure',
                columns: [
                    'ASN.1 Structure',
                    certificate?.certificateContent ? <Asn1Dialog content={certificate.certificateContent} /> : <>n/a</>,
                ],
            });
        }

        if (certificate?.trustedCa !== undefined) {
            certDetail.unshift({
                id: 'trustedCa',
                columns: [
                    certificate?.subjectType == CertificateSubjectType.SelfSignedEndEntity ? 'Trusted Self-Signed' : 'Trusted CA',
                    <SwitchWidget disabled={isUpdatingTrustedStatus} checked={certificate.trustedCa ?? false} onClick={switchCallback} />,
                ],
            });
        }

        return certDetail;
    }, [
        certificate,
        validationResult?.resultStatus,
        isCertificateArchived,
        certificateKeyUsageEnum,
        isUpdatingTrustedStatus,
        switchCallback,
    ]);

    const sanData: TableDataRow[] = useMemo(() => {
        let sanList: TableDataRow[] = [];
        for (let [key, value] of Object.entries(certificate?.subjectAlternativeNames || {})) {
            if (value && Array.isArray(value) && value.length > 0) {
                sanList.push({
                    id: key,
                    columns: [key, value.join(', ')],
                });
            }
        }
        return sanList;
    }, [certificate]);

    const protocolHeader: TableHeader[] = useMemo(
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

    const protocolData: TableDataRow[] = useMemo(() => {
        const protocolInfo = certificate?.protocolInfo;
        if (!protocolInfo) return [];

        function getProtocolProfileLink(): string {
            if (!protocolInfo) return '';
            switch (protocolInfo.protocol) {
                case CertificateProtocol.Acme:
                    return `../acmeprofiles/detail/${protocolInfo.protocolProfileUuid}`;
                case CertificateProtocol.Cmp:
                    return `../cmpprofiles/detail/${protocolInfo.protocolProfileUuid}`;
                case CertificateProtocol.Scep:
                    return `../scepprofiles/detail/${protocolInfo.protocolProfileUuid}`;
            }
        }
        const data = [
            {
                id: 'protocol',
                columns: [
                    'Protocol Name',
                    <Badge key="protocol" color="secondary">
                        {getEnumLabel(certificateProtocol, protocolInfo.protocol)}
                    </Badge>,
                ],
            },
            {
                id: 'protocolProfileUuid',
                columns: [
                    'Protocol Profile UUID',
                    <Link key="protocolProfileUuid" to={getProtocolProfileLink()}>
                        {protocolInfo.protocolProfileUuid}
                    </Link>,
                ],
            },
        ];
        if (protocolInfo.protocol === CertificateProtocol.Acme && protocolInfo.additionalProtocolUuid) {
            data.push({
                id: 'additionalProfileUuid',
                columns: [
                    'Protocol Account UUID',
                    <Link
                        key="additionalProfileUuid"
                        to={`../acmeaccounts/detail/${protocolInfo.protocolProfileUuid}/${protocolInfo.additionalProtocolUuid}`}
                    >
                        {protocolInfo.additionalProtocolUuid}
                    </Link>,
                ],
            });
        }
        return data;
    }, [certificate?.protocolInfo, certificateProtocol]);

    const propertiesHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'attribute',
                content: 'Attribute',
            },
            {
                id: 'value',
                content: 'Value',
            },
            {
                id: 'action',
                content: 'Action',
            },
        ],
        [],
    );

    const propertiesData: TableDataRow[] = useMemo(() => {
        return !certificate
            ? []
            : [
                  {
                      id: 'uuid',
                      columns: ['UUID', certificate.uuid, ''],
                  },
                  {
                      id: 'owner',
                      columns: [
                          'Owner',
                          certificate?.ownerUuid ? (
                              <Link to={`../../users/detail/${certificate.ownerUuid}`}>{certificate.owner ?? 'Unassigned'}</Link>
                          ) : (
                              (certificate.owner ?? 'Unassigned')
                          ),
                          <div className="d-flex">
                              <Button
                                  disabled={isCertificateArchived}
                                  className="btn btn-link"
                                  size="sm"
                                  color="secondary"
                                  onClick={() => {
                                      setOwnerUuid(undefined);
                                      setUpdateOwner(true);
                                  }}
                                  title="Update Owner"
                              >
                                  <i className="fa fa-pencil-square-o" />
                              </Button>

                              <Button
                                  className="btn btn-link"
                                  size="sm"
                                  color="secondary"
                                  disabled={!certificate?.ownerUuid || isCertificateArchived}
                                  onClick={() => {
                                      if (!certificate?.ownerUuid || !certificate?.uuid) return;
                                      dispatch(
                                          actions.deleteOwner({
                                              uuid: certificate.uuid,
                                          }),
                                      );
                                  }}
                              >
                                  <i className="fa fa-trash text-danger" />
                              </Button>
                          </div>,
                      ],
                  },
                  {
                      id: 'groups',
                      columns: [
                          'Groups',
                          certificate?.groups?.length
                              ? certificate?.groups.map((group, i) => (
                                    <React.Fragment key={group.uuid}>
                                        <Link to={`../../groups/detail/${group.uuid}`}>{group.name}</Link>
                                        {certificate?.groups?.length && i !== certificate.groups.length - 1 ? `, ` : ``}
                                    </React.Fragment>
                                ))
                              : 'Unassigned',
                          <div className="d-flex">
                              <Button
                                  disabled={isCertificateArchived}
                                  className="btn btn-link"
                                  size="sm"
                                  color="secondary"
                                  onClick={() => setUpdateGroup(true)}
                                  title="Update Group"
                              >
                                  <i className="fa fa-pencil-square-o" />
                              </Button>
                              <Button
                                  className="btn btn-link"
                                  size="sm"
                                  color="secondary"
                                  disabled={!certificate?.groups?.length || isCertificateArchived}
                                  onClick={() => {
                                      if (!certificate?.uuid) return;
                                      dispatch(
                                          actions.deleteGroups({
                                              uuid: certificate.uuid,
                                          }),
                                      );
                                  }}
                              >
                                  <i className="fa fa-trash text-danger" />
                              </Button>
                          </div>,
                      ],
                  },
                  {
                      id: 'raProfile',
                      columns: [
                          'RA Profile',
                          certificate?.raProfile?.name ? (
                              <Link
                                  to={`../../raProfiles/detail/${certificate?.raProfile.authorityInstanceUuid}/${certificate?.raProfile.uuid}`}
                              >
                                  {certificate?.raProfile.name}
                              </Link>
                          ) : (
                              'Unassigned'
                          ),
                          <div className="d-flex">
                              <Button
                                  disabled={isCertificateArchived}
                                  className="btn btn-link"
                                  size="sm"
                                  color="secondary"
                                  onClick={() => setUpdateRaProfile(true)}
                                  title="Update RA Profile"
                              >
                                  <i className="fa fa-pencil-square-o" />
                              </Button>
                              <Button
                                  className="btn btn-link"
                                  size="sm"
                                  color="secondary"
                                  disabled={!certificate?.raProfile?.uuid || isCertificateArchived}
                                  onClick={() => {
                                      if (!certificate?.raProfile?.authorityInstanceUuid || !certificate?.uuid) return;
                                      dispatch(
                                          actions.deleteRaProfile({
                                              uuid: certificate.uuid,
                                          }),
                                      );
                                  }}
                              >
                                  <i className="fa fa-trash text-danger" />
                              </Button>
                          </div>,
                      ],
                  },
                  {
                      id: 'type',
                      columns: ['Type', certificate.certificateType || '', ''],
                  },
              ];
    }, [certificate, dispatch, isCertificateArchived]);

    return (
        <>
            <Container className="md:grid grid-cols-2 items-start">
                <Widget
                    title={certificateTitle}
                    busy={isBusy}
                    widgetButtons={buttons}
                    titleSize="large"
                    lockSize="large"
                    widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                    refreshAction={getFreshCertificateDetail}
                >
                    <CustomTable hasPagination={false} headers={detailHeaders} data={detailData} />
                </Widget>
                <Container>
                    <Widget title="Subject Alternative Names" busy={isBusy} titleSize="large">
                        <CustomTable headers={detailHeaders} data={sanData} />
                    </Widget>
                    {certificate?.protocolInfo && (
                        <Widget title="Protocol" busy={isBusy} titleSize="large">
                            <CustomTable headers={protocolHeader} data={protocolData} />
                        </Widget>
                    )}
                    <Widget title="Other Properties" busy={isBusy} titleSize="large">
                        <CustomTable headers={propertiesHeaders} data={propertiesData} />
                    </Widget>
                </Container>
            </Container>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Certificate"
                body="You are about to delete a Certificate. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={renew}
                caption={`Renew Certificate`}
                body={
                    <CertificateRenewDialog
                        onCancel={() => setRenew(false)}
                        onRenew={onRenew}
                        allowWithoutFile={certificate?.privateKeyAvailability || false}
                    />
                }
                toggle={() => setRenew(false)}
                buttons={[]}
            />

            <Dialog
                size="lg"
                isOpen={rekey}
                caption={`Rekey Certificate`}
                body={<CertificateRekeyDialog onCancel={() => setRekey(false)} certificate={certificate} />}
                toggle={() => setRekey(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={revoke}
                caption={`Revoke Certificate`}
                body={
                    <div>
                        <Select
                            maxMenuHeight={140}
                            menuPlacement="auto"
                            options={certificateRevokeReasonOptions}
                            placeholder={`Select Revocation Reason`}
                            onChange={(event: any) => setRevokeReason(event?.value as CertificateRevocationReason)}
                        />
                    </div>
                }
                toggle={() => setRevoke(false)}
                buttons={[
                    { color: 'primary', onClick: onRevoke, body: 'Revoke' },
                    { color: 'secondary', variant: 'outline', onClick: () => setRevoke(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={updateGroup}
                caption={`Update Groups`}
                body={
                    <div>
                        <Select
                            maxMenuHeight={140}
                            menuPlacement="auto"
                            options={groupOptions}
                            placeholder={`Select Groups`}
                            value={groups}
                            onChange={(event) => {
                                const newGroupsList = event.length ? [...event] : [];
                                setGroups(newGroupsList);
                            }}
                            isMulti
                        />
                    </div>
                }
                toggle={onCancelGroupUpdate}
                buttons={[
                    { color: 'primary', onClick: onUpdateGroup, body: 'Update', disabled: isUpdatingGroup },
                    { color: 'secondary', variant: 'outline', onClick: onCancelGroupUpdate, body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={updateOwner}
                caption={`Update Owner`}
                body={
                    <Select
                        maxMenuHeight={140}
                        menuPlacement="auto"
                        options={userOptions}
                        placeholder={`Select Owner`}
                        onChange={(event) => setOwnerUuid(event?.value)}
                    />
                }
                toggle={onCancelOwnerUpdate}
                buttons={[
                    { color: 'primary', onClick: onUpdateOwner, body: 'Update', disabled: ownerUuid === undefined || isUpdatingOwner },
                    { color: 'secondary', variant: 'outline', onClick: onCancelOwnerUpdate, body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={updateRaProfile}
                caption={`Update RA Profile`}
                body={
                    <div>
                        <Select
                            maxMenuHeight={140}
                            menuPlacement="auto"
                            options={raProfileOptions}
                            placeholder={`Select RA Profile`}
                            onChange={(event) => updateRaAndAuthorityState(event?.value || '')}
                        />
                    </div>
                }
                toggle={onCancelRaProfileUpdate}
                buttons={[
                    {
                        color: 'primary',
                        onClick: onUpdateRaProfile,
                        body: 'Update',
                        disabled: raProfile === undefined || isUpdatingRaProfile,
                    },
                    { color: 'secondary', variant: 'outline', onClick: onCancelRaProfileUpdate, body: 'Cancel' },
                ]}
            />
        </>
    );
}
