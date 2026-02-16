import JwkSetKeysTable from 'components/_pages/auth-settings/JwkSetKeysTable';
import OAuth2ProviderForm from 'components/_pages/auth-settings/form';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/auth-settings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRunOnFinished } from 'utils/common-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { LockWidgetNameEnum } from 'types/user-interface';
import { renderOAuth2StateBadges } from 'utils/oauth2Providers';
import Container from 'components/Container';
import Breadcrumb from 'components/Breadcrumb';

export default function OAuth2ProviderDetail() {
    const { providerName } = useParams();

    const dispatch = useDispatch();

    const oauth2Provider = useSelector(selectors.oauth2Provider);
    const isFetchingProvider = useSelector(selectors.isFetchingProvider);
    const isUpdatingProvider = useSelector(selectors.isUpdatingProvider);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const getFreshData = useCallback(() => {
        if (!providerName) return;
        dispatch(actions.resetState());
        dispatch(actions.getOAuth2ProviderSettings({ providerName }));
    }, [dispatch, providerName]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const handleOpenEditDialog = useCallback(() => {
        if (!providerName) return;
        setIsEditDialogOpen(true);
        dispatch(actions.getOAuth2ProviderSettings({ providerName }));
    }, [dispatch, providerName]);

    const handleCloseEditDialog = useCallback(() => {
        setIsEditDialogOpen(false);
        if (!oauth2Provider) {
            getFreshData();
        }
    }, [oauth2Provider, getFreshData]);

    useRunOnFinished(isUpdatingProvider, () => {
        if (isEditDialogOpen) {
            handleCloseEditDialog();
            getFreshData();
        }
    });

    const onDeleteClick = useCallback(() => {
        if (!providerName) return;
        dispatch(actions.removeOAuth2Provider({ providerName }));
    }, [dispatch, providerName]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: handleOpenEditDialog,
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    onDeleteClick();
                },
            },
        ],
        [handleOpenEditDialog, onDeleteClick],
    );

    const headers: TableHeader[] = useMemo(
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

    const data: TableDataRow[] = useMemo(
        () =>
            !oauth2Provider
                ? []
                : [
                      { id: 'name', columns: ['Name', <>{oauth2Provider.name}</>] },
                      { id: 'scheme', columns: ['Authentication Scheme', renderOAuth2StateBadges(oauth2Provider)] },
                      { id: 'clientId', columns: ['Client Id', <>{oauth2Provider.clientId}</>] },
                      { id: 'issuerUrl', columns: ['Issuer Url', <>{oauth2Provider.issuerUrl}</>] },
                      { id: 'authorizationUrl', columns: ['Authorization Url', <>{oauth2Provider.authorizationUrl}</>] },
                      { id: 'tokenUrl', columns: ['Token Url', <>{oauth2Provider.tokenUrl}</>] },
                      { id: 'jwkSetUrl', columns: ['JWK Set Url', <>{oauth2Provider.jwkSetUrl}</>] },
                      { id: 'logoutUrl', columns: ['Logout Url', <>{oauth2Provider.logoutUrl}</>] },
                      { id: 'postLogoutUrl', columns: ['Post Logout Url', <>{oauth2Provider.postLogoutUrl}</>] },
                      { id: 'userInfoUrl', columns: ['User Info Url', <>{oauth2Provider.userInfoUrl}</>] },
                      { id: 'scope', columns: ['Scope', <>{oauth2Provider.scope?.join(', ')}</>] },
                      { id: 'audiences', columns: ['Audiences', <>{oauth2Provider.audiences?.join(', ')}</>] },
                      {
                          id: 'skew',
                          columns: [
                              'Skew',
                              <>
                                  {oauth2Provider.skew} second{Number(oauth2Provider.skew) > 1 ? 's' : ''}
                              </>,
                          ],
                      },
                      {
                          id: 'sessionMaxInactiveInterval',
                          columns: [
                              'Session Max Inactive Interval',
                              <>
                                  {oauth2Provider.sessionMaxInactiveInterval} second
                                  {Number(oauth2Provider.sessionMaxInactiveInterval) > 1 ? 's' : ''}
                              </>,
                          ],
                      },
                  ],
        [oauth2Provider],
    );
    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Authentication Settings', href: '/authenticationsettings' },
                    { label: oauth2Provider?.name || 'Provider Details', href: '' },
                ]}
            />
            <Container>
                <Widget
                    title="Provider Details"
                    busy={isFetchingProvider}
                    widgetLockName={LockWidgetNameEnum.AuthenticationProviderDetails}
                    widgetButtons={buttons}
                    titleSize="large"
                    refreshAction={getFreshData}
                >
                    <CustomTable headers={headers} data={data} />
                </Widget>
                <Widget
                    title="JWK Set Keys"
                    busy={isFetchingProvider}
                    widgetLockName={LockWidgetNameEnum.AuthenticationProviderDetails}
                    titleSize="large"
                    refreshAction={getFreshData}
                >
                    <JwkSetKeysTable jwkSetKeys={oauth2Provider?.jwkSetKeys} />
                </Widget>
                <Dialog
                    isOpen={isEditDialogOpen}
                    toggle={handleCloseEditDialog}
                    caption="Edit OAuth2 Provider"
                    size="xl"
                    body={<OAuth2ProviderForm providerName={providerName} onCancel={handleCloseEditDialog} />}
                />
            </Container>
        </div>
    );
}
