import React from "react";
import { MDBBadge } from "mdbreact";
import { Status } from "types/connectors";

interface Props {
   status: Status | undefined;
}

export default function InventoryStatusBadge({ status }: Props) {

   const statusMap: { [key in Status]: { color: string, text: string } } = {
      "connected": { color: "success", text: "Connected" },
      "registered": { color: "warning", text: "Registered" },
      "failed": { color: "danger", text: "Failed" },
      "offline": { color: "secondary", text: "Offline" },
      "waitingForApproval": { color: "info", text: "Waiting for approval" },
      "misconfigured": { color: "danger", text: "Misconfigured" },
      "unavailable": { color: "secondary", text: "Unavailable" },
   }

   const _default = { color: "secondary", text: "Unknown" };

   const { color, text } = status ? statusMap[status] || _default : _default;

   return <MDBBadge color={color}>{text}</MDBBadge>;

}
