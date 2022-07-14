import React, { useMemo } from "react";
import { Container } from "reactstrap";

import DiscoveryForm from "components/Forms/DiscoveryForm";

export default function Add() {

   const title = useMemo(

      () => (

         <h5>
            Create New <span className="fw-semi-bold">Discovery</span>
         </h5>

      ),
      []

   );

   return (
      <Container className="themed-container" fluid>
         <DiscoveryForm title={title} />
      </Container>
   );

}
