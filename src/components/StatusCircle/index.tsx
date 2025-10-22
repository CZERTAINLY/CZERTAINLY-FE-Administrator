import Badge from 'components/Badge';

interface Props {
    status?: boolean;
}

function StatusCircle({ status }: Props) {
    switch (status) {
        case true:
            return (
                <Badge color="success">
                    <i className="fa fa-check-circle"></i>
                </Badge>
            );

        case false:
            return (
                <Badge color="danger">
                    <i className="fa fa-times-circle"></i>
                </Badge>
            );

        default:
            return (
                <Badge color="gray">
                    <i className="fa fa-question-circle"></i>
                </Badge>
            );
    }
}

export default StatusCircle;
