import React, { useMemo } from "react";
import { CertificateModel } from "models";
import { dateFormatter } from "utils/dateUtil";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

interface Props {
   certificate?: CertificateModel;
}

function CertificateAttributes({ certificate }: Props) {

   const detailHeaders: TableHeader[] = useMemo(
      () => [
         {
            id: "adminName",
            content: "Attribute",
         },
         {
            id: "adminUsername",
            content: "Value",
         },
      ],
      []
   );


   const attributes: TableDataRow[] = useMemo(

      () => [
         {
            id: "subjectDN",
            columns: ["Subject DN", certificate?.subjectDn || ""]
         },
         {
            id: "issuerDN",
            columns: ["Issuer DN", certificate?.issuerDn || ""]
         },
         {
            id: "validFrom",
            columns: ["Valid From", <span style={{ whiteSpace: "nowrap" }}>{certificate?.notBefore ? dateFormatter(certificate.notBefore) : ""}</span>]
         },
         {
            id: "validTo",
            columns: ["Valid To", <span style={{ whiteSpace: "nowrap" }}>{certificate?.notAfter ? dateFormatter(certificate.notAfter) : ""}</span>]
         },
         {
            id: "serialNumber",
            columns: ["Serial Number", certificate?.serialNumber || ""]
         }
      ],
      [certificate]

   );

   return (

      <>
         {
            certificate ? (
               <CustomTable headers={detailHeaders} data={attributes} />
            ) : (
               <div className="text-center">Certificate information not available</div>
            )
         }
      </>

   );
}

export default CertificateAttributes;
