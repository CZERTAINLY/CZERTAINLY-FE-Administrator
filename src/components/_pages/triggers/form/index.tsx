import Widget from 'components/Widget';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { actions as resourceActions, selectors as resourceSelectors } from 'ducks/resource';

import { Field, Form } from 'react-final-form';

import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';

import ProgressButton from 'components/ProgressButton';
import SwitchWidget from 'components/SwitchWidget';
import Select from 'react-select';
import { PlatformEnum, Resource, TriggerRequestDtoEventEnum, TriggerType } from 'types/openapi';
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

export interface TriggerFormValues {
    name: string;
    description?: string;
    selectedResource?: SelectChangeValue;
    resource: Resource;
    eventResource: Resource;
    selectedTriggerResource?: SelectChangeValue;
    triggerType?: TriggerType;
    selectedTriggerType?: SelectChangeValue;
    event?: TriggerRequestDtoEventEnum;
    selectedEvent?: SelectedEventValue;
    actionsUuids: SelectChangeValue[];
    rulesUuids: SelectChangeValue[];
    ignoreTrigger: boolean;
    type?: TriggerType;
}

const TriggerForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const title = 'Create Trigger';

    const ruleTriggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));
    const actionsList = useSelector(rulesSelectors.actionsList);
    const resourceEvents = useSelector(resourceSelectors.resourceEvents);
    const rules = useSelector(rulesSelectors.rules);
    const isCreatingTrigger = useSelector(rulesSelectors.isCreatingTrigger);
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const isBusy = useMemo(() => isCreatingTrigger, [isCreatingTrigger]);
    const resourceslist = useSelector(resourceSelectors.resourceslist);

    const resourceOptions = useResourceOptionsFromListWithFilters(resourceslist);
    const resourceEventsOptions = useResourceOptionsFromListWithFilters(resourceslist, 'hasEvents');

    const resourceEventNameOptions = useMemo(() => {
        if (resourceEvents === undefined) return [];
        return resourceEvents.map((event) => {
            return { value: event, label: getEnumLabel(resourceEventEnum, event.event) };
        });
    }, [resourceEvents, resourceEventEnum]);

    useEffect(() => {
        dispatch(resourceActions.listResources());
    }, [dispatch]);

    const actionsOptions = useMemo(() => {
        if (actionsList === undefined) return [];
        return actionsList.map((action) => {
            return { value: action.uuid, label: action.name };
        });
    }, [actionsList]);

    const rulesOptions = useMemo(() => {
        if (rules === undefined) return [];
        return rules.map((rule) => {
            return { value: rule.uuid, label: rule.name };
        });
    }, [rules]);

    const ruleTriggerTypeOptions = useMemo(() => {
        return [{ value: TriggerType.Event, label: getEnumLabel(ruleTriggerTypeEnum, TriggerType.Event) }];
    }, [ruleTriggerTypeEnum]);

    const fetchResourceEvents = useCallback(
        (resource: Resource) => {
            dispatch(resourceActions.listResourceEvents({ resource: resource }));
        },
        [dispatch],
    );

    const fetchActions = useCallback(
        (resource: Resource) => {
            dispatch(rulesActions.listActions({ resource: resource }));
        },
        [dispatch],
    );

    const fetchRules = useCallback(
        (resource: Resource) => {
            dispatch(rulesActions.listRules({ resource: resource }));
        },
        [dispatch],
    );

    const defaultValues: TriggerFormValues = useMemo(() => {
        return {
            name: '',
            resource: Resource.None,
            description: undefined,
            actionsUuids: [],
            rulesUuids: [],
            triggerType: undefined,
            eventResource: Resource.None,
            event: undefined,
            ignoreTrigger: false,
        };
    }, []);

    const submitTitle = 'Create';
    const inProgressTitle = 'Creating...';

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: TriggerFormValues) => {
            if (values.resource === Resource.None || values.eventResource === Resource.None || !values.triggerType) return;
            dispatch(
                rulesActions.createTrigger({
                    trigger: {
                        name: values.name,
                        description: values.description,
                        resource: values.resource,
                        ignoreTrigger: values.ignoreTrigger,
                        actionsUuids: values.actionsUuids.map((action) => action.value),
                        event: values?.event,
                        rulesUuids: values.rulesUuids.map((rule) => rule.value),
                        eventResource: values.eventResource,
                        type: values.triggerType,
                    },
                }),
            );
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: TriggerFormValues) => {
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
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<TriggerFormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Trigger Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter Trigger name"
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
                        <Field name="selectedTriggerType" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="triggerTypeSelect">Type</Label>

                                    <Select
                                        {...input}
                                        inputId="triggerTypeSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={ruleTriggerTypeOptions}
                                        placeholder="Select Trigger Type"
                                        isClearable
                                        onChange={(event) => {
                                            if (!event?.value) return;

                                            input.onChange(event);
                                            form.change('triggerType', event?.value);
                                            form.change('eventResource', Resource.None);
                                            form.change('selectedTriggerResource', undefined);
                                            form.change('event', undefined);
                                            form.change('selectedEvent', undefined);
                                            form.change('resource', Resource.None);
                                            form.change('selectedResource', undefined);
                                            form.change('actionsUuids', []);
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
                                    <Label for="eventResourceSelect">Event Resource</Label>

                                    <Select
                                        {...input}
                                        inputId="eventResourceSelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={resourceEventsOptions}
                                        placeholder="Select Event Resource"
                                        isClearable
                                        isDisabled={!values.triggerType}
                                        onChange={(event) => {
                                            if (!event?.value) return;

                                            input.onChange(event);
                                            form.change('eventResource', event.value as Resource);

                                            if (values.triggerType === TriggerType.Event) {
                                                fetchResourceEvents(event.value as Resource);
                                                form.change('selectedResource', undefined);
                                                form.change('resource', Resource.None);
                                            } else {
                                                form.change('selectedResource', event);
                                                form.change('resource', event.value as Resource);
                                                fetchActions(event.value as Resource);
                                                fetchRules(event.value as Resource);
                                            }
                                            form.change('event', undefined);
                                            form.change('selectedEvent', undefined);
                                            form.change('actionsUuids', []);
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

                        {values?.triggerType === TriggerType.Event && (
                            <Field name="selectedEvent" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="eventSelect">Event</Label>

                                        <Select
                                            {...input}
                                            inputId="eventSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={resourceEventNameOptions || []}
                                            placeholder="Select Event"
                                            isClearable
                                            onChange={(event) => {
                                                if (!event?.value) return;

                                                input.onChange(event);
                                                form.change('event', event?.value?.event as TriggerRequestDtoEventEnum);

                                                if (event?.value?.producedResource) {
                                                    const selectResource = resourceOptions.find(
                                                        (resource) => resource.value === event?.value?.producedResource,
                                                    );
                                                    form.change('selectedResource', selectResource);
                                                    form.change('resource', event?.value?.producedResource);
                                                    fetchActions(event?.value?.producedResource);
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

                        <div className="d-flex my-2">
                            <Label style={{ marginTop: '2.5px', marginRight: '1rem' }}>Ignore Trigger</Label>
                            <SwitchWidget
                                checked={values.ignoreTrigger}
                                onClick={() => {
                                    form.change('ignoreTrigger', !values.ignoreTrigger);
                                    if (!values.ignoreTrigger) {
                                        form.change('actionsUuids', []);
                                    }
                                }}
                            />
                        </div>

                        <Field name="selectedResource">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="resourceSelect">Resource</Label>

                                    <Select
                                        {...input}
                                        id="resource"
                                        inputId="resourceSelect"
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
                                    <Label for="ruleSelect">Rules</Label>

                                    <Select
                                        isDisabled={values.resource === Resource.None || !values.resource}
                                        id="rules"
                                        inputId="ruleSelect"
                                        {...input}
                                        options={rulesOptions}
                                        isMulti
                                        placeholder="Select Rule"
                                        isClearable
                                    />
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="actionsUuids">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="actionsSelect">Actions</Label>

                                    <Select
                                        isDisabled={values.resource === Resource.None || !values.resource || values.ignoreTrigger}
                                        {...input}
                                        inputId="actionsSelect"
                                        options={actionsOptions}
                                        isMulti
                                        placeholder="Select Actions"
                                        isClearable
                                    />
                                </FormGroup>
                            )}
                        </Field>

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
                                        (!values.ignoreTrigger && !values.actionsUuids.length)
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

export default TriggerForm;
