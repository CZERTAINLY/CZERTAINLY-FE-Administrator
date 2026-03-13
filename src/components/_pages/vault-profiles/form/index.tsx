import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Widget from 'components/Widget';
import Container from 'components/Container';
import TextInput from 'components/TextInput';
import TextArea from 'components/TextArea';
import Select from 'components/Select';
import ProgressButton from 'components/ProgressButton';
import Button from 'components/Button';
import AttributeEditor from 'components/Attributes/AttributeEditor';

import { actions as vaultProfileActions, selectors as vaultProfileSelectors } from 'ducks/vault-profiles';
import { actions as vaultActions, selectors as vaultSelectors } from 'ducks/vaults';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';

import { validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import { buildValidationRules, getFieldErrorMessage } from 'utils/validators-helper';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { Resource, VaultInstanceDto } from 'types/openapi';
import type { VaultProfileRequestDto } from 'types/openapi';

interface VaultProfileFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

type SelectOption = {
    value: string;
    label: string;
};

interface FormValues {
    name: string;
    vaultUuid?: string;
    description: string;
}

const listVaultsPayload = { itemsPerPage: 1000, pageNumber: 1, filters: [] } as const;

export default function VaultProfileForm({ onCancel, onSuccess }: VaultProfileFormProps) {
    const dispatch = useDispatch();
    const hasLoadedRef = useRef(false);

    const vaults = useSelector(vaultSelectors.vaults);
    const isCreating = useSelector(vaultProfileSelectors.isCreating);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;
        dispatch(vaultActions.listVaults(listVaultsPayload as any));
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.VaultProfiles));
    }, [dispatch]);

    const optionsForVaults = useMemo<SelectOption[]>(
        () =>
            vaults.map((vault: VaultInstanceDto) => ({
                value: vault.uuid,
                label: vault.name,
            })),
        [vaults],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            name: '',
            vaultUuid: undefined,
            description: '',
        }),
        [],
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
            if (!values.vaultUuid) return;

            const allValues = getValues();
            const request: VaultProfileRequestDto = {
                name: values.name,
                description: values.description || undefined,
                customAttributes: collectFormAttributes('customVaultProfile', resourceCustomAttributes, allValues),
            };

            dispatch(
                vaultProfileActions.createVaultProfile({
                    vaultUuid: values.vaultUuid,
                    request,
                }),
            );
        },
        [dispatch, getValues, resourceCustomAttributes],
    );

    const wasCreatingRef = useRef(false);

    useEffect(() => {
        if (wasCreatingRef.current && !isCreating) {
            onSuccess?.();
        }
        wasCreatingRef.current = isCreating;
    }, [isCreating, onSuccess]);

    const handleCancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    const submitTitle = useMemo(() => 'Create', []);
    const inProgressTitle = useMemo(() => 'Creating...', []);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Widget busy={isCreating} noBorder>
                    <div className="space-y-4">
                        <Controller
                            name="name"
                            control={control}
                            rules={buildValidationRules([validateRequired(), validateAlphaNumericWithSpecialChars()])}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    id="vault-profile-name"
                                    label="Name"
                                    placeholder="Enter the vault profile name"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={getFieldErrorMessage(fieldState)}
                                    required
                                />
                            )}
                        />

                        <Controller
                            name="vaultUuid"
                            control={control}
                            rules={buildValidationRules([validateRequired()])}
                            render={({ field, fieldState }) => (
                                <Select
                                    id="vault-profile-vault"
                                    label="Vault"
                                    placeholder="Select vault"
                                    options={optionsForVaults}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={getFieldErrorMessage(fieldState)}
                                    required
                                />
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    id="vault-profile-description"
                                    label="Description"
                                    placeholder="Describe the vault profile"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />

                        <Widget title="Custom Attributes" titleSize="large">
                            <AttributeEditor id="customVaultProfile" attributeDescriptors={resourceCustomAttributes} />
                        </Widget>

                        <Container className="flex-row justify-end modal-footer" gap={4}>
                            <Button variant="outline" onClick={handleCancel} type="button">
                                Cancel
                            </Button>
                            <ProgressButton
                                inProgress={isSubmitting || isCreating}
                                disabled={!isDirty || !isValid || isSubmitting || isCreating}
                                title={submitTitle}
                                inProgressTitle={inProgressTitle}
                                type="submit"
                                color="primary"
                            />
                        </Container>
                    </div>
                </Widget>
            </form>
        </FormProvider>
    );
}
