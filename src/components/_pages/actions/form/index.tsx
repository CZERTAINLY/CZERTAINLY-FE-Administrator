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

export interface actionFormValues {
    name: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    description?: string;
    executionsUuids: SelectChangeValue[];
}

const ActionsForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Action';

    const executions = useSelector(rulesSelectors.executions);
    const isCreatingAction = useSelector(rulesSelectors.isCreatingAction);
    const [selectedResourceState, setSelectedResourceState] = useState<SelectChangeValue>();
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(() => isCreatingAction || isFetchingResourcesList, [isCreatingAction, isFetchingResourcesList]);

    const executionsOptions = useMemo(() => {
        if (executions === undefined) return [];
        return executions.map((execution) => {
            return { value: execution.uuid, label: execution.name };
        });
    }, [executions]);

    useEffect(() => {
        if (!selectedResourceState) return;
        dispatch(rulesActions.listExecutions({ resource: selectedResourceState.value as Resource }));
    }, [dispatch, selectedResourceState]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    const defaultValues: actionFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            selectedResource: undefined,
            description: undefined,
            executionsUuids: [],
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const onCancel = useCallback(() => {
        navigate('../actions');
    }, [navigate]);

    const onSubmit = useCallback(
        (values: actionFormValues) => {
            if (values.resource === Resource.None) return;
            dispatch(
                rulesActions.createAction({
                    action: {
                        description: values.description,
                        name: values.name,
                        resource: values.resource,
                        executionsUuids: values.executionsUuids.map((execution) => execution.value),
                    },
                }),
            );
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: actionFormValues) => {
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
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<actionFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Action Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Action Name"
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
                                        className="nodrag"
                                        inputId="resourceSelect"
                                        {...input}
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

                                            form.change('executionsUuids', []);
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

                        <Field name="executionsUuids" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Executions</Label>

                                    <Select
                                        className="nodrag"
                                        isDisabled={values.resource === Resource.None || !values.resource}
                                        {...input}
                                        options={executionsOptions}
                                        isMulti
                                        placeholder="Select Executions"
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
                                        values.executionsUuids.length === 0
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

export default ActionsForm;
