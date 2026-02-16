import React from 'react';

export interface TableHeader {
    id: string;
    content: string | React.ReactNode;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    sort?: 'asc' | 'desc';
    sortType?: 'string' | 'numeric' | 'date';
    width?: string;
}

export interface TableDataRow {
    id: number | string;
    columns: (string | React.ReactNode | React.ReactNode[])[];
    detailColumns?: (string | React.ReactNode | React.ReactNode[])[];
    options?: {
        useAccentBottomBorder?: boolean;
    };
}
