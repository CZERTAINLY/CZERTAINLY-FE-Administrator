import React from "react";
import { MDBBadge } from "mdbreact";

interface Props {
  enabled: boolean | undefined;
}

function StatusBadge({ enabled }: Props) {
  switch (enabled) {
    case true:
      return (
          <MDBBadge color="success">
            Enabled
          </MDBBadge>
        // <Badge color="success" pill>
        //   Enabled
        // </Badge>
      );
    case false:
      return (
          <MDBBadge color="danger">
              Disabled
          </MDBBadge>
        // <Badge color="danger" pill>
        //   Disabled
        // </Badge>
      );
    default:
      return (
          <MDBBadge color="secondary">
              Unknown
          </MDBBadge>
        // <Badge color="secondary" pill>
        //   Unknown
        // </Badge>
      );
  }
}

export default StatusBadge;
