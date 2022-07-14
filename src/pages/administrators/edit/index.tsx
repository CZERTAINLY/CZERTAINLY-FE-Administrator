import React, { useMemo } from "react";
import { Container } from "reactstrap";

import AdminForm from "components/Forms/AdminForm";

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
         <AdminForm title={title} />
      </Container>

   );

}

