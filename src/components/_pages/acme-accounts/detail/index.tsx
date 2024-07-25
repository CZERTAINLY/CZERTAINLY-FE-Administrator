import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Badge, Container } from 'reactstrap';

import { actions, selectors } from 'ducks/acme-accounts';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import StatusCircle from 'components/StatusCircle';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { AccountStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { acmeAccountStatus } from '../acmeAccountStatus';

export default function AcmeAccountDetail() {
    const dispatch = useDispatch();

    const { id, acmeProfileId } = useParams();

    const acmeAccount = useSelector(selectors.account);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isDisabling = useSelector(selectors.isDisabling);
    const isEnabling = useSelector(selectors.isEnabling);
    const isRevoking = useSelector(selectors.isRevoking);

    const [confirmRevoke, setConfirmRevoke] = useState<boolean>(false);

    const getFreshAcmeAccount = useCallback(() => {
        if (!id || !acmeProfileId) return;

        dispatch(actions.getAcmeAccount({ acmeProfileUuid: acmeProfileId, uuid: id }));
    }, [id, dispatch, acmeProfileId]);

    useEffect(() => {
        getFreshAcmeAccount();
    }, [id, getFreshAcmeAccount]);

    const onEnableClick = useCallback(() => {
        if (!acmeAccount) return;

        dispatch(actions.enableAcmeAccount({ acmeProfileUuid: acmeAccount.acmeProfileUuid, uuid: acmeAccount.uuid }));
    }, [acmeAccount, dispatch]);

    const onDisableClick = useCallback(() => {
        if (!acmeAccount) return;

        dispatch(actions.disableAcmeAccount({ acmeProfileUuid: acmeAccount.acmeProfileUuid, uuid: acmeAccount.uuid }));
    }, [acmeAccount, dispatch]);

    const onRevokeConfirmed = useCallback(() => {
        if (!acmeAccount) return;
        dispatch(actions.revokeAcmeAccount({ acmeProfileUuid: acmeAccount.acmeProfileUuid, uuid: acmeAccount.uuid }));
        setConfirmRevoke(false);
    }, [acmeAccount, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'cross-circle',
                disabled: acmeAccount ? acmeAccount.status !== AccountStatus.Valid : true,
                tooltip: 'Revoke',
                onClick: () => {
                    setConfirmRevoke(true);
                },
            },
            {
                icon: 'check',
                disabled: acmeAccount ? acmeAccount.enabled || acmeAccount.status !== AccountStatus.Valid : true,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: acmeAccount ? !acmeAccount.enabled : true,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [acmeAccount, onEnableClick, onDisableClick],
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

    const detailData: TableDataRow[] = useMemo(() => {
        if (!acmeAccount) return [];

        const accountStatus = acmeAccountStatus(acmeAccount.status);

        return [
            {
                id: 'uuid',
                columns: ['UUID', acmeAccount.uuid],
            },
            {
                id: 'accountId',
                columns: ['Account Id', acmeAccount.accountId],
            },
            {
                id: 'raProfileName',
                columns: [
                    'RA Profile Name',
                    acmeAccount.raProfile ? (
                        <Link
                            to={`../../../raprofiles/detail/${acmeAccount?.raProfile.authorityInstanceUuid}/${acmeAccount?.raProfile.uuid}`}
                        >
                            {acmeAccount?.raProfile.name ?? 'Unassigned'}
                        </Link>
                    ) : (
                        ''
                    ),
                ],
            },
            {
                id: 'acmeProfileName',
                columns: [
                    'ACME Profile Name',
                    acmeAccount.acmeProfileUuid ? (
                        <Link to={`../../../acmeprofiles/detail/${acmeAccount.acmeProfileUuid}`}>{acmeAccount.acmeProfileName}</Link>
                    ) : (
                        ''
                    ),
                ],
            },
            {
                id: 'internalState',
                columns: ['Internal State', <StatusBadge enabled={acmeAccount.enabled} />],
            },
            {
                id: 'accountStatus',
                columns: ['Account Status', <Badge color={accountStatus[1]}>{accountStatus[0]}</Badge>],
            },
            {
                id: 'Terms of Service Agreed',
                columns: ['Terms of Service Agreed', <StatusCircle status={acmeAccount.termsOfServiceAgreed} />],
            },
            {
                id: 'contacts',
                columns: ['Contacts', <>{acmeAccount?.contact?.map((contact) => <div key={contact}>{contact}</div>)}</>],
            },
        ];
    }, [acmeAccount]);

    const orderHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'orders',
                content: 'Orders',
            },
            {
                id: 'count',
                content: 'Count',
            },
        ],
        [],
    );

    const orderData: TableDataRow[] = useMemo(
        () =>
            !acmeAccount
                ? []
                : [
                      {
                          id: 'Successful orders',
                          columns: ['Successful orders', acmeAccount.successfulOrders.toString()],
                      },
                      {
                          id: 'Valid orders',
                          columns: ['Valid orders', acmeAccount.validOrders.toString()],
                      },
                      {
                          id: 'Pending orders',
                          columns: ['Pending orders', acmeAccount.pendingOrders.toString()],
                      },
                      {
                          id: 'Failed orders',
                          columns: ['Failed orders', acmeAccount.failedOrders.toString()],
                      },
                      {
                          id: 'Processing orders',
                          columns: ['Processing orders', acmeAccount.processingOrders.toString()],
                      },
                  ],
        [acmeAccount],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="ACME Account Details"
                busy={isFetchingDetail || isEnabling || isDisabling || isRevoking}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshAcmeAccount}
                widgetLockName={LockWidgetNameEnum.ACMEAccountDetails}
            >
                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            <Widget title="Order Summary" busy={isFetchingDetail || isEnabling || isDisabling || isRevoking} titleSize="large">
                <CustomTable headers={orderHeaders} data={orderData} />
            </Widget>

            <Dialog
                isOpen={confirmRevoke}
                caption="Revoke ACME Account"
                body="You are about to revoke an ACME Account. Is this what you want to do?"
                toggle={() => setConfirmRevoke(false)}
                buttons={[
                    { color: 'danger', onClick: onRevokeConfirmed, body: 'Yes, revoke' },
                    { color: 'secondary', onClick: () => setConfirmRevoke(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
