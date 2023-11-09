import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Badge } from "reactstrap";
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
    PlatformEnum,
} from "types/openapi";
import { getCertificateStatusColor } from "utils/certificate";

interface Props {
    status: CertificateState | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus;
    asIcon?: boolean;
}

function CertificateStatus({ status, asIcon = false }: Props) {
    const certificateStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateState));
    const certificateValidationStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationStatus));
    const complianceStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceStatus));
    const complianceRuleStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceRuleStatus));

    const getStatusText = useCallback(
        (
            status:
                | CertificateState
                | CertificateValidationStatus
                | CertificateEventHistoryDtoStatusEnum
                | ComplianceStatus
                | ComplianceRuleStatus,
        ) => {
            switch (status) {
                case CertificateValidationStatus.Valid:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Valid);
                case CertificateValidationStatus.Invalid:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Invalid);
                case CertificateValidationStatus.Expiring:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Expiring);
                case CertificateValidationStatus.Expired:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Expired);
                case CertificateValidationStatus.Revoked:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Revoked);
                case CertificateValidationStatus.NotChecked:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.NotChecked);
                case CertificateValidationStatus.Inactive:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Inactive);
                case CertificateValidationStatus.Failed:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Failed);

                case CertificateState.Revoked:
                    return getEnumLabel(certificateStatusEnum, status);
                case CertificateState.Archived:
                    return getEnumLabel(certificateStatusEnum, CertificateState.Archived);
                case CertificateState.Requested:
                    return getEnumLabel(certificateStatusEnum, CertificateState.Requested);
                case CertificateState.Rejected:
                    return getEnumLabel(certificateStatusEnum, CertificateState.Rejected);
                case CertificateState.Issued:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateState.Issued);
                case CertificateState.PendingIssue:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateState.PendingIssue);
                case CertificateState.PendingRevoke:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateState.PendingRevoke);

                case CertificateEventHistoryDtoStatusEnum.Success:
                    return "Success";
                case CertificateEventHistoryDtoStatusEnum.Failed:
                    return "Failed";

                case ComplianceStatus.Ok:
                    return getEnumLabel(complianceStatusEnum, ComplianceStatus.Ok);
                case ComplianceStatus.Nok:
                    return getEnumLabel(complianceStatusEnum, ComplianceStatus.Nok);
                case ComplianceStatus.Na:
                    return getEnumLabel(complianceStatusEnum, ComplianceStatus.Na);
                case ComplianceRuleStatus.Ok:
                    return getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Ok);
                case ComplianceRuleStatus.Nok:
                    return getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Nok);
                case ComplianceRuleStatus.Na:
                    return getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Na);

                default:
                    return "Unknown";
            }
        },
        [certificateStatusEnum, certificateValidationStatusEnum, complianceStatusEnum, complianceRuleStatusEnum],
    );

    const color = getCertificateStatusColor(status);
    const text = getStatusText(status);

    return asIcon ? (
        <i title={text} className={`fa fa-circle`} style={{ color: color }} />
    ) : (
        <Badge color={color} style={{ background: color }}>
            {text.charAt(0).toUpperCase() + text.slice(1)}
        </Badge>
    );
}

export default CertificateStatus;
