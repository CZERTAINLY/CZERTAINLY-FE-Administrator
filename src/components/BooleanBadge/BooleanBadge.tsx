import Badge from 'components/Badge';

interface Props {
    value: boolean;
    invertColor?: boolean;
}

const BooleanBadge = ({ value, invertColor }: Props) =>
    value ? <Badge color={invertColor ? 'danger' : 'success'}>Yes</Badge> : <Badge color={invertColor ? 'success' : 'danger'}>No</Badge>;

export default BooleanBadge;
