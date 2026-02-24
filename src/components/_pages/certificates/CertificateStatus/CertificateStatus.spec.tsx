import { test, expect } from '../../../../../playwright/ct-test';
import CertificateStatusWithStore from './CertificateStatusWithStore';
import { CertificateState, CertificateValidationStatus } from 'types/openapi';

test.describe('CertificateStatus', () => {
    test('should render Issued badge', async ({ mount }) => {
        const component = await mount(<CertificateStatusWithStore status={CertificateState.Issued} />);
        await expect(component.getByText('Issued')).toBeVisible();
    });

    test('should render Revoked badge', async ({ mount }) => {
        const component = await mount(<CertificateStatusWithStore status={CertificateState.Revoked} />);
        await expect(component.getByText('Revoked')).toBeVisible();
    });

    test('should render validation status Valid', async ({ mount }) => {
        const component = await mount(<CertificateStatusWithStore status={CertificateValidationStatus.Valid} />);
        await expect(component.getByText('Valid')).toBeVisible();
    });

    test('should render as icon when asIcon is true', async ({ mount, page }) => {
        await mount(<CertificateStatusWithStore status={CertificateState.Issued} asIcon />);
        const icon = page.getByTitle('Issued');
        await expect(icon).toBeAttached();
        await expect(icon).toHaveAttribute('title', 'Issued');
    });

    test('should support badgeSize', async ({ mount }) => {
        const component = await mount(<CertificateStatusWithStore status={CertificateState.Issued} badgeSize="medium" />);
        await expect(component.getByText('Issued')).toBeVisible();
    });
});
