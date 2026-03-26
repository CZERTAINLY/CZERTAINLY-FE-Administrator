export type TabType = 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
export type HourlyMode = 'everyN' | 'atTime';
export type DailyMode = 'everyN' | 'weekdays';
export type MonthlyMode = 'dayN' | 'lastDay' | 'lastWeekday' | 'daysBeforeEnd' | 'everyN';

export const DAYS_OF_WEEK = [
    { value: 'MON', label: 'Monday' },
    { value: 'TUE', label: 'Tuesday' },
    { value: 'WED', label: 'Wednesday' },
    { value: 'THU', label: 'Thursday' },
    { value: 'FRI', label: 'Friday' },
    { value: 'SAT', label: 'Saturday' },
    { value: 'SUN', label: 'Sunday' },
];

export const TABS: { id: TabType; label: string }[] = [
    { id: 'minutes', label: 'Minutes' },
    { id: 'hourly', label: 'Hourly' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'custom', label: 'Custom' },
];

export interface CronState {
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

export const DEFAULT_STATE: CronState = {
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

function stateFrom(partial: Partial<CronState>): CronState {
    return { ...DEFAULT_STATE, ...partial };
}

function parseIntSafe(s: string, fallback: number): number {
    const n = Number.parseInt(s, 10);
    return Number.isNaN(n) ? fallback : n;
}

function isWildcard(s: string): boolean {
    return s === '*' || s === '?';
}

function parseMinuteHour(rawM: string, rawH: string): { atMinute: number; atHour: number } {
    return { atMinute: parseIntSafe(rawM, 0), atHour: parseIntSafe(rawH, 0) };
}

function tryMinutes(s: string, rawM: string, rawH: string, dom: string, month: string): CronState | null {
    if (s !== '0' || !rawM.startsWith('*/') || rawH !== '*' || !isWildcard(dom) || month !== '*') return null;
    return stateFrom({ tab: 'minutes', everyMinutes: parseIntSafe(rawM.slice(2), 5) });
}

function tryHourlyEveryN(s: string, rawM: string, rawH: string, dom: string, month: string): CronState | null {
    if (s !== '0' || rawM.startsWith('*/') || !rawH.startsWith('*/') || !isWildcard(dom) || month !== '*') return null;
    return stateFrom({ tab: 'hourly', hourlyMode: 'everyN', everyHours: parseIntSafe(rawH.slice(2), 1), ...parseMinuteHour(rawM, rawH) });
}

function tryHourlyAtTime(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || rawM.startsWith('*/') || rawH.startsWith('*/') || dom !== '1/1' || month !== '*' || !isWildcard(dow)) return null;
    return stateFrom({ tab: 'hourly', hourlyMode: 'atTime', ...parseMinuteHour(rawM, rawH) });
}

function tryDailyWeekdays(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || dom !== '?' || month !== '*' || dow !== 'MON-FRI') return null;
    return stateFrom({ tab: 'daily', dailyMode: 'weekdays', ...parseMinuteHour(rawM, rawH) });
}

function tryWeekly(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || dom !== '?' || month !== '*' || dow === '*' || dow === '?' || dow === 'MON-FRI') return null;
    const days = dow.split(',').filter((d) => DAYS_OF_WEEK.some((dw) => dw.value === d));
    return stateFrom({ tab: 'weekly', ...parseMinuteHour(rawM, rawH), weekDays: days.length > 0 ? days : ['MON'] });
}

function tryMonthlyLastDay(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || dom !== 'L' || month !== '*' || !isWildcard(dow)) return null;
    return stateFrom({ tab: 'monthly', monthlyMode: 'lastDay', ...parseMinuteHour(rawM, rawH) });
}

function tryMonthlyLastWeekday(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || dom !== 'LW' || month !== '*' || !isWildcard(dow)) return null;
    return stateFrom({ tab: 'monthly', monthlyMode: 'lastWeekday', ...parseMinuteHour(rawM, rawH) });
}

function tryMonthlyDaysBeforeEnd(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || !dom.startsWith('L-') || month !== '*' || !isWildcard(dow)) return null;
    return stateFrom({
        tab: 'monthly',
        monthlyMode: 'daysBeforeEnd',
        ...parseMinuteHour(rawM, rawH),
        daysBeforeEnd: parseIntSafe(dom.slice(2), 1),
    });
}

function tryMonthlyEveryN(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || !/^\d+\/\d+$/.test(dom) || dom.startsWith('0/') || month !== '*' || !isWildcard(dow)) return null;
    const [start, step] = dom.split('/').map(Number);
    if (start >= 1 && step > 1) {
        return stateFrom({ tab: 'monthly', monthlyMode: 'everyN', ...parseMinuteHour(rawM, rawH), monthlyEveryN: step });
    }
    return stateFrom({ tab: 'daily', dailyMode: 'everyN', ...parseMinuteHour(rawM, rawH), everyDays: step || 1 });
}

function tryDailyEveryN(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || (dom !== '*' && !dom.startsWith('*/')) || month !== '*' || !isWildcard(dow)) return null;
    const n = dom === '*' ? 1 : parseIntSafe(dom.slice(2), 1);
    return stateFrom({ tab: 'daily', dailyMode: 'everyN', ...parseMinuteHour(rawM, rawH), everyDays: n });
}

function tryMonthlySpecificDay(s: string, rawM: string, rawH: string, dom: string, month: string, dow: string): CronState | null {
    if (s !== '0' || !/^\d+$/.test(dom) || month !== '*' || !isWildcard(dow)) return null;
    return stateFrom({ tab: 'monthly', monthlyMode: 'dayN', ...parseMinuteHour(rawM, rawH), monthDay: parseIntSafe(dom, 1) });
}

export function parseCron(cron: string): CronState {
    if (!cron?.trim()) return stateFrom({});
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 6) return stateFrom({ tab: 'custom', customExpression: cron });

    const [s, rawM, rawH, dom, month, dow] = parts;
    return (
        tryMinutes(s, rawM, rawH, dom, month) ??
        tryHourlyEveryN(s, rawM, rawH, dom, month) ??
        tryHourlyAtTime(s, rawM, rawH, dom, month, dow) ??
        tryDailyWeekdays(s, rawM, rawH, dom, month, dow) ??
        tryWeekly(s, rawM, rawH, dom, month, dow) ??
        tryMonthlyLastDay(s, rawM, rawH, dom, month, dow) ??
        tryMonthlyLastWeekday(s, rawM, rawH, dom, month, dow) ??
        tryMonthlyDaysBeforeEnd(s, rawM, rawH, dom, month, dow) ??
        tryMonthlyEveryN(s, rawM, rawH, dom, month, dow) ??
        tryDailyEveryN(s, rawM, rawH, dom, month, dow) ??
        tryMonthlySpecificDay(s, rawM, rawH, dom, month, dow) ??
        stateFrom({ tab: 'custom', customExpression: cron })
    );
}

export function buildCron(state: CronState): string {
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
