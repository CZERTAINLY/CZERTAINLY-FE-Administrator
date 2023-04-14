import { Badge } from "reactstrap";
import { KeyState } from "types/openapi";

interface Props {
    state: KeyState;
}

function KeyStateBadge({ state }: Props) {
    switch (state) {
        case KeyState.Active:
            return <Badge color="success">Active</Badge>;

        case KeyState.PreActive:
            return <Badge color="warning">Pre Active</Badge>;

        case KeyState.Compromised:
            return <Badge color="danger">Compromised</Badge>;
        case KeyState.Destroyed:
            return <Badge color="danger">Destroyed</Badge>;
        case KeyState.CompromisedDestroyed:
            return <Badge color="danger">Compromised & Destroyed</Badge>;

        default:
            return <Badge color="secondary">{state}</Badge>;
    }
}

export default KeyStateBadge;
