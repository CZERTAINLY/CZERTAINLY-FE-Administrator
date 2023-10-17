import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Badge } from "reactstrap";
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
    PlatformEnum,
    CertificateStatus as Status,
} from "types/openapi";

interface Props {
    status:
        | Status
        | CertificateValidationStatus
        | CertificateEventHistoryDtoStatusEnum
        | ComplianceStatus
        | ComplianceRuleStatus
        | undefined
        | any;
    asIcon?: boolean;
}

function CertificateStatus({ status, asIcon = false }: Props) {
    const certificateStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateStatus));
    const certificateValidationStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationStatus));
    const complianceStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceStatus));
    const complianceRuleStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceRuleStatus));

    const getStatusColorAndText = useCallback(
        (status: Status | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus) => {
            switch (status) {
                case Status.Valid:
                    return { color: "success", text: getEnumLabel(certificateStatusEnum, Status.Valid) };
                case Status.Revoked:
                    return { color: "dark", text: getEnumLabel(certificateStatusEnum, Status.Revoked) };
                case Status.Invalid:
                    return { color: "danger", text: getEnumLabel(certificateStatusEnum, Status.Invalid) };
                case Status.Expiring:
                    return { color: "warning", text: getEnumLabel(certificateStatusEnum, Status.Expiring) };
                case Status.Expired:
                    return { color: "danger", text: getEnumLabel(certificateStatusEnum, Status.Expired) };
                case Status.Unknown:
                    return { color: "secondary", text: getEnumLabel(certificateStatusEnum, Status.Unknown) };
                case Status.New:
                    return { color: "primary", text: getEnumLabel(certificateStatusEnum, Status.New) };
                case Status.Rejected:
                    return { color: "danger", text: getEnumLabel(certificateStatusEnum, Status.Rejected) };
                case CertificateValidationStatus.Success:
                    return { color: "success", text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Success) };
                case CertificateValidationStatus.Failed:
                    return { color: "danger", text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Failed) };
                case CertificateValidationStatus.Warning:
                    return { color: "warning", text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Warning) };
                case CertificateValidationStatus.Revoked:
                    return { color: "dark", text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Revoked) };
                case CertificateValidationStatus.NotChecked:
                    return {
                        color: "secondary",
                        text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.NotChecked),
                    };
                case CertificateValidationStatus.Invalid:
                    return { color: "danger", text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Invalid) };
                case CertificateValidationStatus.Expiring:
                    return { color: "warning", text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Expiring) };
                case CertificateValidationStatus.Expired:
                    return { color: "danger", text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Expired) };
                case CertificateEventHistoryDtoStatusEnum.Success:
                    return { color: "success", text: "Success" };
                case CertificateEventHistoryDtoStatusEnum.Failed:
                    return { color: "danger", text: "Failed" };
                case ComplianceStatus.Ok:
                    return { color: "success", text: getEnumLabel(complianceStatusEnum, ComplianceStatus.Ok) };
                case ComplianceStatus.Nok:
                    return { color: "danger", text: getEnumLabel(complianceStatusEnum, ComplianceStatus.Nok) };
                case ComplianceStatus.Na:
                    return { color: "secondary", text: getEnumLabel(complianceStatusEnum, ComplianceStatus.Na) };
                case ComplianceRuleStatus.Ok:
                    return { color: "success", text: getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Ok) };
                case ComplianceRuleStatus.Nok:
                    return { color: "danger", text: getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Nok) };
                case ComplianceRuleStatus.Na:
                    return { color: "secondary", text: getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Na) };
                default:
                    return { color: "secondary", text: "Unknown" };
            }
        },
        [certificateStatusEnum, certificateValidationStatusEnum, complianceStatusEnum, complianceRuleStatusEnum],
    );

    const _default = { color: "secondary", text: "Unknown" };

    const { color, text } = status ? getStatusColorAndText(status) || _default : _default;

    return asIcon ? <i title={text} className={`fa fa-circle text-${color}`} /> : <Badge color={color}>{text}</Badge>;
}

export default CertificateStatus;
