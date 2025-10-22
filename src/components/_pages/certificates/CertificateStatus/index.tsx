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

interface Props {
    status:
        | CertificateState
        | CertificateValidationStatus
        | CertificateEventHistoryDtoStatusEnum
        | ComplianceStatus
        | ComplianceRuleStatus
        | CertificateSubjectType;
    asIcon?: boolean;
}

function CertificateStatus({ status, asIcon = false }: Props) {
    const getStatusText = useGetStatusText();

    const color = getCertificateStatusColor(status);
    const text = getStatusText(status);

    return asIcon ? (
        <span title={capitalize(text)} className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
    ) : (
        <span
            style={{ backgroundColor: color }}
            className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-white"
        >
            {capitalize(text)}
        </span>
    );
}

export default CertificateStatus;
