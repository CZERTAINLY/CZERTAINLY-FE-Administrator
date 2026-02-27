import { ProxyStatus } from 'types/openapi';

// Status filter options for the proxy list
export const PROXY_STATUS_OPTIONS = [
    { value: ProxyStatus.Initialized, label: 'Initialized' },
    { value: ProxyStatus.Provisioning, label: 'Provisioning' },
    { value: ProxyStatus.Failed, label: 'Failed' },
    { value: ProxyStatus.WaitingForInstallation, label: 'Waiting For Installation' },
    { value: ProxyStatus.Connected, label: 'Connected' },
    { value: ProxyStatus.Disconnected, label: 'Disconnected' },
];

/**
 * Maps proxy status to CSS color variable
 * @param status The proxy status
 * @returns CSS color variable string
 */
export function getProxyStatusColor(status: ProxyStatus): string {
    switch (status) {
        case ProxyStatus.Connected:
            return 'var(--status-success-color)';
        case ProxyStatus.Disconnected:
            return 'var(--status-dark-color)';
        case ProxyStatus.Failed:
            return 'var(--status-danger-color)';
        case ProxyStatus.WaitingForInstallation:
            return 'var(--status-warning-color)';
        case ProxyStatus.Provisioning:
            return 'var(--status-gray-color)';
        case ProxyStatus.Initialized:
        default:
            return 'var(--status-gray-color)';
    }
}

/**
 * Formats proxy status for display.
 * Converts camelCase status to Title Case (e.g., "waitingForInstallation" -> "Waiting for installation")
 * @param status The proxy status
 * @returns Formatted status label
 */
export function formatProxyStatus(status: ProxyStatus): string {
    const spaced = status
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
