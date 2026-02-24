import { test, expect } from '../../../../../playwright/ct-test';
import CustomAttributeAddSelect from './index';
import { AttributeType } from 'types/openapi';

function customDescriptor(uuid: string, label: string) {
    return {
        type: AttributeType.Custom,
        uuid,
        name: uuid,
        properties: { label, required: false, readOnly: false, visible: true, list: false },
        content: [],
        contentType: 'String',
    } as any;
}

test.describe('CustomAttributeAddSelect', () => {
    test('renders nothing when attributeDescriptors is undefined', async ({ mount }) => {
        const component = await mount(<CustomAttributeAddSelect attributeDescriptors={undefined} onAdd={() => {}} />);
        await expect(component.locator('#selectAddCustomAttribute')).toHaveCount(0);
    });

    test('renders nothing when attributeDescriptors is empty', async ({ mount }) => {
        const component = await mount(<CustomAttributeAddSelect attributeDescriptors={[]} onAdd={() => {}} />);
        await expect(component.locator('#selectAddCustomAttribute')).toHaveCount(0);
    });

    test('renders Select and placeholder when custom descriptors provided', async ({ mount }) => {
        const descriptors = [customDescriptor('u1', 'Attr One'), customDescriptor('u2', 'Attr Two')];
        const component = await mount(<CustomAttributeAddSelect attributeDescriptors={descriptors} onAdd={() => {}} />);
        await expect(component.locator('#selectAddCustomAttribute')).toBeAttached();
        await expect(component.getByPlaceholder('Show...')).toBeVisible();
    });

    test('renders Label with title "Show custom attribute"', async ({ mount }) => {
        const descriptors = [customDescriptor('u1', 'Attr One')];
        const component = await mount(<CustomAttributeAddSelect attributeDescriptors={descriptors} onAdd={() => {}} />);
        await expect(component.getByText('Show custom attribute')).toBeVisible();
    });

    test('calls onAdd when user selects one option', async ({ mount }) => {
        const descriptors = [customDescriptor('uuid-a', 'First Attr'), customDescriptor('uuid-b', 'Second Attr')];
        const added: unknown[] = [];
        const component = await mount(<CustomAttributeAddSelect attributeDescriptors={descriptors} onAdd={(attr) => added.push(attr)} />);
        const select = component.locator('select#selectAddCustomAttribute');
        await select.evaluate((el: HTMLSelectElement) => {
            const opt = Array.from(el.options).find((o) => o.value === 'uuid-a');
            if (opt) opt.selected = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(added).toHaveLength(1);
        expect((added[0] as { uuid: string; properties: { label: string } }).uuid).toBe('uuid-a');
        expect((added[0] as { uuid: string; properties: { label: string } }).properties.label).toBe('First Attr');
    });

    test('calls onAdd only for newly added options when selection grows', async ({ mount }) => {
        const descriptors = [customDescriptor('id-1', 'One'), customDescriptor('id-2', 'Two')];
        const added: unknown[] = [];
        const component = await mount(<CustomAttributeAddSelect attributeDescriptors={descriptors} onAdd={(attr) => added.push(attr)} />);
        const select = component.locator('select#selectAddCustomAttribute');
        // Select first option
        await select.evaluate((el: HTMLSelectElement) => {
            const o1 = Array.from(el.options).find((o) => o.value === 'id-1');
            if (o1) o1.selected = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(added).toHaveLength(1);
        // Add second option (both selected)
        await select.evaluate((el: HTMLSelectElement) => {
            const o2 = Array.from(el.options).find((o) => o.value === 'id-2');
            if (o2) o2.selected = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(added).toHaveLength(2);
        expect((added[1] as { uuid: string }).uuid).toBe('id-2');
    });

    test('handles onChange with empty values (clear)', async ({ mount }) => {
        const descriptors = [customDescriptor('x', 'Only')];
        const added: unknown[] = [];
        const component = await mount(<CustomAttributeAddSelect attributeDescriptors={descriptors} onAdd={(attr) => added.push(attr)} />);
        const select = component.locator('select#selectAddCustomAttribute');
        await select.evaluate((el: HTMLSelectElement) => {
            Array.from(el.options).forEach((o) => {
                o.selected = false;
            });
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        expect(added).toHaveLength(0);
    });
});
