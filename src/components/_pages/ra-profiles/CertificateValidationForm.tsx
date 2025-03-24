import { useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, Form as BootstrapForm } from 'reactstrap';
import { validatePositiveInteger } from 'utils/validators';

import Spinner from 'components/Spinner';

import { actions, selectors } from 'ducks/ra-profiles';
import { RaProfileResponseModel } from 'types/ra-profiles';
import TextField from 'components/Input/TextField';
import SwitchField from 'components/Input/SwitchField';
import ProgressButton from 'components/ProgressButton';
import { isObjectSame } from 'utils/common-utils';

type FormValues = {
    validationEnabled: boolean;
    validationFrequency?: number;
    expiringThreshold?: number;
};

interface Props {
    raProfile?: RaProfileResponseModel;
}

export default function CertificateValidationForm({ raProfile }: Props) {
    const dispatch = useDispatch();

    const isUpdating = useSelector(selectors.isUpdating);
    const isBusy = useMemo(() => isUpdating, [isUpdating]);

    const initialValues = useMemo(() => {
        if (!raProfile) return {};

        return {
            validationEnabled: raProfile.validationEnabled,
            expiringThreshold: raProfile.expiringThreshold?.toString(),
            validationFrequency: raProfile.validationFrequency?.toString(),
        } as FormValues;
    }, [raProfile]);

    const onSubmit = useCallback((values: FormValues) => {
        if (!raProfile) return;

        dispatch(
            actions.updateCertificateValidation({
                profileUuid: raProfile.uuid,
                authorityInstanceUuid: raProfile.authorityInstanceUuid,
                certificateValidationEditRequest: {
                    certificateValidationSettingsDto: {
                        validationEnabled: values.validationEnabled,
                        expiringThreshold: values.expiringThreshold,
                        validationFrequency: values.validationFrequency,
                    },
                },
            }),
        );
    }, []);

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(values, initialValues);
            return areValuesSame;
        },
        [initialValues],
    );

    if (!raProfile) return <></>;

    return (
        <>
            <Form initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, pristine, submitting, valid, values }) => (
                    <BootstrapForm onSubmit={handleSubmit} className="mt-2">
                        <SwitchField id="validationEnabled" label="Enable certificate validation" />
                        {values.validationEnabled && (
                            <>
                                <TextField
                                    id="validationFrequency"
                                    label="Validation interval"
                                    description="The number of days between consecutive validation runs."
                                    validators={[validatePositiveInteger()]}
                                    inputType="number"
                                />
                                <TextField
                                    id="expiringThreshold"
                                    label="Expiring threshold"
                                    description="How many days before expiration should certificate's validation status change to Expiring."
                                    validators={[validatePositiveInteger()]}
                                    inputType="number"
                                />
                            </>
                        )}
                        {
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={'Apply'}
                                        inProgressTitle={'Applying..'}
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

            <Spinner active={isBusy} />
        </>
    );
}
