import React, { useMemo } from "react";
import { Container } from "reactstrap";

import AcmeProfileForm from "components/Forms/AcmeProfileForm";

export default function AdminEdit() {

   const title = useMemo(

      () => (

         <h5>
            Edit <span className="fw-semi-bold">ACME Profile</span>
         </h5>

      ),
      []

   );

   return (

      <Container className="themed-container" fluid>
         <AcmeProfileForm title={title} />
      </Container>

   );

}

