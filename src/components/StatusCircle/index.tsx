import Badge from 'components/Badge';
import { Check, HelpCircle, X } from 'lucide-react';

interface Props {
    status?: boolean;
}

function StatusCircle({ status }: Props) {
    switch (status) {
        case true:
            return (
                <Badge color="success">
                    <Check size={16} />
                </Badge>
            );

        case false:
            return (
                <Badge color="danger">
                    <X size={16} />
                </Badge>
            );

        default:
            return (
                <Badge color="gray">
                    <HelpCircle size={16} />
                </Badge>
            );
    }
}

export default StatusCircle;
