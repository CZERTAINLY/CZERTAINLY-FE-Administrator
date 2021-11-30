import React from 'react';
import { MDBBadge, MDBIcon } from "mdbreact";

interface Props {
  status?: boolean;
}

function StatusCircle({ status }: Props) {
  switch (status) {
    case true:
      return (
          <MDBBadge color="success">
            <MDBIcon icon="check-circle" />
          </MDBBadge>
      );
    case false:
      return (
          <MDBBadge color="danger">
              <MDBIcon icon="times-circle" />
          </MDBBadge>
      );
    default:
      return (
          <MDBBadge color="dark">
              <MDBIcon icon="question-circle" />
          </MDBBadge>
      );
  }
}

export default StatusCircle;
