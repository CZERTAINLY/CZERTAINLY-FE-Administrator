import { Badge } from "reactstrap";
import { ConnectorStatus } from "types/openapi";

interface Props {
    status: ConnectorStatus | undefined;
}

export default function InventoryStatusBadge({ status }: Props) {
    const getStatus = (status: ConnectorStatus) => {
        switch (status) {
            case ConnectorStatus.Connected:
                return { color: "success", text: "Connected" };
            case ConnectorStatus.Failed:
                return { color: "danger", text: "Failed" };
            case ConnectorStatus.Offline:
                return { color: "secondary", text: "Offline" };
            case ConnectorStatus.WaitingForApproval:
                return { color: "info", text: "Waiting for approval" };
        }
    };

    const _default = { color: "secondary", text: "Unknown" };

    const { color, text } = status ? getStatus(status) || _default : _default;

    return <Badge color={color}>{text}</Badge>;
}
