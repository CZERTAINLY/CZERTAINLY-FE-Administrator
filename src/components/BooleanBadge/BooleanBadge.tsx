import Badge from 'components/Badge';

interface Props {
    value: boolean;
    invertColor?: boolean;
    dataTestId?: string;
}

const BooleanBadge = ({ value, invertColor, dataTestId }: Props) =>
    value ? (
        <Badge color={invertColor ? 'danger' : 'success'} dataTestId={dataTestId || 'boolean-badge'}>
            Yes
        </Badge>
    ) : (
        <Badge color={invertColor ? 'success' : 'danger'} dataTestId={dataTestId || 'boolean-badge'}>
            No
        </Badge>
    );

export default BooleanBadge;
