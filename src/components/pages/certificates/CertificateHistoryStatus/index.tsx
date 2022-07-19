import React from "react";
import { MDBBadge } from "mdbreact";

interface Props {
   status: string | undefined;
}

function CertificateEventStatus({ status }: Props) {

   const statusMap: { [key: string]: { color: string, text: string } } = {
      SUCCESS: { color: "success", text: "Success" },
      FAILED: { color: "danger", text: "Failed" },
   };

   const _default = { color: "secondary", text: "Unknown" };

   const { color, text } = status ? statusMap[status] || _default : _default;

   return <MDBBadge color={color}>{text}</MDBBadge>;

}

export default CertificateEventStatus;
