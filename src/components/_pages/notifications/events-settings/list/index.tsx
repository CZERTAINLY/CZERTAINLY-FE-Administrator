import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { getEnumLabel, selectors as enumSelectors } from 'ducks/enums';
import { actions as settingsActions, selectors as settingsSelectors } from 'ducks/settings';
import { actions as resourceActions, selectors as resourceSelectors } from 'ducks/resource';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { PlatformEnum, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { useHasEventsResourceOptions } from 'utils/rules';
import BooleanBadge from 'components/BooleanBadge/BooleanBadge';

const EventsList = () => {
    const dispatch = useDispatch();

    const eventsSettings = useSelector(settingsSelectors.eventsSettings);
    const resourceEvents = useSelector(resourceSelectors.resourceEvents);
    const isFetchingResourcesList = useSelector(resourceSelectors.isFetchingResourcesList);
    const isFetchingEventsSetting = useSelector(settingsSelectors.isFetchingEventsSetting);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));

    const [selectedResource, setSelectedResource] = useState<Resource>();
    const { resourceOptionsWithEvents, isFetchingResourcesList: isFetchingResourcesWithEventsList } = useHasEventsResourceOptions();

    const getEvents = useCallback(() => {
        dispatch(settingsActions.getEventsSettings());
    }, [dispatch]);

    useEffect(() => {
        getEvents();
    }, [getEvents]);

    useEffect(() => {
        dispatch(resourceActions.listAllResourceEvents());
    }, [dispatch]);

    const isBusy = useMemo(
        () => isFetchingEventsSetting || isFetchingResourcesList || isFetchingResourcesWithEventsList,
        [isFetchingEventsSetting, isFetchingResourcesList, isFetchingResourcesWithEventsList],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'search',
                disabled: false,
                tooltip: 'Select Resource',
                onClick: () => {},
                custom: (
                    <div className="mx-1">
                        <Select
                            isClearable
                            maxMenuHeight={140}
                            menuPlacement="auto"
                            options={resourceOptionsWithEvents}
                            placeholder="Select Produced by Resource"
                            onChange={(event) => {
                                setSelectedResource(event?.value as Resource);
                            }}
                        />
                    </div>
                ),
            },
        ],
        [resourceOptionsWithEvents],
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
                content: 'Produced by Resource',
                sortable: true,
            },
            {
                id: 'hasTrigger',
                content: 'Has Triggers Assigned',
                sortable: true,
                sort: 'desc',
            },
            {
                id: 'triggersCount',
                content: 'Triggers Count',
                sortable: true,
            },
        ],
        [],
    );

    const dataRows: TableDataRow[] = useMemo(
        () =>
            !resourceEvents
                ? []
                : resourceEvents
                      .filter((el) => selectedResource === undefined || selectedResource === el.producedResource)
                      .reduce(
                          (acc, event) => [
                              ...acc,
                              {
                                  id: event.event,
                                  columns: [
                                      <Link key="name" to={`./detail/${event.event}`}>
                                          {getEnumLabel(resourceEventEnum, event.event)}
                                      </Link>,
                                      event.producedResource ? getEnumLabel(resourceEnum, event.producedResource) : '',
                                      <BooleanBadge value={Boolean(eventsSettings?.eventsMapping[event.event]?.length)} />,
                                      (eventsSettings?.eventsMapping[event.event]?.length ?? 0).toString(),
                                  ],
                              },
                          ],
                          [] as TableDataRow[],
                      ),
        [resourceEvents, resourceEventEnum, resourceEnum, selectedResource, eventsSettings],
    );

    return (
        <Widget
            title="List of Events"
            refreshAction={getEvents}
            titleSize="larger"
            widgetButtons={buttons}
            widgetLockName={LockWidgetNameEnum.EventSettings}
            lockSize="large"
            busy={isBusy}
            widgetInfoCard={{
                title: 'Information',
                description: 'When an Event is produced, assigned Triggers are fired',
            }}
        >
            <br />
            <CustomTable headers={headers} data={dataRows} hasPagination={true} />
        </Widget>
    );
};

export default EventsList;
