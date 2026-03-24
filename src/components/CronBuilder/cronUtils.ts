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

export function parseCron(cron: string): CronState {
    if (!cron?.trim()) return stateFrom({});
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 6) return stateFrom({ tab: 'custom', customExpression: cron });

    const [s, rawM, rawH, dom, month, dow] = parts;
    const atMinute = isNaN(parseInt(rawM, 10)) ? 0 : parseInt(rawM, 10);
    const atHour = isNaN(parseInt(rawH, 10)) ? 0 : parseInt(rawH, 10);

    // Every N minutes: 0 */N * * * ?
    if (s === '0' && rawM.startsWith('*/') && rawH === '*' && (dom === '*' || dom === '?') && month === '*') {
        const n = parseInt(rawM.slice(2), 10);
        return stateFrom({ tab: 'minutes', everyMinutes: isNaN(n) ? 5 : n });
    }

    // Hourly everyN: 0 M */N * * ?
    if (s === '0' && !rawM.startsWith('*/') && rawH.startsWith('*/') && (dom === '*' || dom === '?') && month === '*') {
        const n = parseInt(rawH.slice(2), 10);
        return stateFrom({ tab: 'hourly', hourlyMode: 'everyN', everyHours: isNaN(n) ? 1 : n, atMinute });
    }

    // Hourly atTime (old react-cron-generator format): 0 M H 1/1 * ? [*]
    if (s === '0' && !rawM.startsWith('*/') && !rawH.startsWith('*/') && dom === '1/1' && month === '*' && (dow === '?' || dow === '*')) {
        return stateFrom({ tab: 'hourly', hourlyMode: 'atTime', atMinute, atHour });
    }

    // Daily weekdays: 0 M H ? * MON-FRI
    if (s === '0' && dom === '?' && month === '*' && dow === 'MON-FRI') {
        return stateFrom({ tab: 'daily', dailyMode: 'weekdays', atMinute, atHour });
    }

    // Weekly: 0 M H ? * DOW (with specific days)
    if (s === '0' && dom === '?' && month === '*' && dow !== '*' && dow !== '?' && dow !== 'MON-FRI') {
        const days = dow.split(',').filter((d) => DAYS_OF_WEEK.some((dw) => dw.value === d));
        return stateFrom({ tab: 'weekly', atMinute, atHour, weekDays: days.length > 0 ? days : ['MON'] });
    }

    // Monthly last day: 0 M H L * ?
    if (s === '0' && dom === 'L' && month === '*' && (dow === '?' || dow === '*')) {
        return stateFrom({ tab: 'monthly', monthlyMode: 'lastDay', atMinute, atHour });
    }

    // Monthly last weekday: 0 M H LW * ?
    if (s === '0' && dom === 'LW' && month === '*' && (dow === '?' || dow === '*')) {
        return stateFrom({ tab: 'monthly', monthlyMode: 'lastWeekday', atMinute, atHour });
    }

    // Monthly L-N days before end: 0 M H L-N * ?
    if (s === '0' && dom.startsWith('L-') && month === '*' && (dow === '?' || dow === '*')) {
        const n = parseInt(dom.slice(2), 10);
        return stateFrom({ tab: 'monthly', monthlyMode: 'daysBeforeEnd', atMinute, atHour, daysBeforeEnd: isNaN(n) ? 1 : n });
    }

    // Monthly every N days: 0 M H 1/N * ? (N > 1, use 1/ prefix to distinguish from daily */N)
    if (s === '0' && /^\d+\/\d+$/.test(dom) && !dom.startsWith('0/') && month === '*' && (dow === '?' || dow === '*')) {
        const [start, step] = dom.split('/').map(Number);
        if (start >= 1 && step > 1) {
            return stateFrom({ tab: 'monthly', monthlyMode: 'everyN', atMinute, atHour, monthlyEveryN: step });
        }
        // 1/1 or similar → daily everyN=1
        return stateFrom({ tab: 'daily', dailyMode: 'everyN', everyDays: step || 1, atMinute, atHour });
    }

    // Daily every N days: 0 M H */N * ? or 0 M H * * ?
    if (s === '0' && (dom === '*' || dom.startsWith('*/')) && month === '*' && (dow === '?' || dow === '*')) {
        const n = dom === '*' ? 1 : parseInt(dom.slice(2), 10);
        return stateFrom({ tab: 'daily', dailyMode: 'everyN', everyDays: isNaN(n) ? 1 : n, atMinute, atHour });
    }

    // Monthly specific day: 0 M H N * ?
    if (s === '0' && /^\d+$/.test(dom) && month === '*' && (dow === '?' || dow === '*')) {
        const day = parseInt(dom, 10);
        return stateFrom({ tab: 'monthly', monthlyMode: 'dayN', atMinute, atHour, monthDay: isNaN(day) ? 1 : day });
    }

    return stateFrom({ tab: 'custom', customExpression: cron });
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
