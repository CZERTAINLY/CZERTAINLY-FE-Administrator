import React, { useMemo } from "react";
import { Container } from "reactstrap";

import RaProfileForm from "components/Forms/RaProfileForm";

export default function RaProfilesAdd() {

   const title = useMemo(
      () => (
         <h5>
            Add <span className="fw-semi-bold">RA Profile</span>
         </h5>
      ),
      []
   );

   return (
      <Container className="themed-container" fluid>
         <RaProfileForm title={title} />
      </Container>
   );

}
