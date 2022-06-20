import React, { useMemo } from "react";
import { Container } from "reactstrap";

import CredentialForm from "components/Forms/CredentialForm";

export default function CredentialEdit() {

   const title = useMemo(
      () => (
         <h5>
            Add <span className="fw-semi-bold">Credential</span>
         </h5>
      ),
      []
   );

   return (
      <Container className="themed-container" fluid>
         <CredentialForm title={title} />
      </Container>
   );

}
