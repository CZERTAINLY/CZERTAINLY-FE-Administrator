
interface Props {
   status: "ok" | "nok" | "na" | undefined;
   id: string;
}

interface CertificateComplianceIcon {

   [key: string]: {

      color: string;
      message: string;

   };
}

const certificateIcon: CertificateComplianceIcon = {

   ok: {
      color: "green",
      message: "Compliant",
   },
   nok: {
      color: "red",
      message: "Non Compliant",
   },
   na: {
      color: "grey",
      message: "Not Applicable",
   },
   unknown: {
      color: "#D1D1D1",
      message: "Not Checked",
   },

};

function CertificateComplianceStatusIcon({ status, id }: Props) {

   const pattern = certificateIcon[status || "unknown"];

   return (

      <>
         <i title={pattern.message} className={"fa fa-circle"} style={{ color: pattern.color }} data-tip data-for={id} />
      </>

   );

}

export default CertificateComplianceStatusIcon;
