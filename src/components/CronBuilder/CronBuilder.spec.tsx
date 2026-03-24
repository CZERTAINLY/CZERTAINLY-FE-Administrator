import { test, expect } from '../../../playwright/ct-test';
import CronBuilder from './index';
import { withProviders } from 'utils/test-helpers';

const cron = (value: string, onChange: (v: string) => void = () => {}) => withProviders(<CronBuilder value={value} onChange={onChange} />);

test.describe('CronBuilder', () => {
    test('should display cron expression at the bottom', async ({ mount }) => {
        const component = await mount(cron('0 */5 * * * ?'));
        await expect(component.locator('code').last()).toContainText('0 */5 * * * ?');
    });

    test('should select Minutes tab when given minutes expression', async ({ mount }) => {
        const component = await mount(cron('0 */10 * * * ?'));
        await expect(component.getByRole('tab', { name: 'Minutes' })).toHaveClass(/\bactive\b/);
    });

    test('should select Hourly tab when given hourly everyN expression', async ({ mount }) => {
        const component = await mount(cron('0 00 */2 * * ?'));
        await expect(component.getByRole('tab', { name: 'Hourly' })).toHaveClass(/\bactive\b/);
    });

    test('should select Daily tab when given daily expression', async ({ mount }) => {
        const component = await mount(cron('0 00 12 * * ?'));
        await expect(component.getByRole('tab', { name: 'Daily' })).toHaveClass(/\bactive\b/);
    });

    test('should select Daily tab for weekdays expression', async ({ mount }) => {
        const component = await mount(cron('0 00 08 ? * MON-FRI'));
        await expect(component.getByRole('tab', { name: 'Daily' })).toHaveClass(/\bactive\b/);
    });

    test('should select Weekly tab when given weekly expression', async ({ mount }) => {
        const component = await mount(cron('0 00 09 ? * MON,WED'));
        await expect(component.getByRole('tab', { name: 'Weekly' })).toHaveClass(/\bactive\b/);
    });

    test('should select Monthly tab for specific day expression', async ({ mount }) => {
        const component = await mount(cron('0 00 12 15 * ?'));
        await expect(component.getByRole('tab', { name: 'Monthly' })).toHaveClass(/\bactive\b/);
    });

    test('should select Monthly tab for last day expression', async ({ mount }) => {
        const component = await mount(cron('0 00 12 L * ?'));
        await expect(component.getByRole('tab', { name: 'Monthly' })).toHaveClass(/\bactive\b/);
    });

    test('should select Monthly tab for last weekday expression', async ({ mount }) => {
        const component = await mount(cron('0 00 12 LW * ?'));
        await expect(component.getByRole('tab', { name: 'Monthly' })).toHaveClass(/\bactive\b/);
    });

    test('should select Monthly tab for days-before-end expression', async ({ mount }) => {
        const component = await mount(cron('0 00 12 L-3 * ?'));
        await expect(component.getByRole('tab', { name: 'Monthly' })).toHaveClass(/\bactive\b/);
    });

    test('should select Monthly tab for every-N-days expression', async ({ mount }) => {
        const component = await mount(cron('0 00 12 1/5 * ?'));
        await expect(component.getByRole('tab', { name: 'Monthly' })).toHaveClass(/\bactive\b/);
    });

    test('should select Custom tab for unrecognized expression', async ({ mount }) => {
        const component = await mount(cron('0 0 12 1,15 * ?'));
        await expect(component.getByRole('tab', { name: 'Custom' })).toHaveClass(/\bactive\b/);
    });

    test('should select Custom tab for expression with fewer than 6 parts', async ({ mount }) => {
        const component = await mount(cron('0 0 12'));
        await expect(component.getByRole('tab', { name: 'Custom' })).toHaveClass(/\bactive\b/);
    });

    test('should parse old react-cron-generator hourly atTime format (1/1 DOM)', async ({ mount }) => {
        const component = await mount(cron('0 06 15 1/1 * ? *'));
        await expect(component.getByRole('tab', { name: 'Hourly' })).toHaveClass(/\bactive\b/);
    });

    test('should display zero-padded minutes and hours in cron expression', async ({ mount }) => {
        const component = await mount(cron('0 06 09 * * ?'));
        await expect(component.locator('code').last()).toContainText('0 06 09 * * ?');
    });

    const tabSwitchCases: [string, RegExp][] = [
        ['Minutes', /^0 \*\/\d+ \* \* \* \?$/],
        ['Hourly', /^0 \d+ \*\/\d+ \* \* \?$/],
        ['Weekly', /^0 \d+ \d+ \? \* \w+$/],
        ['Monthly', /^0 \d+ \d+ \d+ \* \?$/],
    ];

    for (const [tab, pattern] of tabSwitchCases) {
        test(`should switch to ${tab} tab and emit cron`, async ({ mount }) => {
            let emitted = '';
            const component = await mount(
                cron('0 00 12 * * ?', (v) => {
                    emitted = v;
                }),
            );
            await component.getByRole('tab', { name: tab }).click();
            await expect.poll(() => emitted, { timeout: 2000 }).toMatch(pattern);
        });
    }

    test('should switch to Custom tab and populate expression from current state', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Custom' }).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toBe('0 00 12 * * ?');
    });

    test('should emit correct cron after incrementing minutes interval', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 */5 * * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Increase').first().click();
        await expect.poll(() => emitted, { timeout: 2000 }).toBe('0 */6 * * * ?');
    });

    test('should display everyN hourly cron correctly', async ({ mount }) => {
        const component = await mount(cron('0 00 */3 * * ?'));
        await expect(component.getByRole('tab', { name: 'Hourly' })).toHaveClass(/\bactive\b/);
        await expect(component.locator('code').last()).toContainText('0 00 */3 * * ?');
    });

    test('should emit atTime cron when At row is selected', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 */3 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('radio').nth(1).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ \* \* \?$/);
    });

    test('should stay on Hourly tab after switching to atTime mode', async ({ mount }) => {
        const component = await mount(cron('0 00 */2 * * ?'));
        await component.getByRole('radio').nth(1).click();
        await expect(component.getByRole('tab', { name: 'Hourly' })).toHaveClass(/\bactive\b/);
    });

    test('should switch back to everyN mode in Hourly and emit correct cron', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 06 09 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Hourly' }).click();
        await component.getByRole('radio').nth(0).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \*\/\d+ \* \* \?$/);
    });

    test('should emit correct cron after changing everyHours in Hourly everyN mode', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 */2 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Increase').first().click();
        await expect.poll(() => emitted, { timeout: 2000 }).toBe('0 00 */3 * * ?');
    });

    test('should emit correct cron after changing atHour in Hourly atTime mode', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 06 09 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Hourly' }).click();
        await component.getByRole('radio').nth(1).click();
        emitted = '';
        // Hourly tab Increase buttons: nth(0)=everyHours, nth(1)=atMinute(everyN), nth(2)=atHour, nth(3)=atMinute(atTime)
        await component.getByLabel('Increase').nth(2).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 06 \d+ \* \* \?$/);
    });

    test('should emit weekdays cron when Every week day is selected', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 08 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Daily' }).click();
        await component.getByRole('radio').nth(1).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ \? \* MON-FRI$/);
    });

    test('should stay on Daily tab after selecting Every week day', async ({ mount }) => {
        const component = await mount(cron('0 00 08 * * ?'));
        await component.getByRole('tab', { name: 'Daily' }).click();
        await component.getByRole('radio').nth(1).click();
        await expect(component.getByRole('tab', { name: 'Daily' })).toHaveClass(/\bactive\b/);
    });

    test('should emit correct cron after switching Daily to everyN mode', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 08 ? * MON-FRI', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('radio').nth(0).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ \* \* \?$/);
    });

    test('should emit correct cron after incrementing daily everyN days', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 08 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Increase').first().click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ \*\/2 \* \?$/);
    });

    test('should emit correct cron after changing start time hour in Daily tab', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 * * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Increase').nth(1).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 00 13 \* \* \?$/);
    });

    test('should show weekday checkboxes on Weekly tab', async ({ mount }) => {
        const component = await mount(cron('0 00 09 ? * MON,WED'));
        await expect(component.getByText('Monday', { exact: true })).toBeVisible();
        await expect(component.getByText('Friday', { exact: true })).toBeVisible();
    });

    test('should emit correct cron when weekday is toggled', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 09 ? * MON', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Wednesday').click();
        await expect.poll(() => emitted, { timeout: 2000 }).toContain('MON,WED');
    });

    test('should keep last weekday when unchecking it', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 09 ? * MON', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Monday').click();
        await expect.poll(() => emitted, { timeout: 2000 }).toContain('MON');
    });

    test('should emit correct cron after changing start time hour in Weekly tab', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 09 ? * MON', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Increase').first().click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 00 10 \? \* MON$/);
    });

    test('should emit lastDay cron when Last day option is selected', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 1 * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Monthly' }).click();
        await component.getByRole('radio').nth(1).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ L \* \?$/);
    });

    test('should emit lastWeekday cron when Last weekday option is selected', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 1 * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Monthly' }).click();
        await component.getByRole('radio').nth(2).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ LW \* \?$/);
    });

    test('should stay on Monthly tab after selecting lastDay mode', async ({ mount }) => {
        const component = await mount(cron('0 00 12 1 * ?'));
        await component.getByRole('tab', { name: 'Monthly' }).click();
        await component.getByRole('radio').nth(1).click();
        await expect(component.getByRole('tab', { name: 'Monthly' })).toHaveClass(/\bactive\b/);
    });

    test('should emit daysBeforeEnd cron when that option is selected', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 1 * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Monthly' }).click();
        await component.getByRole('radio').nth(3).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ L-\d+ \* \?$/);
    });

    test('should emit everyN monthly cron when everyN option is selected', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 1 * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByRole('tab', { name: 'Monthly' }).click();
        await component.getByRole('radio').nth(4).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toMatch(/^0 \d+ \d+ 1\/\d+ \* \?$/);
    });

    test('should emit correct cron after incrementing monthDay in Monthly tab', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 1 * ?', (v) => {
                emitted = v;
            }),
        );
        await component.getByLabel('Increase').first().click();
        await expect.poll(() => emitted, { timeout: 2000 }).toBe('0 00 12 2 * ?');
    });

    test('should emit correct cron after incrementing daysBeforeEnd value', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 L-3 * ?', (v) => {
                emitted = v;
            }),
        );
        // Monthly tab Increase order: nth(0)=monthDay, nth(1)=daysBeforeEnd, nth(2)=monthlyEveryN, nth(3)=atHour, nth(4)=atMinute
        await component.getByLabel('Increase').nth(1).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toBe('0 00 12 L-4 * ?');
    });

    test('should emit correct cron after incrementing monthlyEveryN value', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 00 12 1/5 * ?', (v) => {
                emitted = v;
            }),
        );
        // Monthly tab Increase order: nth(0)=monthDay, nth(1)=daysBeforeEnd, nth(2)=monthlyEveryN, nth(3)=atHour, nth(4)=atMinute
        await component.getByLabel('Increase').nth(2).click();
        await expect.poll(() => emitted, { timeout: 2000 }).toBe('0 00 12 1/6 * ?');
    });

    test('should allow editing expression manually in Custom tab', async ({ mount }) => {
        let emitted = '';
        const component = await mount(
            cron('0 0 12 1,15 * ?', (v) => {
                emitted = v;
            }),
        );
        await expect(component.getByRole('tab', { name: 'Custom' })).toHaveClass(/\bactive\b/);
        const input = component.getByPlaceholder('0 0 12 * * ?');
        await input.focus();
        await input.fill('0 0 6 * * ?');
        await expect.poll(() => emitted, { timeout: 2000 }).toBe('0 0 6 * * ?');
    });

    test('should show human-readable description for valid expression', async ({ mount }) => {
        const component = await mount(cron('0 00 12 * * ?'));
        await expect(component.locator('code').first()).not.toBeEmpty();
    });

    test('should update displayed expression when value prop changes externally', async ({ mount }) => {
        const component = await mount(cron('0 00 12 * * ?'));
        await component.update(cron('0 */15 * * * ?'));
        await expect(component.locator('code').last()).toContainText('0 */15 * * * ?');
    });

    test('should not re-parse when value matches last emitted cron', async ({ mount }) => {
        const component = await mount(cron('0 00 */2 * * ?'));
        await expect(component.getByRole('tab', { name: 'Hourly' })).toHaveClass(/\bactive\b/);
        await component.update(cron('0 00 */2 * * ?'));
        await expect(component.getByRole('tab', { name: 'Hourly' })).toHaveClass(/\bactive\b/);
    });
});
