import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Checkbox from 'components/Checkbox';
import Label from 'components/Label';
import TabLayout from 'components/Layout/TabLayout';
import NumberInput from 'components/NumberInput';
import RadioRow from 'components/RadioRow';
import TextInput from 'components/TextInput';
import { getStrongFromCronExpression } from 'utils/dateUtil';
import Container from 'components/Container';

type TabType = 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
type HourlyMode = 'everyN' | 'atTime';
type DailyMode = 'everyN' | 'weekdays';
type MonthlyMode = 'dayN' | 'lastDay' | 'lastWeekday' | 'daysBeforeEnd' | 'everyN';

const DAYS_OF_WEEK = [
    { value: 'MON', label: 'Monday' },
    { value: 'TUE', label: 'Tuesday' },
    { value: 'WED', label: 'Wednesday' },
    { value: 'THU', label: 'Thursday' },
    { value: 'FRI', label: 'Friday' },
    { value: 'SAT', label: 'Saturday' },
    { value: 'SUN', label: 'Sunday' },
];

const TABS: { id: TabType; label: string }[] = [
    { id: 'minutes', label: 'Minutes' },
    { id: 'hourly', label: 'Hourly' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'custom', label: 'Custom' },
];

interface CronState {
    tab: TabType;
    everyMinutes: number;
    hourlyMode: HourlyMode;
    everyHours: number;
    dailyMode: DailyMode;
    everyDays: number;
    weekDays: string[];
    monthlyMode: MonthlyMode;
    monthDay: number;
    daysBeforeEnd: number;
    monthlyEveryN: number;
    atMinute: number;
    atHour: number;
    customExpression: string;
}

const DEFAULT_STATE: CronState = {
    tab: 'daily',
    everyMinutes: 5,
    hourlyMode: 'everyN',
    everyHours: 1,
    dailyMode: 'everyN',
    everyDays: 1,
    weekDays: ['MON'],
    monthlyMode: 'dayN',
    monthDay: 1,
    daysBeforeEnd: 1,
    monthlyEveryN: 1,
    atMinute: 0,
    atHour: 0,
    customExpression: '',
};

function parseCron(cron: string): CronState {
    if (!cron?.trim()) return { ...DEFAULT_STATE };
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 6) return { ...DEFAULT_STATE, tab: 'custom', customExpression: cron };

    const [s, rawM, rawH, dom, month, dow] = parts;
    const atMinute = isNaN(parseInt(rawM, 10)) ? 0 : parseInt(rawM, 10);
    const atHour = isNaN(parseInt(rawH, 10)) ? 0 : parseInt(rawH, 10);

    // Every N minutes: 0 */N * * * ?
    if (s === '0' && rawM.startsWith('*/') && rawH === '*' && (dom === '*' || dom === '?') && month === '*') {
        const n = parseInt(rawM.slice(2), 10);
        return { ...DEFAULT_STATE, tab: 'minutes', everyMinutes: isNaN(n) ? 5 : n };
    }

    // Hourly everyN: 0 M */N * * ?
    if (s === '0' && !rawM.startsWith('*/') && rawH.startsWith('*/') && (dom === '*' || dom === '?') && month === '*') {
        const n = parseInt(rawH.slice(2), 10);
        return { ...DEFAULT_STATE, tab: 'hourly', hourlyMode: 'everyN', everyHours: isNaN(n) ? 1 : n, atMinute };
    }

    // Hourly atTime (old react-cron-generator format): 0 M H 1/1 * ? [*]
    if (s === '0' && !rawM.startsWith('*/') && !rawH.startsWith('*/') && dom === '1/1' && month === '*' && (dow === '?' || dow === '*')) {
        return { ...DEFAULT_STATE, tab: 'hourly', hourlyMode: 'atTime', atMinute, atHour };
    }

    // Daily weekdays: 0 M H ? * MON-FRI
    if (s === '0' && dom === '?' && month === '*' && dow === 'MON-FRI') {
        return { ...DEFAULT_STATE, tab: 'daily', dailyMode: 'weekdays', atMinute, atHour };
    }

    // Weekly: 0 M H ? * DOW (with specific days)
    if (s === '0' && dom === '?' && month === '*' && dow !== '*' && dow !== '?' && dow !== 'MON-FRI') {
        const days = dow.split(',').filter((d) => DAYS_OF_WEEK.some((dw) => dw.value === d));
        return { ...DEFAULT_STATE, tab: 'weekly', atMinute, atHour, weekDays: days.length > 0 ? days : ['MON'] };
    }

    // Monthly last day: 0 M H L * ?
    if (s === '0' && dom === 'L' && month === '*' && (dow === '?' || dow === '*')) {
        return { ...DEFAULT_STATE, tab: 'monthly', monthlyMode: 'lastDay', atMinute, atHour };
    }

    // Monthly last weekday: 0 M H LW * ?
    if (s === '0' && dom === 'LW' && month === '*' && (dow === '?' || dow === '*')) {
        return { ...DEFAULT_STATE, tab: 'monthly', monthlyMode: 'lastWeekday', atMinute, atHour };
    }

    // Monthly L-N days before end: 0 M H L-N * ?
    if (s === '0' && dom.startsWith('L-') && month === '*' && (dow === '?' || dow === '*')) {
        const n = parseInt(dom.slice(2), 10);
        return { ...DEFAULT_STATE, tab: 'monthly', monthlyMode: 'daysBeforeEnd', atMinute, atHour, daysBeforeEnd: isNaN(n) ? 1 : n };
    }

    // Monthly every N days: 0 M H 1/N * ? (N > 1, use 1/ prefix to distinguish from daily */N)
    if (s === '0' && /^\d+\/\d+$/.test(dom) && !dom.startsWith('0/') && month === '*' && (dow === '?' || dow === '*')) {
        const [start, step] = dom.split('/').map(Number);
        if (start >= 1 && step > 1) {
            return { ...DEFAULT_STATE, tab: 'monthly', monthlyMode: 'everyN', atMinute, atHour, monthlyEveryN: step };
        }
        // 1/1 or similar → daily everyN=1
        return { ...DEFAULT_STATE, tab: 'daily', dailyMode: 'everyN', everyDays: step || 1, atMinute, atHour };
    }

    // Daily every N days: 0 M H */N * ? or 0 M H * * ?
    if (s === '0' && (dom === '*' || dom.startsWith('*/')) && month === '*' && (dow === '?' || dow === '*')) {
        const n = dom === '*' ? 1 : parseInt(dom.slice(2), 10);
        return { ...DEFAULT_STATE, tab: 'daily', dailyMode: 'everyN', everyDays: isNaN(n) ? 1 : n, atMinute, atHour };
    }

    // Monthly specific day: 0 M H N * ?
    if (s === '0' && /^\d+$/.test(dom) && month === '*' && (dow === '?' || dow === '*')) {
        const day = parseInt(dom, 10);
        return { ...DEFAULT_STATE, tab: 'monthly', monthlyMode: 'dayN', atMinute, atHour, monthDay: isNaN(day) ? 1 : day };
    }

    return { ...DEFAULT_STATE, tab: 'custom', customExpression: cron };
}

function buildCron(state: CronState): string {
    const {
        tab,
        everyMinutes,
        hourlyMode,
        everyHours,
        dailyMode,
        everyDays,
        weekDays,
        monthlyMode,
        monthDay,
        daysBeforeEnd,
        monthlyEveryN,
        atMinute,
        atHour,
        customExpression,
    } = state;

    const m = String(atMinute).padStart(2, '0');
    const h = String(atHour).padStart(2, '0');

    switch (tab) {
        case 'minutes':
            return `0 */${everyMinutes} * * * ?`;
        case 'hourly':
            if (hourlyMode === 'atTime') return `0 ${m} ${h} * * ?`;
            return `0 ${m} */${everyHours} * * ?`;
        case 'daily':
            if (dailyMode === 'weekdays') return `0 ${m} ${h} ? * MON-FRI`;
            return everyDays <= 1 ? `0 ${m} ${h} * * ?` : `0 ${m} ${h} */${everyDays} * ?`;
        case 'weekly':
            return `0 ${m} ${h} ? * ${weekDays.length > 0 ? weekDays.join(',') : 'MON'}`;
        case 'monthly':
            switch (monthlyMode) {
                case 'lastDay':
                    return `0 ${m} ${h} L * ?`;
                case 'lastWeekday':
                    return `0 ${m} ${h} LW * ?`;
                case 'daysBeforeEnd':
                    return `0 ${m} ${h} L-${daysBeforeEnd} * ?`;
                case 'everyN':
                    return `0 ${m} ${h} 1/${monthlyEveryN} * ?`;
                default:
                    return `0 ${m} ${h} ${monthDay} * ?`;
            }
        case 'custom':
            return customExpression;
    }
}

function StartTimePicker({
    atHour,
    atMinute,
    onHourChange,
    onMinuteChange,
}: {
    atHour: number;
    atMinute: number;
    onHourChange: (v: number) => void;
    onMinuteChange: (v: number) => void;
}) {
    return (
        <div className="flex items-center gap-2 mt-1 justify-center">
            <Label className="!mb-0 text-gray-500 whitespace-nowrap">Start time</Label>
            <NumberInput value={atHour} onChange={onHourChange} min={0} max={23} zeroPad />
            <span className="text-gray-400 font-bold">:</span>
            <NumberInput value={atMinute} onChange={onMinuteChange} min={0} max={59} zeroPad />
        </div>
    );
}

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function CronBuilder({ value, onChange }: Props) {
    const [state, setState] = useState<CronState>(() => parseCron(value));
    const lastEmittedRef = useRef<string>(value);

    useEffect(() => {
        if (value === lastEmittedRef.current) return;
        setState(parseCron(value));
    }, [value]);

    const update = useCallback(
        (patch: Partial<CronState>) => {
            setState((prev) => {
                const next = { ...prev, ...patch };
                const cron = buildCron(next);
                lastEmittedRef.current = cron;
                onChange(cron);
                return next;
            });
        },
        [onChange],
    );

    const handleTabChange = useCallback(
        (index: number) => {
            const newTab = TABS[index].id;
            setState((prev) => {
                const next: CronState = { ...prev, tab: newTab };
                if (newTab === 'custom') next.customExpression = buildCron(prev);
                const cron = buildCron(next);
                lastEmittedRef.current = cron;
                onChange(cron);
                return next;
            });
        },
        [onChange],
    );

    const currentCron = buildCron(state);
    const description = getStrongFromCronExpression(currentCron);

    const tabs = useMemo(
        () => [
            {
                title: 'Minutes',
                content: (
                    <div className="flex items-center gap-2 min-h-16 justify-center">
                        <Label className="!mb-0 whitespace-nowrap">Every</Label>
                        <NumberInput value={state.everyMinutes} onChange={(v) => update({ everyMinutes: v })} min={1} max={59} />
                        <Label className="!mb-0 whitespace-nowrap">minute(s)</Label>
                    </div>
                ),
            },
            {
                title: 'Hourly',
                content: (
                    <Container gap={4}>
                        <RadioRow checked={state.hourlyMode === 'everyN'} onSelect={() => update({ hourlyMode: 'everyN' })} maxWidth={500}>
                            <Label className="!mb-0 whitespace-nowrap">Every</Label>
                            <NumberInput
                                value={state.everyHours}
                                onChange={(v) => update({ hourlyMode: 'everyN', everyHours: v })}
                                min={1}
                                max={23}
                            />
                            <Label className="!mb-0 whitespace-nowrap">hour(s) at minute</Label>
                            <NumberInput
                                value={state.atMinute}
                                onChange={(v) => update({ hourlyMode: 'everyN', atMinute: v })}
                                min={0}
                                max={59}
                            />
                        </RadioRow>
                        <RadioRow checked={state.hourlyMode === 'atTime'} onSelect={() => update({ hourlyMode: 'atTime' })} maxWidth={500}>
                            <Label className="!mb-0 whitespace-nowrap">At</Label>
                            <NumberInput
                                value={state.atHour}
                                onChange={(v) => update({ hourlyMode: 'atTime', atHour: v })}
                                min={0}
                                max={23}
                                zeroPad
                            />
                            <NumberInput
                                value={state.atMinute}
                                onChange={(v) => update({ hourlyMode: 'atTime', atMinute: v })}
                                min={0}
                                max={59}
                                zeroPad
                            />
                        </RadioRow>
                    </Container>
                ),
            },
            {
                title: 'Daily',
                content: (
                    <Container gap={4}>
                        <RadioRow checked={state.dailyMode === 'everyN'} onSelect={() => update({ dailyMode: 'everyN' })} maxWidth={500}>
                            <Label className="!mb-0 whitespace-nowrap">Every</Label>
                            <NumberInput
                                value={state.everyDays}
                                onChange={(v) => update({ dailyMode: 'everyN', everyDays: v })}
                                min={1}
                                max={31}
                            />
                            <Label className="!mb-0 whitespace-nowrap">day(s)</Label>
                        </RadioRow>
                        <RadioRow
                            checked={state.dailyMode === 'weekdays'}
                            onSelect={() => update({ dailyMode: 'weekdays' })}
                            maxWidth={500}
                        >
                            <Label className="!mb-0">Every week day</Label>
                        </RadioRow>
                        <StartTimePicker
                            atHour={state.atHour}
                            atMinute={state.atMinute}
                            onHourChange={(v) => update({ atHour: v })}
                            onMinuteChange={(v) => update({ atMinute: v })}
                        />
                    </Container>
                ),
            },
            {
                title: 'Weekly',
                content: (
                    <div className="flex flex-col gap-4 max-w-96 m-auto">
                        <div className="grid grid-cols-2 gap-4">
                            {DAYS_OF_WEEK.map((day) => (
                                <Checkbox
                                    key={day.value}
                                    id={`cron-dow-${day.value}`}
                                    label={day.label}
                                    checked={state.weekDays.includes(day.value)}
                                    onChange={(checked) => {
                                        const days = checked
                                            ? [...state.weekDays, day.value]
                                            : state.weekDays.filter((d) => d !== day.value);
                                        update({ weekDays: days.length > 0 ? days : [day.value] });
                                    }}
                                />
                            ))}
                        </div>
                        <StartTimePicker
                            atHour={state.atHour}
                            atMinute={state.atMinute}
                            onHourChange={(v) => update({ atHour: v })}
                            onMinuteChange={(v) => update({ atMinute: v })}
                        />
                    </div>
                ),
            },
            {
                title: 'Monthly',
                content: (
                    <Container gap={4}>
                        <RadioRow checked={state.monthlyMode === 'dayN'} onSelect={() => update({ monthlyMode: 'dayN' })} maxWidth={500}>
                            <Label className="!mb-0 whitespace-nowrap">Day</Label>
                            <NumberInput
                                value={state.monthDay}
                                onChange={(v) => update({ monthlyMode: 'dayN', monthDay: v })}
                                min={1}
                                max={31}
                            />
                            <Label className="!mb-0 whitespace-nowrap">of every month(s)</Label>
                        </RadioRow>
                        <RadioRow
                            checked={state.monthlyMode === 'lastDay'}
                            onSelect={() => update({ monthlyMode: 'lastDay' })}
                            maxWidth={500}
                        >
                            <Label className="!mb-0">Last day of every month</Label>
                        </RadioRow>
                        <RadioRow
                            checked={state.monthlyMode === 'lastWeekday'}
                            onSelect={() => update({ monthlyMode: 'lastWeekday' })}
                            maxWidth={500}
                        >
                            <Label className="!mb-0">On the last weekday of every month</Label>
                        </RadioRow>
                        <RadioRow
                            checked={state.monthlyMode === 'daysBeforeEnd'}
                            onSelect={() => update({ monthlyMode: 'daysBeforeEnd' })}
                            maxWidth={500}
                        >
                            <NumberInput
                                value={state.daysBeforeEnd}
                                onChange={(v) => update({ monthlyMode: 'daysBeforeEnd', daysBeforeEnd: v })}
                                min={1}
                                max={30}
                            />
                            <Label className="!mb-0 whitespace-nowrap">day(s) before the end of the month</Label>
                        </RadioRow>
                        <RadioRow
                            checked={state.monthlyMode === 'everyN'}
                            onSelect={() => update({ monthlyMode: 'everyN' })}
                            maxWidth={500}
                        >
                            <NumberInput
                                value={state.monthlyEveryN}
                                onChange={(v) => update({ monthlyMode: 'everyN', monthlyEveryN: v })}
                                min={1}
                                max={31}
                            />
                            <Label className="!mb-0 whitespace-nowrap">day(s) of every month</Label>
                        </RadioRow>
                        <StartTimePicker
                            atHour={state.atHour}
                            atMinute={state.atMinute}
                            onHourChange={(v) => update({ atHour: v })}
                            onMinuteChange={(v) => update({ atMinute: v })}
                        />
                    </Container>
                ),
            },
            {
                title: 'Custom',
                content: (
                    <div className="flex items-center justify-center gap-2 min-h-16">
                        <Label className="!mb-0 whitespace-nowrap text-[var(--dark-gray-color)]">Expression</Label>
                        <div>
                            <TextInput
                                id="cron-custom"
                                value={state.customExpression}
                                onChange={(v) => update({ customExpression: v })}
                                placeholder="0 0 12 * * ?"
                                className="w-auto"
                            />
                        </div>
                    </div>
                ),
            },
        ],
        [state, update],
    );

    return (
        <div className="space-y-4">
            <TabLayout tabs={tabs} selectedTab={TABS.findIndex((t) => t.id === state.tab)} onTabChange={handleTabChange} noBorder />
            <div className="flex items-center gap-2 px-1">
                <code className="flex-1 text-sm font-mono bg-gray-100 dark:bg-neutral-800 text-[var(--dark-gray-color)] dark:text-neutral-300 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700">
                    {description && <p className="text-sm text-gray-500 px-1 text-inherit">{description}</p>}
                </code>
            </div>
            <div className="flex items-center gap-2 px-1">
                <code className="flex-1 text-sm font-mono bg-gray-100 dark:bg-neutral-800 text-[var(--dark-gray-color)] dark:text-neutral-300 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700">
                    {currentCron || '—'}
                </code>
            </div>
        </div>
    );
}
