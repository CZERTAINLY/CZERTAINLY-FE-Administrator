import SwitchField from 'components/Input/SwitchField';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from 'ducks/settings';
import { Form as BootstrapForm, ButtonGroup, Container } from 'reactstrap';
import { isObjectSame } from 'utils/common-utils';
import { validatePositiveInteger } from 'utils/validators';
import TextField from 'components/Input/TextField';
import { SettingsPlatformModel } from 'types/settings';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import SwitchWidget from 'components/SwitchWidget';

type Props = {
    platformSettings?: SettingsPlatformModel;
};

const CertificateSettings = ({ platformSettings }: Props) => {
    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'setting',
                content: 'Setting',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const data: TableDataRow[] = useMemo(() => {
        const validation = platformSettings?.certificates?.validation;
        if (!validation) return [];
        const rows = [
            {
                id: 'enabled',
                columns: ['Validation Enabled', <SwitchWidget disabled checked={validation.enabled} />],
            },
        ];
        if (validation.enabled && typeof validation.frequency === 'number' && typeof validation.expiringThreshold === 'number') {
            rows.push(
                {
                    id: 'validationFrequency',
                    columns: ['Validation Frequency', validation.frequency.toString()],
                },
                {
                    id: 'expiringThreshold',
                    columns: ['Expiring Threshold', validation.expiringThreshold.toString()],
                },
            );
        }
        return rows;
    }, [platformSettings]);

    return (
        <div style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}>
            <CustomTable headers={headers} data={data} />
        </div>
    );
};

export default CertificateSettings;
