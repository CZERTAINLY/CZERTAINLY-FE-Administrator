import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { actions as settingsActions, selectors as settingsSelectors } from 'ducks/settings';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';

import { Container } from 'reactstrap';
import { EventSettingsDtoEventEnum, PlatformEnum } from 'types/openapi';
import { EventSettingsDto } from 'types/settings';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function EventDetail() {
    const { event } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const eventsSettings = useSelector(settingsSelectors.eventsSettings);
    const triggers = useSelector(rulesSelectors.triggers);
    const isFetchingEventsSetting = useSelector(settingsSelectors.isFetchingEventsSetting);
    const isFetchingTriggers = useSelector(rulesSelectors.isFetchingTriggers);

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const resourceEventEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));
    const isBusy = useMemo(() => isFetchingEventsSetting || isFetchingTriggers, [isFetchingEventsSetting, isFetchingTriggers]);

    const eventSettings: EventSettingsDto | undefined = useMemo(() => {
        if (!event || !eventsSettings) return undefined;
        return {
            event: event as EventSettingsDtoEventEnum,
            triggerUuids: eventsSettings.eventsMapping[event] ?? [],
        };
    }, [eventsSettings, event]);

    const getFreshData = useCallback(() => {
        if (!event) return;
        dispatch(settingsActions.getEventsSettings());
        dispatch(rulesActions.listTriggers({}));
    }, [dispatch, event]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const onEditEvent = useCallback(() => {
        if (!event) return;
        navigate(`../events/edit/${event}/`);
    }, [navigate, event]);

    const widgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditEvent();
                },
            },
        ],
        [onEditEvent],
    );
    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const profileData: TableDataRow[] = useMemo(
        () =>
            !eventSettings
                ? []
                : [
                      {
                          id: 'name',
                          columns: ['Name', getEnumLabel(resourceEventEnum, eventSettings.event)],
                      },
                  ],
        [eventSettings, resourceEventEnum],
    );

    const triggerHeaders: TableHeader[] = [
        {
            id: 'name',
            content: 'Name',
        },
        {
            id: 'triggerType',
            content: 'Trigger Type',
        },
        {
            id: 'ignoreTrigger',
            content: 'Ignore Trigger',
        },
        {
            id: 'eventName',
            content: 'Event Name',
        },
        {
            id: 'resource',
            content: 'Resource',
        },
        {
            id: 'description',
            content: 'Description',
        },
    ];

    const triggerTableData: TableDataRow[] = useMemo(
        () =>
            triggers.length
                ? triggers
                      .filter((trigger) => eventSettings?.triggerUuids.includes(trigger.uuid))
                      .map((trigger) => ({
                          id: trigger.uuid,
                          columns: [
                              <Link to={`../../triggers/detail/${trigger.uuid}`}>{trigger.name}</Link>,
                              getEnumLabel(triggerTypeEnum, trigger.type ?? ''),
                              trigger.ignoreTrigger ? 'Yes' : 'No',
                              getEnumLabel(resourceEventEnum, trigger.event ?? ''),
                              getEnumLabel(resourceTypeEnum, trigger.resource ?? ''),
                              trigger.description || '',
                          ],
                      }))
                : [],
        [eventSettings, triggers, triggerTypeEnum, resourceTypeEnum, resourceEventEnum],
    );
    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Event Settings"
                busy={isBusy}
                widgetButtons={widgetButtons}
                widgetLockName={LockWidgetNameEnum.EventSettings}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <CustomTable headers={headers} data={profileData} />
            </Widget>
            <Widget title="Assigned Triggers" busy={isBusy} widgetLockName={LockWidgetNameEnum.EventSettings} titleSize="large">
                <CustomTable headers={triggerHeaders} data={triggerTableData} />
            </Widget>
        </Container>
    );
}
