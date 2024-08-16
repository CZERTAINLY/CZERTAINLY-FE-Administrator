import { actions as approvalProfileActions, selectors as approvalProfileSelectors } from 'ducks/approval-profiles';
import { actions as raProfilesActions, selectors as raProfilesSelectors } from 'ducks/ra-profiles';
import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormGroup, Label } from 'reactstrap';

import { useCallback, useEffect, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { validateRequired } from 'utils/validators';

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
                    value: raProfile,
                    label: raProfile.name,
                })),
        [approvalProfiles, availableApprovalProfileUuids],
    );

    const onSubmit = useCallback(
        (values: any) => {
            if (!authorityUuid || !raProfile || !values?.approvalProfiles?.value?.uuid) return;
            dispatch(
                raProfilesActions.associateRAProfileWithApprovalProfile({
                    approvalProfileUuid: values?.approvalProfiles?.value?.uuid,
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
            <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit, pristine, submitting, valid }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="approvalProfiles" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="approvalProfileSelect">Select Approval profile</Label>

                                    <Select
                                        {...input}
                                        inputId="approvalProfileSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForApprovalProfiles}
                                        placeholder="Select Approval profile to be associated"
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        Required Field
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        <div style={{ textAlign: 'right' }}>
                            <ButtonGroup>
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={pristine || submitting || !valid || isAssociatingApprovalProfile}
                                    onClick={handleSubmit}
                                >
                                    Associate
                                </Button>

                                <Button type="button" color="secondary" disabled={submitting} onClick={onClose}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>
        </>
    );
};

export default AssociateApprovalProfileDialogBody;
