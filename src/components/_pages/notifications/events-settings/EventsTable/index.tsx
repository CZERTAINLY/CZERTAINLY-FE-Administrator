import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { getEnumLabel, selectors as enumSelectors } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { actions as resourceActions, selectors as resourceSelectors } from 'ducks/resource';
import { actions as settingsActions, selectors as settingsSelectors } from 'ducks/settings';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useDispatch, useSelector } from 'react-redux';
import { PlatformEnum, Resource, ResourceEvent } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import Dialog from 'components/Dialog';
import { Form } from 'react-final-form';
import { Button, ButtonGroup } from 'reactstrap';
import CustomSelect from 'components/Input/CustomSelect';
import TriggerEditorWidget from 'components/TriggerEditorWidget';
import { isObjectSame } from 'utils/common-utils';

type Props = (
    | {
          mode: 'association';
          resource: Resource;
          resourceUuid: string;
      }
    | { mode: 'platform'; resource?: never; resourceUuid?: never }
) & {
    widgetLocks: LockWidgetNameEnum[];
};

type OptionType = {
    value: string;
    label: string;
};
type FormValues = {
    event?: OptionType;
    resource?: OptionType;
    triggerUuids?: string[];
};
const EventsTable = ({ mode, resource, resourceUuid, widgetLocks }: Props) => {
    const dispatch = useDispatch();

    const allResourceEvents = useSelector(resourceSelectors.allResourceEvents);
    const eventsSettings = useSelector(settingsSelectors.eventsSettings);

    const resourceEvents = useSelector(resourceSelectors.resourceEvents);
    const eventTriggerAssociation = useSelector(rulesSelectors.eventTriggerAssociation);
    const isFetchingResourcesList = useSelector(resourceSelectors.isFetchingResourcesList);
    const isFetchingEventTriggersAssociation = useSelector(rulesSelectors.isFetchingEventTriggersAssociation);
    const isUpdatingEventTriggersAssociation = useSelector(rulesSelectors.isUpdatingEventTriggersAssociation);
    const isFetchingEventsSetting = useSelector(settingsSelectors.isFetchingEventsSetting);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));

    const [isAddAssociationOpen, setIsTriggersDialogOpen] = useState(false);
    const [editedEvent, setEditedEvent] = useState<ResourceEvent | null>(null);

    const isBusy = useMemo(
        () =>
            isFetchingResourcesList || isFetchingEventTriggersAssociation || isUpdatingEventTriggersAssociation || isFetchingEventsSetting,
        [isFetchingResourcesList, isFetchingEventTriggersAssociation, isUpdatingEventTriggersAssociation, isFetchingEventsSetting],
    );

    const fetchEventAssociations = useCallback(() => {
        if (mode === 'association') {
            dispatch(rulesActions.getEventTriggersAssociations({ resource, associationObjectUuid: resourceUuid }));
        }
    }, [dispatch, mode, resource, resourceUuid]);

    const fetchEventsSettings = useCallback(() => {
        if (mode === 'platform') {
            dispatch(settingsActions.getEventsSettings());
        }
    }, [dispatch, mode]);

    const fetchResources = useCallback(() => {
        if (mode === 'association') {
            dispatch(resourceActions.listResourceEvents({ resource: resource }));
        } else if (mode === 'platform') {
            dispatch(resourceActions.listAllResourceEvents());
        }
    }, [dispatch, mode, resource]);

    useEffect(() => {
        fetchEventAssociations();
    }, [fetchEventAssociations]);

    useEffect(() => {
        fetchEventsSettings();
    }, [fetchEventsSettings]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    useEffect(() => {}, [dispatch, mode, resource]);

    const onClose = useCallback(() => {
        setEditedEvent(null);
        setIsTriggersDialogOpen(false);
    }, []);

    const onEdit = useCallback((event: ResourceEvent) => {
        setEditedEvent(event);
        setIsTriggersDialogOpen(true);
    }, []);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!values.event) return;
            if (mode === 'association') {
                dispatch(
                    rulesActions.associateEventTriggers({
                        triggerEventAssociationRequestModel: {
                            event: values.event.value as ResourceEvent,
                            objectUuid: resourceUuid,
                            resource: resource,
                            triggerUuids: values.triggerUuids ?? [],
                        },
                    }),
                );
            } else {
                dispatch(
                    settingsActions.updateEventSettings({
                        eventSettings: {
                            event: values.event.value as ResourceEvent,
                            triggerUuids: values.triggerUuids ?? [],
                        },
                    }),
                );
            }
            onClose();
        },
        [dispatch, onClose, mode, resource, resourceUuid],
    );
    const getResourceEventModel = useCallback(
        (event?: ResourceEvent | string | null) => {
            return mode === 'association'
                ? resourceEvents.find((el) => el.event === event)
                : allResourceEvents.find((el) => el.event === event);
        },
        [allResourceEvents, mode, resourceEvents],
    );
    const textContent: {
        title: string;
        dialogTitle: string;
        description: string;
        addTooltip: string;
        confirmDialogButtonText: string;
    } = useMemo(() => {
        if (mode === 'association') {
            return {
                title: 'Associated Events',
                dialogTitle: 'Associate Event Triggers',
                description: `When an Event is produced on Resources related to this ${getEnumLabel(resourceEnum, resource)}, assigned Triggers are fired`,
                addTooltip: 'Associate Event',
                confirmDialogButtonText: 'Associate',
            };
        }
        return {
            title: 'Platform Events',
            dialogTitle: 'Configure Event Triggers',
            description: 'When an Event is produced, assigned Triggers are fired',
            addTooltip: 'Add Event',
            confirmDialogButtonText: 'Add',
        };
    }, [mode, resource, resourceEnum]);

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'eventName',
                content: 'Event Name',
                sortable: true,
            },
            {
                id: 'resource',
                content: 'Resource',
                sort: 'asc',
                sortable: true,
            },
            {
                id: 'triggersCount',
                content: 'Triggers Count',
                sortable: true,
            },
            {
                id: 'edit',
                content: '',
                width: '40px',
            },
        ],
        [],
    );

    const dataRows: TableDataRow[] = useMemo(() => {
        const eventTriggerEntries =
            mode === 'association' ? Object.entries(eventTriggerAssociation ?? {}) : Object.entries(eventsSettings?.eventsMapping ?? {});

        return eventTriggerEntries
            .filter(([_, triggerUuids]) => triggerUuids.length > 0)
            .map(([event, triggerUuids]) => {
                const resourceEvent = getResourceEventModel(event);
                return {
                    id: event,
                    columns: [
                        getEnumLabel(resourceEventEnum, event),
                        resourceEvent?.producedResource ? getEnumLabel(resourceEnum, resourceEvent.producedResource) : '',
                        (triggerUuids?.length ?? 0).toString(),
                        <Button
                            className="btn btn-link py-0 px-1 ms-2"
                            color="white"
                            title="Edit"
                            key="edit"
                            onClick={() => onEdit(event as ResourceEvent)}
                        >
                            <i className="fa fa-edit" style={{ color: 'auto' }} />
                        </Button>,
                    ],
                };
            });
    }, [mode, eventTriggerAssociation, eventsSettings, getResourceEventModel, resourceEventEnum, resourceEnum, onEdit]);

    const eventOptions = useMemo(() => {
        if (mode === 'association') {
            return resourceEvents
                .filter((event) => !eventTriggerAssociation?.[event.event])
                .map((event) => ({
                    value: event.event,
                    label: getEnumLabel(resourceEventEnum, event.event),
                }));
        }
        return allResourceEvents
            .filter((event) => !eventsSettings?.eventsMapping?.[event.event])
            .map((event) => ({
                value: event.event,
                label: getEnumLabel(resourceEventEnum, event.event),
            }));
    }, [mode, allResourceEvents, resourceEvents, eventTriggerAssociation, resourceEventEnum, eventsSettings]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: !eventOptions.length,
                tooltip: textContent.addTooltip,
                onClick: () => setIsTriggersDialogOpen(true),
            },
        ],
        [eventOptions.length, textContent.addTooltip],
    );

    const initialValues: FormValues = useMemo(() => {
        const resourceEvent = getResourceEventModel(editedEvent);

        if (!resourceEvent) return {};

        return {
            event: {
                label: getEnumLabel(resourceEventEnum, resourceEvent.event),
                value: resourceEvent.event,
            },
            resource: {
                label: getEnumLabel(resourceEnum, resourceEvent.producedResource ?? Resource.None),
                value: resourceEvent.producedResource ?? Resource.None,
            },
            triggerUuids:
                mode === 'association'
                    ? eventTriggerAssociation?.[resourceEvent.event]
                    : (eventsSettings?.eventsMapping?.[resourceEvent.event] ?? []),
        };
    }, [editedEvent, eventTriggerAssociation, eventsSettings, getResourceEventModel, mode, resourceEnum, resourceEventEnum]);

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                initialValues as unknown as Record<string, unknown>,
            );
            return areValuesSame;
        },
        [initialValues],
    );

    return (
        <>
            <Widget
                title={textContent.title}
                refreshAction={mode === 'association' ? fetchEventAssociations : fetchEventsSettings}
                titleSize="larger"
                widgetButtons={buttons}
                widgetLockName={widgetLocks}
                lockSize="large"
                busy={isBusy}
                widgetInfoCard={{
                    title: 'Information',
                    description: textContent.description,
                }}
            >
                <br />
                <CustomTable headers={headers} data={dataRows} />
            </Widget>
            <Dialog
                isOpen={isAddAssociationOpen}
                caption={textContent.dialogTitle}
                size="xl"
                body={
                    <Form onSubmit={onSubmit} initialValues={initialValues}>
                        {({ values, handleSubmit, submitting, valid, form }) => (
                            <>
                                <CustomSelect
                                    label="Event"
                                    options={eventOptions}
                                    value={values.event}
                                    onChange={(e) => {
                                        form.change('event', e as OptionType);
                                        const producedResource = getResourceEventModel((e as OptionType).value)?.producedResource;

                                        if (producedResource) {
                                            form.change('resource', {
                                                value: producedResource,
                                                label: getEnumLabel(resourceEnum, producedResource),
                                            });
                                        }
                                    }}
                                    isDisabled={!!editedEvent}
                                    required
                                />
                                {values.event?.value && (
                                    <>
                                        <CustomSelect label="Resource" value={values.resource} isDisabled />
                                        <TriggerEditorWidget
                                            resource={values.resource?.value as Resource}
                                            selectedTriggers={values.triggerUuids ?? []}
                                            onSelectedTriggersChange={(e) => {
                                                form.change('triggerUuids', e);
                                            }}
                                            noteText={`Only Triggers associated with the same Resource as the Event are shown`}
                                        />
                                    </>
                                )}
                                <div style={{ textAlign: 'right' }}>
                                    <ButtonGroup>
                                        <Button
                                            type="submit"
                                            color="primary"
                                            disabled={isBusy || submitting || !valid || areDefaultValuesSame(values)}
                                            onClick={handleSubmit}
                                        >
                                            {editedEvent ? 'Save' : textContent.confirmDialogButtonText}
                                        </Button>

                                        <Button type="button" color="secondary" disabled={isBusy || submitting} onClick={onClose}>
                                            Cancel
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </>
                        )}
                    </Form>
                }
                toggle={() => setIsTriggersDialogOpen(false)}
            />
        </>
    );
};

export default EventsTable;
