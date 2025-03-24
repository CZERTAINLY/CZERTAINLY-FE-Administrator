import CertificateSettingsForm from 'components/_pages/platform-settings/certificates/CertificateSettingsForm';
import UtilsSettingsForm from 'components/_pages/platform-settings/utils/UtilsSettingsForm';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';

import { selectors } from 'ducks/settings';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PlatformSettingsForm() {
    const isFetchingPlatform = useSelector(selectors.isFetchingPlatform);
    const isUpdatingPlatform = useSelector(selectors.isUpdatingPlatform);

    const isBusy = useMemo(() => isFetchingPlatform || isUpdatingPlatform, [isFetchingPlatform, isUpdatingPlatform]);

    return (
        <Widget title="Platform Settings" busy={isBusy}>
            <TabLayout
                tabs={[
                    {
                        title: 'Utils',
                        content: <UtilsSettingsForm />,
                    },
                    {
                        title: 'Certificates',
                        content: <CertificateSettingsForm />,
                    },
                ]}
            />
        </Widget>
    );
}
