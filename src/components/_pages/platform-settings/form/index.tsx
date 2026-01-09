import CertificateSettingsForm from 'components/_pages/platform-settings/certificates/CertificateSettingsForm';
import UtilsSettingsForm from 'components/_pages/platform-settings/utils/UtilsSettingsForm';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';

import { selectors } from 'ducks/settings';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface PlatformSettingsFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function PlatformSettingsForm({ onCancel, onSuccess }: PlatformSettingsFormProps) {
    const dispatch = useDispatch();
    const isFetchingPlatform = useSelector(selectors.isFetchingPlatform);
    const isUpdatingPlatform = useSelector(selectors.isUpdatingPlatform);

    const isBusy = useMemo(() => isFetchingPlatform || isUpdatingPlatform, [isFetchingPlatform, isUpdatingPlatform]);

    return (
        <Widget noBorder busy={isBusy}>
            <TabLayout
                noBorder
                tabs={[
                    {
                        title: 'Utils',
                        content: <UtilsSettingsForm onCancel={onCancel} onSuccess={onSuccess} />,
                    },
                    {
                        title: 'Certificates',
                        content: <CertificateSettingsForm onCancel={onCancel} onSuccess={onSuccess} />,
                    },
                ]}
            />
        </Widget>
    );
}
