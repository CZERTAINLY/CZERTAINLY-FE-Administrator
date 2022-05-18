import { CertificateDetailResponse } from "models";
import React from "react";
import { Table } from "reactstrap";
import { dateFormatter } from "utils/dateUtil";

interface Props {
  certificate?: CertificateDetailResponse;
}

function CertificateAttributes({ certificate }: Props) {
  return (
    <Table className="table-hover" size="sm">
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Subject DN</td>
          <td>{certificate?.subjectDn}</td>
        </tr>
        <tr>
          <td>Issuer DN</td>
          <td>{certificate?.issuerDn}</td>
        </tr>
        <tr>
          <td>Valid from</td>
          <td>{dateFormatter(certificate?.notBefore)}</td>
        </tr>
        <tr>
          <td>Valid to</td>
          <td>{dateFormatter(certificate?.notAfter)}</td>
        </tr>
        <tr>
          <td>Serial Number</td>
          <td>{certificate?.serialNumber}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default CertificateAttributes;
