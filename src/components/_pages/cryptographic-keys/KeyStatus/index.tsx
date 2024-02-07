import { Badge } from 'reactstrap';
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

    return asIcon ? <i title={text} className={`fa fa-circle text-${color}`} /> : <Badge color={color}>{text}</Badge>;
}

export default KeyStatus;
