import { useMemo } from 'react';
import { SettingsPlatformModel } from 'types/settings';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import SwitchWidget from 'components/SwitchWidget';
import { renderExpiringThresholdLabel, renderValidationFrequencyLabel } from 'utils/certificate-validation';

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
                columns: ['Validation Enabled', <SwitchWidget key="enabled" disabled checked={validation.enabled} />],
            },
        ];
        if (validation.enabled && typeof validation.frequency === 'number' && typeof validation.expiringThreshold === 'number') {
            rows.push(
                {
                    id: 'validationFrequency',
                    columns: ['Validation Frequency', renderValidationFrequencyLabel(validation.frequency)],
                },
                {
                    id: 'expiringThreshold',
                    columns: ['Expiring Threshold', renderExpiringThresholdLabel(validation.expiringThreshold)],
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
