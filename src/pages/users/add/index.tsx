import React, { useMemo } from "react";
import { Container } from "reactstrap";

import UserForm from "components/Forms/UserForm";

export default function AdminAdd() {

   const title = useMemo(

      () => (

         <h5>
            Add new <span className="fw-semi-bold">Administrator</span>
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
