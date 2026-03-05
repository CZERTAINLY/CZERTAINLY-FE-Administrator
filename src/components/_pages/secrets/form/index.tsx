import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import Container from 'components/Container';
import TabLayout from 'components/Layout/TabLayout';
import TextInput from 'components/TextInput';
import TextArea from 'components/TextArea';
import Select from 'components/Select';
import Button from 'components/Button';

import { actions as groupActions, selectors as groupSelectors } from 'ducks/certificateGroups';
import { actions as userActions, selectors as userSelectors } from 'ducks/users';
import { actions as secretsActions, selectors as secretsSelectors } from 'ducks/secrets';
import { actions as vaultProfileActions, selectors as vaultProfileSelectors } from 'ducks/vault-profiles';

import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { PlatformEnum, SecretType } from 'types/openapi';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import { buildValidationRules, getFieldErrorMessage } from 'utils/validators-helper';

interface SelectOption {
    value: string;
    label: string;
}

interface SecretFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

interface FormValues {
    name: string;
    description: string;
    sourceVaultProfile?: string;
    type?: string;
    owner?: string;
    groups: SelectOption[];
    content?: string;
}

export default function SecretForm({ onCancel, onSuccess }: SecretFormProps) {
    const dispatch = useDispatch();

    const users = useSelector(userSelectors.users);
    const groups = useSelector(groupSelectors.certificateGroups);
    const isCreating = useSelector(secretsSelectors.isCreating);
    const vaultProfiles = useSelector(vaultProfileSelectors.vaultProfiles);

    const secretTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SecretType));

    useEffect(() => {
        dispatch(groupActions.listGroups());
        dispatch(userActions.list());
    }, [dispatch]);

    useEffect(() => {
        dispatch(vaultProfileActions.listVaultProfiles());
    }, [dispatch]);

    const optionsForUsers = useMemo(
        () =>
            users.map((user) => ({
                value: user.uuid,
                label: user.username,
            })),
        [users],
    );

    const optionsForGroups = useMemo(
        () =>
            groups.map((group) => ({
                value: group.uuid,
                label: group.name,
            })),
        [groups],
    );

    const optionsForVaultProfiles = useMemo(
        () =>
            vaultProfiles
                .filter((profile) => profile.enabled)
                .map((profile) => ({
                    value: profile.uuid,
                    label: profile.name,
                })),
        [vaultProfiles],
    );

    const optionsForTypes = useMemo(() => {
        const options: SelectOption[] = [];
        for (const key in SecretType) {
            const value = SecretType[key as keyof typeof SecretType];
            options.push({
                value,
                label: getEnumLabel(secretTypeEnum, value),
            });
        }
        return options;
    }, [secretTypeEnum]);

    const defaultValues: FormValues = useMemo(
        () => ({
            name: '',
            description: '',
            sourceVaultProfile: undefined,
            type: undefined,
            owner: undefined,
            groups: [],
            content: '',
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
    } = methods;

    const onSubmit = useCallback(
        (values: FormValues) => {
            // Backend integration will be added in a separate step.
            dispatch(secretsActions.createSecret());
            onSuccess?.();
        },
        [dispatch, onSuccess],
    );

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
                                    id="secret-name"
                                    label="Name*"
                                    placeholder="Enter the secret name"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={getFieldErrorMessage(fieldState)}
                                />
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    id="secret-description"
                                    label="Description"
                                    placeholder="Describe the secret"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />

                        <Controller
                            name="sourceVaultProfile"
                            control={control}
                            rules={buildValidationRules([validateRequired()])}
                            render={({ field, fieldState }) => (
                                <Select
                                    id="secret-vault-profile"
                                    label="Source Vault Profile*"
                                    placeholder="Select profile"
                                    options={optionsForVaultProfiles}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={getFieldErrorMessage(fieldState)}
                                />
                            )}
                        />

                        <Controller
                            name="type"
                            control={control}
                            rules={buildValidationRules([validateRequired()])}
                            render={({ field, fieldState }) => (
                                <Select
                                    id="secret-type"
                                    label="Content inputs*"
                                    placeholder="Select"
                                    options={optionsForTypes}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={getFieldErrorMessage(fieldState)}
                                />
                            )}
                        />

                        <Controller
                            name="owner"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="secret-owner"
                                    label="Owner"
                                    placeholder="Select user"
                                    options={optionsForUsers}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <Controller
                            name="groups"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="secret-groups"
                                    label="Groups"
                                    placeholder="Select group"
                                    options={optionsForGroups}
                                    value={field.value}
                                    onChange={field.onChange}
                                    isMulti
                                />
                            )}
                        />

                        <TabLayout
                            tabs={[
                                {
                                    title: 'Attributes',
                                    content: <div className="text-sm text-gray-500">No attributes configured yet.</div>,
                                },
                                {
                                    title: 'Custom Attributes',
                                    content: <div className="text-sm text-gray-500">No custom attributes configured yet.</div>,
                                },
                            ]}
                        />

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
