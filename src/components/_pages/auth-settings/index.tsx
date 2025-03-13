import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import SwitchField from 'components/Input/SwitchField';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as authSettingsActions, selectors as authSettingsSelectors } from 'ducks/auth-settings';
import { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form as BootstrapForm, ButtonGroup, Container } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { renderOAuth2StateBadge } from 'utils/oauth2Providers';

type FormValues = {
    disableLocalhostUser: boolean;
};

const AuthenticationSettings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authenticationSettings = useSelector(authSettingsSelectors.authenticationSettings);
    const isFetchingSettings = useSelector(authSettingsSelectors.isFetchingSettings);
    const isUpdatingSettings = useSelector(authSettingsSelectors.isUpdatingSettings);

    const getAuthenticationSettings = useCallback(() => {
        dispatch(authSettingsActions.getAuthenticationSettings());
    }, [dispatch]);

    useEffect(() => {
        getAuthenticationSettings();
    }, [getAuthenticationSettings]);

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
                id: 'status',
                content: 'Status',
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
                          renderOAuth2StateBadge(provider),
                      ],
                  })),
        [authenticationSettings],
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
        </Container>
    );
};

export default AuthenticationSettings;
