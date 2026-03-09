import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import AttributeEditor from 'components/Attributes/AttributeEditor';
import Button from 'components/Button';
import Container from 'components/Container';
import ProgressButton from 'components/ProgressButton';
import TextArea from 'components/TextArea';

import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as vaultProfileActions, selectors as vaultProfileSelectors } from 'ducks/vault-profiles';

import { Resource } from 'types/openapi';
import type { VaultProfileDetailDto } from 'types/openapi';
import { collectFormAttributes } from 'utils/attributes/attributes';

interface VaultProfileEditFormProps {
    profile: VaultProfileDetailDto;
    vaultUuid: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

interface FormValues {
    description: string;
    [key: string]: unknown;
}

export default function VaultProfileEditForm({ profile, vaultUuid, onCancel, onSuccess }: VaultProfileEditFormProps) {
    const dispatch = useDispatch();

    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isUpdating = useSelector(vaultProfileSelectors.isUpdating);

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.VaultProfiles));
    }, [dispatch]);

    const defaultValues: FormValues = useMemo(
        () => ({
            description: profile.description ?? '',
        }),
        [profile.description],
    );

    const methods = useForm<FormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isDirty, isSubmitting, isValid },
        getValues,
    } = methods;

    const onSubmit = useCallback(
        (values: FormValues) => {
            const allValues = getValues();
            dispatch(
                vaultProfileActions.updateVaultProfile({
                    vaultUuid,
                    vaultProfileUuid: profile.uuid,
                    request: {
                        description: values.description ?? '',
                        customAttributes: collectFormAttributes('customVaultProfile', resourceCustomAttributes, allValues),
                    },
                }),
            );
            onSuccess?.();
        },
        [dispatch, getValues, onSuccess, profile.uuid, resourceCustomAttributes, vaultUuid],
    );

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextArea
                                id="vault-profile-edit-description"
                                label="Description"
                                placeholder="Describe the vault profile"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                    <AttributeEditor
                        id="customVaultProfile"
                        attributeDescriptors={resourceCustomAttributes}
                        attributes={profile.customAttributes ?? []}
                    />
                    <Container className="flex-row justify-end modal-footer" gap={4}>
                        <Button variant="outline" onClick={onCancel} type="button">
                            Cancel
                        </Button>
                        <ProgressButton
                            inProgress={isSubmitting || isUpdating}
                            disabled={!isDirty || !isValid || isSubmitting || isUpdating}
                            title="Save"
                            inProgressTitle="Saving..."
                            type="submit"
                            color="primary"
                        />
                    </Container>
                </div>
            </form>
        </FormProvider>
    );
}
