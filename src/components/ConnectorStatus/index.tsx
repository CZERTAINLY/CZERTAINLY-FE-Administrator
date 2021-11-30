import React from "react";
import { MDBBadge } from "mdbreact";

interface Props {
  status: string | undefined;
}

function InventoryStatusBadge({ status }: Props) {
  switch (status) {
    case "Success":
      return <MDBBadge color="success">{status}</MDBBadge>;
    case "REGISTERED":
      return <MDBBadge color="success">Registered</MDBBadge>;
    case "CONNECTED":
      return <MDBBadge color="success">Connected</MDBBadge>;
    case "FAILED":
      return <MDBBadge color="danger">Failed</MDBBadge>;
    case "Failed":
      return <MDBBadge color="danger">Failed</MDBBadge>;
    case "OFFLINE":
      return <MDBBadge color="danger">Offline</MDBBadge>;
    case "WAITING_FOR_APPROVAL":
      return <MDBBadge color="warning">Awaiting Authorization</MDBBadge>;
    default:
      return <MDBBadge color="dark">{status || "Unknown"}</MDBBadge>;
  }
}

export default InventoryStatusBadge;
