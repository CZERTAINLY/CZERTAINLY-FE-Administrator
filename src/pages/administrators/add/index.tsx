import React, { useMemo } from "react";
import { Container } from "reactstrap";

import AdminForm from "components/Forms/AdminForm";

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
         <AdminForm title={title} />
      </Container>
   );
}
