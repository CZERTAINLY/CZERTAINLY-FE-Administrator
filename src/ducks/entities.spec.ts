import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './entities';

describe('entities slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            entity: { uuid: 'e-1' } as any,
            entities: [{ uuid: 'e-1' } as any],
            isFetchingDetail: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('clearEntityProviderAttributeDescriptors sets descriptors to empty array', () => {
        const next = reducer(
            { ...initialState, entityProviderAttributeDescriptors: [{ uuid: 'd-1' } as any] },
            actions.clearEntityProviderAttributeDescriptors(),
        );
        expect(next.entityProviderAttributeDescriptors).toEqual([]);
    });

    test('listEntityProviders / success / failure', () => {
        let next = reducer(initialState, actions.listEntityProviders());
        expect(next.isFetchingEntityProviders).toBe(true);

        const providers = [{ uuid: 'p-1' } as any];
        next = reducer(next, actions.listEntityProvidersSuccess({ providers }));
        expect(next.isFetchingEntityProviders).toBe(false);
        expect(next.entityProviders).toEqual(providers);

        next = reducer({ ...next, isFetchingEntityProviders: true }, actions.listEntityProvidersFailure({ error: 'err' }));
        expect(next.isFetchingEntityProviders).toBe(false);
    });

    test('getEntityProviderAttributesDescriptors / success / failure', () => {
        let next = reducer(initialState, actions.getEntityProviderAttributesDescriptors({ uuid: 'p-1', kind: 'ENTITY' }));
        expect(next.isFetchingEntityProviderAttributeDescriptors).toBe(true);
        expect(next.entityProviderAttributeDescriptors).toEqual([]);

        const descriptors = [{ uuid: 'd-1' } as any];
        next = reducer(next, actions.getEntityProviderAttributesDescriptorsSuccess({ attributeDescriptor: descriptors }));
        expect(next.isFetchingEntityProviderAttributeDescriptors).toBe(false);
        expect(next.entityProviderAttributeDescriptors).toEqual(descriptors);

        next = reducer(
            { ...next, isFetchingEntityProviderAttributeDescriptors: true },
            actions.getEntityProviderAttributeDescriptorsFailure({ error: 'err' }),
        );
        expect(next.isFetchingEntityProviderAttributeDescriptors).toBe(false);
    });

    test('listEntities / listEntitiesSuccess', () => {
        let next = reducer({ ...initialState, entities: [{ uuid: 'e-1' } as any] }, actions.listEntities({ filters: [] } as any));
        expect(next.entities).toEqual([]);

        const items = [{ uuid: 'e-1' }, { uuid: 'e-2' }] as any[];
        next = reducer(next, actions.listEntitiesSuccess(items));
        expect(next.entities).toEqual(items);
    });

    test('getEntityDetail / success / failure', () => {
        let next = reducer(initialState, actions.getEntityDetail({ uuid: 'e-1' }));
        expect(next.isFetchingDetail).toBe(true);
        expect(next.entity).toBeUndefined();

        const entity = { uuid: 'e-1', name: 'Entity 1' } as any;
        next = reducer(next, actions.getEntityDetailSuccess({ entity }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.entity).toEqual(entity);

        next = reducer({ ...next, isFetchingDetail: true }, actions.getEntityDetailFailure({ error: 'err' }));
        expect(next.isFetchingDetail).toBe(false);
    });

    test('addEntity / success / failure', () => {
        let next = reducer(initialState, actions.addEntity({ connectorUuid: 'c-1', kind: 'ENTITY', name: 'E1', attributes: [] } as any));
        expect(next.isCreating).toBe(true);
        expect(next.createEntitySucceeded).toBe(false);

        next = reducer(next, actions.addEntitySuccess({ uuid: 'e-1' }));
        expect(next.isCreating).toBe(false);
        expect(next.createEntitySucceeded).toBe(true);

        next = reducer({ ...next, isCreating: true }, actions.addEntityFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createEntitySucceeded).toBe(false);
    });

    test('deleteEntity / success / failure', () => {
        const items = [{ uuid: 'e-1' } as any, { uuid: 'e-2' } as any];

        let next = reducer({ ...initialState, entities: items }, actions.deleteEntity({ uuid: 'e-1' }));
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteEntitySuccess({ uuid: 'e-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.entities.find((e) => e.uuid === 'e-1')).toBeUndefined();

        next = reducer({ ...next, isDeleting: true }, actions.deleteEntityFailure({ error: 'err' }));
        expect(next.isDeleting).toBe(false);
    });

    test('updateEntity / success / failure', () => {
        let next = reducer(initialState, actions.updateEntity({ uuid: 'e-1', attributes: [] }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateEntitySucceeded).toBe(false);

        const entity = { uuid: 'e-1', name: 'Updated' } as any;
        next = reducer(next, actions.updateEntitySuccess({ entity }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateEntitySucceeded).toBe(true);

        next = reducer({ ...next, isUpdating: true }, actions.updateEntityFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateEntitySucceeded).toBe(false);
    });

    test('listLocationAttributeDescriptors / success / failure', () => {
        let next = reducer(initialState, actions.listLocationAttributeDescriptors({ entityUuid: 'e-1' }));
        expect(next.isFetchingLocationAttributeDescriptors).toBe(true);

        const descriptors = [{ uuid: 'd-1' } as any];
        next = reducer(next, actions.listLocationAttributeDescriptorsSuccess({ descriptors }));
        expect(next.isFetchingLocationAttributeDescriptors).toBe(false);
        expect(next.locationAttributeDescriptors).toEqual(descriptors);

        next = reducer(
            { ...next, isFetchingLocationAttributeDescriptors: true },
            actions.listLocationAttributeDescriptorsFailure({ error: 'err' }),
        );
        expect(next.isFetchingLocationAttributeDescriptors).toBe(false);
    });
});

describe('entities selectors', () => {
    test('selectors read values from entities state', () => {
        const entity = { uuid: 'e-1' } as any;
        const providers = [{ uuid: 'p-1' } as any];
        const descriptors = [{ uuid: 'd-1' } as any];
        const featureState = {
            ...initialState,
            entity,
            entities: [entity],
            entityProviders: providers,
            entityProviderAttributeDescriptors: descriptors,
            locationAttributeDescriptors: descriptors,
            isFetchingEntityProviders: true,
            isFetchingEntityProviderAttributeDescriptors: true,
            isFetchingDetail: true,
            isFetchingLocationAttributeDescriptors: true,
            isCreating: true,
            createEntitySucceeded: true,
            isDeleting: true,
            isUpdating: true,
            updateEntitySucceeded: true,
        };

        const state = { entities: featureState } as any;

        expect(selectors.entity(state)).toEqual(entity);
        expect(selectors.entities(state)).toEqual([entity]);
        expect(selectors.entityProviders(state)).toEqual(providers);
        expect(selectors.entityProviderAttributeDescriptors(state)).toEqual(descriptors);
        expect(selectors.locationAttributeDescriptors(state)).toEqual(descriptors);
        expect(selectors.isFetchingEntityProviders(state)).toBe(true);
        expect(selectors.isFetchingEntityProviderAttributeDescriptors(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isFetchingLocationAttributeDescriptors(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.createEntitySucceeded(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.updateEntitySucceeded(state)).toBe(true);
    });
});
