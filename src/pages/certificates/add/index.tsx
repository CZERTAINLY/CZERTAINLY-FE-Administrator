import React, { useMemo } from "react";
import { Container } from "reactstrap";

import CertificateIssueForm from "components/Forms/CertificateIssueForm";

export default function Add() {

   const title = useMemo(

      () => (

         <h5>
            Issue <span className="fw-semi-bold">Certificate</span>
         </h5>

      ),
      []

   );

   return (
      <Container className="themed-container" fluid>
         <CertificateIssueForm title={title} />
      </Container>
   );

}
