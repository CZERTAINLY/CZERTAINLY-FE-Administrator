import { Badge } from "reactstrap";
import { CertificateEventHistoryDtoStatusEnum, CertificateStatus as Status, CertificateValidationStatus, ComplianceRuleStatus, ComplianceStatus } from "types/openapi";

interface Props {
   status: Status | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus | undefined;
   asIcon?: boolean;
}

function CertificateStatus({ status, asIcon=false }: Props) {

   const statusMap: { [key in Status | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus]: { color: string, text: string } } = {
      [Status.Valid]: { color: "success", text: "Valid" },
      [Status.Revoked]: { color: "dark", text: "Revoked" },
      [Status.Invalid]: { color: "danger", text: "Invalid" },
      [Status.Expiring]: { color: "warning", text: "Expiring" },
      [Status.Expired]: { color: "danger", text: "Expired" },
      [Status.Unknown]: { color: "secondary", text: "Unknown" },
      [Status.New]: { color: "primary", text: "New" },
      [CertificateValidationStatus.Success]: { color: "success", text: "Success" },
      [CertificateValidationStatus.Failed]: { color: "danger", text: "Failed" },
      [CertificateValidationStatus.Warning]: { color: "warning", text: "Warning" },
      [CertificateValidationStatus.Revoked]: { color: "dark", text: "Revoked" },
      [CertificateValidationStatus.NotChecked]: { color: "secondary", text: "Not Checked" },
      [CertificateValidationStatus.Invalid]: { color: "danger", text: "Invalid" },
      [CertificateValidationStatus.Expiring]: { color: "warning", text: "Expiring" },
      [CertificateValidationStatus.Expired]: { color: "danger", text: "Expired" },
      [CertificateEventHistoryDtoStatusEnum.Success]: { color: "success", text: "Success" },
      [CertificateEventHistoryDtoStatusEnum.Failed]: { color: "danger", text: "Failed" },
      [ComplianceStatus.Ok]: { color: "success", text: "Compliant" },
      [ComplianceStatus.Nok]: { color: "danger", text: "Not Compliant" },
      [ComplianceStatus.Na]: { color: "secondary", text: "Not Applicable" },
      [ComplianceRuleStatus.Ok]: { color: "success", text: "Compliant" },
      [ComplianceRuleStatus.Nok]: { color: "danger", text: "Not Compliant" },
      [ComplianceRuleStatus.Na]: { color: "secondary", text: "Not Applicable" },
      [CertificateEventHistoryDtoStatusEnum.Success]: { color: "success", text: "Success" },
      [CertificateEventHistoryDtoStatusEnum.Failed]: { color: "danger", text: "Failed" },
   }

   const _default = { color: "secondary", text: "Unknown" };

   const { color, text } = status ? (statusMap[status] || _default) : _default;

   return asIcon ? <i title={text} className={`fa fa-circle text-${color}`}/> : <Badge color={color}>{text}</Badge>;

}

export default CertificateStatus;
