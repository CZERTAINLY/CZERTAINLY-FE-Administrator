import { useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, Form as BootstrapForm, Button, Label } from 'reactstrap';
import { validateNonZeroInteger, validatePositiveInteger } from 'utils/validators';

import Spinner from 'components/Spinner';

import { actions, selectors } from 'ducks/ra-profiles';
import { RaProfileResponseModel } from 'types/ra-profiles';
import TextField from 'components/Input/TextField';
import SwitchField from 'components/Input/SwitchField';
import ProgressButton from 'components/ProgressButton';
import { isObjectSame } from 'utils/common-utils';
import { SettingsPlatformModel } from 'types/settings';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import SwitchWidget from 'components/SwitchWidget';
import { renderExpiringThresholdLabel, renderValidationFrequencyLabel } from 'utils/certificate-validation';

type FormValues = {
    usePlatformSettings: boolean;
    enabled: boolean;
    frequency?: number;
    expiringThreshold?: number;
};

interface Props {
    platformSettings?: SettingsPlatformModel;
    raProfile?: RaProfileResponseModel;
    onClose: () => void;
}

export default function CertificateValidationDialogBody({ raProfile, platformSettings, onClose }: Props) {
    const dispatch = useDispatch();

    const isUpdating = useSelector(selectors.isUpdating);
    const isBusy = useMemo(() => isUpdating, [isUpdating]);

    const initialValues = useMemo(() => {
        if (!raProfile?.certificateValidationSettings) return {};

        return {
            usePlatformSettings: raProfile.certificateValidationSettings.usePlatformSettings,
            enabled: raProfile.certificateValidationSettings.enabled,
            frequency: raProfile.certificateValidationSettings.frequency?.toString(),
            expiringThreshold: raProfile.certificateValidationSettings.expiringThreshold?.toString(),
        } as FormValues;
    }, [raProfile]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!raProfile) return;

            dispatch(
                actions.updateRaProfileCertificateValidation({
                    profileUuid: raProfile.uuid,
                    authorityInstanceUuid: raProfile.authorityInstanceUuid ?? 'unknown',
                    validation: {
                        usePlatformSettings: values.usePlatformSettings,
                        enabled: values.enabled,
                        frequency: values.frequency,
                        expiringThreshold: values.expiringThreshold,
                    },
                }),
            );
            onClose();
        },
        [dispatch, raProfile, onClose],
    );

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(values, initialValues);
            return areValuesSame;
        },
        [initialValues],
    );
    const certificateValidationHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'setting',
                content: 'Setting',
                width: '70%',
            },
            {
                id: 'value',
                content: 'Value',
                width: '30%',
            },
        ],
        [],
    );

    const certificateValidationData: TableDataRow[] = useMemo(() => {
        if (!platformSettings) return [];

        const data = [
            {
                id: 'enabled',
                columns: [
                    'Enable Validation',
                    <SwitchWidget key="validationEnabled" disabled checked={platformSettings.certificates?.validation?.enabled} />,
                ],
            },
            {
                id: 'frequency',
                columns: ['Validation Frequency', renderValidationFrequencyLabel(platformSettings.certificates?.validation?.frequency)],
            },
            {
                id: 'expiringThreshold',
                columns: ['Expiring Threshold', renderExpiringThresholdLabel(platformSettings.certificates?.validation?.expiringThreshold)],
            },
        ];

        return data;
    }, [platformSettings]);

    if (!raProfile) return <></>;

    return (
        <>
            <Form initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, pristine, submitting, valid, values }) => (
                    <BootstrapForm onSubmit={handleSubmit} className="mt-2">
                        <SwitchField id="usePlatformSettings" label="Use Platform Certificate Validation Settings" />
                        {values.usePlatformSettings ? (
                            <>
                                <Label>Current Platform Settings</Label>
                                <CustomTable headers={certificateValidationHeaders} data={certificateValidationData} />
                            </>
                        ) : (
                            <>
                                <SwitchField id="enabled" label="Enable Certificate Validation" />
                                {values.enabled && (
                                    <>
                                        <TextField
                                            id="frequency"
                                            label="Validation Frequency"
                                            description="Validation frequency of certificates specified in days."
                                            validators={[validateNonZeroInteger(), validatePositiveInteger()]}
                                            inputType="number"
                                        />
                                        <TextField
                                            id="expiringThreshold"
                                            label="Expiring Threshold"
                                            description="How many days before expiration should certificate's validation status change to Expiring."
                                            validators={[validateNonZeroInteger(), validatePositiveInteger()]}
                                            inputType="number"
                                        />
                                    </>
                                )}
                            </>
                        )}
                        {
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={'Save'}
                                        inProgressTitle={'Saving...'}
                                        disabled={submitting || isBusy || areDefaultValuesSame(values)}
                                        inProgress={submitting || isBusy}
                                        type="submit"
                                    />
                                    <Button type="button" color="secondary" disabled={submitting} onClick={onClose}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        }
                    </BootstrapForm>
                )}
            </Form>

            <Spinner active={isBusy} />
        </>
    );
}
