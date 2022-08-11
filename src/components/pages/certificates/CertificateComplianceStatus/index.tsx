import { MDBBadge } from "mdbreact";
import { Status } from "types/certificate";

interface Props {
   status: "na" | "nok" | "ok";
}

function CertificateComplianceStatus({ status }: Props) {

   const statusMap: { [key in "na" | "nok" | "ok"]: { color: string, text: string } } = {
      ok: { color: "success", text: "Compliant" },
      nok: { color: "danger", text: "Not Compliant" },
      na: { color: "secondary", text: "Not Applicable" },
   };

   const _default = { color: "secondary", text: "Unknown" };

   const { color, text } = status ? statusMap[status] || _default : _default;

   return <MDBBadge color={color}>{text}</MDBBadge>;

}

export default CertificateComplianceStatus;
