import React from "react";
import { Container } from "reactstrap";

import ClientForm from "components/Forms/ClientForm";

export default function ClientEdit() {

   const title = (
      <h5>
         Edit <span className="fw-semi-bold">Client</span>
      </h5>
   )

   return (
      <Container className="themed-container" fluid>
         <ClientForm title={title} />
      </Container>
   );

}