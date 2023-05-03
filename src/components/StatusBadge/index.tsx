import { Badge } from "reactstrap";

interface Props {
    enabled: boolean | undefined;
    style?: React.CSSProperties;
}

function StatusBadge({ enabled, style }: Props) {
    switch (enabled) {
        case true:
            return (
                <Badge style={style} color="success">
                    Enabled
                </Badge>
            );

        case false:
            return (
                <Badge style={style} color="danger">
                    Disabled
                </Badge>
            );

        default:
            return (
                <Badge style={style} color="secondary">
                    Unknown
                </Badge>
            );
    }
}

export default StatusBadge;
