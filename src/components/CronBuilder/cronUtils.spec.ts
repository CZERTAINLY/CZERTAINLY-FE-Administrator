import { describe, it, expect } from 'vitest';
import { parseCron, buildCron, DEFAULT_STATE } from './cronUtils';
import type { CronState } from './cronUtils';

describe('parseCron', () => {
    it('returns default state for empty string', () => {
        expect(parseCron('')).toEqual(DEFAULT_STATE);
    });

    it('returns default state for whitespace-only string', () => {
        expect(parseCron('   ')).toEqual(DEFAULT_STATE);
    });

    it('returns custom tab for expression with fewer than 6 parts', () => {
        const result = parseCron('0 0 12');
        expect(result.tab).toBe('custom');
        expect(result.customExpression).toBe('0 0 12');
    });

    it('parses every-N-minutes expression', () => {
        const result = parseCron('0 */5 * * * ?');
        expect(result.tab).toBe('minutes');
        expect(result.everyMinutes).toBe(5);
    });

    it('parses every-N-minutes with * dom', () => {
        const result = parseCron('0 */10 * * * ?');
        expect(result.tab).toBe('minutes');
        expect(result.everyMinutes).toBe(10);
    });

    it('parses hourly everyN expression', () => {
        const result = parseCron('0 00 */2 * * ?');
        expect(result.tab).toBe('hourly');
        expect(result.hourlyMode).toBe('everyN');
        expect(result.everyHours).toBe(2);
        expect(result.atMinute).toBe(0);
    });

    it('parses hourly everyN with non-zero minutes', () => {
        const result = parseCron('0 30 */3 * * ?');
        expect(result.tab).toBe('hourly');
        expect(result.hourlyMode).toBe('everyN');
        expect(result.everyHours).toBe(3);
        expect(result.atMinute).toBe(30);
    });

    it('parses old react-cron-generator hourly atTime format (1/1 DOM)', () => {
        const result = parseCron('0 06 15 1/1 * ? *');
        expect(result.tab).toBe('hourly');
        expect(result.hourlyMode).toBe('atTime');
        expect(result.atMinute).toBe(6);
        expect(result.atHour).toBe(15);
    });

    it('parses old react-cron-generator hourly atTime format without trailing *', () => {
        const result = parseCron('0 06 15 1/1 * ?');
        expect(result.tab).toBe('hourly');
        expect(result.hourlyMode).toBe('atTime');
    });

    it('parses daily everyN expression (0 M H * * ?)', () => {
        const result = parseCron('0 00 12 * * ?');
        expect(result.tab).toBe('daily');
        expect(result.dailyMode).toBe('everyN');
        expect(result.everyDays).toBe(1);
        expect(result.atHour).toBe(12);
        expect(result.atMinute).toBe(0);
    });

    it('parses daily weekdays expression', () => {
        const result = parseCron('0 00 08 ? * MON-FRI');
        expect(result.tab).toBe('daily');
        expect(result.dailyMode).toBe('weekdays');
        expect(result.atHour).toBe(8);
    });

    it('parses weekly expression', () => {
        const result = parseCron('0 00 09 ? * MON,WED');
        expect(result.tab).toBe('weekly');
        expect(result.weekDays).toEqual(['MON', 'WED']);
        expect(result.atHour).toBe(9);
    });

    it('parses weekly single-day expression', () => {
        const result = parseCron('0 00 09 ? * FRI');
        expect(result.tab).toBe('weekly');
        expect(result.weekDays).toEqual(['FRI']);
    });

    it('falls back to MON for weekly expression with unknown days', () => {
        const result = parseCron('0 00 09 ? * XYZ');
        expect(result.tab).toBe('weekly');
        expect(result.weekDays).toEqual(['MON']);
    });

    it('parses monthly specific day expression', () => {
        const result = parseCron('0 00 12 15 * ?');
        expect(result.tab).toBe('monthly');
        expect(result.monthlyMode).toBe('dayN');
        expect(result.monthDay).toBe(15);
    });

    it('parses monthly last day expression', () => {
        const result = parseCron('0 00 12 L * ?');
        expect(result.tab).toBe('monthly');
        expect(result.monthlyMode).toBe('lastDay');
    });

    it('parses monthly last weekday expression', () => {
        const result = parseCron('0 00 12 LW * ?');
        expect(result.tab).toBe('monthly');
        expect(result.monthlyMode).toBe('lastWeekday');
    });

    it('parses monthly days-before-end expression', () => {
        const result = parseCron('0 00 12 L-3 * ?');
        expect(result.tab).toBe('monthly');
        expect(result.monthlyMode).toBe('daysBeforeEnd');
        expect(result.daysBeforeEnd).toBe(3);
    });

    it('parses monthly every-N-days expression', () => {
        const result = parseCron('0 00 12 1/5 * ?');
        expect(result.tab).toBe('monthly');
        expect(result.monthlyMode).toBe('everyN');
        expect(result.monthlyEveryN).toBe(5);
    });

    it('returns custom tab for unrecognized expression', () => {
        const result = parseCron('0 0 12 1,15 * ?');
        expect(result.tab).toBe('custom');
        expect(result.customExpression).toBe('0 0 12 1,15 * ?');
    });

    it('zero-pads atMinute and atHour correctly', () => {
        const result = parseCron('0 06 09 * * ?');
        expect(result.atMinute).toBe(6);
        expect(result.atHour).toBe(9);
    });
});

describe('buildCron', () => {
    const base: CronState = { ...DEFAULT_STATE };

    it('builds minutes expression', () => {
        expect(buildCron({ ...base, tab: 'minutes', everyMinutes: 5 })).toBe('0 */5 * * * ?');
    });

    it('builds minutes expression with different interval', () => {
        expect(buildCron({ ...base, tab: 'minutes', everyMinutes: 15 })).toBe('0 */15 * * * ?');
    });

    it('builds hourly everyN expression', () => {
        expect(buildCron({ ...base, tab: 'hourly', hourlyMode: 'everyN', everyHours: 2, atMinute: 0 })).toBe('0 00 */2 * * ?');
    });

    it('builds hourly atTime expression with zero-padding', () => {
        expect(buildCron({ ...base, tab: 'hourly', hourlyMode: 'atTime', atHour: 9, atMinute: 6 })).toBe('0 06 09 * * ?');
    });

    it('builds hourly atTime expression with double-digit values', () => {
        expect(buildCron({ ...base, tab: 'hourly', hourlyMode: 'atTime', atHour: 15, atMinute: 30 })).toBe('0 30 15 * * ?');
    });

    it('builds daily everyN=1 expression', () => {
        expect(buildCron({ ...base, tab: 'daily', dailyMode: 'everyN', everyDays: 1, atHour: 12, atMinute: 0 })).toBe('0 00 12 * * ?');
    });

    it('builds daily everyN>1 expression', () => {
        expect(buildCron({ ...base, tab: 'daily', dailyMode: 'everyN', everyDays: 3, atHour: 8, atMinute: 0 })).toBe('0 00 08 */3 * ?');
    });

    it('builds daily weekdays expression', () => {
        expect(buildCron({ ...base, tab: 'daily', dailyMode: 'weekdays', atHour: 8, atMinute: 0 })).toBe('0 00 08 ? * MON-FRI');
    });

    it('builds weekly expression', () => {
        expect(buildCron({ ...base, tab: 'weekly', weekDays: ['MON', 'WED'], atHour: 9, atMinute: 0 })).toBe('0 00 09 ? * MON,WED');
    });

    it('builds weekly expression falling back to MON when weekDays is empty', () => {
        expect(buildCron({ ...base, tab: 'weekly', weekDays: [], atHour: 9, atMinute: 0 })).toBe('0 00 09 ? * MON');
    });

    it('builds monthly dayN expression', () => {
        expect(buildCron({ ...base, tab: 'monthly', monthlyMode: 'dayN', monthDay: 15, atHour: 12, atMinute: 0 })).toBe('0 00 12 15 * ?');
    });

    it('builds monthly lastDay expression', () => {
        expect(buildCron({ ...base, tab: 'monthly', monthlyMode: 'lastDay', atHour: 12, atMinute: 0 })).toBe('0 00 12 L * ?');
    });

    it('builds monthly lastWeekday expression', () => {
        expect(buildCron({ ...base, tab: 'monthly', monthlyMode: 'lastWeekday', atHour: 12, atMinute: 0 })).toBe('0 00 12 LW * ?');
    });

    it('builds monthly daysBeforeEnd expression', () => {
        expect(buildCron({ ...base, tab: 'monthly', monthlyMode: 'daysBeforeEnd', daysBeforeEnd: 3, atHour: 12, atMinute: 0 })).toBe(
            '0 00 12 L-3 * ?',
        );
    });

    it('builds monthly everyN expression', () => {
        expect(buildCron({ ...base, tab: 'monthly', monthlyMode: 'everyN', monthlyEveryN: 5, atHour: 12, atMinute: 0 })).toBe(
            '0 00 12 1/5 * ?',
        );
    });

    it('returns custom expression as-is', () => {
        expect(buildCron({ ...base, tab: 'custom', customExpression: '0 0 12 1,15 * ?' })).toBe('0 0 12 1,15 * ?');
    });

    it('round-trips: parseCron then buildCron yields same expression', () => {
        const expressions = [
            '0 */5 * * * ?',
            '0 00 */2 * * ?',
            '0 00 12 * * ?',
            '0 00 08 ? * MON-FRI',
            '0 00 09 ? * MON,WED',
            '0 00 12 15 * ?',
            '0 00 12 L * ?',
            '0 00 12 LW * ?',
            '0 00 12 L-3 * ?',
            '0 00 12 1/5 * ?',
        ];
        for (const expr of expressions) {
            expect(buildCron(parseCron(expr))).toBe(expr);
        }
    });
});
