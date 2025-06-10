import Widget from 'components/Widget';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { Resource, TriggerDto, PlatformEnum, ResourceEvent } from 'types/openapi';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { Button } from 'reactstrap';
import BooleanBadge from 'components/BooleanBadge/BooleanBadge';

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

    const sortTriggersByIgnoreTriggerValue = useCallback(
        (selectedTriggers: string[]) =>
            [...selectedTriggers].sort((a, b) => {
                const triggerA = triggers.find((t) => t.uuid === a);
                const triggerB = triggers.find((t) => t.uuid === b);
                if (!triggerA || !triggerB) return 0;
                if (triggerA.ignoreTrigger === triggerB.ignoreTrigger) return 0;
                return triggerA.ignoreTrigger ? -1 : 1;
            }),
        [triggers],
    );
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
            onSelectedTriggersChange(sortTriggersByIgnoreTriggerValue(allTriggers));
        },
        [triggers, selectedTriggers, onSelectedTriggersChange, sortTriggersByIgnoreTriggerValue],
    );

    const onDeleteTrigger = useCallback(
        (trigger: TriggerDto) => {
            onSelectedTriggersChange(
                sortTriggersByIgnoreTriggerValue(selectedTriggers.filter((selectedTrigger) => selectedTrigger !== trigger.uuid)),
            );
        },
        [selectedTriggers, onSelectedTriggersChange, sortTriggersByIgnoreTriggerValue],
    );
    const onMoveTriggerUp = useCallback(
        (trigger: TriggerDto) => {
            const index = selectedTriggers.findIndex((selectedTrigger) => selectedTrigger === trigger.uuid);
            if (index === 0) return;
            const newSelectedTriggers = [...selectedTriggers];
            const temp = newSelectedTriggers[index];
            newSelectedTriggers[index] = newSelectedTriggers[index - 1];
            newSelectedTriggers[index - 1] = temp;
            onSelectedTriggersChange(sortTriggersByIgnoreTriggerValue(newSelectedTriggers));
        },
        [selectedTriggers, onSelectedTriggersChange, sortTriggersByIgnoreTriggerValue],
    );

    const onMoveTriggerDown = useCallback(
        (trigger: TriggerDto) => {
            const index = selectedTriggers.findIndex((selectedTrigger) => selectedTrigger === trigger.uuid);
            if (index === selectedTriggers.length - 1) return;
            const newSelectedTriggers = [...selectedTriggers];
            const temp = newSelectedTriggers[index];
            newSelectedTriggers[index] = newSelectedTriggers[index + 1];
            newSelectedTriggers[index + 1] = temp;
            onSelectedTriggersChange(sortTriggersByIgnoreTriggerValue(newSelectedTriggers));
        },
        [selectedTriggers, onSelectedTriggersChange, sortTriggersByIgnoreTriggerValue],
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
            align: 'center',
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

        const ignoreTriggerIndexTransition = triggerDataListOrderedAsPerSelectedTriggers.findIndex((el) => !el.ignoreTrigger) - 1;

        return triggerDataListOrderedAsPerSelectedTriggers.map((trigger, i, arr) => {
            const moveUpDisabled = i === 0 || i === ignoreTriggerIndexTransition + 1;
            const moveDownDisabled = i === arr.length - 1 || i === ignoreTriggerIndexTransition;
            return {
                id: trigger.uuid,
                options: {
                    useAccentBottomBorder: i === ignoreTriggerIndexTransition,
                },
                columns: [
                    <Link key="name" to={`../../triggers/detail/${trigger.uuid}`}>
                        {trigger.name}
                    </Link>,
                    getEnumLabel(triggerTypeEnum, trigger.type ?? ''),
                    <BooleanBadge key="ignoreTrigger" value={trigger.ignoreTrigger} />,
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
                            disabled={moveUpDisabled}
                            onClick={() => onMoveTriggerUp(trigger)}
                        >
                            <i className="fa fa-arrow-up" />
                        </Button>

                        <Button
                            className="btn btn-link"
                            size="sm"
                            title="Move Trigger Down"
                            disabled={moveDownDisabled}
                            onClick={() => onMoveTriggerDown(trigger)}
                        >
                            <i className="fa fa-arrow-down" />
                        </Button>
                    </div>,
                ],
            };
        }) as TableDataRow[];
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
