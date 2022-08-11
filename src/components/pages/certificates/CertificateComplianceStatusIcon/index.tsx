
import { MDBBadge, MDBIcon } from "mdbreact"; import ToolTip from "components/ToolTip";

interface Props {
   status: "ok" | "nok" | "na" | undefined;
   id: string;
}

interface CertificateComplianceIcon {

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

const certificateIcon: CertificateComplianceIcon = {

   ok: {
      color: "green",
      message: "Compliant",
      tooltipType: "success",
   },
   nok: {
      color: "red",
      message: "Non Compliant",
      tooltipType: "warning",
   },
   na: {
      color: "grey",
      message: "Not Checked",
      tooltipType: "dark",
   },
   unknown: {
      color: "grey",
      message: "Not Checked",
      tooltipType: "dark",
   },

};

function CertificateComplianceStatusIcon({ status, id }: Props) {

   console.log(status)
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

export default CertificateComplianceStatusIcon;
