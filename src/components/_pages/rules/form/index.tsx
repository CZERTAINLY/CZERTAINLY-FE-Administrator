import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// import { EntityType, actions as filterActions } from 'ducks/filters';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';

import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ConditionFormFilter from 'components/ConditionFormFilter';
import ProgressButton from 'components/ProgressButton';
import Select from 'react-select';
import { Resource } from 'types/openapi';
import { RuleConditiontModel } from 'types/rules';
import { isObjectSame } from 'utils/common-utils';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
// import ConditionFormFilter from '../ConditionFormFilter';

interface SelectChangeValue {
    value: string;
    label: string;
}

export interface ConditionGroupFormValues {
    name: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    description?: string;
    conditions: RuleConditiontModel[];
    conditionGroupsUuids: SelectChangeValue[];
}

const ConditionGroupForm = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Rule';

    const conditionGroups = useSelector(rulesSelectors.conditionRuleGroups);
    const isCreatingRule = useSelector(rulesSelectors.isCreatingRule);
    const isUpdatingRule = useSelector(rulesSelectors.isUpdatingRule);
    const [selectedResourceState, setSelectedResourceState] = useState<SelectChangeValue>();
    const ruleDetails = useSelector(rulesSelectors.ruleDetails);
    const { resourceOptions, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(
        () => isCreatingRule || isUpdatingRule || isFetchingResourcesList,
        [isCreatingRule, isUpdatingRule, isFetchingResourcesList],
    );

    const conditionGroupsOptions = useMemo(() => {
        if (conditionGroups === undefined) return [];
        return conditionGroups.map((conditionGroup) => {
            return { value: conditionGroup.uuid, label: conditionGroup.name };
        });
    }, [conditionGroups]);

    useEffect(() => {
        if (!selectedResourceState) return;
        dispatch(rulesActions.listConditionGroups({ resource: selectedResourceState.value as Resource }));
    }, [dispatch, selectedResourceState]);

    useEffect(() => {
        if (!id) return;
        dispatch(rulesActions.getRule({ ruleUuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    const defaultValues: ConditionGroupFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            selectedResource: undefined,
            description: undefined,
            conditions: [],
            conditionGroupsUuids: [],
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: ConditionGroupFormValues) => {
            if (values.resource === Resource.None) return;
            dispatch(
                rulesActions.createRule({
                    rule: {
                        conditionGroupsUuids: values.conditionGroupsUuids.map((uuid) => uuid.value),
                        conditions: values.conditions,
                        description: values.description,
                        name: values.name,
                        resource: values.resource,
                    },
                }),
            );
        },
        [dispatch],
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

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<ConditionGroupFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Rule Name</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Condition Group Name"
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="description">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Description</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Description"
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
                                        isClearable
                                        onChange={(event) => {
                                            input.onChange(event);
                                            if (event?.value) {
                                                form.change('resource', event.value);
                                                setSelectedResourceState(event);
                                            } else {
                                                form.change('resource', undefined);
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
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="conditionGroupsUuids">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Condition Groups</Label>

                                    <Select
                                        isDisabled={values.resource === Resource.None || !values.resource}
                                        {...input}
                                        options={conditionGroupsOptions}
                                        isMulti
                                        placeholder="Select Condition Group"
                                        isClearable
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        {values?.resource && <ConditionFormFilter formType="conditions" resource={values.resource} />}

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
                                        (values.conditions.length === 0 && values.conditionGroupsUuids.length === 0)
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
