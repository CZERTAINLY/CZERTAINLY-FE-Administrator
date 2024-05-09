import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { EntityType, actions as filterActions } from 'ducks/filters';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';

import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ConditionFormFilter from 'components/ConditionFormFilter';
import ProgressButton from 'components/ProgressButton';
import Select from 'react-select';
import { PlatformEnum, Resource, RuleTriggerType } from 'types/openapi';
import { ActionRuleRequestModel } from 'types/rules';
import { isObjectSame } from 'utils/common-utils';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';

interface SelectChangeValue {
    value: string;
    label: string;
}

export interface ConditionGroupFormValues {
    name: string;
    description: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    selecetedResource?: SelectChangeValue;
    triggerResource: Resource;
    selectedTriggerResource?: SelectChangeValue;
    triggerType?: RuleTriggerType;
    selectedTriggerType?: SelectChangeValue;
    actions: ActionRuleRequestModel[];
    eventName?: string;
    selectedEventName?: SelectChangeValue;
    actionGroupsUuids: SelectChangeValue[];
    rulesUuids: SelectChangeValue[];
}

const ConditionGroupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Trigger';

    const actionGroups = useSelector(rulesSelectors.actionGroups);
    const resourceEvents = useSelector(rulesSelectors.resourceEvents);
    const rules = useSelector(rulesSelectors.rules);
    const isCreatingTrigger = useSelector(rulesSelectors.isCreatingTrigger);
    const [selectedResourceState, setSelectedResourceState] = useState<SelectChangeValue>();
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const isBusy = useMemo(() => isCreatingTrigger, [isCreatingTrigger]);

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

    const resourceEventNameOptions = useMemo(() => {
        if (resourceEvents === undefined) return [];
        return resourceEvents.map((event) => {
            return { value: event, label: getEnumLabel(resourceEventEnum, event) };
        });
    }, [resourceEvents, resourceEventEnum]);

    const actionGroupsOptions = useMemo(() => {
        if (actionGroups === undefined) return [];
        return actionGroups.map((conditionGroup) => {
            return { value: conditionGroup.uuid, label: conditionGroup.name };
        });
    }, [actionGroups]);

    const rulesOptions = useMemo(() => {
        if (rules === undefined) return [];
        return rules.map((rule) => {
            return { value: rule.uuid, label: rule.name };
        });
    }, [rules]);

    const ruleTriggerTypeOptions = useMemo(() => {
        return [
            { value: RuleTriggerType.Event, label: 'Event' },
            { value: RuleTriggerType.Manual, label: 'Manual' },
        ];
    }, []);

    const fetchResourceEvents = useCallback(
        (resource: Resource) => {
            dispatch(rulesActions.listResourceEvents({ resource: resource }));
        },
        [dispatch],
    );

    useEffect(() => {
        if (!selectedResourceState) return;
        dispatch(rulesActions.listActionGroups({ resource: selectedResourceState.value as Resource }));
        dispatch(rulesActions.listRules({ resource: selectedResourceState.value as Resource }));
    }, [dispatch, selectedResourceState]);

    const defaultValues: ConditionGroupFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            selectedResource: undefined,
            description: '',
            actionGroupsUuids: [],
            actions: [],
            eventName: '',
            rulesUuids: [],
            triggerType: undefined,
            triggerResource: Resource.None,
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: ConditionGroupFormValues) => {
            if (values.resource === Resource.None || values.triggerResource === Resource.None || !values.triggerType) return;

            dispatch(
                rulesActions.createTrigger({
                    trigger: {
                        name: values.name,
                        description: values.description,
                        resource: values.resource,
                        triggerType: values.triggerType,
                        actionGroupsUuids: values.actionGroupsUuids.map((actionGroup) => actionGroup.value),
                        actions: values.actions,
                        eventName: values.eventName,
                        rulesUuids: values.rulesUuids.map((rule) => rule.value),
                        triggerResource: values.triggerResource,
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
                                    <Label for="name">Trgger Name</Label>

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
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="selectedTriggerResource" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="triggerResource">Trigger Resource</Label>

                                    <Select
                                        {...input}
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={resourceOptions || []}
                                        placeholder="Select Resource"
                                        isClearable
                                        onChange={(event) => {
                                            if (event?.value) {
                                                form.change('triggerResource', event.value);
                                                form.change('selectedTriggerResource', event);
                                                form.change('triggerType', undefined);
                                                form.change('selectedTriggerType', undefined);
                                                form.change('eventName', undefined);
                                                form.change('selectedEventName', undefined);
                                            } else {
                                                form.change('triggerResource', undefined);
                                            }
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

                        <Field name="selectedTriggerType" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="triggerType">Rule Trigger Type</Label>

                                    <Select
                                        {...input}
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={ruleTriggerTypeOptions}
                                        placeholder="Select Rule Trigger Type"
                                        isClearable
                                        onChange={(event) => {
                                            input.onChange(event);
                                            form.change('triggerType', event?.value);

                                            if (event.value === RuleTriggerType.Event) {
                                                fetchResourceEvents(values.triggerResource);
                                            }

                                            form.change('eventName', undefined);
                                            form.change('selectedEventName', undefined);
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        {values?.triggerType === RuleTriggerType.Event && (
                            <Field name="selectedEventName" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="eventName">Event Name</Label>

                                        <Select
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={resourceEventNameOptions || []}
                                            placeholder="Select Event Name"
                                            isClearable
                                            onChange={(event) => {
                                                input.onChange(event);
                                                form.change('eventName', event?.value);
                                                form.change('selectedEventName', event);
                                            }}
                                        />

                                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                            {meta.error}
                                        </div>
                                    </FormGroup>
                                )}
                            </Field>
                        )}

                        <hr />
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

                                            form.change('actions', []);
                                            // dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.ACTIONS }));
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

                        <Field name="rulesUuids">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Rules</Label>

                                    <Select
                                        isDisabled={values.resource === Resource.None || !values.resource}
                                        {...input}
                                        options={rulesOptions}
                                        isMulti
                                        placeholder="Select Rule"
                                        isClearable
                                    />
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="actionGroupsUuids">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Action Groups</Label>

                                    <Select
                                        isDisabled={values.resource === Resource.None || !values.resource}
                                        {...input}
                                        options={actionGroupsOptions}
                                        isMulti
                                        placeholder="Select Condition Group"
                                        isClearable
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        {values?.resource && <ConditionFormFilter formType="actionGroup" resource={values.resource} />}

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
                                        (!values.actionGroupsUuids.length && !values.actions.length)
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
