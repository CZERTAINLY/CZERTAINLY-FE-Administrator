import Badge from 'components/Badge';

export type BooleanCellProps = Readonly<{
    value: boolean | undefined;
    trueLabel?: string;
    falseLabel?: string;
    dataTestId?: string;
}>;

/**
 * A yes/no cell for a boolean column. `undefined` is not `false`: an entry not carrying the field
 * renders `null`, which the row turns into the shared empty state.
 */
export default function BooleanCell({ value, trueLabel = 'Yes', falseLabel = 'No', dataTestId }: BooleanCellProps) {
    if (value === undefined) return null;

    return (
        <Badge color={value ? 'success' : 'gray'} size="small" dataTestId={dataTestId}>
            {value ? trueLabel : falseLabel}
        </Badge>
    );
}
