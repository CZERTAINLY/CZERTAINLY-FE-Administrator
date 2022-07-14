import React, { useMemo } from "react";
import { Container } from "reactstrap";

import AuthorityForm from "components/Forms/AuthorityForm";

export default function Add() {

   const title = useMemo(

      () => (

         <h5>
            Add <span className="fw-semi-bold">Certification Authority</span>
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
