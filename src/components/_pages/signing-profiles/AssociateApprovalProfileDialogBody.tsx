import { actions as approvalProfileActions, selectors as approvalProfileSelectors } from 'ducks/approval-profiles';
import { actions, selectors } from 'ducks/signing-profiles';
import Select from 'components/Select';
import Button from 'components/Button';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { buildValidationRules } from 'utils/validators-helper';
import { validateRequired } from 'utils/validators';
import cn from 'classnames';
import Label from 'components/Label';
import Container from 'components/Container';

interface Props {
    visible: boolean;
    onClose: () => void;
    signingProfileUuid?: string;
    alreadyAssociatedUuids?: string[];
}

const AssociateApprovalProfileDialogBody = ({ signingProfileUuid, visible, onClose, alreadyAssociatedUuids }: Props) => {
    const dispatch = useDispatch();
    const approvalProfiles = useSelector(approvalProfileSelectors.profileApprovalList);
    const isAssociatingApprovalProfile = useSelector(selectors.isAssociatingApprovalProfile);

    useEffect(() => {
        if (!visible) return;
        dispatch(approvalProfileActions.listApprovalProfiles());
    }, [dispatch, visible]);

    const optionsForApprovalProfiles = useMemo(
        () =>
            approvalProfiles
                .filter((e) => !alreadyAssociatedUuids?.includes(e.uuid))
                .map((profile) => ({
                    value: profile.uuid,
                    label: profile.name,
                })),
        [approvalProfiles, alreadyAssociatedUuids],
    );

    const methods = useForm({
        mode: 'onTouched',
        defaultValues: {
            approvalProfile: undefined as string | undefined,
        },
    });

    const { control, handleSubmit, formState } = methods;

    const onSubmit = useCallback(
        (values: { approvalProfile: string | undefined }) => {
            if (!signingProfileUuid || !values?.approvalProfile) return;
            dispatch(
                actions.associateWithApprovalProfile({
                    signingProfileUuid,
                    approvalProfileUuid: values.approvalProfile,
                }),
            );
            onClose();
        },
        [onClose, signingProfileUuid, dispatch],
    );

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="approvalProfile"
                        control={control}
                        rules={buildValidationRules([validateRequired()])}
                        render={({ field, fieldState }) => (
                            <div className="mb-4">
                                <Label
                                    htmlFor="approvalProfileSelect"
                                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-white"
                                >
                                    Select Approval Profile
                                </Label>
                                <Select
                                    id="approvalProfileSelect"
                                    options={optionsForApprovalProfiles}
                                    value={field.value as string}
                                    onChange={(value) => field.onChange(value as string | undefined)}
                                    placeholder="Select Approval Profile to be associated"
                                    className={cn({
                                        'border-red-500': fieldState.error && fieldState.isTouched,
                                    })}
                                />
                                {fieldState.error && fieldState.isTouched && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {typeof fieldState.error === 'string'
                                            ? fieldState.error
                                            : fieldState.error?.message || 'Required Field'}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                    <Container className="flex-row justify-end modal-footer" gap={4}>
                        <Button type="button" variant="outline" color="secondary" disabled={formState.isSubmitting} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={formState.isSubmitting || !formState.isValid || isAssociatingApprovalProfile}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Associate
                        </Button>
                    </Container>
                </form>
            </FormProvider>
        </>
    );
};

export default AssociateApprovalProfileDialogBody;
