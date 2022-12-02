import { Badge } from "reactstrap";
import { Status } from "types/discoveries";

interface Props {
   status: Status | undefined;
}

export default function DiscoveryStatusBadge({
   status
}: Props) {

   const statusMap: { [key in Status]: { color: string, text: string } } = {
      "success": { color: "success", text: "Success" },
      "completed": { color: "success", text: "Completed" },
      "failed": { color: "danger", text: "Failed" },
      "inProgress": { color: "info", text: "In Progress" },
   }

   const _default = { color: "secondary", text: "Unknown" };

   const { color, text } = status ? statusMap[status] || _default : _default;

   return <Badge color={color}>{text}</Badge>;

}
