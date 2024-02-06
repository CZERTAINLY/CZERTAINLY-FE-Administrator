import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';

import { actions as profileApprovalActions, selectors as profileApprovalSelectors } from 'ducks/approval-profiles';
import { useCallback, useEffect, useMemo } from 'react';

import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Form as BootstrapForm, Button, ButtonGroup, Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';

import { ApprovalStepRequestModel, ProfileApprovalRequestModel } from 'types/approval-profiles';
import { mutators } from 'utils/attributes/attributeEditorMutators';
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

function ApprovalProfileForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isCreating = useSelector(profileApprovalSelectors.isCreating);
    const isUpdating = useSelector(profileApprovalSelectors.isUpdating);
    const isFetchingDetail = useSelector(profileApprovalSelectors.isFetchingDetail);
    const isBusy = useMemo(() => isCreating || isUpdating || isFetchingDetail, [isCreating, isUpdating, isFetchingDetail]);

    const profileApprovalDetail = useSelector(profileApprovalSelectors.profileApprovalDetail);

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    useEffect(() => {
        if (!id) return;
        dispatch(profileApprovalActions.getApprovalProfile({ uuid: id }));
    }, [id, dispatch]);

    const defaultValues: ProfileApprovalRequestModel = useMemo(
        () =>
            editMode && profileApprovalDetail
                ? profileApprovalDetail
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

    const onCancelClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <Widget title={editMode ? 'Edit Approval Profile' : 'Add Approval Profile'} busy={isBusy}>
            <Form
                initialValues={defaultValues}
                validate={(values) => {
                    const errors: {
                        approvalStepsInValid?: string;
                    } = {};

                    const inValidSteps = values.approvalSteps.some((step) => {
                        const { roleUuid, groupUuid, userUuid } = step;
                        return !roleUuid && !groupUuid && !userUuid;
                    });
                    if (inValidSteps) {
                        errors.approvalStepsInValid = 'Approval Steps are not valid';
                    }
                    return errors;
                }}
                onSubmit={onSubmit}
                mutators={{ ...mutators<ProfileApprovalRequestModel>() }}
            >
                {({ handleSubmit, submitting, valid, values, errors }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <Label htmlFor="name">Profile Name</Label>

                                            <Input
                                                {...input}
                                                valid={!meta.error && meta.touched}
                                                invalid={!!meta.error && meta.touched}
                                                type="text"
                                                id="name"
                                                placeholder="Approval Profile Name"
                                                disabled={editMode}
                                            />

                                            <FormFeedback>{meta.error}</FormFeedback>
                                        </FormGroup>
                                    )}
                                </Field>
                            </Col>
                            <Col>
                                <Field
                                    name="expiry"
                                    validate={composeValidators(validateRequired(), validateNonZeroInteger(), validatePositiveInteger())}
                                >
                                    {({ input, meta }) => (
                                        <FormGroup htmlFor="expiry">
                                            <Label>Expiry</Label>
                                            <Input
                                                {...input}
                                                type="number"
                                                id="expiry"
                                                placeholder="Expiry in hours"
                                                valid={!meta.error && meta.touched}
                                                invalid={!!meta.error && meta.touched}
                                            />
                                            <FormFeedback>{meta.error}</FormFeedback>
                                        </FormGroup>
                                    )}
                                </Field>
                            </Col>
                        </Row>

                        <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label htmlFor="description">Profile Description</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        id="description"
                                        placeholder="Approval Profile Description"
                                    />
                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <>
                            <br />

                            <ApprovalStepField approvalSteps={values.approvalSteps} inProgress={submitting} onCancelClick={onCancelClick} />
                        </>

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={editMode ? 'Update' : 'Create'}
                                    inProgressTitle={editMode ? 'Updating...' : 'Creating...'}
                                    inProgress={submitting}
                                    disabled={submitting || !valid || errors?.approvalStepsInValid || areDefaultValuesSame(values)}
                                />
                                <Button color="default" onClick={onCancelClick} disabled={submitting}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
}

export default ApprovalProfileForm;
