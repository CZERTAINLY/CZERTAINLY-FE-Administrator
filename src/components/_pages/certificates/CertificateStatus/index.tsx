import { selectors as enumSelectors } from "ducks/enums";
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
import { getCertificateStatusColor, useGetStatusText } from "utils/certificate";
import { capitalize } from "utils/common-utils";

interface Props {
    status: CertificateState | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus;
    asIcon?: boolean;
}

function CertificateStatus({ status, asIcon = false }: Props) {
    const certificateStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateState));
    const certificateValidationStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationStatus));
    const complianceStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceStatus));
    const complianceRuleStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceRuleStatus));

    const color = getCertificateStatusColor(status);
    const text = useGetStatusText(status);

    return asIcon ? (
        <i title={capitalize(text)} className={`fa fa-circle`} style={{ color: color }} />
    ) : (
        <Badge color={color} style={{ background: color }}>
            {capitalize(text)}
        </Badge>
    );
}

export default CertificateStatus;
