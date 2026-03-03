import { test, expect } from '../../playwright/ct-test';
import { firstValueFrom, of } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import cbomActuatorEpics from './cbomActuator-epics';
import { actions } from './cbomActuator';

test.describe('cbomActuator epics', () => {
    test('returns healthFailure when cbom url is missing', async () => {
        const output$ = (cbomActuatorEpics[0] as any)(of(actions.health(undefined)), of({}) as any, {} as any);
        const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

        expect(emitted).toEqual([actions.healthFailure({ error: 'CBOM URL not provided.' })]);
    });

    test('uses /v1/health when url ends with /api', async () => {
        const fetchMock = async (url: string) => {
            expect(url).toBe('https://cbom-repo.otilm.com/api/v1/health');
            return {
                status: 200,
                json: async () => ({ status: 'UP' }),
            } as any;
        };

        const originalFetch = globalThis.fetch;
        (globalThis as any).fetch = fetchMock;

        try {
            const output$ = (cbomActuatorEpics[0] as any)(of(actions.health('https://cbom-repo.otilm.com/api/')), of({}) as any, {} as any);
            const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

            expect(emitted).toEqual([actions.healthSuccess({ status: 'UP' })]);
        } finally {
            (globalThis as any).fetch = originalFetch;
        }
    });

    test('uses /api/v1/health when url does not end with /api', async () => {
        const fetchMock = async (url: string) => {
            expect(url).toBe('https://cbom-repo.otilm.com/api/v1/health');
            return {
                status: 200,
                json: async () => ({ status: 'UP' }),
            } as any;
        };

        const originalFetch = globalThis.fetch;
        (globalThis as any).fetch = fetchMock;

        try {
            const output$ = (cbomActuatorEpics[0] as any)(of(actions.health('https://cbom-repo.otilm.com')), of({}) as any, {} as any);
            const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

            expect(emitted).toEqual([actions.healthSuccess({ status: 'UP' })]);
        } finally {
            (globalThis as any).fetch = originalFetch;
        }
    });

    test('returns healthFailure when response is not UP', async () => {
        const fetchMock = async () => {
            return {
                status: 200,
                json: async () => ({ status: 'DOWN' }),
            } as any;
        };

        const originalFetch = globalThis.fetch;
        (globalThis as any).fetch = fetchMock;

        try {
            const output$ = (cbomActuatorEpics[0] as any)(of(actions.health('https://cbom-repo.otilm.com')), of({}) as any, {} as any);
            const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

            expect(emitted).toEqual([actions.healthFailure({ error: 'Failed to get CBOM health status.' })]);
        } finally {
            (globalThis as any).fetch = originalFetch;
        }
    });

    test('returns healthFailure when fetch throws', async () => {
        const fetchMock = async () => {
            throw new Error('network down');
        };

        const originalFetch = globalThis.fetch;
        (globalThis as any).fetch = fetchMock;

        try {
            const output$ = (cbomActuatorEpics[0] as any)(of(actions.health('https://cbom-repo.otilm.com')), of({}) as any, {} as any);
            const emitted = (await firstValueFrom(output$.pipe(take(1), toArray()))) as any[];

            expect(emitted).toEqual([actions.healthFailure({ error: 'Failed to get CBOM health.. network down' })]);
        } finally {
            (globalThis as any).fetch = originalFetch;
        }
    });
});
