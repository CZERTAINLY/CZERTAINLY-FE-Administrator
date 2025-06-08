import Widget from 'components/Widget';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { Resource, TriggerDto, PlatformEnum, ResourceEvent } from 'types/openapi';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { Button } from 'reactstrap';

type OptionType = {
    label: string;
    value: string;
};

type Props = {
    resource?: Resource;
    event?: ResourceEvent;
    selectedTriggers: string[];
    onSelectedTriggersChange: (triggerUuids: string[]) => void;
    noteText?: string;
};

export default function TriggerEditorWidget({ resource, event, selectedTriggers, onSelectedTriggersChange, noteText }: Props) {
    const dispatch = useDispatch();

    const triggers = useSelector(rulesSelectors.triggers);

    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));
    const eventNameEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));

    const isFetchingTriggers = useSelector(rulesSelectors.isFetchingTriggers);

    const newTriggerOptions = useMemo(
        () =>
            triggers
                .filter((trigger) => event === undefined || trigger.event === event)
                .map((trigger) => ({
                    label: trigger.name,
                    value: trigger.uuid,
                }))
                .filter((trigger) => !selectedTriggers.find((selectedTrigger) => selectedTrigger === trigger.value)),
        [triggers, selectedTriggers, event],
    );

    const isBusy = useMemo(() => isFetchingTriggers, [isFetchingTriggers]);

    useEffect(() => {
        dispatch(rulesActions.listTriggers({ resource }));
    }, [dispatch, resource]);

    const onAddTrigger = useCallback(
        (newValues: OptionType[]) => {
            const previousTriggers = selectedTriggers;
            const newTriggers = newValues.map((el) => triggers.find((innerEl) => innerEl.uuid === el.value));
            const allTriggers = [
                ...previousTriggers,
                ...(newTriggers.filter((newValue) => !previousTriggers.find((trigger) => trigger === newValue?.uuid)) as TriggerDto[]).map(
                    (el) => el?.uuid,
                ),
            ];
            onSelectedTriggersChange(allTriggers);
        },
        [triggers, selectedTriggers, onSelectedTriggersChange],
    );

    const onDeleteTrigger = useCallback(
        (trigger: TriggerDto) => {
            onSelectedTriggersChange(selectedTriggers.filter((selectedTrigger) => selectedTrigger !== trigger.uuid));
        },
        [selectedTriggers, onSelectedTriggersChange],
    );
    const onMoveTriggerUp = useCallback(
        (trigger: TriggerDto) => {
            const index = selectedTriggers.findIndex((selectedTrigger) => selectedTrigger === trigger.uuid);
            if (index === 0) return;
            const newSelectedTriggers = [...selectedTriggers];
            const temp = newSelectedTriggers[index];
            newSelectedTriggers[index] = newSelectedTriggers[index - 1];
            newSelectedTriggers[index - 1] = temp;
            onSelectedTriggersChange(newSelectedTriggers);
        },
        [selectedTriggers, onSelectedTriggersChange],
    );

    const onMoveTriggerDown = useCallback(
        (trigger: TriggerDto) => {
            const index = selectedTriggers.findIndex((selectedTrigger) => selectedTrigger === trigger.uuid);
            if (index === selectedTriggers.length - 1) return;
            const newSelectedTriggers = [...selectedTriggers];
            const temp = newSelectedTriggers[index];
            newSelectedTriggers[index] = newSelectedTriggers[index + 1];
            newSelectedTriggers[index + 1] = temp;
            onSelectedTriggersChange(newSelectedTriggers);
        },
        [selectedTriggers, onSelectedTriggersChange],
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
        {
            id: 'actions',
            content: 'Actions',
        },
    ];

    const triggerTableData: TableDataRow[] = useMemo(() => {
        const triggerDataListOrderedAsPerSelectedTriggers = triggers
            .filter((trigger) => selectedTriggers.find((selectedTrigger) => selectedTrigger === trigger.uuid))
            .sort(
                (a, b) =>
                    selectedTriggers.findIndex((selectedTrigger) => selectedTrigger === a.uuid) -
                    selectedTriggers.findIndex((selectedTrigger) => selectedTrigger === b.uuid),
            );

        return triggerDataListOrderedAsPerSelectedTriggers.map((trigger, i) => ({
            id: trigger.uuid,
            columns: [
                <Link key="name" to={`../../triggers/detail/${trigger.uuid}`}>
                    {trigger.name}
                </Link>,
                getEnumLabel(triggerTypeEnum, trigger.type ?? ''),
                getEnumLabel(eventNameEnum, trigger.event ?? ''),
                getEnumLabel(resourceTypeEnum, trigger.resource ?? ''),
                trigger.description ?? '',
                <div key="actions" className="d-flex">
                    <Button
                        className="btn btn-link text-danger"
                        size="sm"
                        color="danger"
                        title="Delete Condition Group"
                        onClick={() => onDeleteTrigger(trigger)}
                    >
                        <i className="fa fa-trash" />
                    </Button>
                    <Button
                        className="btn btn-link"
                        size="sm"
                        title="Move Trigger Up"
                        disabled={i === 0}
                        onClick={() => onMoveTriggerUp(trigger)}
                    >
                        <i className="fa fa-arrow-up" />
                    </Button>

                    <Button
                        className="btn btn-link"
                        size="sm"
                        title="Move Trigger Down"
                        disabled={i === selectedTriggers.length - 1}
                        onClick={() => onMoveTriggerDown(trigger)}
                    >
                        <i className="fa fa-arrow-down" />
                    </Button>
                </div>,
            ],
        }));
    }, [selectedTriggers, triggers, eventNameEnum, resourceTypeEnum, triggerTypeEnum, onDeleteTrigger, onMoveTriggerUp, onMoveTriggerDown]);

    return (
        <Widget title="Triggers">
            {noteText && <p className="text-muted mt-1 ">Note: {noteText}</p>}
            <CustomTable
                hasHeader={!!triggerTableData.length}
                data={triggerTableData}
                headers={triggerHeaders}
                newRowWidgetProps={{
                    selectHint: 'Select Triggers',
                    immediateAdd: true,
                    newItemsList: newTriggerOptions,
                    isBusy,
                    onAddClick: onAddTrigger,
                }}
            />
        </Widget>
    );
}
