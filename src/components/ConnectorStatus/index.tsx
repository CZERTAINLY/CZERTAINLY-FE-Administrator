import React from "react";
import { MDBBadge } from "mdbreact";

interface Props {
  status: string | undefined;
}

function InventoryStatusBadge({ status }: Props) {
  switch (status) {
    case "Success":
      return <MDBBadge color="success">{status}</MDBBadge>;
    case "registered":
      return <MDBBadge color="success">Registered</MDBBadge>;
    case "connected":
      return <MDBBadge color="success">Connected</MDBBadge>;
    case "failed":
      return <MDBBadge color="danger">Failed</MDBBadge>;
    case "offline":
      return <MDBBadge color="danger">Offline</MDBBadge>;
    case "waitingForApproval":
      return <MDBBadge color="warning">Awaiting Authorization</MDBBadge>;
    default:
      return <MDBBadge color="dark">{status || "Unknown"}</MDBBadge>;
  }
}

export default InventoryStatusBadge;
