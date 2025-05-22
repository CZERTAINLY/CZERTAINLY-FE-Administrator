import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as settingsActions, selectors as settingsSelectors } from 'ducks/settings';

import { actions as resourceActions, selectors as resourceSelectors } from 'ducks/resource';
import { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Form as BootstrapForm, Button, ButtonGroup } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { isObjectSame } from 'utils/common-utils';
import CustomSelect from 'components/Input/CustomSelect';
import { EventSettingsDto, EventSettingsDtoEventEnum, PlatformEnum, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import TriggerEditorWidget from 'components/TriggerEditorWidget';

interface OptionType {
    value: string;
    label: string;
}

interface FormValues {
    event?: OptionType;
    resource?: OptionType;
    triggers?: string[];
}

export default function EventForm() {
    const { event } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resourceEvents = useSelector(resourceSelectors.resourceEvents);
    const eventsSettings = useSelector(settingsSelectors.eventsSettings);

    const isFetchingResourcesList = useSelector(resourceSelectors.isFetchingResourcesList);
    const isFetchingEventsSetting = useSelector(settingsSelectors.isFetchingEventsSetting);
    const isUpdatingEventsSetting = useSelector(settingsSelectors.isUpdatingEventsSetting);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));

    const isBusy = useMemo(
        () => isFetchingEventsSetting || isUpdatingEventsSetting || isFetchingResourcesList,
        [isFetchingEventsSetting, isUpdatingEventsSetting, isFetchingResourcesList],
    );

    const eventSettings: EventSettingsDto | undefined = useMemo(() => {
        if (!event || !eventsSettings) return undefined;
        return {
            event: event as EventSettingsDtoEventEnum,
            triggerUuids: eventsSettings.eventsMapping[event] ?? [],
        };
    }, [eventsSettings, event]);

    useEffect(() => {
        if (!event) return;
        dispatch(settingsActions.getEventsSettings());
    }, [dispatch, event]);

    useEffect(() => {
        if (resourceEvents.length) return;
        dispatch(resourceActions.listAllResourceEvents());
    }, [dispatch, resourceEvents]);

    const defaultValues: FormValues = useMemo(() => {
        if (!eventSettings) return {};
        return {
            event: {
                label: getEnumLabel(resourceEventEnum, eventSettings.event),
                value: eventSettings.event,
            },
            resource: {
                label: getEnumLabel(resourceEnum, resourceEvents.find((el) => el.event === event)?.producedResource ?? ''),
                value: resourceEvents.find((el) => el.event === event)?.producedResource ?? '',
            },
            triggers: eventSettings.triggerUuids ?? [],
        };
    }, [event, resourceEvents, eventSettings, resourceEnum, resourceEventEnum]);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!event) return;
            dispatch(
                settingsActions.updateEventSettings({
                    eventSettings: {
                        event: event as EventSettingsDtoEventEnum,
                        triggerUuids: values.triggers ?? [],
                    },
                    redirect: `../events/detail/${event}`,
                }),
            );
        },
        [dispatch, event],
    );

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                defaultValues as unknown as Record<string, unknown>,
            );
            return areValuesSame;
        },
        [defaultValues],
    );

    return (
        <Widget title={'Edit Event'} busy={isBusy} widgetLockName={LockWidgetNameEnum.EventSettings}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => {
                    return (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <CustomSelect label="Event Name" id="name" isDisabled value={values.event} />
                            <CustomSelect label="Resource" id="resource" isDisabled value={values.resource} />
                            <TriggerEditorWidget
                                resource={values.resource?.value as Resource | undefined}
                                selectedTriggers={values.triggers ?? []}
                                onSelectedTriggersChange={(newTriggers) => {
                                    form.change('triggers', newTriggers);
                                }}
                            />

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={'Save'}
                                        inProgressTitle={'Saving...'}
                                        inProgress={submitting}
                                        disabled={areDefaultValuesSame(values) || isBusy}
                                    />

                                    <Button color="default" onClick={onCancel} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </BootstrapForm>
                    );
                }}
            </Form>
        </Widget>
    );
}
