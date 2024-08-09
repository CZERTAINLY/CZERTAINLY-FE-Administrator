import { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';

import { WidgetButtonProps } from 'components/WidgetButtons';

import { ApiClients } from 'api';
import PagedList from 'components/PagedList/PagedList';
import { actions, selectors } from 'ducks/cryptographic-keys';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType } from 'ducks/filters';
import { selectors as pagingSelectors } from 'ducks/paging';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Badge, Container } from 'reactstrap';
import { SearchRequestModel } from 'types/certificate';
import { KeyCompromiseReason, KeyUsage, PlatformEnum } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { dateFormatter } from 'utils/dateUtil';
import KeyStateCircle from '../KeyStateCircle';
import KeyStatusCircle from '../KeyStatusCircle';

function CryptographicKeyList() {
    const dispatch = useDispatch();

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.KEY));
    const cryptographicKeys = useSelector(selectors.cryptographicKeys);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isBulkEnabling = useSelector(selectors.isBulkEnabling);
    const isBulkDisabling = useSelector(selectors.isBulkDisabling);
    const isBulkUpdatingKeyUsage = useSelector(selectors.isBulkUpdatingKeyUsage);
    const isBulkCompromising = useSelector(selectors.isBulkCompromising);
    const isBulkDestroying = useSelector(selectors.isBulkDestroying);

    const keyUsageEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyUsage));
    const keyTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyType));
    const keyCompromiseReasonEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.KeyCompromiseReason));
    const isBusy = isBulkDeleting || isBulkEnabling || isBulkDisabling || isBulkUpdatingKeyUsage || isBulkCompromising || isBulkDestroying;

    const [confirmCompromise, setConfirmCompromise] = useState<boolean>(false);

    const [confirmDestroy, setConfirmDestroy] = useState<boolean>(false);

    const [keyUsageUpdate, setKeyUsageUpdate] = useState<boolean>(false);

    const [keyUsages, setKeyUsages] = useState<KeyUsage[]>([]);

    const [compromiseReason, setCompromiseReason] = useState<KeyCompromiseReason>();

    useEffect(() => {
        dispatch(actions.clearDeleteErrorMessages());
    }, [dispatch]);

    const onEnableClick = useCallback(() => {
        dispatch(actions.bulkEnableCryptographicKeyItems({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDisableClick = useCallback(() => {
        dispatch(actions.bulkDisableCryptographicKeyItems({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onUpdateKeyUsageConfirmed = useCallback(() => {
        dispatch(actions.bulkUpdateKeyItemUsage({ usage: { usage: keyUsages, uuids: checkedRows } }));
        setKeyUsageUpdate(false);
    }, [checkedRows, dispatch, keyUsages]);

    const onCompromise = useCallback(() => {
        if (!compromiseReason) return;
        dispatch(actions.bulkCompromiseCryptographicKeyItems({ request: { reason: compromiseReason, uuids: checkedRows } }));
        setConfirmCompromise(false);
    }, [checkedRows, dispatch, compromiseReason]);

    const onDestroy = useCallback(() => {
        dispatch(actions.bulkDestroyCryptographicKeyItems({ uuids: checkedRows }));
        setConfirmDestroy(false);
    }, [checkedRows, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: checkedRows.length === 0,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
            {
                icon: 'key',
                disabled: checkedRows.length === 0,
                tooltip: 'Update Key Usage',
                onClick: () => {
                    setKeyUsageUpdate(true);
                },
            },
            {
                icon: 'compromise',
                disabled: checkedRows.length === 0,
                tooltip: 'Compromise',
                onClick: () => {
                    setConfirmCompromise(true);
                },
            },
            {
                icon: 'destroy',
                disabled: checkedRows.length === 0,
                tooltip: 'Destroy',
                onClick: () => {
                    setConfirmDestroy(true);
                },
            },
        ],
        [checkedRows, onEnableClick, onDisableClick, setKeyUsageUpdate],
    );

    const keyUsageOptions = useMemo(() => {
        let options = [];
        if (keyUsageEnum) {
            for (const suit in KeyUsage) {
                options.push({
                    label: getEnumLabel(keyUsageEnum, KeyUsage[suit as keyof typeof KeyUsage]),
                    value: KeyUsage[suit as keyof typeof KeyUsage],
                });
            }
        }
        return options;
    }, [keyUsageEnum]);

    const keyUsageBody = (
        <div>
            <div className="form-group">
                <label className="form-label">Key Usage</label>
                <Select
                    isMulti={true}
                    id="field"
                    options={keyUsageOptions}
                    onChange={(e) => {
                        setKeyUsages(e.map((item) => item.value));
                    }}
                    isClearable={true}
                />
            </div>
        </div>
    );

    const cryptographicKeysTableHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'status',
                content: 'Status',
                align: 'center',
                width: '1%',
            },
            {
                id: 'state',
                content: 'State',
                align: 'center',
                width: '1%',
            },
            {
                id: 'keyName',
                content: 'Name',
                width: '15%',
            },
            {
                id: 'type',
                content: 'Type',
                width: '15%',
            },
            {
                id: 'algorithm',
                align: 'center',
                content: 'Algorithm',
                width: '15%',
            },
            {
                id: 'size',
                align: 'center',
                content: 'Size',
                width: '15%',
            },
            {
                id: 'format',
                align: 'center',
                content: 'Format',
                width: '15%',
            },
            {
                id: 'creationTime',
                align: 'center',
                content: 'Creation Date',
                width: '15%',
            },
            {
                id: 'group',
                align: 'center',
                content: 'Group',
                width: '15%',
            },
            {
                id: 'owner',
                align: 'center',
                content: 'Owner',
                width: '15%',
            },
            {
                id: 'tokenProfile',
                align: 'center',
                content: 'Token Profile',
                width: '15%',
            },
            {
                id: 'tokenInstance',
                align: 'center',
                content: 'Token Instance',
                width: '15%',
            },
            {
                id: 'associations',
                align: 'center',
                content: 'Associations',
                width: '15%',
            },
        ],
        [],
    );

    const cryptographicKeysList: TableDataRow[] = useMemo(
        () =>
            cryptographicKeys.map((cryptographicKey) => {
                return {
                    id: cryptographicKey.uuid,
                    columns: [
                        <KeyStatusCircle status={cryptographicKey.enabled} />,
                        <KeyStateCircle state={cryptographicKey.state} />,
                        <span style={{ whiteSpace: 'nowrap' }}>
                            <Link
                                to={`./detail/${cryptographicKey.tokenInstanceUuid || 'unknown'}/${cryptographicKey.keyWrapperUuid}/${
                                    cryptographicKey.uuid
                                }`}
                            >
                                {cryptographicKey.name}
                            </Link>
                        </span>,
                        <Badge color="secondary">{getEnumLabel(keyTypeEnum, cryptographicKey.type)}</Badge>,
                        cryptographicKey.keyAlgorithm,
                        cryptographicKey.length?.toString() || 'unknown',
                        cryptographicKey.format || 'unknown',
                        <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(cryptographicKey.creationTime) || ''}</span>,
                        cryptographicKey?.groups?.length
                            ? cryptographicKey?.groups.map((group, i) => (
                                  <Fragment key={group.uuid}>
                                      <Link to={`../../groups/detail/${group.uuid}`}>{group.name}</Link>
                                      {cryptographicKey?.groups?.length && i !== cryptographicKey.groups.length - 1 ? `, ` : ``}
                                  </Fragment>
                              ))
                            : 'Unassigned',
                        cryptographicKey.ownerUuid ? (
                            <Link to={`../users/detail/${cryptographicKey.ownerUuid}`}>{cryptographicKey.owner ?? 'Unassigned'}</Link>
                        ) : (
                            (cryptographicKey.owner ?? 'Unassigned')
                        ),
                        cryptographicKey.tokenProfileName ? (
                            <Link to={`../tokenprofiles/detail/${cryptographicKey.tokenInstanceUuid}/${cryptographicKey.tokenProfileUuid}`}>
                                {cryptographicKey.tokenProfileName ?? 'Unassigned'}
                            </Link>
                        ) : (
                            (cryptographicKey.tokenProfileName ?? 'Unassigned')
                        ),
                        cryptographicKey.tokenInstanceName ? (
                            <Link to={`../tokens/detail/${cryptographicKey.tokenInstanceUuid}`}>
                                {cryptographicKey.tokenInstanceName ?? 'Unassigned'}
                            </Link>
                        ) : (
                            (cryptographicKey.tokenInstanceName ?? 'Unassigned')
                        ),
                        cryptographicKey.associations?.toString() || '',
                    ],
                };
            }),
        [cryptographicKeys, keyTypeEnum],
    );

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

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(actions.listCryptographicKeys(filters)), [dispatch]);

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.KEY}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids) => dispatch(actions.bulkDeleteCryptographicKeyItems({ uuids }))}
                getAvailableFiltersApi={useCallback(
                    (apiClients: ApiClients) => apiClients.cryptographicKeys.getSearchableFieldInformation1(),
                    [],
                )}
                additionalButtons={buttons}
                headers={cryptographicKeysTableHeaders}
                data={cryptographicKeysList}
                isBusy={isBusy}
                title="List of Keys"
                pageWidgetLockName={LockWidgetNameEnum.ListOfKeys}
                entityNameSingular="a Key"
                entityNamePlural="Keys"
                filterTitle="Key Inventory Filter"
            />

            <Dialog
                isOpen={confirmCompromise}
                caption={`Compromise ${checkedRows.length > 1 ? 'Keys' : 'Key'}`}
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
                caption={`Destroy ${checkedRows.length > 1 ? 'Keys' : 'Key'}`}
                body={`You are about to destroy ${checkedRows.length > 1 ? 'a Key' : 'Keys'}. Is this what you want to do?`}
                toggle={() => setConfirmDestroy(false)}
                buttons={[
                    { color: 'danger', onClick: onDestroy, body: 'Yes, Destroy' },
                    { color: 'secondary', onClick: () => setConfirmDestroy(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={keyUsageUpdate}
                caption={`Update Key Usage`}
                body={keyUsageBody}
                toggle={() => setKeyUsageUpdate(false)}
                buttons={[
                    { color: 'primary', onClick: onUpdateKeyUsageConfirmed, body: 'Update' },
                    { color: 'secondary', onClick: () => setKeyUsageUpdate(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}

export default CryptographicKeyList;
