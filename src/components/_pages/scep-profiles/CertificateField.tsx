import { useEffect, useMemo } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';
import { CertificateListResponseModel } from 'types/certificate';

import { validateRequired } from 'utils/validators';

interface Props {
    certificates: CertificateListResponseModel[] | undefined;
}

export default function CertificateField({ certificates }: Props) {
    const form = useForm();
    const formState = useFormState();

    useEffect(() => {
        if (
            formState.values['certificate'] &&
            certificates &&
            !certificates?.find((c) => c.uuid === formState.values['certificate']?.value)
        ) {
            form.change('certificate', undefined);
        }
    }, [certificates, formState.values, form]);

    const optionsForCertificates = useMemo(() => {
        return certificates?.map((certificate) => ({
            value: certificate.uuid,
            label: `${certificate.commonName} (${certificate.serialNumber})`,
        }));
    }, [certificates]);

    return (
        <Field name="certificate" type="select" validate={validateRequired()}>
            {({ input, meta }) => (
                <FormGroup>
                    <Label for="certificateSelect">CA Certificate</Label>
                    <Select
                        {...input}
                        inputId="certificateSelect"
                        id="certificate"
                        maxMenuHeight={140}
                        menuPlacement="auto"
                        options={optionsForCertificates}
                        placeholder="Select to change CA Certificate if needed"
                        isClearable={true}
                    />
                </FormGroup>
            )}
        </Field>
    );
}
