import React, { useMemo } from "react";
import { Container } from "reactstrap";

import RoleForm from "components/Forms/RoleForm";

export default function AdminAdd() {

   const title = useMemo(

      () => (

         <h5>
            Add new <span className="fw-semi-bold">Role</span>
         </h5>

      ),
      []

   );

   return (

      <Container className="themed-container" fluid>
         <RoleForm title={title} />
      </Container>

   );

}
