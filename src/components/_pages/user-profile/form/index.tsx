import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Field, Form } from 'react-final-form';
import { Button, ButtonGroup, Container, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions, selectors } from 'ducks/auth';

import { composeValidators, validateAlphaNumericWithSpecialChars, validateEmail, validateLength } from 'utils/validators';

interface FormValues {
    description: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function UserProfileForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = useSelector(selectors.profile);

    const isFetchingProfile = useSelector(selectors.isFetchingProfile);
    const isUpdatingProfile = useSelector(selectors.isUpdatingProfile);

    useEffect(() => {
        dispatch(actions.getProfile());
    }, [dispatch]);

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
                }),
            );
        },
        [dispatch],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const defaultValues = useMemo(
        () => ({
            description: profile?.description || '',
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            email: profile?.email || '',
        }),
        [profile?.description, profile?.email, profile?.firstName, profile?.lastName],
    );

    return (
        <Container className="themed-container">
            <Widget title="Edit User Profile" busy={isFetchingProfile || isUpdatingProfile}>
                <Form onSubmit={onSubmit} initialValues={defaultValues}>
                    {({ handleSubmit, pristine, submitting, values, valid }) => (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="description">Description</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Description"
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="firstName" validate={composeValidators(validateAlphaNumericWithSpecialChars())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="firstName">First Name</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="First Name"
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="lastName" validate={composeValidators(validateAlphaNumericWithSpecialChars())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="lastName">Last Name</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Last name"
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="email" validate={composeValidators(validateEmail())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="email">Email</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Email address"
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title="Save"
                                        inProgressTitle={'Saving...'}
                                        inProgress={submitting || isFetchingProfile || isUpdatingProfile}
                                        disabled={
                                            pristine ||
                                            submitting ||
                                            isFetchingProfile ||
                                            isUpdatingProfile ||
                                            !valid ||
                                            profile?.systemUser
                                        }
                                    />

                                    <Button
                                        color="default"
                                        onClick={onCancel}
                                        disabled={submitting || isFetchingProfile || isUpdatingProfile}
                                    >
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </BootstrapForm>
                    )}
                </Form>
            </Widget>
        </Container>
    );
}
