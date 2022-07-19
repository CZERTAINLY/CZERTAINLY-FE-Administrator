import React from "react";
import { MDBBadge } from "mdbreact";

interface Props {
   enabled: boolean | undefined;
}

function StatusBadge({
   enabled
}: Props) {

   switch (enabled) {

      case true:

         return (
            <MDBBadge color="success">
               Enabled
            </MDBBadge>
         );

      case false:

         return (
            <MDBBadge color="danger">
               Disabled
            </MDBBadge>
         );

      default:

         return (
            <MDBBadge color="secondary">
               Unknown
            </MDBBadge>
         );

   }

}

export default StatusBadge;
