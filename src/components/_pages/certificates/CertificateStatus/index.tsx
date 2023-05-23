import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
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
        | undefined;
    asIcon?: boolean;
}

function CertificateStatus({ status, asIcon = false }: Props) {
    const certificateStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateStatus));
    const certificateValidationStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationStatus));
    const complianceStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceStatus));
    const complianceRuleStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceRuleStatus));

    const statusMap: {
        [key in Status | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus]: {
            color: string;
            text: string;
        };
    } = {
        [Status.Valid]: { color: "success", text: getEnumLabel(certificateStatusEnum, Status.Valid) },
        [Status.Revoked]: { color: "dark", text: getEnumLabel(certificateStatusEnum, Status.Revoked) },
        [Status.Invalid]: { color: "danger", text: getEnumLabel(certificateStatusEnum, Status.Invalid) },
        [Status.Expiring]: { color: "warning", text: getEnumLabel(certificateStatusEnum, Status.Expiring) },
        [Status.Expired]: { color: "danger", text: getEnumLabel(certificateStatusEnum, Status.Expired) },
        [Status.Unknown]: { color: "secondary", text: getEnumLabel(certificateStatusEnum, Status.Unknown) },
        [Status.New]: { color: "primary", text: getEnumLabel(certificateStatusEnum, Status.New) },
        [CertificateValidationStatus.Success]: {
            color: "success",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Success),
        },
        [CertificateValidationStatus.Failed]: {
            color: "danger",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Failed),
        },
        [CertificateValidationStatus.Warning]: {
            color: "warning",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Warning),
        },
        [CertificateValidationStatus.Revoked]: {
            color: "dark",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Revoked),
        },
        [CertificateValidationStatus.NotChecked]: {
            color: "secondary",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.NotChecked),
        },
        [CertificateValidationStatus.Invalid]: {
            color: "danger",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Invalid),
        },
        [CertificateValidationStatus.Expiring]: {
            color: "warning",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Expiring),
        },
        [CertificateValidationStatus.Expired]: {
            color: "danger",
            text: getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Expired),
        },
        [CertificateEventHistoryDtoStatusEnum.Success]: { color: "success", text: "Success" },
        [CertificateEventHistoryDtoStatusEnum.Failed]: { color: "danger", text: "Failed" },
        [ComplianceStatus.Ok]: { color: "success", text: getEnumLabel(complianceStatusEnum, ComplianceStatus.Ok) },
        [ComplianceStatus.Nok]: { color: "danger", text: getEnumLabel(complianceStatusEnum, ComplianceStatus.Nok) },
        [ComplianceStatus.Na]: { color: "secondary", text: getEnumLabel(complianceStatusEnum, ComplianceStatus.Na) },
        [ComplianceRuleStatus.Ok]: { color: "success", text: getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Ok) },
        [ComplianceRuleStatus.Nok]: { color: "danger", text: getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Nok) },
        [ComplianceRuleStatus.Na]: { color: "secondary", text: getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Na) },
    };

    const _default = { color: "secondary", text: "Unknown" };

    const { color, text } = status ? statusMap[status] || _default : _default;

    return asIcon ? <i title={text} className={`fa fa-circle text-${color}`} /> : <Badge color={color}>{text}</Badge>;
}

export default CertificateStatus;
