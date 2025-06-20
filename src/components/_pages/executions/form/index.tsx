import Widget from 'components/Widget';
import { selectors as rulesSelectors, actions as rulesActions } from 'ducks/rules';
import { useCallback, useMemo } from 'react';
import { Field, Form, FormProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ConditionFormFilter from 'components/ConditionFormFilter';
import ProgressButton from 'components/ProgressButton';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import Select from 'react-select';
import { ExecutionType, PlatformEnum, Resource } from 'types/openapi';
import { ExecutionItemRequestModel } from 'types/rules';
import { isObjectSame } from 'utils/common-utils';
import { useRuleEvaluatorResourceOptions } from 'utils/rules';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import { SendNotificationExecutionItems } from 'components/_pages/executions/SendNotificationExecutionItems';
interface SelectChangeValue {
    value: string;
    label: string;
}

export interface ExecutionFormValues {
    name: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    description?: string;
    items: ExecutionItemRequestModel[];
    notificationProfileItems?: SelectChangeValue[];
    selectedType?: SelectChangeValue;
    type?: ExecutionType;
}

const ExecutionForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Execution';
    const isCreatingExecution = useSelector(rulesSelectors.isCreatingExecution);
    const { resourceOptionsWithRuleEvaluator, isFetchingResourcesList } = useRuleEvaluatorResourceOptions();
    const isBusy = useMemo(() => isCreatingExecution || isFetchingResourcesList, [isCreatingExecution, isFetchingResourcesList]);
    const executionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ExecutionType));
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const executionTypeOptions = useMemo(() => {
        return [
            { value: ExecutionType.SetField, label: getEnumLabel(executionTypeEnum, ExecutionType.SetField) },
            { value: ExecutionType.SendNotification, label: getEnumLabel(executionTypeEnum, ExecutionType.SendNotification) },
        ];
    }, [executionTypeEnum]);

    const defaultValues: ExecutionFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            selectedResource: undefined,
            description: undefined,
            actions: [],
            items: [],
            selectedType: undefined,
            type: undefined,
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const onCancel = useCallback(() => {
        navigate('../actions/1');
    }, [navigate]);

    const onSubmit = useCallback(
        (values: ExecutionFormValues) => {
            switch (values.type) {
                case ExecutionType.SetField:
                    if (values.resource === Resource.None || !values.type) return;
                    dispatch(
                        rulesActions.createExecution({
                            executionRequestModel: {
                                items: values.items,
                                type: values.type,
                                name: values.name,
                                description: values.description,
                                resource: values.resource,
                            },
                        }),
                    );
                    break;
                case ExecutionType.SendNotification:
                    dispatch(
                        rulesActions.createExecution({
                            executionRequestModel: {
                                items:
                                    values.notificationProfileItems?.map((el) => ({
                                        notificationProfileUuid: el.value,
                                    })) ?? [],
                                type: values.type,
                                name: values.name,
                                description: values.description,
                                resource: values.resource,
                            },
                        }),
                    );
                    break;
            }
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: ExecutionFormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                defaultValues as unknown as Record<string, unknown>,
            );
            return areValuesSame;
        },
        [defaultValues],
    );

    const renderExecutionItems = useCallback(({ values, form }: Partial<FormProps<ExecutionFormValues>>) => {
        switch (values.selectedType?.value) {
            case ExecutionType.SetField:
                return values?.resource && <ConditionFormFilter formType="executionItem" resource={values.resource} />;
            case ExecutionType.SendNotification:
                return (
                    <SendNotificationExecutionItems
                        mode="form"
                        notificationProfileItems={values.notificationProfileItems}
                        onNotificationProfileItemsChange={(newItems) => form?.change('notificationProfileItems', newItems)}
                    />
                );
        }
    }, []);

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<ExecutionFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Execution Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Execution Name"
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
                                        id="description"
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

                        <Field name="selectedType" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="typeSelect">Execution Type</Label>

                                    <Select
                                        {...input}
                                        inputId="typeSelect"
                                        options={executionTypeOptions}
                                        placeholder="Select Execution Type"
                                        onChange={(event) => {
                                            input.onChange(event);
                                            if (event?.value) {
                                                form.change('type', event.value);
                                            }
                                            form.change('resource', Resource.Any);
                                            form.change('selectedResource', {
                                                value: Resource.Any,
                                                label: getEnumLabel(resourceEnum, Resource.Any),
                                            });
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
                                        }}
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                        isClearable
                                        isDisabled={values.type === ExecutionType.SendNotification}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        {renderExecutionItems({ values, form })}

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={submitTitle}
                                    inProgressTitle={inProgressTitle}
                                    inProgress={submitting}
                                    disabled={
                                        areDefaultValuesSame(values) ||
                                        (values.resource === Resource.None && values.type !== ExecutionType.SendNotification) ||
                                        submitting ||
                                        !valid ||
                                        isBusy ||
                                        (!values.items.length && !values.notificationProfileItems?.length)
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

export default ExecutionForm;
