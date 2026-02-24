import { test, expect } from '../../../../../playwright/ct-test';
import DonutChartWithStore from './DonutChartWithStore';
import { EntityType } from 'ducks/filters';
import { CertificateState } from 'types/openapi';

test.describe('DonutChart', () => {
    test('should render title and chart with data', async ({ mount }) => {
        const component = await mount(
            <DonutChartWithStore
                title="Certificates by status"
                data={{ [CertificateState.Issued]: 10, [CertificateState.Revoked]: 2 }}
                entity={EntityType.CERTIFICATE}
                redirect="/certificates"
                onSetFilter={() => []}
            />,
        );
        await expect(component.getByRole('heading', { name: 'Certificates by status' })).toBeVisible();
        await expect(component.getByText('Issued')).toBeVisible();
        await expect(component.getByText('Revoked')).toBeVisible();
    });

    test('should render with empty data', async ({ mount }) => {
        const component = await mount(
            <DonutChartWithStore title="Empty chart" data={{}} entity={EntityType.CERTIFICATE} redirect="/" onSetFilter={() => []} />,
        );
        await expect(component.getByRole('heading', { name: 'Empty chart' })).toBeVisible();
    });
});
