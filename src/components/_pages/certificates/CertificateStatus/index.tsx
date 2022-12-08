import { Badge } from "reactstrap";
import {
   CertificateEventHistoryDtoStatusEnum,
   CertificateStatus as Status,
   CertificateValidationDtoStatusEnum,
   ComplianceStatus,
   ComplianceRuleStatus
} from "types/openapi";

interface Props {
   status: Status | CertificateValidationDtoStatusEnum | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus | undefined;
   asIcon?: boolean;
}

function CertificateStatus({ status, asIcon=false }: Props) {

   const statusMap: { [key in Status | CertificateValidationDtoStatusEnum | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus]: { color: string, text: string } } = {
      [Status.Valid]: { color: "success", text: "Valid" },
      [Status.Revoked]: { color: "dark", text: "Revoked" },
      [Status.Invalid]: { color: "danger", text: "Invalid" },
      [Status.Expiring]: { color: "warning", text: "Expiring" },
      [Status.Expired]: { color: "danger", text: "Expired" },
      [Status.Unknown]: { color: "secondary", text: "Unknown" },
      [Status.New]: { color: "primary", text: "New" },
      [CertificateValidationDtoStatusEnum.Success]: { color: "success", text: "Success" },
      [CertificateValidationDtoStatusEnum.Failed]: { color: "danger", text: "Failed" },
      [CertificateValidationDtoStatusEnum.Warning]: { color: "warning", text: "Warning" },
      [CertificateValidationDtoStatusEnum.Revoked]: { color: "dark", text: "Revoked" },
      [CertificateValidationDtoStatusEnum.NotChecked]: { color: "secondary", text: "Not Checked" },
      [CertificateValidationDtoStatusEnum.Invalid]: { color: "danger", text: "Invalid" },
      [CertificateValidationDtoStatusEnum.Expiring]: { color: "warning", text: "Expiring" },
      [CertificateValidationDtoStatusEnum.Expired]: { color: "danger", text: "Expired" },
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
