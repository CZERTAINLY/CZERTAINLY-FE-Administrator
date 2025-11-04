export function inventoryStatus(status: string) {
    switch (status) {
        case 'Success':
            return ['Success', 'var(--status-success-color)'];

        case 'registered':
            return ['Reistered', 'var(--status-success-color)'];

        case 'connected':
            return ['Connected', 'var(--status-success-color)'];

        case 'failed':
            return ['Failed', 'var(--status-danger-color)'];

        case 'Failed':
            return ['Failed', 'var(--status-danger-color)'];

        case 'offline':
            return ['Offline', 'var(--status-danger-color)'];

        case 'waitingForApproval':
            return ['Waiting for Approval', 'var(--status-warning-color)'];

        default:
            return [status || 'Unknown', 'var(--status-gray-color)'];
    }
}
