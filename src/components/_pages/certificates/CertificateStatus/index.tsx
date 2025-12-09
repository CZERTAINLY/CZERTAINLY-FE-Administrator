import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateSubjectType,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
} from 'types/openapi';
import { getCertificateStatusColor, useGetStatusText } from 'utils/certificate';
import { capitalize } from 'utils/common-utils';
import Badge from 'components/Badge';

interface Props {
    status:
        | CertificateState
        | CertificateValidationStatus
        | CertificateEventHistoryDtoStatusEnum
        | ComplianceStatus
        | ComplianceRuleStatus
        | CertificateSubjectType;
    asIcon?: boolean;
    badgeSize?: 'small' | 'medium' | 'large';
}

function CertificateStatus({ status, badgeSize = 'small', asIcon = false }: Props) {
    const getStatusText = useGetStatusText();

    const color = getCertificateStatusColor(status);
    const text = getStatusText(status);

    return asIcon ? (
        <span title={capitalize(text)} className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
    ) : (
        <Badge size={badgeSize} style={{ backgroundColor: color }}>
            {capitalize(text)}
        </Badge>
    );
}

export default CertificateStatus;
