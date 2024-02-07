import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import TokenStatusBadge from 'components/_pages/tokens/TokenStatusBadge';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions as keyActions, selectors as keySelectors } from 'ducks/cryptographic-keys';
import { actions, selectors } from 'ducks/tokens';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Label } from 'reactstrap';
import { Resource, TokenInstanceStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import TokenActivationDialogBody from '../TokenActivationDialogBody';
import RandomDataGeneration from './RandomDataGeneration';

export default function TokenDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const token = useSelector(selectors.token);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isActivating = useSelector(selectors.isActivating);
    const isDeactivating = useSelector(selectors.isDeactivating);
    const isReloading = useSelector(selectors.isReloading);

    const isSyncing = useSelector(keySelectors.isSyncing);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmDeactivation, setConfirmDeactivation] = useState<boolean>(false);
    const [activateToken, setActivateToken] = useState<boolean>(false);

    const [randomDataGeneration, setRandomDataGeneration] = useState<boolean>(false);

    const isBusy = useMemo(
        () => isFetching || isDeleting || isActivating || isDeactivating || isReloading || isSyncing,
        [isFetching, isDeleting, isActivating, isDeactivating, isReloading, isSyncing],
    );

    const getFreshTokenDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.resetState());
        dispatch(actions.getTokenDetail({ uuid: id }));
    }, [dispatch, id]);

    const getFreshAttributes = useCallback(() => {
        if (!id) return;
        dispatch(actions.listActivationAttributeDescriptors({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshTokenDetails();
        getFreshAttributes();
    }, [getFreshTokenDetails, getFreshAttributes, id]);

    const onEditClick = useCallback(() => {
        if (!token) return;
        navigate(`../../edit/${token.uuid}`, { relative: 'path' });
    }, [token, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!token) return;

        dispatch(actions.deleteToken({ uuid: token.uuid }));
        setConfirmDelete(false);
    }, [token, dispatch]);

    const onDeactivationConfirmed = useCallback(() => {
        if (!token) return;

        dispatch(actions.deactivateToken({ uuid: token.uuid }));
        setConfirmDeactivation(false);
    }, [token, dispatch]);

    const onReload = useCallback(() => {
        if (!token) return;

        dispatch(actions.reloadToken({ uuid: token.uuid }));
    }, [token, dispatch]);

    const onSync = useCallback(() => {
        if (!token) return;

        dispatch(keyActions.syncKeys({ tokenInstanceUuid: token.uuid }));
    }, [token, dispatch]);

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
                icon: 'reload',
                disabled: false,
                tooltip: 'Reload Status',
                onClick: () => {
                    onReload();
                },
            },
            {
                icon: 'refresh',
                disabled: token?.status.status !== TokenInstanceStatus.Activated,
                tooltip: 'Sync Keys',
                onClick: () => {
                    onSync();
                },
            },
            {
                icon: 'check',
                disabled: token?.status.status !== TokenInstanceStatus.Deactivated,
                tooltip: 'Activate',
                onClick: () => {
                    setActivateToken(true);
                },
            },
            {
                icon: 'times',
                disabled: token?.status.status !== TokenInstanceStatus.Activated,
                tooltip: 'Deactivate',
                onClick: () => {
                    setConfirmDeactivation(true);
                },
            },
            {
                icon: 'random',
                disabled: token?.status.status !== TokenInstanceStatus.Activated,
                tooltip: 'Generate Random',
                onClick: () => {
                    setRandomDataGeneration(true);
                },
            },
        ],
        [onEditClick, onReload, token?.status.status, onSync, setRandomDataGeneration],
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
            !token
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', token.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', token.name],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <TokenStatusBadge status={token.status.status} />],
                      },
                      {
                          id: 'cryptographyProviderUUID',
                          columns: ['Cryptography Provider UUID', token.connectorUuid || ''],
                      },
                      {
                          id: 'cryptographyProviderName',
                          columns: [
                              'Cryptography Provider Name',
                              token.connectorUuid ? (
                                  <Link to={`../../connectors/detail/${token.connectorUuid}`}>{token.connectorName}</Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'kind',
                          columns: ['Kind', token.kind || ''],
                      },
                      {
                          id: 'tokenProfiles',
                          columns: ['Number of Token Profiles', token.tokenProfiles.toString()],
                      },
                  ],
        [token],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Token Details"
                busy={isBusy}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshTokenDetails}
                widgetLockName={LockWidgetNameEnum.TokenDetails}
            >
                <br />

                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            <Widget
                title="Attributes"
                titleSize="large"
                refreshAction={getFreshAttributes}
                widgetLockName={LockWidgetNameEnum.TokenDetails}
            >
                <br />

                <Label>Token Attributes</Label>
                <AttributeViewer attributes={token?.attributes} />
            </Widget>

            {token && <CustomAttributeWidget resource={Resource.Tokens} resourceUuid={token.uuid} attributes={token.customAttributes} />}

            <Widget title="Metadata" titleSize="large">
                <br />
                <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={token?.metadata} />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Token"
                body="You are about to delete Token. If you continue, objects
                  related to the token will fail. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmDeactivation}
                caption="Deactivate Token"
                body="You are about to deactivate Token. If you continue, objects
                  related to the token not work. Is this what you want to do?"
                toggle={() => setConfirmDeactivation(false)}
                buttons={[
                    { color: 'danger', onClick: onDeactivationConfirmed, body: 'Deactivate' },
                    { color: 'secondary', onClick: () => setConfirmDeactivation(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={activateToken}
                caption="Activate Token"
                body={TokenActivationDialogBody({ visible: activateToken, onClose: () => setActivateToken(false), tokenUuid: token?.uuid })}
                toggle={() => setActivateToken(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={randomDataGeneration}
                caption="Random Data Generation"
                body={RandomDataGeneration({
                    visible: randomDataGeneration,
                    onClose: () => setRandomDataGeneration(false),
                    tokenUuid: token?.uuid,
                })}
                toggle={() => setRandomDataGeneration(false)}
                buttons={[]}
            />
        </Container>
    );
}
