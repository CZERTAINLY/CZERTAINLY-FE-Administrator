import React, { useMemo } from "react";
import { Container } from "reactstrap";

import ConnectorForm from "components/Forms/ConnectorForm";

export default function Edit() {

   const title = useMemo(
      () => (
         <h5>
            Edit <span className="fw-semi-bold">Connector</span>
         </h5>
      ),
      []
   );

   return (
      <Container className="themed-container" fluid>
         <ConnectorForm title={title} />
      </Container>
   );

}
