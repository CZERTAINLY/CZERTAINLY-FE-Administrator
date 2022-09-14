import React, { useMemo } from "react";
import { Container } from "reactstrap";

import LocationForm from "components/Forms/LocationForm";

export default function Add() {

   const title = useMemo(

      () => (

         <h5>
            Add <span className="fw-semi-bold">Location</span>
         </h5>

      ),
      []

   );

   return (
      <Container className="themed-container" fluid>
         <LocationForm title={title} />
      </Container>
   );

}
