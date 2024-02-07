import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';

import { actions, selectors } from 'ducks/compliance-profiles';
import { useCallback, useEffect, useMemo } from 'react';

import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateLength, validateRequired } from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { Resource } from '../../../../types/openapi';
import { collectFormAttributes } from '../../../../utils/attributes/attributes';
import AttributeEditor from '../../../Attributes/AttributeEditor';
import TabLayout from '../../../Layout/TabLayout';

interface FormValues {
    name: string;
    description: string;
}

function ComplianceProfileForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isCreating = useSelector(selectors.isCreating);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.ComplianceProfiles));
    }, [dispatch]);

    const isBusy = useMemo(() => isCreating || isFetchingResourceCustomAttributes, [isCreating, isFetchingResourceCustomAttributes]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            dispatch(
                actions.createComplianceProfile({
                    name: values.name,
                    description: values.description,
                    customAttributes: collectFormAttributes('customCompliance', resourceCustomAttributes, values),
                }),
            );
        },
        [dispatch, resourceCustomAttributes],
    );

    const onCancelClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const defaultValues: FormValues = useMemo(
        () => ({
            name: '',
            description: '',
        }),
        [],
    );

    return (
        <Widget title="Add Compliance Profile" busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Profile Name</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        id="name"
                                        placeholder="Compliance Profile Name"
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Profile Description</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        id="description"
                                        placeholder="Compliance Profile Description"
                                    />
                                </FormGroup>
                            )}
                        </Field>

                        <>
                            <br />

                            <TabLayout
                                tabs={[
                                    {
                                        title: 'Custom Attributes',
                                        content: <AttributeEditor id="customCompliance" attributeDescriptors={resourceCustomAttributes} />,
                                    },
                                ]}
                            />
                        </>

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={'Create'}
                                    inProgressTitle={'Creating...'}
                                    inProgress={submitting}
                                    disabled={pristine || submitting || !valid}
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

export default ComplianceProfileForm;
