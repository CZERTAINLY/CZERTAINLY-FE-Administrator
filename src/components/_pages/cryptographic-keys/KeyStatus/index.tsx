import Badge from 'components/Badge';
import { Circle } from 'lucide-react';
import { CertificateEventHistoryDtoStatusEnum, KeyEventHistoryDtoStatusEnum } from 'types/openapi';

interface Props {
    status: KeyEventHistoryDtoStatusEnum | undefined;
    asIcon?: boolean;
}

function KeyStatus({ status, asIcon = false }: Props) {
    const statusMap: { [key in KeyEventHistoryDtoStatusEnum]: { color: string; text: string } } = {
        [CertificateEventHistoryDtoStatusEnum.Success]: { color: 'success', text: 'Success' },
        [CertificateEventHistoryDtoStatusEnum.Failed]: { color: 'danger', text: 'Failed' },
    };

    const _default = { color: 'secondary', text: 'Unknown' };

    const { color, text } = status ? statusMap[status] || _default : _default;

    return asIcon ? <Circle size={12} title={text} className={`text-${color}`} fill="currentColor" /> : <Badge color={color}>{text}</Badge>;
}

export default KeyStatus;
