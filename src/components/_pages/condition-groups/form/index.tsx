import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// import { EntityType, actions as filterActions } from 'ducks/filters';
import { selectors as enumSelectors } from 'ducks/enums';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';

import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ProgressButton from 'components/ProgressButton';
import Select from 'react-select';
import { PlatformEnum, Resource } from 'types/openapi';
import { RuleConditiontModel } from 'types/rules';
import { isObjectSame } from 'utils/common-utils';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import ConditionFormFilter from '../../../ConditionFormFilter';

interface SelectChangeValue {
    value: string;
    label: string;
}

export interface ConditionGroupFormValues {
    name: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    description: string;
    conditions: RuleConditiontModel[];
}

const ConditionGroupForm = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = id ? 'Edit Condition Group' : 'Create Condition Group';
    const isCreatingConditionGroup = useSelector(rulesSelectors.isCreatingConditionGroup);
    const isUpdatingConditionGroup = useSelector(rulesSelectors.isUpdatingConditionGroup);
    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    const editMode = useMemo(() => !!id, [id]);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const isBusy = useMemo(
        () => isCreatingConditionGroup || isUpdatingConditionGroup,
        [isCreatingConditionGroup, isUpdatingConditionGroup],
    );
    const resourceOptions = useMemo(() => {
        if (resourceTypeEnum === undefined) return [];
        const resourceTypeArray = Object.entries(resourceTypeEnum)
            .map(([key, value]) => {
                return { value: value.code, label: value.label };
            })
            .filter((resource) => resource.value !== Resource.None)
            .sort((a, b) => a.label.localeCompare(b.label));

        return resourceTypeArray;
    }, [resourceTypeEnum]);

    useEffect(() => {
        if (!id) return;
        dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    const defaultValues: ConditionGroupFormValues = useMemo(() => {
        let selectedResource;
        if (editMode) {
            selectedResource = resourceOptions.find((resource) => resource.value === conditionGroupsDetails?.resource);
        }
        return {
            name: editMode ? conditionGroupsDetails?.name || '' : '',
            resource: editMode ? conditionGroupsDetails?.resource || Resource.None : Resource.None,
            selectedResource: editMode ? selectedResource : undefined,
            description: editMode ? conditionGroupsDetails?.description || '' : '',
            conditions: editMode ? conditionGroupsDetails?.conditions || [] : [],
        };
    }, [editMode, conditionGroupsDetails, resourceOptions]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);
    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: ConditionGroupFormValues) => {
            // if (values.resource === ('' as string)) return;
            if (values.resource === Resource.None) return;

            if (editMode && id) {
                dispatch(
                    rulesActions.updateConditionGroup({
                        conditionGroupUuid: id,
                        conditionGroup: {
                            conditions: values.conditions,
                            description: values.description,
                        },
                    }),
                );
            } else {
                dispatch(
                    rulesActions.createConditionGroup({
                        ruleConditionGroupRequest: {
                            conditions: values.conditions,
                            name: values.name,
                            resource: values.resource,
                            description: values.description,
                        },
                    }),
                );
            }
        },
        [dispatch, editMode, id],
    );

    const areDefaultValuesSame = useCallback(
        (values: ConditionGroupFormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                defaultValues as unknown as Record<string, unknown>,
            );
            return areValuesSame;
        },
        [defaultValues],
    );

    if (id) return null;

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<ConditionGroupFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Condition Group Name</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Condition Group Name"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="description" validate={composeValidators(validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Description</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Description"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="selectedResource" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="resource">Resource</Label>

                                    <Select
                                        {...input}
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={resourceOptions || []}
                                        placeholder="Select Resource"
                                        onChange={(event) => {
                                            input.onChange(event);
                                            if (event?.value) {
                                                form.change('resource', event.value);
                                            }
                                            form.change('conditions', []);
                                            dispatch(
                                                filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }),
                                            );
                                        }}
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                        isClearable
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        {values?.resource && <ConditionFormFilter formType="conditionGroup" resource={values.resource} />}

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={submitTitle}
                                    inProgressTitle={inProgressTitle}
                                    inProgress={submitting}
                                    disabled={
                                        areDefaultValuesSame(values) ||
                                        values.resource === Resource.None ||
                                        submitting ||
                                        !valid ||
                                        isBusy ||
                                        !values.conditions.length
                                    }
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
    );
};

export default ConditionGroupForm;
