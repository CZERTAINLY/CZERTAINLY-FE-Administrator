import JwkSetKeysTable from 'components/_pages/auth-settings/JwkSetKeysTable';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import SwitchField from 'components/Input/SwitchField';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Spinner from 'components/Spinner';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as authSettingsActions, selectors as authSettingsSelectors } from 'ducks/auth-settings';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { Form as BootstrapForm, Button, ButtonGroup, Container } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { renderOAuth2StateBadges } from 'utils/oauth2Providers';

type FormValues = {
    disableLocalhostUser: boolean;
};

const AuthenticationSettings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authenticationSettings = useSelector(authSettingsSelectors.authenticationSettings);
    const isFetchingSettings = useSelector(authSettingsSelectors.isFetchingSettings);
    const isUpdatingSettings = useSelector(authSettingsSelectors.isUpdatingSettings);

    const oauth2Provider = useSelector(authSettingsSelectors.oauth2Provider);
    const isFetchingProvider = useSelector(authSettingsSelectors.isFetchingProvider);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [jwkSetKeysDialog, setJwkSetKeysDialog] = useState(false);

    const getAuthenticationSettings = useCallback(() => {
        dispatch(authSettingsActions.getAuthenticationSettings());
    }, [dispatch]);

    useEffect(() => {
        getAuthenticationSettings();
    }, [getAuthenticationSettings]);

    useEffect(() => {
        if (!selectedProvider) return;
        dispatch(authSettingsActions.resetOAuth2ProviderSettings());
        dispatch(authSettingsActions.getOAuth2ProviderSettings({ providerName: selectedProvider }));
    }, [dispatch, selectedProvider]);

    const isBusy = useMemo(() => isFetchingSettings, [isFetchingSettings]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!values) return;
            dispatch(
                authSettingsActions.updateAuthenticationSettings({
                    authenticationSettingsUpdateModel: { disableLocalhostUser: values.disableLocalhostUser },
                }),
            );
        },
        [dispatch],
    );

    const onShowProviderJwkSetKeys = useCallback((providerName: string) => {
        setSelectedProvider(providerName);
        setJwkSetKeysDialog(true);
    }, []);

    const onCloseProviderJwkSetKeys = useCallback(() => {
        setSelectedProvider(null);
        setJwkSetKeysDialog(false);
    }, []);
    const providersButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create Authentication Provider',
                onClick: () => {
                    navigate('./add');
                },
            },
        ],
        [navigate],
    );

    const providerHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'providerName',
                content: 'Name',
            },
            {
                id: 'issuerUrl',
                content: 'Issuer URL',
            },
            {
                id: 'scheme',
                content: 'Authentication scheme',
                align: 'center',
            },
            {
                id: 'moreInfo',
                content: '',
                width: '2%',
            },
        ],
        [],
    );

    const providerDataRows: TableDataRow[] = useMemo(
        () =>
            !authenticationSettings?.oauth2Providers
                ? []
                : Object.entries(authenticationSettings.oauth2Providers).map(([providerName, provider]) => ({
                      id: providerName,
                      columns: [
                          <Link key="link" to={`./detail/${providerName}`}>
                              {providerName}
                          </Link>,
                          provider.issuerUrl ?? '',
                          renderOAuth2StateBadges(provider),
                          <Button
                              className="btn btn-link py-0 px-1 ms-2"
                              color="white"
                              title="Detail"
                              key="jwkKeyInfo"
                              onClick={() => onShowProviderJwkSetKeys(providerName)}
                          >
                              <i className="fa fa-key" style={{ color: 'auto' }} />
                          </Button>,
                      ],
                  })),
        [authenticationSettings, onShowProviderJwkSetKeys],
    );

    const initialValues = useMemo(() => {
        if (!authenticationSettings) return {};
        return { disableLocalhostUser: authenticationSettings.disableLocalhostUser };
    }, [authenticationSettings]);

    const hasValuesChanged = useCallback(
        (values: FormValues) => {
            return values.disableLocalhostUser !== initialValues?.disableLocalhostUser;
        },
        [initialValues],
    );
    return (
        <Container className="themed-container" fluid>
            <TabLayout
                tabs={[
                    {
                        title: 'Authentication Providers',
                        content: (
                            <Widget
                                title="OAuth2 Providers"
                                widgetButtons={providersButtons}
                                refreshAction={getAuthenticationSettings}
                                titleSize="larger"
                                widgetLockName={LockWidgetNameEnum.AuthenticationSettings}
                                lockSize="large"
                                busy={isBusy}
                            >
                                <CustomTable headers={providerHeaders} data={providerDataRows} />
                            </Widget>
                        ),
                    },
                    {
                        title: 'Configuration',
                        content: (
                            <Widget
                                title="Authentication Settings"
                                titleSize="larger"
                                refreshAction={getAuthenticationSettings}
                                busy={isBusy}
                                widgetLockName={LockWidgetNameEnum.AuthenticationSettings}
                                lockSize="large"
                            >
                                <Form initialValues={initialValues} onSubmit={onSubmit}>
                                    {({ handleSubmit, values, submitting }) => (
                                        <BootstrapForm onSubmit={handleSubmit} className="mt-2">
                                            <SwitchField id="disableLocalhostUser" label="Disable Localhost User" />
                                            <div className="d-flex justify-content-end">
                                                <ButtonGroup>
                                                    <ProgressButton
                                                        title={'Apply'}
                                                        inProgressTitle={'Applying..'}
                                                        disabled={submitting || isBusy || !hasValuesChanged(values)}
                                                        inProgress={isUpdatingSettings}
                                                        type="submit"
                                                    />
                                                </ButtonGroup>
                                            </div>
                                        </BootstrapForm>
                                    )}
                                </Form>
                            </Widget>
                        ),
                    },
                ]}
            />
            <Dialog
                size="xl"
                isOpen={jwkSetKeysDialog}
                caption={`JWK Set Keys of "${selectedProvider}"`}
                body={
                    isFetchingProvider ? (
                        <div style={{ height: '100px' }}>
                            <Spinner active={isFetchingProvider} />
                        </div>
                    ) : (
                        <JwkSetKeysTable jwkSetKeys={oauth2Provider?.jwkSetKeys} />
                    )
                }
                toggle={onCloseProviderJwkSetKeys}
                buttons={[{ color: 'secondary', variant: 'outline', onClick: onCloseProviderJwkSetKeys, body: 'Close' }]}
            />
        </Container>
    );
};

export default AuthenticationSettings;
