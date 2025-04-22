import CertificateSettings from 'components/_pages/platform-settings/certificates/CertificateSettings';
import UtilsSettings from 'components/_pages/platform-settings/utils/UtilsSettings';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/settings';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { Container } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function PlatformSettingsDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const platformSettings = useSelector(selectors.platformSettings);
    const isFetchingPlatform = useSelector(selectors.isFetchingPlatform);

    const getFreshPlatformSettings = useCallback(() => {
        dispatch(actions.getPlatformSettings());
    }, [dispatch]);

    useEffect(() => {
        getFreshPlatformSettings();
    }, [getFreshPlatformSettings]);

    const onEditClick = useCallback(() => {
        navigate(`./edit`);
    }, [navigate]);

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
        ],
        [onEditClick],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Platform Settings"
                busy={isFetchingPlatform}
                widgetLockName={LockWidgetNameEnum.PlatformSettings}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshPlatformSettings}
            >
                <TabLayout
                    tabs={[
                        {
                            title: 'Utils',
                            content: <UtilsSettings platformSettings={platformSettings} />,
                        },
                        {
                            title: 'Certificates',
                            content: <CertificateSettings platformSettings={platformSettings} />,
                        },
                    ]}
                />
            </Widget>
        </Container>
    );
}
