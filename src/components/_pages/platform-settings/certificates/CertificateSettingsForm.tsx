import SwitchField from 'components/Input/SwitchField';
import ProgressButton from 'components/ProgressButton';
import { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from 'ducks/settings';
import { Form as BootstrapForm, ButtonGroup } from 'reactstrap';
import { isObjectSame } from 'utils/common-utils';
import { validateNonZeroInteger, validatePositiveInteger } from 'utils/validators';
import TextField from 'components/Input/TextField';

type FormValues = {
    enabled: boolean;
    frequency?: number;
    expiringThreshold?: number;
};

const CertificateSettingsForm = () => {
    const DEFAULT_FREQUENCY = 1;
    const DEFAULT_EXPIRING_THRESHOLD = 30;

    const dispatch = useDispatch();

    const platformSettings = useSelector(selectors.platformSettings);
    const isFetching = useSelector(selectors.isFetchingPlatform);
    const isUpdating = useSelector(selectors.isUpdatingPlatform);

    const getFreshSettings = useCallback(() => {
        dispatch(actions.getPlatformSettings());
    }, [dispatch]);

    useEffect(() => {
        getFreshSettings();
    }, [getFreshSettings]);

    const isBusy = useMemo(() => isFetching || isUpdating, [isFetching, isUpdating]);

    const initialValues = useMemo(() => {
        const validationSettings = platformSettings?.certificates?.validation;
        if (!validationSettings) return {};

        return {
            enabled: validationSettings.enabled,
            expiringThreshold: validationSettings.expiringThreshold?.toString() || DEFAULT_EXPIRING_THRESHOLD,
            frequency: validationSettings.frequency?.toString() || DEFAULT_FREQUENCY,
        } as FormValues;
    }, [platformSettings?.certificates?.validation]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            dispatch(
                actions.updatePlatformSettings({
                    certificates: {
                        validation: values,
                    },
                }),
            );
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(values, initialValues);
            return areValuesSame;
        },
        [initialValues],
    );

    return (
        <div style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}>
            <Form initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, pristine, submitting, valid, values }) => (
                    <BootstrapForm onSubmit={handleSubmit} className="mt-2">
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
                                </ButtonGroup>
                            </div>
                        }
                    </BootstrapForm>
                )}
            </Form>
        </div>
    );
};

export default CertificateSettingsForm;
