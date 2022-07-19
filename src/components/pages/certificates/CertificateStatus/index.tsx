import { MDBBadge } from "mdbreact";
import { Status } from "types/certificate";

interface Props {
   status: Status;
}

function CertificateStatus({ status }: Props) {

   const statusMap: { [key in Status]: { color: string, text: string } } = {
      valid: { color: "success", text: "Valid" },
      revoked: { color: "dark", text: "Revoked" },
      invalid: { color: "danger", text: "Invalid" },
      expiring: { color: "warning", text: "Expiring" },
      expired: { color: "danger", text: "Expired" },
      unknown: { color: "secondary", text: "Unknown" },
      new: { color: "primary", text: "New" },
   };

   const _default = { color: "secondary", text: "Unknown" };

   const { color, text } = status ? statusMap[status] || _default : _default;

   return <MDBBadge color={color}>{text}</MDBBadge>;

}

export default CertificateStatus;
