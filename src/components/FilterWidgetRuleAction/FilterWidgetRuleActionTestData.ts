import type { SearchFieldListModel } from 'types/certificate';

export const defaultMockAvailableFilters: SearchFieldListModel[] = [
    {
        filterFieldSource: 'meta' as const,
        searchFieldData: [
            {
                fieldIdentifier: 'status',
                fieldLabel: 'Status',
                type: 'string' as const,
                conditions: [],
            },
            {
                fieldIdentifier: 'enabled',
                fieldLabel: 'Enabled',
                type: 'boolean' as const,
                conditions: [],
            },
            {
                fieldIdentifier: 'kind',
                fieldLabel: 'Kind',
                type: 'list' as const,
                conditions: [],
                value: [
                    { uuid: 'k1', name: 'Kind One' },
                    { uuid: 'k2', name: 'Kind Two' },
                ],
                multiValue: false,
            },
        ],
    },
];
