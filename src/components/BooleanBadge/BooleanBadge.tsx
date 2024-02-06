import { Badge } from 'reactstrap';

interface Props {
    value: boolean;
}

const BooleanBadge = ({ value }: Props) => (value ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>);

export default BooleanBadge;
