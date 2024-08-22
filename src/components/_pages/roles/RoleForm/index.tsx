import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';

import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';
import { useCallback, useEffect, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateEmail, validateLength, validateRequired } from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { Resource } from '../../../../types/openapi';
import { mutators } from '../../../../utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from '../../../../utils/attributes/attributes';
import AttributeEditor from '../../../Attributes/AttributeEditor';
import TabLayout from '../../../Layout/TabLayout';

interface FormValues {
    name: string;
    description: string;
    email: string;
}

function RoleForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const roleSelector = useSelector(rolesSelectors.role);
    const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

    const isBusy = useMemo(
        () => isFetchingRoleDetail || isFetchingResourceCustomAttributes,
        [isFetchingRoleDetail, isFetchingResourceCustomAttributes],
    );

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Roles));
    }, [dispatch]);

    useEffect(() => {
        if (editMode && id) {
            dispatch(rolesActions.getDetail({ uuid: id }));
        }
    }, [dispatch, editMode, id]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (editMode) {
                dispatch(
                    rolesActions.update({
                        uuid: id!,
                        roleRequest: {
                            name: values.name,
                            description: values.description,
                            email: values.email ? values.email : undefined,
                            customAttributes: collectFormAttributes('customRole', resourceCustomAttributes, values),
                        },
                    }),
                );
            } else {
                dispatch(
                    rolesActions.create({
                        name: values.name,
                        description: values.description,
                        email: values.email ? values.email : undefined,
                        customAttributes: collectFormAttributes('customRole', resourceCustomAttributes, values),
                    }),
                );
            }
        },

        [dispatch, editMode, id, resourceCustomAttributes],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? roleSelector?.name || '' : '',
            description: editMode ? roleSelector?.description || '' : '',
            email: editMode ? roleSelector?.email || '' : '',
        }),
        [editMode, roleSelector],
    );

    const title = useMemo(() => (editMode ? 'Edit Role' : 'Add Role'), [editMode]);

    const renderCustomAttributesEditor = useMemo(() => {
        if (isBusy) return <></>;
        return (
            <AttributeEditor id="customRole" attributeDescriptors={resourceCustomAttributes} attributes={roleSelector?.customAttributes} />
        );
    }, [roleSelector, resourceCustomAttributes, isBusy]);

    return (
        <>
            <Widget title={title} busy={isBusy}>
                <Form onSubmit={onSubmit} initialValues={defaultValues} mutators={{ ...mutators<FormValues>() }}>
                    {({ handleSubmit, pristine, submitting, values, valid }) => (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="name">Role Name</Label>

                                        <Input
                                            id="name"
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            disabled={editMode || roleSelector?.systemRole}
                                            type="text"
                                            placeholder="Enter name of the role"
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="description">Description</Label>

                                        <Input
                                            id="description"
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Enter description of the role"
                                            disabled={roleSelector?.systemRole}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="email" validate={composeValidators(validateEmail())}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="email">E-mail</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            id="email"
                                            placeholder="Enter e-mail of the role"
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <br />

                            <TabLayout
                                tabs={[
                                    {
                                        title: 'Custom Attributes',
                                        content: renderCustomAttributesEditor,
                                    },
                                ]}
                            />

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={submitTitle}
                                        inProgressTitle={inProgressTitle}
                                        inProgress={submitting}
                                        disabled={pristine || submitting || roleSelector?.systemRole}
                                    />

                                    <Button color="default" onClick={onCancel} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </BootstrapForm>
                    )}
                </Form>
            </Widget>
        </>
    );
}

export default RoleForm;
