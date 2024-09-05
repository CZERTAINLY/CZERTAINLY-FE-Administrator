import Widget from 'components/Widget';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ProgressButton from 'components/ProgressButton';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import Select from 'react-select';
import { ConditionType, PlatformEnum, Resource } from 'types/openapi';
import { ConditionItemModel } from 'types/rules';
import { isObjectSame } from 'utils/common-utils';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import ConditionFormFilter from '../../../ConditionFormFilter';

interface SelectChangeValue {
    value: string;
    label: string;
}

export interface ConditionFormValues {
    name: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    description?: string;
    type?: ConditionType;
    selectedType?: SelectChangeValue;
    items: ConditionItemModel[];
}

const ConditionForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Condition';
    const isCreatingCondition = useSelector(rulesSelectors.isCreatingCondition);
    const conditionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ConditionType));
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();

    const isBusy = useMemo(() => isCreatingCondition || isFetchingResourcesList, [isCreatingCondition, isFetchingResourcesList]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    const defaultValues: ConditionFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            selectedResource: undefined,
            description: undefined,
            items: [],
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const typeOptions = useMemo(() => {
        return [{ value: ConditionType.CheckField, label: getEnumLabel(conditionTypeEnum, ConditionType.CheckField) }];
    }, [conditionTypeEnum]);

    const onCancel = useCallback(() => {
        navigate('../rules/1');
    }, [navigate]);

    const onSubmit = useCallback(
        (values: ConditionFormValues) => {
            if (values.resource === Resource.None || !values.type) return;
            dispatch(
                rulesActions.createCondition({
                    conditionRequestModel: {
                        items: values.items,
                        type: values.type,
                        name: values.name,
                        resource: values.resource,
                        description: values.description,
                    },
                }),
            );
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: ConditionFormValues) => {
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
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<ConditionFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Condition Name</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        id="name"
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

                        <Field name="selectedType" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="typeSelect">Condition Type</Label>

                                    <Select
                                        {...input}
                                        inputId="typeSelect"
                                        options={typeOptions}
                                        placeholder="Select Condition Type"
                                        onChange={(event) => {
                                            input.onChange(event);
                                            if (event?.value) {
                                                form.change('type', event.value);
                                            }
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="selectedResource" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="resourceSelect">Resource</Label>

                                    <Select
                                        {...input}
                                        id="resource"
                                        inputId="resourceSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={resourceOptionsWithRuleEvaluator || []}
                                        placeholder="Select Resource"
                                        onChange={(event) => {
                                            input.onChange(event);
                                            if (event?.value) {
                                                form.change('resource', event.value);
                                            }
                                            form.change('items', []);
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

                        {values?.resource && <ConditionFormFilter formType="conditionItem" resource={values.resource} />}

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
                                        !values.items.length
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

export default ConditionForm;
