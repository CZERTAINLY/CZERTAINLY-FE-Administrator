import { test, expect } from '../../../playwright/ct-test';
import JsonViewer from './index';

test.describe('JsonViewer', () => {
    test('highlights key and primitive value types with configured colors', async ({ mount }) => {
        const component = await mount(
            <div>
                <JsonViewer value={JSON.stringify({ name: 'Alice', age: 5, active: true, extra: null })} />
            </div>,
        );

        const highlightedHtml = await component.locator('code').innerHTML();
        expect(highlightedHtml).toContain('color:#7AA2F7');
        expect(highlightedHtml).toContain('color:#9ECE6A');
        expect(highlightedHtml).toContain('color:#F7768E');
        expect(highlightedHtml).toContain('color:#BB9AF7');
        expect(highlightedHtml).toContain('color:#E0AF68');
    });

    test('shows original input when value is not valid json', async ({ mount }) => {
        const component = await mount(
            <div>
                <JsonViewer value="{not-valid-json}" />
            </div>,
        );

        await expect(component.locator('pre')).toContainText('{not-valid-json}');
    });

    test('applies custom sizing props', async ({ mount }) => {
        const component = await mount(
            <div>
                <JsonViewer value="{}" height={278} paddingTop={44} />
            </div>,
        );

        await expect(component.locator('pre')).toHaveCSS('height', '278px');
        await expect(component.locator('pre')).toHaveCSS('padding-top', '44px');
    });
});
