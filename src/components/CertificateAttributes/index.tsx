import React, { useMemo } from "react";
import { CertificateModel } from "models";
import { Table } from "reactstrap";
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
            columns: ["Valid From", certificate?.notBefore ? dateFormatter(certificate.notBefore) : ""]
         },
         {
            id: "validTo",
            columns: ["Valid To", certificate?.notAfter ? dateFormatter(certificate.notAfter) : ""]
         },
         {
            id: "serialNumber",
            columns: ["Serial Number", certificate?.serialNumber || ""]
         }
      ],
      [certificate]

   );

   return (

      <CustomTable
         headers={detailHeaders}
         data={attributes}
      />

   );
}

export default CertificateAttributes;
