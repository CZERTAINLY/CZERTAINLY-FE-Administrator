import { describe, expect, it } from 'vitest';

import { FilterFieldSource, Resource, type SearchFieldDataByGroupDto } from 'types/openapi';
import { toCreateRequest, toStandardSlice } from 'utils/listViews';
import { KEY_COLUMNS } from './keyTableHelpers';

const DISPLAY_ONLY = 'CK_ASSOCIATIONS';

const keysCatalogue = [
    {
        filterFieldSource: FilterFieldSource.Property,
        searchFieldData: KEY_COLUMNS.filter((column) => column.fieldIdentifier !== DISPLAY_ONLY).map((column) => ({
            fieldIdentifier: column.fieldIdentifier,
            fieldLabel: column.catalogueLabel,
            type: column.type,
            conditions: [],
        })),
    },
] as unknown as SearchFieldDataByGroupDto[];

describe('KEY_COLUMNS saved as a view', () => {
    it('carries the display-only associations column, which the catalogue cannot publish', () => {
        expect(KEY_COLUMNS.map((column) => column.fieldIdentifier)).toContain(DISPLAY_ONLY);
    });

    it('drops that column on write, so saving the platform default set is accepted', () => {
        const request = toCreateRequest('Standard (copy)', Resource.Keys, toStandardSlice(KEY_COLUMNS), keysCatalogue);

        expect(request.columns.map((column) => column.fieldIdentifier)).toEqual(
            KEY_COLUMNS.filter((column) => column.fieldIdentifier !== DISPLAY_ONLY).map((column) => column.fieldIdentifier),
        );
    });
});
