import CertificateSettingsForm from 'components/_pages/platform-settings/certificates/CertificateSettingsForm';
import UtilsSettingsForm from 'components/_pages/platform-settings/utils/UtilsSettingsForm';
import TextField from 'components/Input/TextField';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions, selectors } from 'ducks/settings';
import { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Form as BootstrapForm, Button, ButtonGroup } from 'reactstrap';
import { SettingsPlatformModel } from 'types/settings';

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
