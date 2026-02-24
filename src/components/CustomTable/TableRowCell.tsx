import React from 'react';
import Button from 'components/Button';
import type { TableDataRow, TableHeader } from './types';

export interface TableRowCellProps {
    column: string | React.ReactNode | React.ReactNode[];
    index: number;
    row: TableDataRow;
    tblHeaders: TableHeader[] | undefined;
    hasDetails?: boolean;
    onDetailClick: (rowId: number | string) => void;
}

export function TableRowCell({ column, index, row, tblHeaders, hasDetails = false, onDetailClick }: TableRowCellProps) {
    const isFirstColumn = index === 0;
    const shouldShowButton = hasDetails && isFirstColumn && row.detailColumns && row.detailColumns.length > 0;
    const align = tblHeaders?.[index]?.align;

    return (
        <td
            style={align ? { textAlign: align } : {}}
            className="px-2.5 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200"
        >
            {shouldShowButton ? (
                <Button
                    variant="transparent"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetailClick(row.id);
                    }}
                    className="!p-0 hover:bg-transparent text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto font-medium"
                >
                    {column}
                </Button>
            ) : (
                <div>{column ? column : <></>}</div>
            )}
        </td>
    );
}
