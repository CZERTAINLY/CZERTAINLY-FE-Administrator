import { describe, expect, test } from 'vitest';
import {
    transformCbomDetailDtoToModel,
    transformCbomDtoToModel,
    transformCbomUploadRequestModelToDto,
    transformPaginationResponseDtoToModel,
    transformSearchableFieldsDtoToModel,
    transformSearchRequestModelToDto,
} from './cbom';

describe('cbom transform helpers', () => {
    test('transformCbomDtoToModel returns shallow clone', () => {
        const input = { uuid: 'cbom-1', serialNumber: 'urn:cbom:1', metadata: { source: 'lens' } } as any;
        const result = transformCbomDtoToModel(input);

        expect(result).toEqual(input);
        expect(result).not.toBe(input);
        expect((result as any).metadata).toBe(input.metadata);
    });

    test('transformCbomDetailDtoToModel returns shallow clone', () => {
        const input = { uuid: 'detail-1', version: 3, content: { metadata: { foo: 'bar' } } } as any;
        const result = transformCbomDetailDtoToModel(input);

        expect(result).toEqual(input);
        expect(result).not.toBe(input);
        expect(result.content).toBe(input.content);
    });

    test('transformCbomUploadRequestModelToDto returns shallow clone', () => {
        const input = { content: { metadata: { serialNumber: 'urn:cbom:2' } } } as any;
        const result = transformCbomUploadRequestModelToDto(input);

        expect(result).toEqual(input);
        expect(result).not.toBe(input);
        expect(result.content).toBe(input.content);
    });

    test('transformSearchRequestModelToDto returns shallow clone', () => {
        const input = {
            pageNumber: 2,
            itemsPerPage: 25,
            filters: [{ field: 'serialNumber', value: 'urn:cbom:3' }],
            sort: [{ column: 'createdAt', order: 'DESC' }],
        } as any;
        const result = transformSearchRequestModelToDto(input);

        expect(result).toEqual(input);
        expect(result).not.toBe(input);
        expect(result.filters).toBe(input.filters);
    });

    test('transformSearchableFieldsDtoToModel maps every item to a shallow clone', () => {
        const input = [
            { group: 'main', fields: [{ field: 'serialNumber', label: 'Serial Number' }] },
            { group: 'metadata', fields: [{ field: 'source', label: 'Source' }] },
        ] as any;

        const result = transformSearchableFieldsDtoToModel(input);

        expect(result).toEqual(input);
        expect(result).not.toBe(input);
        expect(result).toHaveLength(2);
        expect(result[0]).not.toBe(input[0]);
        expect(result[1]).not.toBe(input[1]);
        expect((result[0] as any).fields).toBe(input[0].fields);
    });

    test('transformPaginationResponseDtoToModel returns shallow clone', () => {
        const input = {
            items: [{ uuid: 'cbom-1' }, { uuid: 'cbom-2' }],
            totalItems: 2,
            pageNumber: 1,
            itemsPerPage: 10,
            totalPages: 1,
        } as any;
        const result = transformPaginationResponseDtoToModel(input);

        expect(result).toEqual(input);
        expect(result).not.toBe(input);
        expect(result.items).toBe(input.items);
    });
});
