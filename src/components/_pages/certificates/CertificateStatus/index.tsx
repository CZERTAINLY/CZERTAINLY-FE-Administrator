import { selectors as enumSelectors } from "ducks/enums";
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
        [Status.Valid]: { color: "success", text: certificateStatusEnum[Status.Valid].label },
        [Status.Revoked]: { color: "dark", text: certificateStatusEnum[Status.Revoked].label },
        [Status.Invalid]: { color: "danger", text: certificateStatusEnum[Status.Invalid].label },
        [Status.Expiring]: { color: "warning", text: certificateStatusEnum[Status.Expiring].label },
        [Status.Expired]: { color: "danger", text: certificateStatusEnum[Status.Expired].label },
        [Status.Unknown]: { color: "secondary", text: certificateStatusEnum[Status.Unknown].label },
        [Status.New]: { color: "primary", text: certificateStatusEnum[Status.New].label },
        [CertificateValidationStatus.Success]: {
            color: "success",
            text: certificateValidationStatusEnum[CertificateValidationStatus.Success].label,
        },
        [CertificateValidationStatus.Failed]: {
            color: "danger",
            text: certificateValidationStatusEnum[CertificateValidationStatus.Failed].label,
        },
        [CertificateValidationStatus.Warning]: {
            color: "warning",
            text: certificateValidationStatusEnum[CertificateValidationStatus.Warning].label,
        },
        [CertificateValidationStatus.Revoked]: {
            color: "dark",
            text: certificateValidationStatusEnum[CertificateValidationStatus.Revoked].label,
        },
        [CertificateValidationStatus.NotChecked]: {
            color: "secondary",
            text: certificateValidationStatusEnum[CertificateValidationStatus.NotChecked].label,
        },
        [CertificateValidationStatus.Invalid]: {
            color: "danger",
            text: certificateValidationStatusEnum[CertificateValidationStatus.Invalid].label,
        },
        [CertificateValidationStatus.Expiring]: {
            color: "warning",
            text: certificateValidationStatusEnum[CertificateValidationStatus.Expiring].label,
        },
        [CertificateValidationStatus.Expired]: {
            color: "danger",
            text: certificateValidationStatusEnum[CertificateValidationStatus.Expired].label,
        },
        [CertificateEventHistoryDtoStatusEnum.Success]: { color: "success", text: "Success" },
        [CertificateEventHistoryDtoStatusEnum.Failed]: { color: "danger", text: "Failed" },
        [ComplianceStatus.Ok]: { color: "success", text: complianceStatusEnum[ComplianceStatus.Ok].label },
        [ComplianceStatus.Nok]: { color: "danger", text: complianceStatusEnum[ComplianceStatus.Nok].label },
        [ComplianceStatus.Na]: { color: "secondary", text: complianceStatusEnum[ComplianceStatus.Na].label },
        [ComplianceRuleStatus.Ok]: { color: "success", text: complianceRuleStatusEnum[ComplianceRuleStatus.Ok].label },
        [ComplianceRuleStatus.Nok]: { color: "danger", text: complianceRuleStatusEnum[ComplianceRuleStatus.Nok].label },
        [ComplianceRuleStatus.Na]: { color: "secondary", text: complianceRuleStatusEnum[ComplianceRuleStatus.Na].label },
    };

    const _default = { color: "secondary", text: "Unknown" };

    const { color, text } = status ? statusMap[status] || _default : _default;

    return asIcon ? <i title={text} className={`fa fa-circle text-${color}`} /> : <Badge color={color}>{text}</Badge>;
}

export default CertificateStatus;
