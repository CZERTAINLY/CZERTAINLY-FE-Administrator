import { Badge } from "reactstrap";

interface Props {
    enabled: boolean | undefined;
}

function StatusBadge({ enabled }: Props) {
    switch (enabled) {
        case true:
            return <Badge color="success">Enabled</Badge>;

        case false:
            return <Badge color="danger">Disabled</Badge>;

        default:
            return <Badge color="secondary">Unknown</Badge>;
    }
}

export default StatusBadge;
