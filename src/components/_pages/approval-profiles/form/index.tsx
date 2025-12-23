import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';

import { actions as profileApprovalActions, selectors as profileApprovalSelectors } from 'ducks/approval-profiles';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Button from 'components/Button';
import Container from 'components/Container';
import TextInput from 'components/TextInput';
import { ApprovalStepRequestModel, ProfileApprovalRequestModel } from 'types/approval-profiles';
import { isObjectSame } from 'utils/common-utils';
import {
    composeValidators,
    validateAlphaNumericWithSpecialChars,
    validateLength,
    validateNonZeroInteger,
    validatePositiveInteger,
    validateRequired,
} from 'utils/validators';
import ApprovalStepField from './approval-step-field';

const defaultApprovalSteps: ApprovalStepRequestModel[] = [
    {
        order: 1,
    },
];

interface ApprovalProfileFormProps {
    approvalProfileId?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
}

function ApprovalProfileForm({ approvalProfileId, onCancel, onSuccess }: ApprovalProfileFormProps) {
    const dispatch = useDispatch();

    const isCreating = useSelector(profileApprovalSelectors.isCreating);
    const isUpdating = useSelector(profileApprovalSelectors.isUpdating);
    const isFetchingDetail = useSelector(profileApprovalSelectors.isFetchingDetail);
    const isBusy = useMemo(() => isCreating || isUpdating || isFetchingDetail, [isCreating, isUpdating, isFetchingDetail]);

    const profileApprovalDetail = useSelector(profileApprovalSelectors.profileApprovalDetail);

    const { id: routeId } = useParams();
    const id = approvalProfileId || routeId;

    const editMode = useMemo(() => !!id, [id]);

    const previousIdRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (editMode && id) {
            // Fetch if id changed or if we don't have the correct profile loaded
            if (previousIdRef.current !== id || !profileApprovalDetail || profileApprovalDetail.uuid !== id) {
                dispatch(profileApprovalActions.getApprovalProfile({ uuid: id }));
                previousIdRef.current = id;
            }
        } else {
            previousIdRef.current = undefined;
        }
    }, [dispatch, id, editMode, profileApprovalDetail]);

    const defaultValues: ProfileApprovalRequestModel = useMemo(
        () =>
            editMode && profileApprovalDetail
                ? { ...profileApprovalDetail, enabled: false }
                : {
                      name: '',
                      enabled: false,
                      approvalSteps: defaultApprovalSteps,
                  },
        [profileApprovalDetail, editMode],
    );

    const areDefaultValuesSame = useCallback(
        (values: ProfileApprovalRequestModel) => {
            const areValuesSame = isObjectSame(values, defaultValues);
            return areValuesSame;
        },
        [defaultValues],
    );

    const methods = useForm<ProfileApprovalRequestModel>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isDirty, isSubmitting, isValid, errors },
        reset,
    } = methods;

    const formValues = useWatch({ control });

    // Helper function to convert validators for react-hook-form
    const buildValidationRules = (validators: Array<(value: any) => string | undefined>) => {
        return {
            validate: (value: any) => {
                const composed = composeValidators(...validators);
                return composed(value);
            },
        };
    };

    const validateApprovalSteps = useCallback((values: ProfileApprovalRequestModel) => {
        const hasInvalidSteps = values.approvalSteps.some((step) => {
            const { roleUuid, groupUuid, userUuid } = step;
            return !roleUuid && !groupUuid && !userUuid;
        });
        return hasInvalidSteps ? 'Approval Steps are not valid' : undefined;
    }, []);

    const onSubmit = useCallback(
        (values: ProfileApprovalRequestModel) => {
            if (!editMode) {
                dispatch(profileApprovalActions.createApprovalProfile(values));
            } else {
                if (!id) return;

                dispatch(profileApprovalActions.editApprovalProfile({ editProfileApproval: values, uuid: id }));
            }
        },
        [dispatch, editMode, id],
    );

    // Reset form values when profileApprovalDetail is loaded in edit mode
    useEffect(() => {
        if (editMode && id && profileApprovalDetail && profileApprovalDetail.uuid === id && !isFetchingDetail) {
            const newDefaultValues: ProfileApprovalRequestModel = {
                ...profileApprovalDetail,
                enabled: false,
            };
            reset(newDefaultValues, { keepDefaultValues: false });
        } else if (!editMode) {
            // Reset form when switching to create mode
            reset({
                name: '',
                enabled: false,
                approvalSteps: defaultApprovalSteps,
                expiry: undefined,
                description: '',
            });
        }
    }, [editMode, profileApprovalDetail, id, reset, isFetchingDetail]);

    const wasCreating = useRef(isCreating);
    const wasUpdating = useRef(isUpdating);

    useEffect(() => {
        if (wasCreating.current && !isCreating) {
            if (onSuccess) {
                onSuccess();
            }
        }
        wasCreating.current = isCreating;
    }, [isCreating, onSuccess]);

    useEffect(() => {
        if (wasUpdating.current && !isUpdating) {
            if (onSuccess) {
                onSuccess();
            }
        }
        wasUpdating.current = isUpdating;
    }, [isUpdating, onSuccess]);

    const handleCancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    const approvalStepsError = validateApprovalSteps(formValues);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Widget noBorder busy={isBusy}>
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                rules={buildValidationRules([validateRequired(), validateAlphaNumericWithSpecialChars()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        onBlur={field.onBlur}
                                        id="name"
                                        type="text"
                                        placeholder="Approval Profile Name"
                                        disabled={editMode}
                                        label="Profile Name"
                                        required
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
                                name="expiry"
                                control={control}
                                rules={buildValidationRules([validateRequired(), validateNonZeroInteger(), validatePositiveInteger()])}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        value={field.value !== undefined ? field.value.toString() : ''}
                                        onChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                        onBlur={field.onBlur}
                                        id="expiry"
                                        type="number"
                                        placeholder="Expiry in hours"
                                        label="Expiry"
                                        required
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
                        </div>

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
                                    placeholder="Approval Profile Description"
                                    label="Profile Description"
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

                        <ApprovalStepField
                            approvalSteps={useMemo(
                                () =>
                                    formValues.approvalSteps?.map((step, index) => ({
                                        ...step,
                                        order: step.order ?? index + 1,
                                    })) ?? [],
                                [formValues.approvalSteps],
                            )}
                            inProgress={isSubmitting}
                            onCancelClick={handleCancel}
                        />

                        {approvalStepsError && <p className="mt-1 text-sm text-red-600">{approvalStepsError}</p>}

                        <Container className="flex-row justify-end modal-footer" gap={4}>
                            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} type="button">
                                Cancel
                            </Button>
                            <ProgressButton
                                title={editMode ? 'Update' : 'Create'}
                                inProgressTitle={editMode ? 'Updating...' : 'Creating...'}
                                inProgress={isSubmitting}
                                disabled={isSubmitting || !isValid || !!approvalStepsError || areDefaultValuesSame(formValues)}
                                type="submit"
                            />
                        </Container>
                    </div>
                </Widget>
            </form>
        </FormProvider>
    );
}

export default ApprovalProfileForm;
