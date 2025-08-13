import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/cmp-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import { Badge, Col, Container, Row } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import { createWidgetDetailHeaders, getGroupNames, getOwnerName } from 'utils/widget';
import { actions as groupsActions, selectors as groupsSelectors } from 'ducks/certificateGroups';
import { actions as userAction, selectors as userSelectors } from 'ducks/users';

export default function AdministratorDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const cmpProfile = useSelector(selectors.cmpProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isDisabling = useSelector(selectors.isDisabling);
    const isEnabling = useSelector(selectors.isEnabling);
    const cmpCmpProfileVariantEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CmpProfileVariant));
    const protectionMethodEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ProtectionMethod));

    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);
    const users = useSelector(userSelectors.users);
    const groups = useSelector(groupsSelectors.certificateGroups);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetchingDetail || isDisabling || isEnabling, [isFetchingDetail, isDisabling, isEnabling]);

    const getFreshCmpProfile = useCallback(() => {
        if (!id) return;
        dispatch(actions.getCmpProfile({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshCmpProfile();
    }, [id, getFreshCmpProfile]);

    useEffect(() => {
        dispatch(userAction.list());
    }, [dispatch]);
    useEffect(() => {
        dispatch(groupsActions.listGroups());
    }, [dispatch]);

    const onEditClick = useCallback(() => {
        navigate(`../../cmpprofiles/edit/${cmpProfile?.uuid}`);
    }, [cmpProfile, navigate]);

    const onEnableClick = useCallback(() => {
        if (!cmpProfile) return;

        dispatch(actions.enableCmpProfile({ uuid: cmpProfile.uuid }));
    }, [cmpProfile, dispatch]);

    const onDisableClick = useCallback(() => {
        if (!cmpProfile) return;

        dispatch(actions.disableCmpProfile({ uuid: cmpProfile.uuid }));
    }, [cmpProfile, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!cmpProfile) return;

        dispatch(actions.deleteCmpProfile({ uuid: cmpProfile.uuid }));
        setConfirmDelete(false);
    }, [cmpProfile, dispatch]);

    const onForceDeleteCmpProfile = useCallback(() => {
        if (!cmpProfile) return;

        dispatch(actions.bulkForceDeleteCmpProfiles({ uuids: [cmpProfile.uuid], redirect: `../cmpprofiles` }));
    }, [cmpProfile, dispatch]);

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
                disabled: cmpProfile?.enabled || false,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: !(cmpProfile?.enabled || false),
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [cmpProfile, onEditClick, onDisableClick, onEnableClick],
    );

    const tableHeader: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const cmpProfileDetailData: TableDataRow[] = useMemo(
        () =>
            !cmpProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', cmpProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', cmpProfile.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', cmpProfile.description || ''],
                      },
                      {
                          id: 'variant',
                          columns: ['Variant', <Badge color="primary">{getEnumLabel(cmpCmpProfileVariantEnum, cmpProfile.variant)}</Badge>],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={cmpProfile.enabled} />],
                      },
                      {
                          id: 'cmpUrl',
                          columns: ['CMP URL', cmpProfile.cmpUrl || 'N/A'],
                      },
                  ],
        [cmpProfile, cmpCmpProfileVariantEnum],
    );

    const raProfileDetailData: TableDataRow[] = useMemo(
        () =>
            !cmpProfile || !cmpProfile.raProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', cmpProfile.raProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: [
                              'Name',
                              cmpProfile.raProfile?.uuid ? (
                                  <Link
                                      to={`../../raprofiles/detail/${cmpProfile.raProfile.authorityInstanceUuid}/${cmpProfile.raProfile.uuid}`}
                                  >
                                      {cmpProfile.raProfile.name}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={cmpProfile.raProfile.enabled} />],
                      },
                  ],
        [cmpProfile],
    );

    const requestConfigurationData: TableDataRow[] = useMemo(
        () =>
            !cmpProfile || !cmpProfile.requestProtectionMethod
                ? []
                : [
                      {
                          id: 'requestProtectionMethod',
                          columns: ['Request Protection Method', getEnumLabel(protectionMethodEnum, cmpProfile?.requestProtectionMethod)],
                      },
                  ],
        [cmpProfile, protectionMethodEnum],
    );

    const responseConfigurationData: TableDataRow[] = useMemo(
        () =>
            !cmpProfile
                ? []
                : [
                      {
                          id: 'responseProtectionMethod',
                          columns: ['Response Protection Method', getEnumLabel(protectionMethodEnum, cmpProfile?.responseProtectionMethod)],
                      },
                      {
                          id: 'signingCertificate',
                          columns: [
                              'Signing Certificate',
                              cmpProfile?.signingCertificate ? (
                                  <Link to={`/certificates/detail/${cmpProfile.signingCertificate.uuid}`}>
                                      {cmpProfile?.signingCertificate.commonName}
                                  </Link>
                              ) : (
                                  'N/A'
                              ),
                          ],
                      },
                  ],
        [cmpProfile, protectionMethodEnum],
    );

    const raProfileText = useMemo(
        () => (raProfileDetailData.length > 0 ? 'RA Profile Configuration' : 'Default RA Profile not selected'),
        [raProfileDetailData],
    );

    const ownerName = useMemo(() => getOwnerName(cmpProfile?.certificateAssociations?.ownerUuid, users), [cmpProfile, users]);

    const groupNames = useMemo(() => {
        return getGroupNames(cmpProfile?.certificateAssociations?.groupUuids, groups);
    }, [cmpProfile, groups]);

    const defaultCertificateAssociationsData: TableDataRow[] = useMemo(() => {
        if (!cmpProfile) return [];
        return [
            {
                id: 'owner',
                columns: [
                    'Owner',
                    cmpProfile.certificateAssociations?.ownerUuid ? (
                        <Link key="owner" to={`../../users/detail/${cmpProfile.certificateAssociations?.ownerUuid}`}>
                            {ownerName}
                        </Link>
                    ) : (
                        ownerName
                    ),
                ],
            },
            {
                id: 'groups',
                columns: [
                    'Groups',
                    <>
                        {cmpProfile.certificateAssociations?.groupUuids?.map((groupUuid, index) => {
                            return (
                                <>
                                    <Link key={groupUuid} to={`../../groups/detail/${groupUuid}`}>
                                        {groupNames?.[index] ?? 'N/A'}
                                    </Link>
                                    <br />
                                </>
                            );
                        })}
                    </>,
                ],
            },
        ];
    }, [cmpProfile, ownerName, groupNames]);

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        title="CMP Profile Details"
                        busy={isBusy}
                        widgetButtons={buttons}
                        titleSize="large"
                        refreshAction={getFreshCmpProfile}
                        widgetLockName={LockWidgetNameEnum.CMPProfileDetails}
                        lockSize="large"
                    >
                        <CustomTable headers={tableHeader} data={cmpProfileDetailData} />
                    </Widget>
                </Col>
                <Col>
                    {cmpProfile && (
                        <CustomAttributeWidget
                            resource={Resource.CmpProfiles}
                            resourceUuid={cmpProfile.uuid}
                            attributes={cmpProfile.customAttributes}
                        />
                    )}
                </Col>
            </Row>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget title="Request Configuration">
                        <CustomTable headers={tableHeader} data={requestConfigurationData} />
                    </Widget>
                </Col>
                <Col>
                    <Widget title="Response Configuration">
                        <CustomTable headers={tableHeader} data={responseConfigurationData} />
                    </Widget>
                </Col>
            </Row>
            {raProfileDetailData.length === 0 ? (
                <></>
            ) : (
                <>
                    <Row xs="1" sm="1" md="2" lg="2" xl="2">
                        <Col>
                            <Widget title={raProfileText} busy={isBusy}>
                                <CustomTable headers={tableHeader} data={raProfileDetailData} />
                            </Widget>
                        </Col>
                        <Col>
                            {cmpProfile?.issueCertificateAttributes === undefined || cmpProfile.issueCertificateAttributes.length === 0 ? (
                                <></>
                            ) : (
                                <Widget title="List of Attributes to Issue Certificate" busy={isBusy}>
                                    <AttributeViewer attributes={cmpProfile?.issueCertificateAttributes} />
                                </Widget>
                            )}
                        </Col>

                        <Col>
                            {cmpProfile?.revokeCertificateAttributes === undefined ||
                            cmpProfile.revokeCertificateAttributes.length === 0 ? (
                                <></>
                            ) : (
                                <Widget title="List of Attributes to Revoke Certificate" busy={isBusy}>
                                    <AttributeViewer attributes={cmpProfile?.revokeCertificateAttributes} />
                                </Widget>
                            )}
                        </Col>
                    </Row>
                </>
            )}
            <Widget title="Default Certificate associations" busy={isBusy} titleSize="large">
                <CustomTable headers={tableHeader} data={defaultCertificateAssociationsData} />
                <Widget title="Certificate Associated Attributes" busy={isBusy}>
                    <AttributeViewer attributes={cmpProfile?.certificateAssociations?.customAttributes} />
                </Widget>
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete CMP Profile"
                body="You are about to delete CMP Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete CMP Profile"
                body={
                    <>
                        Failed to delete the CMP Profile that has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    { color: 'danger', onClick: onForceDeleteCmpProfile, body: 'Force' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
