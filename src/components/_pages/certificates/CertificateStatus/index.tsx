import { Badge } from 'reactstrap';
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
} from 'types/openapi';
import { getCertificateStatusColor, useGetStatusText } from 'utils/certificate';
import { capitalize } from 'utils/common-utils';

interface Props {
    status: CertificateState | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus;
    asIcon?: boolean;
}

function CertificateStatus({ status, asIcon = false }: Props) {
    const getStatusText = useGetStatusText();

    const color = getCertificateStatusColor(status);
    const text = getStatusText(status);

    return asIcon ? (
        <i title={capitalize(text)} className={`fa fa-circle`} style={{ color: color }} />
    ) : (
        <Badge color={color} style={{ background: color }}>
            {capitalize(text)}
        </Badge>
    );
}

export default CertificateStatus;
