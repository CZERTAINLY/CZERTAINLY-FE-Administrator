import React from "react";
import ToolTip from "components/ToolTip";

interface Props {
   status: string | undefined;
   id: string;
}

interface CertificateIcon {

   [key: string]: {

      color: string;
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
      color: "green",
      message: "Valid",
      tooltipType: "success",
   },
   expiring: {
      color: "orange",
      message: "Expiring",
      tooltipType: "warning",
   },
   revoked: {
      color: "silver",
      message: "Revoked",
      tooltipType: "dark",
   },
   expired: {
      color: "red",
      message: "Expired",
      tooltipType: "error",
   },
   unknown: {
      color: "silver",
      message: "Unknown",
      tooltipType: "dark",
   },

};

function CertificateStatusIcon({ status, id }: Props) {

   const pattern = certificateIcon[status || "unknown"];

   return (

      <>

         <i className={"fa fa-circle"} style={{ color: pattern.color }} data-tip data-for={id} />

         <ToolTip
            id={id}
            message={pattern.message}
            tooltipType={pattern.tooltipType}
         />

      </>

   );

}

export default CertificateStatusIcon;
