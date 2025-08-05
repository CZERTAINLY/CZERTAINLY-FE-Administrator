import { TableDataRow, TableHeader } from 'components/CustomTable';
import { WidgetButtonProps } from 'components/WidgetButtons';

export function getEditAndDeleteWidgetButtons(
    onEditClick: (event: React.MouseEvent) => void,
    setConfirmDelete: (value: boolean) => void,
): WidgetButtonProps[] {
    return [
        {
            icon: 'pencil',
            disabled: false,
            tooltip: 'Edit',
            onClick: (event) => {
                onEditClick(event);
            },
        },
        {
            icon: 'trash',
            disabled: false,
            tooltip: 'Delete',
            onClick: () => {
                setConfirmDelete(true);
            },
        },
    ];
}

export function createWidgetDetailHeaders(): TableHeader[] {
    return [
        {
            id: 'property',
            content: 'Property',
        },
        {
            id: 'value',
            content: 'Value',
        },
    ];
}

export function createTableDataRow(label: string, value: string | null | undefined): TableDataRow {
    return {
        id: label.toLowerCase().replace(/[^a-z0-9]/g, ''),
        columns: [label, value ?? ''],
    };
}
