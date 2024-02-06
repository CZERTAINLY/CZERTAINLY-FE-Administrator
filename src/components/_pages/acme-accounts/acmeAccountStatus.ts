export function acmeAccountStatus(status: string) {
    switch (status) {
        case 'valid':
            return ['Valid', 'success'];

        case 'deactivated':
            return ['Deactivated', 'danger'];

        case 'revoked':
            return ['Revoked', 'dark'];

        default:
            return [status || 'Unknown', 'dark'];
    }
}
