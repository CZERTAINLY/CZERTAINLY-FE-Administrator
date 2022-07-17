import React from "react";
import { MDBBadge } from "mdbreact";
import { ValidationStatus } from "types/certificate";

interface Props {
  status: ValidationStatus;
}

function CertificateValidationStatus({ status }: Props) {

  const statusMap: { [key in ValidationStatus]: { color: string, text: string } } = {
    success: { color: "success", text: "Success" },
    failed: { color: "danger", text: "Failed" },
    warning: { color: "warning", text: "Warning" },
    revoked: { color: "dark", text: "Revoked" },
    notChecked: { color: "secondary", text: "Not Checked" },
    invalid: { color: "danger", text: "Invalid" },
    expiring: { color: "warning", text: "Expiring" },
    expired: { color: "danger", text: "Expired" },
  }

  const _default = { color: "secondary", text: "Unknown" };

  const { color, text } = status ? statusMap[status] || _default : _default;

  return <MDBBadge color={color}>{text}</MDBBadge>;

}

export default CertificateValidationStatus;
