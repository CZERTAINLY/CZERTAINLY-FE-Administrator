export function inventoryStatus(status: String) {
    switch (status) {
        case 'Success':
            return ['Success', 'success'];

        case 'registered':
            return ['Reistered', 'success'];

        case 'connected':
            return ['Connected', 'success'];

        case 'failed':
            return ['Failed', 'danger'];

        case 'Failed':
            return ['Failed', 'danger'];

        case 'offline':
            return ['Offline', 'danger'];

        case 'waitingForApproval':
            return ['Waiting for Approval', 'warning'];

        default:
            return [status || 'Unknown', 'dark'];
    }
}
