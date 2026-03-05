import { describe, expect, test } from 'vitest';

import {
    transformAttributeResponseDtoToModel,
    transformAttributeRequestModelToDto,
    transformCustomAttributeDtoToModel,
    transformAttributeMappingDtoToModel,
    transformAttributeMappingModelToDto,
    transformAttributeDescriptorDtoToModel,
    transformAttributeDescriptorCollectionDtoToModel,
    transformHealthDtoToModel,
    transformHealthInfoToModel,
    transformCallbackAttributeModelToDto,
} from './attributes';
import { HealthStatus } from 'types/openapi';

describe('attribute transform helpers', () => {
    test('transformAttributeResponseDtoToModel clones V2 content deeply', () => {
        const content = [{ data: 'x' }] as any[];
        const dto = {
            uuid: 'a-1',
            name: 'Attr',
            label: 'Attr',
            type: 'String',
            contentType: 'String',
            version: 'V2',
            content,
        } as any;

        const model = transformAttributeResponseDtoToModel(dto);

        expect(model).toEqual(dto);
        expect(model).not.toBe(dto);
        expect(model.content).toEqual(content);
        expect(model.content).not.toBe(content);
    });

    test('transformAttributeResponseDtoToModel leaves V3 attributes without content', () => {
        const dto = {
            uuid: 'a-2',
            name: 'AttrV3',
            label: 'AttrV3',
            type: 'String',
            contentType: 'String',
            version: 'V3',
        } as any;

        const model = transformAttributeResponseDtoToModel(dto);

        expect(model.uuid).toBe('a-2');
        expect(model.content).toBeUndefined();
    });

    test('transformAttributeResponseDtoToModel with V2 and undefined content sets content undefined', () => {
        const dto = {
            uuid: 'a-v2',
            name: 'Attr',
            label: 'Attr',
            type: 'String',
            contentType: 'String',
            version: 'V2',
            content: undefined,
        } as any;

        const model = transformAttributeResponseDtoToModel(dto);

        expect(model.uuid).toBe('a-v2');
        expect(model.content).toBeUndefined();
    });

    test('transformAttributeRequestModelToDto clones content deeply', () => {
        const content = [{ data: 'y' }] as any[];
        const model = {
            uuid: 'req-1',
            name: 'Req',
            content,
        } as any;

        const dto = transformAttributeRequestModelToDto(model);

        expect(dto).toEqual(model);
        expect(dto).not.toBe(model);
        expect(dto.content).toEqual(content);
        expect(dto.content).not.toBe(content);
    });

    test('transformCustomAttributeDtoToModel clones content deeply or sets undefined', () => {
        const content = [{ data: 'z' }] as any[];
        const dto = {
            uuid: 'c-1',
            name: 'Custom',
            content,
            properties: {},
        } as any;

        const model = transformCustomAttributeDtoToModel(dto);

        expect(model).not.toBe(dto);
        expect(model.content).toEqual(content);
        expect(model.content).not.toBe(content);

        const dtoWithoutContent = {
            uuid: 'c-2',
            name: 'NoContent',
            properties: {},
        } as any;
        const model2 = transformCustomAttributeDtoToModel(dtoWithoutContent);
        expect(model2.content).toBeUndefined();
    });

    test('transformAttributeDescriptorDtoToModel clones descriptor content deeply', () => {
        const content = [{ foo: 'bar' }] as any[];
        const dto = {
            uuid: 'd-1',
            name: 'Desc',
            content,
        } as any;

        const model = transformAttributeDescriptorDtoToModel(dto);

        expect(model).toEqual(dto);
        expect(model).not.toBe(dto);
        expect(model.content).toEqual(content);
        expect(model.content).not.toBe(content);
    });

    test('transformAttributeDescriptorDtoToModel with undefined content sets content undefined', () => {
        const dto = {
            uuid: 'd-2',
            name: 'DescNoContent',
            content: undefined,
        } as any;

        const model = transformAttributeDescriptorDtoToModel(dto);

        expect(model.uuid).toBe('d-2');
        expect(model.content).toBeUndefined();
    });

    test('transformAttributeDescriptorCollectionDtoToModel maps each descriptor with cloning', () => {
        const desc = { uuid: 'd-1', name: 'Desc', content: [{ a: 1 }] } as any;
        const collection = {
            group1: {
                kind1: [desc],
            },
        } as any;

        const model = transformAttributeDescriptorCollectionDtoToModel(collection);
        const kind1 = model.group1?.kind1;

        expect(kind1).toHaveLength(1);
        expect(kind1?.[0]).not.toBe(desc);
        expect(kind1?.[0].content).toEqual(desc.content);
        expect(kind1?.[0].content).not.toBe(desc.content);
    });

    test('transformAttributeMappingDtoToModel and transformAttributeMappingModelToDto are symmetric', () => {
        const mapping = { sourceAttributeUuid: 's', destinationAttributeUuid: 'd' } as any;

        const model = transformAttributeMappingDtoToModel(mapping);
        const dto = transformAttributeMappingModelToDto(model);

        expect(model).toEqual(mapping);
        expect(dto).toEqual(mapping);
    });

    test('transformHealthDtoToModel maps nested parts recursively', () => {
        const dto = {
            status: HealthStatus.Up,
            description: 'root',
            parts: {
                db: {
                    status: HealthStatus.Up,
                    description: 'db ok',
                },
            },
        } as any;

        const model = transformHealthDtoToModel(dto);

        expect(model.status).toBe(HealthStatus.Up);
        expect(model.description).toBe('root');
        expect(model.parts!.db.status).toBe(HealthStatus.Up);
        expect(model.parts!.db.description).toBe('db ok');
    });

    test('transformHealthDtoToModel with no parts returns undefined parts', () => {
        const dto = {
            status: HealthStatus.Down,
            description: 'no parts',
        } as any;

        const model = transformHealthDtoToModel(dto);

        expect(model.status).toBe(HealthStatus.Down);
        expect(model.description).toBe('no parts');
        expect(model.parts).toBeUndefined();
    });

    test('transformHealthInfoToModel maps components into parts with description from details', () => {
        const healthInfo = {
            status: HealthStatus.Down,
            components: {
                api: {
                    status: HealthStatus.Up,
                    details: { description: 'ok' },
                },
                db: {
                    status: HealthStatus.Down,
                    details: { error: 'connection', code: 500 },
                },
            },
        } as any;

        const model = transformHealthInfoToModel(healthInfo);

        expect(model.status).toBe(HealthStatus.Down);
        expect(model.parts).toBeDefined();
        expect(model.parts!.api.status).toBe(HealthStatus.Up);
        expect(model.parts!.api.description).toBe('ok');
        expect(model.parts!.db.status).toBe(HealthStatus.Down);
        expect(model.parts!.db.description).toContain('error: connection');
        expect(model.parts!.db.description).toContain('code: 500');
    });

    test('transformHealthInfoToModel with no components returns undefined parts', () => {
        const healthInfo = { status: HealthStatus.Up } as any;

        const model = transformHealthInfoToModel(healthInfo);

        expect(model.status).toBe(HealthStatus.Up);
        expect(model.parts).toBeUndefined();
    });

    test('transformHealthInfoToModel uses Unknown when component status is null', () => {
        const healthInfo = {
            status: HealthStatus.Up,
            components: {
                sub: {
                    status: undefined,
                    details: {},
                },
            },
        } as any;

        const model = transformHealthInfoToModel(healthInfo);

        expect(model.parts!.sub.status).toBe(HealthStatus.Unknown);
        expect(model.parts!.sub.description).toBeUndefined();
    });

    test('transformCallbackAttributeModelToDto returns shallow clone', () => {
        const model = {
            callbackContext: '/v1/test',
            mappings: [],
        } as any;

        const dto = transformCallbackAttributeModelToDto(model);

        expect(dto).toEqual(model);
        expect(dto).not.toBe(model);
    });
});
