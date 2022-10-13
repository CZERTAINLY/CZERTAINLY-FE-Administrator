import React from "react";
import { Container } from "reactstrap";

import RolePermissionsForm from "components/Forms/RolePermissionsForm";

export default function AdminAdd() {

   return (

      <Container className="themed-container" fluid>
         <RolePermissionsForm />
      </Container>

   );

}
