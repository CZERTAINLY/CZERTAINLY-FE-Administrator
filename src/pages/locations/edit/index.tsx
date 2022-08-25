import React, { useMemo } from "react";
import { Container } from "reactstrap";

import EntityForm from "components/Forms/EntityForm";

export default function Edit() {

   const title = useMemo(

      () => (
         <h5>
            Edit <span className="fw-semi-bold">Entity</span>
         </h5>
      ),
      []

   );

   return (

      <Container className="themed-container" fluid>
         <EntityForm title={title} />
      </Container>

   );

}
