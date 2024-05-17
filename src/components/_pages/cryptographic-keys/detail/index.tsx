import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import TabLayout from 'components/Layout/TabLayout';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/cryptographic-keys';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { Col, Container, Label, Row } from 'reactstrap';
import { KeyCompromiseReason, KeyState, KeyType, PlatformEnum, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { dateFormatter } from 'utils/dateUtil';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import CryptographicKeyItem from './CryptographicKeyItem';

export default function CryptographicKeyDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id, tokenId, keyItemUuid } = useParams();
    const relativePath = keyItemUuid ? '../../../..' : '../../..';

    const cryptographicKey = useSelector(selectors.cryptographicKey);
    const state = useSelector(selectors.state);
    const isUpdatingKeyUsage = useSelector(selectors.isUpdatingKeyUsage);

    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);
    const isCompromising = useSelector(selectors.isBulkCompromising);
    const isDestroying = useSelector(selectors.isBulkDestroying);
    const isFetchingHistory = useSelector(selectors.isFetchingHistory);
    const [selectedTab, setSelectedTab] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const [confirmCompromise, setConfirmCompromise] = useState<boolean>(false);

    const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);

    const [compromiseReason, setCompromiseReason] = useState<KeyCompromiseReason>();
    const keyCompromiseReasonEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyCompromiseReason));
    const keyTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyType));

    const isBusy = useMemo(
        () => state.isFetchingDetail || isDeleting || isEnabling || isDisabling || isUpdatingKeyUsage || isCompromising || isDestroying,
        [isDeleting, isEnabling, isDisabling, isUpdatingKeyUsage, isCompromising, isDestroying, state.isFetchingDetail],
    );

    const getFreshCryptographicKeyDetails = useCallback(() => {
        if (!id || !tokenId) return;

        dispatch(actions.getCryptographicKeyDetail({ tokenInstanceUuid: tokenId, uuid: id }));
    }, [id, dispatch, tokenId]);

    useEffect(() => {
        getFreshCryptographicKeyDetails();
    }, [getFreshCryptographicKeyDetails, id, tokenId]);

    const onEditClick = useCallback(() => {
        if (!cryptographicKey) return;
        navigate(`${relativePath}/edit/${cryptographicKey.tokenInstanceUuid}/${cryptographicKey?.uuid}`, { relative: 'path' });
    }, [navigate, cryptographicKey, relativePath]);

    const onEnableClick = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.enableCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
    }, [dispatch, cryptographicKey]);

    const onDisableClick = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.disableCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
    }, [dispatch, cryptographicKey]);

    const onDeleteConfirmed = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.deleteCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid || 'unknown',
                uuid: cryptographicKey.uuid,
                redirect: cryptographicKey.items.length > 1 ? `${relativePath}/` : undefined,
            }),
        );
        setConfirmDelete(false);
    }, [dispatch, cryptographicKey, relativePath]);

    const onCompromise = useCallback(() => {
        if (!cryptographicKey) return;
        if (!compromiseReason) return;
        dispatch(
            actions.compromiseCryptographicKey({
                request: { reason: compromiseReason },
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
        setConfirmCompromise(false);
    }, [dispatch, cryptographicKey, compromiseReason]);

    const onDestroy = useCallback(() => {
        if (!cryptographicKey) return;
        dispatch(
            actions.destroyCryptographicKey({
                keyItemUuid: [],
                tokenInstanceUuid: cryptographicKey.tokenInstanceUuid,
                uuid: cryptographicKey.uuid,
            }),
        );
        setConfirmDestroy(false);
    }, [dispatch, cryptographicKey]);

    const optionForCompromise = useMemo(() => {
        var options = [];
        if (keyCompromiseReasonEnum) {
            for (const reason in KeyCompromiseReason) {
                const myReason: KeyCompromiseReason = KeyCompromiseReason[reason as keyof typeof KeyCompromiseReason];
                options.push({ value: myReason, label: getEnumLabel(keyCompromiseReasonEnum, myReason) });
            }
        }
        return options;
    }, [keyCompromiseReasonEnum]);

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
                disabled: cryptographicKey?.items.every((item) => item.enabled) ?? false,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: cryptographicKey?.items.every((item) => !item.enabled) ?? false,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
            {
                icon: 'compromise',
                disabled:
                    cryptographicKey?.items.every(
                        (item) => ![KeyState.PreActive, KeyState.Active, KeyState.Deactivated].includes(item.state),
                    ) ?? false,
                tooltip: 'Compromise',
                onClick: () => {
                    setConfirmCompromise(true);
                },
            },
            {
                icon: 'destroy',
                disabled:
                    cryptographicKey?.items.every(
                        (item) => ![KeyState.PreActive, KeyState.Compromised, KeyState.Deactivated].includes(item.state),
                    ) ?? false,
                tooltip: 'Destroy',
                onClick: () => {
                    setConfirmDestroy(true);
                },
            },
        ],
        [cryptographicKey, onEditClick, onDisableClick, onEnableClick, setConfirmCompromise, setConfirmDestroy],
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

    const associationHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
            },
            {
                id: 'uuid',
                content: 'UUID',
            },
            {
                id: 'resource',
                content: 'Resource',
            },
        ],
        [],
    );

    const associationBody = useMemo(
        () =>
            !cryptographicKey || !cryptographicKey.associations
                ? []
                : cryptographicKey.associations.map((item) => ({
                      id: item.uuid,
                      columns: [
                          item.resource !== Resource.Certificates ? (
                              item.name
                          ) : (
                              <Link to={`${relativePath}/certificates/detail/${item.uuid}`}>{item.name}</Link>
                          ),

                          item.uuid,

                          item.resource,
                      ],
                  })),
        [cryptographicKey, relativePath],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !cryptographicKey
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', cryptographicKey.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', cryptographicKey.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', cryptographicKey.description || ''],
                      },
                      {
                          id: 'creationTime',
                          columns: ['Creation Time', dateFormatter(cryptographicKey.creationTime) || ''],
                      },
                      {
                          id: 'tokenName',
                          columns: [
                              'Token Instance Name',
                              cryptographicKey.tokenInstanceUuid ? (
                                  <Link to={`${relativePath}/tokens/detail/${cryptographicKey.tokenInstanceUuid}`}>
                                      {cryptographicKey.tokenInstanceName}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'tokenUuid',
                          columns: ['Token Instance UUID', cryptographicKey.tokenInstanceUuid],
                      },
                      {
                          id: 'tokenProfileName',
                          columns: [
                              'Token Profile Name',
                              cryptographicKey.tokenInstanceUuid && cryptographicKey.tokenProfileUuid ? (
                                  <Link
                                      to={`${relativePath}/tokenprofiles/detail/${cryptographicKey.tokenInstanceUuid}/${cryptographicKey.tokenProfileUuid}`}
                                  >
                                      {cryptographicKey.tokenProfileName}
                                  </Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'tokenProfileUuid',
                          columns: ['Token Profile UUID', cryptographicKey.tokenProfileUuid || 'Unassigned'],
                      },
                      {
                          id: 'owner',
                          columns: [
                              'Owner',
                              cryptographicKey.ownerUuid ? (
                                  <Link to={`${relativePath}/users/detail/${cryptographicKey.ownerUuid}`}>
                                      {cryptographicKey.owner ?? 'Unassigned'}
                                  </Link>
                              ) : (
                                  cryptographicKey.owner || 'Unassigned'
                              ),
                          ],
                      },
                      {
                          id: 'groupNames',
                          columns: [
                              'Groups',
                              cryptographicKey.groups?.length
                                  ? cryptographicKey.groups.map((group, i) => (
                                        <Fragment key={group.uuid}>
                                            <Link to={`${relativePath}/groups/detail/${group.uuid}`}>{group.name}</Link>
                                            {cryptographicKey?.groups?.length && i !== cryptographicKey.groups.length - 1 ? `, ` : ``}
                                        </Fragment>
                                    ))
                                  : '',
                          ],
                      },
                  ],
        [cryptographicKey, relativePath],
    );

    const itemTabs = useMemo(() => {
        const keyItems = [...(cryptographicKey?.items ?? [])].sort(
            (a, b) => Object.values(KeyType).indexOf(a.type) - Object.values(KeyType).indexOf(b.type),
        );

        const keyTab = keyItems.findIndex((item) => item.uuid === keyItemUuid);
        setSelectedTab(keyTab < 0 ? 0 : keyTab);

        const tabs = keyItems.map((item, i) => ({
            title: (
                <div className="d-flex p-2 px-3" onClick={() => setSelectedTab(i)}>
                    {getEnumLabel(keyTypeEnum, item.type)}
                </div>
            ),
            content: (
                <Widget busy={isBusy || isFetchingHistory}>
                    <CryptographicKeyItem
                        key={item.uuid}
                        keyItem={item}
                        keyUuid={cryptographicKey!.uuid}
                        tokenInstanceUuid={cryptographicKey!.tokenInstanceUuid}
                        tokenProfileUuid={cryptographicKey!.tokenProfileUuid}
                        totalKeyItems={cryptographicKey!.items.length}
                    />
                </Widget>
            ),
        }));
        return { tabs };
    }, [cryptographicKey, isBusy, isFetchingHistory, keyTypeEnum, keyItemUuid]);

    return (
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                    <Widget
                        title="Key Details"
                        busy={isBusy}
                        widgetButtons={buttons}
                        titleSize="large"
                        refreshAction={getFreshCryptographicKeyDetails}
                        widgetLockName={LockWidgetNameEnum.keyDetails}
                        lockSize="large"
                    >
                        <br />

                        <CustomTable headers={detailHeaders} data={detailData} />
                    </Widget>
                </Col>

                <Col>
                    <Widget title="Attributes" busy={isBusy} titleSize="large">
                        <br />
                        <Label>Key Attributes</Label>
                        <AttributeViewer attributes={cryptographicKey?.attributes} />
                    </Widget>

                    {cryptographicKey && (
                        <CustomAttributeWidget
                            resource={Resource.Keys}
                            resourceUuid={cryptographicKey.uuid}
                            attributes={cryptographicKey.customAttributes}
                        />
                    )}
                </Col>
            </Row>

            {itemTabs.tabs.length > 0 && <TabLayout tabs={itemTabs.tabs} selectedTab={selectedTab} />}

            <Widget title="Key Associations" busy={isBusy} titleSize="large">
                <br />

                <CustomTable headers={associationHeaders} data={associationBody} />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Token Profile"
                body="You are about to delete Token Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmCompromise}
                caption={`Compromise Key`}
                body={
                    <div>
                        <p>You are about to mark the Key as compromised. Is this what you want to do?</p>
                        <p>
                            <b>Warning:</b> This action cannot be undone.
                        </p>
                        <Select
                            name="compromiseReason"
                            id="compromiseReason"
                            options={optionForCompromise}
                            onChange={(e) => setCompromiseReason(e?.value)}
                        />
                    </div>
                }
                toggle={() => setConfirmCompromise(false)}
                buttons={[
                    { color: 'danger', onClick: onCompromise, body: 'Yes' },
                    { color: 'secondary', onClick: () => setConfirmCompromise(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmDestroy}
                caption={`Destroy Key`}
                body={`You are about to destroy the Key. Is this what you want to do?`}
                toggle={() => setConfirmDestroy(false)}
                buttons={[
                    { color: 'danger', onClick: onDestroy, body: 'Yes, Destroy' },
                    { color: 'secondary', onClick: () => setConfirmDestroy(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
