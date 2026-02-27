import Badge from 'components/Badge';
import { ProxyStatus } from 'types/openapi';
import { getProxyStatusColor, formatProxyStatus } from 'utils/proxy';

interface ProxyStatusBadgeProps {
    status: ProxyStatus;
}

/**
 * Badge component for displaying proxy status
 * Maps status to appropriate color and formatted label
 */
export default function ProxyStatusBadge({ status }: ProxyStatusBadgeProps) {
    const statusColor = getProxyStatusColor(status);
    const statusLabel = formatProxyStatus(status);

    return <Badge style={{ backgroundColor: statusColor }}>{statusLabel}</Badge>;
}
