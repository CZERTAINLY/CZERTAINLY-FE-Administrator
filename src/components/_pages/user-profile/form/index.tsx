import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import Button from 'components/Button';
import Container from 'components/Container';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import TextInput from 'components/TextInput';

import { actions, selectors } from 'ducks/auth';

import { composeValidators, validateAlphaNumericWithSpecialChars, validateEmail, validateLength } from 'utils/validators';

interface FormValues {
    description: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface UserProfileFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function UserProfileForm({ onCancel, onSuccess }: UserProfileFormProps = {}) {
    const dispatch = useDispatch();

    const profile = useSelector(selectors.profile);

    const isFetchingProfile = useSelector(selectors.isFetchingProfile);
    const isUpdatingProfile = useSelector(selectors.isUpdatingProfile);

    useEffect(() => {
        dispatch(actions.getProfile());
    }, [dispatch]);

    const wasUpdating = useRef(isUpdatingProfile);

    useEffect(() => {
        if (wasUpdating.current && !isUpdatingProfile) {
            if (onSuccess) {
                onSuccess();
            }
        }
        wasUpdating.current = isUpdatingProfile;
    }, [isUpdatingProfile, onSuccess]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            dispatch(
                actions.updateProfile({
                    profile: {
                        description: values.description || undefined,
                        firstName: values.firstName || undefined,
                        lastName: values.lastName || undefined,
                        email: values.email,
                    },
                    redirect: '/userprofile',
                }),
            );
        },
        [dispatch],
    );

    const defaultValues = useMemo(
        () => ({
            description: profile?.description || '',
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            email: profile?.email || '',
        }),
        [profile?.description, profile?.email, profile?.firstName, profile?.lastName],
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

    const buildValidationRules = (validators: Array<(value: any) => string | undefined>) => {
        return {
            validate: (value: any) => {
                const composed = composeValidators(...validators);
                return composed(value);
            },
        };
    };

    return (
        <Container>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Widget noBorder busy={isFetchingProfile || isUpdatingProfile}>
                        <div className="space-y-4">
                            <Controller
                                name="description"
                                control={control}
                                rules={buildValidationRules([validateLength(0, 300)])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        onBlur={field.onBlur}
                                        id="description"
                                        type="text"
                                        placeholder="Description"
                                        label="Description"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="firstName"
                                control={control}
                                rules={buildValidationRules([validateAlphaNumericWithSpecialChars()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        onBlur={field.onBlur}
                                        id="firstName"
                                        type="text"
                                        placeholder="First Name"
                                        label="First Name"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="lastName"
                                control={control}
                                rules={buildValidationRules([validateAlphaNumericWithSpecialChars()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        onBlur={field.onBlur}
                                        id="lastName"
                                        type="text"
                                        placeholder="Last name"
                                        label="Last Name"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                rules={buildValidationRules([validateEmail()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        onBlur={field.onBlur}
                                        id="email"
                                        type="email"
                                        placeholder="Email address"
                                        label="Email"
                                        invalid={fieldState.error && fieldState.isTouched}
                                        error={
                                            fieldState.error && fieldState.isTouched
                                                ? typeof fieldState.error === 'string'
                                                    ? fieldState.error
                                                    : fieldState.error?.message || 'Invalid value'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <Container className="flex-row justify-end modal-footer" gap={4}>
                                <Button
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isSubmitting || isFetchingProfile || isUpdatingProfile}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <ProgressButton
                                    title="Save"
                                    inProgressTitle={'Saving...'}
                                    inProgress={isSubmitting || isFetchingProfile || isUpdatingProfile}
                                    disabled={
                                        !isDirty ||
                                        isSubmitting ||
                                        isFetchingProfile ||
                                        isUpdatingProfile ||
                                        !isValid ||
                                        profile?.systemUser
                                    }
                                    type="submit"
                                />
                            </Container>
                        </div>
                    </Widget>
                </form>
            </FormProvider>
        </Container>
    );
}
