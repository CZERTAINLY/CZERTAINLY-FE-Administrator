import Widget from 'components/Widget';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ProgressButton from 'components/ProgressButton';
import Select from 'react-select';
import { Resource } from 'types/openapi';
import { isObjectSame } from 'utils/common-utils';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';

interface SelectChangeValue {
    value: string;
    label: string;
}

export interface ruleFormValues {
    name: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    description?: string;
    conditionsUuids: SelectChangeValue[];
}

const RulesForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Rule';

    const conditions = useSelector(rulesSelectors.conditions);
    const isCreatingRule = useSelector(rulesSelectors.isCreatingRule);
    const [selectedResourceState, setSelectedResourceState] = useState<SelectChangeValue>();
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(() => isCreatingRule || isFetchingResourcesList, [isCreatingRule, isFetchingResourcesList]);

    const conditionsOptions = useMemo(() => {
        if (conditions === undefined) return [];
        return conditions.map((condition) => {
            return { value: condition.uuid, label: condition.name };
        });
    }, [conditions]);

    useEffect(() => {
        if (!selectedResourceState) return;
        dispatch(rulesActions.listConditions({ resource: selectedResourceState.value as Resource }));
    }, [dispatch, selectedResourceState]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    const defaultValues: ruleFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            selectedResource: undefined,
            description: undefined,
            conditionsUuids: [],
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const onCancel = useCallback(() => {
        navigate('../rules');
    }, [navigate]);

    const onSubmit = useCallback(
        (values: ruleFormValues) => {
            if (values.resource === Resource.None) return;
            dispatch(
                rulesActions.createRule({
                    rule: {
                        description: values.description,
                        name: values.name,
                        resource: values.resource,
                        conditionsUuids: values.conditionsUuids.map((condition) => condition.value),
                    },
                }),
            );
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: ruleFormValues) => {
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
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<ruleFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Rule Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
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
                                        id="description"
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
                                    <Label for="resourceSelect">Resource</Label>

                                    <Select
                                        {...input}
                                        inputId="resourceSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={resourceOptionsWithRuleEvaluator || []}
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

                                            form.change('conditionsUuids', []);
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

                        <Field name="conditionsUuids" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Conditions</Label>

                                    <Select
                                        isDisabled={values.resource === Resource.None || !values.resource}
                                        {...input}
                                        options={conditionsOptions}
                                        isMulti
                                        placeholder="Select Conditions"
                                        isClearable
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        {/* {values?.resource && <ConditionFormFilter formType="conditionItem" resource={values.resource} />} */}

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
                                        values.conditionsUuids.length === 0
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

export default RulesForm;
