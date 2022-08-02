import ComplianceProfileForm from "components/Forms/ComplianceProfileForm";
import { useMemo } from "react";
import { Container } from "reactstrap";

export default function AdminEdit() {

   const title = useMemo(

      () => (

         <h5>
            Add new <span className="fw-semi-bold">Compliance Profile</span>
         </h5>

      ),
      []

   );

   return (

      <Container className="themed-container" fluid>
         <ComplianceProfileForm title={title} />
      </Container>

   );

}

