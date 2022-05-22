import React from "react";
import { Container } from "reactstrap";

import AdminForm from "components/AdminForm";

function AdminEdit() {

   const title = (
      <h5>
         Edit <span className="fw-semi-bold">Administrator</span>
      </h5>
   )

   return (
      <Container className="themed-container" fluid>
         <AdminForm title={title} />
      </Container>
   );

}

export default AdminEdit;
