import React, { useMemo } from "react";
import { Container } from "reactstrap";

import AuthorityForm from "components/Forms/AuthorityForm";

export default function Edit() {

   const title = useMemo(

      () => (
         <h5>
            Edit <span className="fw-semi-bold">Certification Authority</span>
         </h5>
      ),
      []

   );

   return (

      <Container className="themed-container" fluid>
         <AuthorityForm title={title} />
      </Container>

   );

}
