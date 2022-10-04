import React, { useMemo } from "react";
import { Container } from "reactstrap";

import UserForm from "components/Forms/UserForm";

export default function AdminEdit() {

   const title = useMemo(

      () => (

         <h5>
            Edit <span className="fw-semi-bold">Administrator</span>
         </h5>

      ),
      []

   );

   return (

      <Container className="themed-container" fluid>
         <UserForm title={title} />
      </Container>

   );

}

