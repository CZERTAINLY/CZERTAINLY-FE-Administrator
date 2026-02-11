import { test, expect } from '../../../../../playwright/ct-test';
import ConnectorStatusWithStore from './ConnectorStatusWithStore';
import { ConnectorStatus } from 'types/openapi';

test.describe('ConnectorStatus (InventoryStatusBadge)', () => {
    test('should render Connected badge', async ({ mount }) => {
        const component = await mount(<ConnectorStatusWithStore status={ConnectorStatus.Connected} />);
        await expect(component.getByText('Connected')).toBeVisible();
    });

    test('should render Failed badge', async ({ mount }) => {
        const component = await mount(<ConnectorStatusWithStore status={ConnectorStatus.Failed} />);
        await expect(component.getByText('Failed')).toBeVisible();
    });

    test('should render Offline badge', async ({ mount }) => {
        const component = await mount(<ConnectorStatusWithStore status={ConnectorStatus.Offline} />);
        await expect(component.getByText('Offline')).toBeVisible();
    });

    test('should render Unknown when status is undefined', async ({ mount }) => {
        const component = await mount(<ConnectorStatusWithStore status={undefined} />);
        await expect(component.getByText('Unknown')).toBeVisible();
    });
});
