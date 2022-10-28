import { Badge } from "reactstrap";

interface Props {
   status: "na" | "nok" | "ok";
}

function CertificateComplianceStatus({ status }: Props) {

   const statusMap: { [key in "na" | "nok" | "ok"]: { color: string, text: string } } = {
      ok: { color: "success", text: "Compliant" },
      nok: { color: "danger", text: "Not Compliant" },
      na: { color: "secondary", text: "Not Applicable" },
   };

   const _default = { color: "secondary", text: "Not Checked" };

   const { color, text } = status ? statusMap[status] || _default : _default;

   return <Badge color={color}>{text}</Badge>;

}

export default CertificateComplianceStatus;
