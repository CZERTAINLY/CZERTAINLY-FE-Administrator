import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { getEnumLabel, selectors as enumSelectors } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { actions as resourceActions, selectors as resourceSelectors } from 'ducks/resource';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { PlatformEnum, Resource, ResourceEvent } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import Dialog from 'components/Dialog';
import { Form } from 'react-final-form';
import { Button, ButtonGroup } from 'reactstrap';
import CustomSelect from 'components/Input/CustomSelect';
import TriggerEditorWidget from 'components/TriggerEditorWidget';
import { isObjectSame } from 'utils/common-utils';

type Props = {
    resource: Resource;
    resourceUuid: string;
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
const EventsAssociationTable = ({ resource, resourceUuid, widgetLocks }: Props) => {
    const dispatch = useDispatch();

    const resourceEvents = useSelector(resourceSelectors.resourceEvents);
    const eventTriggerAssociation = useSelector(rulesSelectors.eventTriggerAssociation);
    const isFetchingResourcesList = useSelector(resourceSelectors.isFetchingResourcesList);
    const isFetchingEventTriggersAssociation = useSelector(rulesSelectors.isFetchingEventTriggersAssociation);
    const isUpdatingEventTriggersAssociation = useSelector(rulesSelectors.isUpdatingEventTriggersAssociation);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));

    const [isAddAssociationOpen, setIsAddAssociationOpen] = useState(false);
    const [editedEvent, setEditedEvent] = useState<ResourceEvent | null>(null);

    const isBusy = useMemo(
        () => isFetchingResourcesList || isFetchingEventTriggersAssociation || isUpdatingEventTriggersAssociation,
        [isFetchingResourcesList, isFetchingEventTriggersAssociation, isUpdatingEventTriggersAssociation],
    );

    const getEventAssociation = useCallback(() => {
        dispatch(rulesActions.getEventTriggersAssociations({ resource, associationObjectUuid: resourceUuid }));
    }, [dispatch, resource, resourceUuid]);

    useEffect(() => {
        getEventAssociation();
    }, [getEventAssociation]);

    useEffect(() => {
        dispatch(resourceActions.listResourceEvents({ resource: resource }));
    }, [dispatch, resource]);

    const onClose = useCallback(() => {
        setEditedEvent(null);
        setIsAddAssociationOpen(false);
    }, []);

    const onEdit = useCallback((event: ResourceEvent) => {
        setEditedEvent(event);
        setIsAddAssociationOpen(true);
    }, []);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!values.event) return;

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
            onClose();
        },
        [dispatch, onClose, resource, resourceUuid],
    );
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
            },
        ],
        [],
    );

    const dataRows: TableDataRow[] = useMemo(
        () =>
            !eventTriggerAssociation
                ? []
                : Object.entries(eventTriggerAssociation).map(([event, triggerUuids]) => {
                      const resourceEvent = resourceEvents.find((el) => el.event === event);
                      return {
                          id: event,
                          columns: [
                              <Link key="name" to={`/events/detail/${event}`}>
                                  {getEnumLabel(resourceEventEnum, event)}
                              </Link>,
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
                  }),
        [eventTriggerAssociation, resourceEvents, resourceEventEnum, resourceEnum, onEdit],
    );

    const eventOptions = useMemo(() => {
        return resourceEvents
            .filter((event) => !eventTriggerAssociation?.[event.event])
            .map((event) => ({
                value: event.event,
                label: getEnumLabel(resourceEventEnum, event.event),
            }));
    }, [resourceEvents, resourceEventEnum, eventTriggerAssociation]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: !eventOptions.length,
                tooltip: 'Associate Event',
                onClick: () => setIsAddAssociationOpen(true),
            },
        ],
        [eventOptions],
    );

    const initialValues: FormValues = useMemo(() => {
        const resourceEvent = resourceEvents.find((el) => el.event === editedEvent);
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
            triggerUuids: eventTriggerAssociation?.[resourceEvent.event] ?? [],
        };
    }, [editedEvent, eventTriggerAssociation, resourceEnum, resourceEventEnum, resourceEvents]);

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
                title="Associated Events"
                refreshAction={getEventAssociation}
                titleSize="larger"
                widgetButtons={buttons}
                widgetLockName={widgetLocks}
                lockSize="large"
                busy={isBusy}
            >
                <br />
                <CustomTable headers={headers} data={dataRows} />
            </Widget>
            <Dialog
                isOpen={isAddAssociationOpen}
                caption="Associate Event Triggers"
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
                                        const producedResource = resourceEvents?.find(
                                            (el) => el.event === (e as OptionType).value,
                                        )?.producedResource;

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
                                            Associate
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
                toggle={() => setIsAddAssociationOpen(false)}
            />
        </>
    );
};

export default EventsAssociationTable;
