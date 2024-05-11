import Widget from 'components/Widget';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { EntityType, actions as filterActions } from 'ducks/filters';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';

import { actions as resourceActions, selectors as resourceSelectors } from 'ducks/resource';

import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ConditionFormFilter from 'components/ConditionFormFilter';
import ProgressButton from 'components/ProgressButton';
import Select from 'react-select';
import { PlatformEnum, Resource, ResourceEventDtoEventEnum, RuleTriggerType } from 'types/openapi';
import { ActionRuleRequestModel } from 'types/rules';
import { isObjectSame } from 'utils/common-utils';
import { useResourceOptionsFromListWithFilters } from 'utils/rules';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';

interface SelectChangeValue {
    value: string;
    label: string;
}

interface SelectedEventValue {
    label: string;
    value: { event: string; producedResource?: string };
}

export interface ConditionGroupFormValues {
    name: string;
    description: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    triggerResource: Resource;
    selectedTriggerResource?: SelectChangeValue;
    triggerType?: RuleTriggerType;
    selectedTriggerType?: SelectChangeValue;
    actions: ActionRuleRequestModel[];
    eventName?: ResourceEventDtoEventEnum;
    selectedEventName?: SelectedEventValue;
    actionGroupsUuids: SelectChangeValue[];
    rulesUuids: SelectChangeValue[];
}

const ConditionGroupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Trigger';

    const actionGroups = useSelector(rulesSelectors.actionGroups);
    const resourceEvents = useSelector(resourceSelectors.resourceEvents);
    const rules = useSelector(rulesSelectors.rules);
    const isCreatingTrigger = useSelector(rulesSelectors.isCreatingTrigger);
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const isBusy = useMemo(() => isCreatingTrigger, [isCreatingTrigger]);
    const resourceslist = useSelector(resourceSelectors.resourceslist);

    const resourceOptions = useResourceOptionsFromListWithFilters(resourceslist);
    const resourceEventsOptions = useResourceOptionsFromListWithFilters(resourceslist, 'hasEvents');
    const resourceRuleEvaluatorOptions = useResourceOptionsFromListWithFilters(resourceslist, 'hasRuleEvaluator');

    const resourceEventNameOptions = useMemo(() => {
        if (resourceEvents === undefined) return [];
        return resourceEvents.map((event) => {
            return { value: event, label: getEnumLabel(resourceEventEnum, event.event) };
        });
    }, [resourceEvents, resourceEventEnum]);

    useEffect(() => {
        dispatch(resourceActions.listResources());
    }, [dispatch]);

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
            dispatch(resourceActions.listResourceEvents({ resource: resource }));
        },
        [dispatch],
    );

    const fetchActionGroups = useCallback(
        (resource: Resource) => {
            dispatch(rulesActions.listActionGroups({ resource: resource }));
        },
        [dispatch],
    );

    const fetchRules = useCallback(
        (resource: Resource) => {
            dispatch(rulesActions.listRules({ resource: resource }));
        },
        [dispatch],
    );

    const defaultValues: ConditionGroupFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            description: '',
            actionGroupsUuids: [],
            actions: [],
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
                                    <Label for="name">Trigger Name</Label>

                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter Trigger name"
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
                                            if (!event?.value) return;

                                            input.onChange(event);

                                            form.change('triggerType', event?.value);

                                            // set all other values to default

                                            form.change('triggerResource', Resource.None);
                                            form.change('selectedTriggerResource', undefined);
                                            form.change('eventName', undefined);
                                            form.change('selectedEventName', undefined);
                                            form.change('resource', Resource.None);
                                            form.change('selectedResource', undefined);
                                            form.change('actions', []);
                                            form.change('actionGroupsUuids', []);
                                            form.change('rulesUuids', []);
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
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
                                        options={
                                            values.triggerType === RuleTriggerType.Event
                                                ? resourceEventsOptions
                                                : resourceRuleEvaluatorOptions
                                        }
                                        placeholder="Select Trigger Resource"
                                        isClearable
                                        onChange={(event) => {
                                            if (!event?.value) return;

                                            input.onChange(event);
                                            form.change('triggerResource', event.value as Resource);

                                            if (values.triggerType === RuleTriggerType.Event) {
                                                fetchResourceEvents(event.value as Resource);
                                                form.change('selectedResource', undefined);
                                                form.change('resource', Resource.None);
                                            } else {
                                                form.change('selectedResource', event);
                                                form.change('resource', event.value as Resource);
                                                fetchActionGroups(event.value as Resource);
                                                fetchRules(event.value as Resource);
                                            }
                                            form.change('eventName', undefined);
                                            form.change('selectedEventName', undefined);
                                            form.change('actions', []);
                                            form.change('actionGroupsUuids', []);
                                            form.change('rulesUuids', []);
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

                        {values?.triggerType === RuleTriggerType.Event && (
                            <Field name="selectedEventName" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="selectedEventName">Event Name</Label>

                                        <Select
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={resourceEventNameOptions || []}
                                            placeholder="Select Event Name"
                                            isClearable
                                            onChange={(event) => {
                                                if (!event?.value) return;

                                                input.onChange(event);
                                                form.change('eventName', event?.value?.event as ResourceEventDtoEventEnum);

                                                if (event?.value?.producedResource) {
                                                    const selectResource = resourceOptions.find(
                                                        (resource) => resource.value === event?.value?.producedResource,
                                                    );
                                                    form.change('selectedResource', selectResource);
                                                    form.change('resource', event?.value?.producedResource);
                                                    fetchActionGroups(event?.value?.producedResource);
                                                    fetchRules(event?.value?.producedResource);
                                                }
                                            }}
                                        />

                                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                            {meta.error}
                                        </div>
                                    </FormGroup>
                                )}
                            </Field>
                        )}

                        <Field name="selectedResource">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="selectedResource">Resource</Label>

                                    <Select
                                        {...input}
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={resourceOptions || []}
                                        placeholder="Select Resource"
                                        isDisabled={true}
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
                        {values?.resource && <ConditionFormFilter formType="actionGroup" resource={values.resource} includeIgnoreAction />}

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
