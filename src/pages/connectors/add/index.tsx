import React from "react";
import { Container } from "reactstrap";

import ConnectorForm from "components/Forms/ConnectorForm";

export default function ConnectorAdd() {

   const title = (
      <h5>
         Add new <span className="fw-semi-bold">Connector</span>
      </h5>
   );

   return (
      <Container className="themed-container" fluid>
         <ConnectorForm title={title} />
      </Container>
   );
}
