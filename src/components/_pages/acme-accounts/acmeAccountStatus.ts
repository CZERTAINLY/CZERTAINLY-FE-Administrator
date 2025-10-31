import { BadgeColor } from 'components/Badge';

export function acmeAccountStatus(status: string): [string, BadgeColor] {
    switch (status) {
        case 'valid':
            return ['Valid', 'success'];

        case 'deactivated':
            return ['Deactivated', 'danger'];

        case 'revoked':
            return ['Revoked', 'gray'];

        default:
            return [status || 'Unknown', 'gray'];
    }
}
