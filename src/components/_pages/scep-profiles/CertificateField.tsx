import { useEffect, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import Select from 'components/Select';
import { CertificateListResponseModel } from 'types/certificate';

import { buildValidationRules } from 'utils/validators-helper';
import { validateRequired } from 'utils/validators';
import cn from 'classnames';

interface Props {
    certificates: CertificateListResponseModel[] | undefined;
}

export default function CertificateField({ certificates }: Props) {
    const { control, setValue } = useFormContext();
    const watchedCertificate = useWatch({ control, name: 'certificate' });

    useEffect(() => {
        if (watchedCertificate && certificates && !certificates?.find((c) => c.uuid === watchedCertificate)) {
            setValue('certificate', undefined);
        }
    }, [certificates, watchedCertificate, setValue]);

    const optionsForCertificates = useMemo(() => {
        return certificates?.map((certificate) => ({
            value: certificate.uuid,
            label: `${certificate.commonName} (${certificate.serialNumber})`,
        }));
    }, [certificates]);

    return (
        <Controller
            name="certificate"
            control={control}
            rules={buildValidationRules([validateRequired()])}
            render={({ field, fieldState }) => (
                <div className="mb-4">
                    <label htmlFor="certificateSelect" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                        CA Certificate
                    </label>
                    <Select
                        id="certificateSelect"
                        options={optionsForCertificates || []}
                        value={field.value}
                        onChange={(value) => field.onChange(value as string | undefined)}
                        placeholder="Select to change CA Certificate if needed"
                        isClearable={true}
                        className={cn({
                            'border-red-500': fieldState.error && fieldState.isTouched,
                        })}
                    />
                    {fieldState.error && fieldState.isTouched && (
                        <p className="mt-1 text-sm text-red-600">
                            {typeof fieldState.error === 'string' ? fieldState.error : fieldState.error?.message || 'Invalid value'}
                        </p>
                    )}
                </div>
            )}
        />
    );
}
