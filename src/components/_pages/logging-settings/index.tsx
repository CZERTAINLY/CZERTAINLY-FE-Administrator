import AuditLogsSettingForm from 'components/_pages/logging-settings/AuditLogsSettingsForm';
import EventLogsSettingForm from 'components/_pages/logging-settings/EventLogsSettingsForm';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
import { actions, selectors } from 'ducks/settings';
import { actions as authActions, selectors as authSelectors } from 'ducks/auth';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';

const LoggingSetting = () => {
    const dispatch = useDispatch();

    const isFetching = useSelector(selectors.isFetchingLoggingSetting);
    const isUpdating = useSelector(selectors.isUpdatingLoggingSetting);

    const getFreshLoggingSettings = useCallback(() => {
        dispatch(actions.getLoggingSettings());
    }, [dispatch]);

    useEffect(() => {
        getFreshLoggingSettings();
    }, [getFreshLoggingSettings]);

    const isBusy = useMemo(() => isFetching || isUpdating, [isFetching, isUpdating]);

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Logging Settings"
                titleSize="larger"
                busy={isBusy}
                refreshAction={getFreshLoggingSettings}
                widgetLockName={LockWidgetNameEnum.LoggingSettings}
            >
                <TabLayout
                    tabs={[
                        {
                            title: 'Audit logs',
                            content: <AuditLogsSettingForm />,
                        },
                        {
                            title: 'Event logs',
                            content: <EventLogsSettingForm />,
                        },
                    ]}
                />
            </Widget>
        </Container>
    );
};

export default LoggingSetting;
