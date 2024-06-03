import { Badge } from 'reactstrap';
import { DiscoveryStatus } from 'types/openapi';

interface Props {
    status: DiscoveryStatus | undefined;
}

export default function DiscoveryStatusBadge({ status }: Props) {
    const statusMap: { [key in DiscoveryStatus]: { color: string; text: string } } = {
        [DiscoveryStatus.Completed]: { color: 'success', text: 'Completed' },
        [DiscoveryStatus.Failed]: { color: 'danger', text: 'Failed' },
        [DiscoveryStatus.InProgress]: { color: 'secondary', text: 'In Progress' },
        [DiscoveryStatus.Processing]: { color: 'info', text: 'Processing' },
        [DiscoveryStatus.Warning]: { color: 'warning', text: 'Warning' },
    };

    const _default = { color: 'secondary', text: 'Unknown' };

    const { color, text } = status ? statusMap[status] || _default : _default;

    return <Badge color={color}>{text}</Badge>;
}
