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
});
