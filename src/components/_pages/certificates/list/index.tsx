import { TableDataRow, TableHeader } from 'components/CustomTable';

import Dialog from 'components/Dialog';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/certificates';
import { EntityType } from 'ducks/filters';
import { selectors as pagingSelectors } from 'ducks/paging';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { Badge, Container, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';

import { ApiClients } from 'api';
import PagedList from 'components/PagedList/PagedList';
import { actions as userAction, selectors as userSelectors } from 'ducks/users';
import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';
import { dateFormatter } from 'utils/dateUtil';
import { AttributeRequestModel } from '../../../../types/attributes';
import { CertificateType, PlatformEnum } from '../../../../types/openapi';
import CertificateGroupDialog from '../CertificateGroupDialog';
import CertificateOwnerDialog from '../CertificateOwnerDialog';
import CertificateRAProfileDialog from '../CertificateRAProfileDialog';
import CertificateStatus from '../CertificateStatus';
import CertificateUploadDialog from '../CertificateUploadDialog';

interface Props {
    selectCertsOnly?: boolean;
    multiSelect?: boolean;
    onCheckedRowsChanged?: (checkedRows: (string | number)[]) => void;
    hideWidgetButtons?: boolean;
}

export default function CertificateList({
    hideWidgetButtons = false,
    selectCertsOnly = false,
    multiSelect = true,
    onCheckedRowsChanged,
}: Props) {
    const dispatch = useDispatch();

    const certificates = useSelector(selectors.certificates);
    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.CERTIFICATE));
    const users = useSelector(userSelectors.users);

    const isIssuing = useSelector(selectors.isIssuing);
    const isRevoking = useSelector(selectors.isRevoking);
    const isRenewing = useSelector(selectors.isRenewing);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
    const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);
    const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
    const isBulkUpdatingGroup = useSelector(selectors.isBulkUpdatingGroup);
    const isBulkUpdatingRaProfile = useSelector(selectors.isBulkUpdatingRaProfile);
    const isBulkUpdatingOwner = useSelector(selectors.isBulkUpdatingOwner);
    const isUploading = useSelector(selectors.isUploading);
    const certificateTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateType));

    const [upload, setUpload] = useState<boolean>(false);
    const [updateGroup, setUpdateGroup] = useState<boolean>(false);
    const [updateOwner, setUpdateOwner] = useState<boolean>(false);
    const [updateEntity, setUpdateEntity] = useState<boolean>(false);
    const [updateRaProfile, setUpdateRaProfile] = useState<boolean>(false);

    const isBusy =
        isIssuing ||
        isRevoking ||
        isRenewing ||
        isDeleting ||
        isBulkDeleting ||
        isUpdatingGroup ||
        isUpdatingRaProfile ||
        isUpdatingOwner ||
        isBulkUpdatingGroup ||
        isBulkUpdatingRaProfile ||
        isBulkUpdatingOwner ||
        isUploading;

    useEffect(() => {
        dispatch(actions.clearDeleteErrorMessages());
    }, [dispatch]);

    const getUserList = useCallback(() => {
        dispatch(userAction.list());
    }, [dispatch]);

    useEffect(() => {
        if (onCheckedRowsChanged) {
            onCheckedRowsChanged(checkedRows);
        }
    }, [checkedRows, onCheckedRowsChanged]);

    const onUploadClick = useCallback(
        (data: { fileContent: string; customAttributes?: Array<AttributeRequestModel> }) => {
            if (data.fileContent) {
                try {
                    dispatch(actions.uploadCertificate({ certificate: data.fileContent, customAttributes: data.customAttributes ?? [] }));
                } catch (error) {}
            }

            setUpload(false);
        },
        [dispatch],
    );

    const downloadDropDown = useMemo(
        () => (
            <UncontrolledButtonDropdown>
                <DropdownToggle color="light" caret className="btn btn-link" disabled={checkedRows.length === 0} title="Download">
                    <i className="fa fa-download" aria-hidden="true" />
                </DropdownToggle>

                <DropdownMenu>
                    <DropdownItem
                        key="pem"
                        onClick={() => {
                            dispatch(actions.getCertificateContents({ uuids: checkedRows, format: 'pem' }));
                        }}
                    >
                        PEM (.pem)
                    </DropdownItem>

                    <DropdownItem
                        key="der"
                        onClick={() => {
                            dispatch(actions.getCertificateContents({ uuids: checkedRows, format: 'cer' }));
                        }}
                    >
                        DER (.cer)
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        ),
        [dispatch, checkedRows],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () =>
            selectCertsOnly
                ? []
                : [
                      {
                          icon: 'upload',
                          disabled: false,
                          tooltip: 'Upload Certificate',
                          onClick: () => {
                              setUpload(true);
                          },
                      },
                      {
                          icon: 'group',
                          disabled: checkedRows.length === 0,
                          tooltip: 'Update Group',
                          onClick: () => {
                              setUpdateGroup(true);
                          },
                      },
                      {
                          icon: 'user',
                          disabled: checkedRows.length === 0,
                          tooltip: 'Update Owner',
                          onClick: () => {
                              getUserList();
                              setUpdateOwner(true);
                          },
                      },
                      // { icon: "cubes", disabled: true, tooltip: "Update Entity", onClick: () => { setUpdateEntity(true) } },
                      {
                          icon: 'plug',
                          disabled: checkedRows.length === 0,
                          tooltip: 'Update RA Profile',
                          onClick: () => {
                              setUpdateRaProfile(true);
                          },
                      },
                      {
                          icon: 'download',
                          disabled: checkedRows.length === 0,
                          tooltip: 'Download',
                          custom: downloadDropDown,
                          onClick: () => {},
                      },
                  ],
        [checkedRows.length, downloadDropDown, selectCertsOnly, getUserList],
    );

    const certificatesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'State',
                align: 'center',
                id: 'state',
                width: '5%',
            },
            {
                content: 'Validation',
                align: 'center',
                id: 'validation',
                width: '5%',
            },
            {
                content: 'Compliance',
                align: 'center',
                id: 'compliance',
                width: '5%',
            },
            {
                content: '',
                align: 'center',
                id: 'keyAvailability',
                width: '1%',
            },
            {
                content: 'Common Name',
                id: 'commonName',
                width: '10%',
            },
            {
                content: 'Valid From',
                id: 'validFrom',
                width: '15%',
            },
            {
                content: 'Expires At',
                id: 'expiresAt',
                width: '15%',
            },
            {
                content: 'Groups',
                id: 'group',
                width: '15%',
            },
            {
                content: 'RA Profile',
                id: 'raProfile',
                width: '15%',
            },
            {
                content: 'Owner',
                id: 'owner',
                width: '15%',
            },
            {
                content: 'Serial number',
                id: 'serialNumber',
                width: '15%',
            },
            {
                content: 'Signature Algorithm',
                id: 'signatureAlgorithm',
                width: '15%',
            },
            {
                content: 'Public Key Algorithm',
                id: 'publicKeyAlgorithm',
                width: '15%',
            },
            {
                content: 'Issuer Common Name',
                id: 'issuerCommonName',
                width: '15%',
            },
            {
                content: 'Certificate Type',
                id: 'certificateType',
                width: '15%',
            },
        ],
        [],
    );

    const certificateList: TableDataRow[] = useMemo(
        () =>
            certificates.map((certificate) => {
                return {
                    id: certificate.uuid,
                    columns: [
                        <CertificateStatus status={certificate.state} asIcon={true} />,
                        <CertificateStatus status={certificate.validationStatus} asIcon={true} />,
                        certificate.complianceStatus ? <CertificateStatus status={certificate.complianceStatus} asIcon={true} /> : '',

                        certificate.privateKeyAvailability ? <i className="fa fa-key" aria-hidden="true"></i> : '',
                        selectCertsOnly ? (
                            certificate.commonName || '(empty)'
                        ) : (
                            <Link to={`./detail/${certificate.uuid}`}>{certificate.commonName || '(empty)'}</Link>
                        ),
                        certificate.notBefore ? <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(certificate.notBefore)}</span> : '',
                        certificate.notAfter ? <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(certificate.notAfter)}</span> : '',
                        certificate?.groups?.length
                            ? certificate?.groups.map((group, i) => (
                                  <React.Fragment key={group.uuid}>
                                      <Link to={`../../groups/detail/${group.uuid}`}>{group.name}</Link>
                                      {certificate?.groups?.length && i !== certificate.groups.length - 1 ? `, ` : ``}
                                  </React.Fragment>
                              ))
                            : 'Unassigned',
                        <span style={{ whiteSpace: 'nowrap' }}>
                            {certificate.raProfile ? (
                                <Link
                                    to={`../raprofiles/detail/${certificate?.raProfile.authorityInstanceUuid}/${certificate?.raProfile.uuid}`}
                                >
                                    {certificate.raProfile.name ?? 'Unassigned'}
                                </Link>
                            ) : (
                                (certificate.raProfile ?? 'Unassigned')
                            )}
                        </span>,
                        certificate?.ownerUuid ? (
                            <Link to={`../users/detail/${certificate?.ownerUuid}`}>{certificate.owner ?? 'Unassigned'}</Link>
                        ) : (
                            (certificate.owner ?? 'Unassigned')
                        ),
                        certificate.serialNumber || '',
                        certificate.signatureAlgorithm,
                        certificate.publicKeyAlgorithm,
                        certificate.issuerCommonName && certificate?.issuerCertificateUuid ? (
                            <Link to={`./detail/${certificate.issuerCertificateUuid}`}>{certificate.issuerCommonName}</Link>
                        ) : (
                            certificate.issuerCommonName || ''
                        ),
                        certificate.certificateType ? (
                            <Badge color={certificate.certificateType === CertificateType.X509 ? 'primary' : 'secondary'}>
                                {getEnumLabel(certificateTypeEnum, certificate.certificateType)}
                            </Badge>
                        ) : (
                            ''
                        ),
                    ],
                };
            }),
        [certificates, selectCertsOnly, certificateTypeEnum],
    );

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(actions.listCertificates(filters)), [dispatch]);

    return (
        <Container className="themed-container" fluid>
            <PagedList
                hideWidgetButtons={hideWidgetButtons}
                entity={EntityType.CERTIFICATE}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids, filters) => dispatch(actions.bulkDelete({ uuids, filters }))}
                getAvailableFiltersApi={useCallback(
                    (apiClients: ApiClients) => apiClients.certificates.getSearchableFieldInformation4(),
                    [],
                )}
                additionalButtons={buttons}
                headers={certificatesRowHeaders}
                data={certificateList}
                isBusy={isBusy}
                title="List of Certificates"
                entityNameSingular="Certificate"
                entityNamePlural="Certificates"
                filterTitle="Certificate Inventory Filter"
                multiSelect={multiSelect}
                pageWidgetLockName={LockWidgetNameEnum.ListOfCertificates}
            />

            <Dialog
                isOpen={upload}
                caption={`Upload Certificate`}
                body={<CertificateUploadDialog onCancel={() => setUpload(false)} onUpload={(data) => onUploadClick(data)} />}
                toggle={() => setUpload(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={updateGroup}
                caption={`Update Groups`}
                body={
                    <CertificateGroupDialog
                        uuids={checkedRows}
                        onCancel={() => setUpdateGroup(false)}
                        onUpdate={() => setUpdateGroup(false)}
                    />
                }
                toggle={() => setUpdateGroup(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={updateOwner}
                caption={`Update Owner`}
                body={
                    <CertificateOwnerDialog
                        users={users}
                        uuids={checkedRows}
                        onCancel={() => setUpdateOwner(false)}
                        onUpdate={() => setUpdateOwner(false)}
                    />
                }
                toggle={() => setUpdateOwner(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={updateEntity}
                caption={`Update Entity`}
                body={`Update Entity`}
                toggle={() => setUpdateEntity(false)}
                buttons={[
                    { color: 'primary', onClick: () => {}, body: 'Update' },
                    { color: 'secondary', onClick: () => setUpdateEntity(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={updateRaProfile}
                caption={`Update RA Profile`}
                body={
                    <CertificateRAProfileDialog
                        uuids={checkedRows}
                        onCancel={() => setUpdateRaProfile(false)}
                        onUpdate={() => setUpdateRaProfile(false)}
                    />
                }
                toggle={() => setUpdateRaProfile(false)}
                buttons={[]}
            />
        </Container>
    );
}
