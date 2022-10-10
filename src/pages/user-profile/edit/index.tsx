import React, { useMemo } from "react";
import { Container } from "reactstrap";

import UserProfileForm from "components/Forms/UserProfileForm";

export default function UserEdit() {

   const title = useMemo(

      () => (

         <h5>
            Edit <span className="fw-semi-bold">Profile</span>
         </h5>

      ),
      []

   );

   return (

      <Container className="themed-container" fluid>
         <UserProfileForm title={title} />
      </Container>

   );

}

