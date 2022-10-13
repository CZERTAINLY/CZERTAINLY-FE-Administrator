import React from "react";
import { Container } from "reactstrap";

import RoleUsersForm from "components/Forms/RoleUsersForm";

export default function AdminAdd() {

   return (

      <Container className="themed-container" fluid>
         <RoleUsersForm />
      </Container>

   );

}
