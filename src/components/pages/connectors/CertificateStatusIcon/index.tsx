import React from "react";
import { MDBBadge, MDBIcon } from "mdbreact";
import ToolTip from "components/ToolTip";

interface Props {
   status: string | undefined;
   id: string;
}

interface CertificateIcon {

   [key: string]: {

      color: string;
      icon: string;
      message: string;
      tooltipType:
      | "dark"
      | "success"
      | "warning"
      | "error"
      | "info"
      | "light"
      | undefined;

   };
}

const certificateIcon: CertificateIcon = {

   valid: {
      color: "success",
      icon: "battery-full",
      message: "Valid",
      tooltipType: "success",
   },
   expiring: {
      color: "info",
      icon: "battery-half",
      message: "Expiring",
      tooltipType: "info",
   },
   revoked: {
      color: "dark",
      icon: "battery-empty",
      message: "Revoked",
      tooltipType: "dark",
   },
   expired: {
      color: "danger",
      icon: "battery-empty",
      message: "Expired",
      tooltipType: "error",
   },
   unknown: {
      color: "dark",
      icon: "question-circle",
      message: "Unknown",
      tooltipType: "dark",
   },

};

function CertificateStatusIcon({ status, id }: Props) {

   const pattern = certificateIcon[status || "unknown"];

   return (

      <MDBBadge color={pattern.color} data-tip data-for={id}>

         <MDBIcon icon={pattern.icon} />

         <ToolTip
            id={id}
            message={pattern.message}
            tooltipType={pattern.tooltipType}
         />

      </MDBBadge>

   );

}

export default CertificateStatusIcon;
