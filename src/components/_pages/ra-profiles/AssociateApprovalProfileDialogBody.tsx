import { actions as approvalProfileActions, selectors as approvalProfileSelectors } from 'ducks/approval-profiles';
import { actions as raProfilesActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import Select from 'components/Select';
import Button from 'components/Button';

import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { buildValidationRules } from 'utils/validators-helper';
import { validateRequired } from 'utils/validators';
import cn from 'classnames';

interface Props {
    visible: boolean;
    onClose: () => void;
    raProfile?: RaProfileResponseModel;
    availableApprovalProfileUuids?: string[];
    authorityUuid?: string;
    uuid?: string;
}

const AssociateApprovalProfileDialogBody = ({ raProfile, visible, onClose, availableApprovalProfileUuids, authorityUuid, uuid }: Props) => {
    const dispatch = useDispatch();
    const approvalProfiles = useSelector(approvalProfileSelectors.profileApprovalList);

    const isAssociatingApprovalProfile = useSelector(raProfilesSelectors.isAssociatingApprovalProfile);

    useEffect(() => {
        if (!visible) return;

        dispatch(approvalProfileActions.listApprovalProfiles());
    }, [dispatch, visible]);

    const optionsForApprovalProfiles = useMemo(
        () =>
            approvalProfiles
                .filter((e) => !availableApprovalProfileUuids?.includes(e.uuid))
                .map((raProfile) => ({
                    value: raProfile.uuid,
                    label: raProfile.name,
                })),
        [approvalProfiles, availableApprovalProfileUuids],
    );

    const methods = useForm({
        mode: 'onTouched',
        defaultValues: {
            approvalProfiles: undefined as string | undefined,
        },
    });

    const { control, handleSubmit, formState } = methods;

    const onSubmit = useCallback(
        (values: { approvalProfiles: string | undefined }) => {
            if (!authorityUuid || !raProfile || !values?.approvalProfiles) return;
            dispatch(
                raProfilesActions.associateRAProfileWithApprovalProfile({
                    approvalProfileUuid: values.approvalProfiles,
                    authorityUuid: authorityUuid,
                    raProfileUuid: raProfile.uuid,
                }),
            );
            onClose();
        },
        [onClose, authorityUuid, raProfile, dispatch],
    );

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="approvalProfiles"
                        control={control}
                        rules={buildValidationRules([validateRequired()])}
                        render={({ field, fieldState }) => (
                            <div className="mb-4">
                                <label
                                    htmlFor="approvalProfileSelect"
                                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-white"
                                >
                                    Select Approval profile
                                </label>

                                <Select
                                    id="approvalProfileSelect"
                                    options={optionsForApprovalProfiles}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value as string | undefined)}
                                    placeholder="Select Approval profile to be associated"
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

                    <div className="flex justify-end gap-2">
                        <Button
                            type="submit"
                            color="primary"
                            disabled={formState.isSubmitting || !formState.isValid || isAssociatingApprovalProfile}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Associate
                        </Button>

                        <Button type="button" variant="outline" color="secondary" disabled={formState.isSubmitting} onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default AssociateApprovalProfileDialogBody;
