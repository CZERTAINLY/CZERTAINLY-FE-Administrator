import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState } from './scheduler';

describe('scheduler slice', () => {
    test('bulkDeleteSchedulerJobs / success removes only deleted jobs / failure', () => {
        const items = [{ uuid: 'j-1' } as any, { uuid: 'j-2' } as any, { uuid: 'j-3' } as any];
        const schedulerJob = { uuid: 'j-2' } as any;

        let next = reducer(
            { ...initialState, schedulerJobs: items, schedulerJob },
            actions.bulkDeleteSchedulerJobs({ uuids: ['j-1', 'j-2'] }),
        );
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.bulkDeleteSchedulerJobsSuccess({ uuids: ['j-1'] }));
        expect(next.isDeleting).toBe(false);
        expect(next.schedulerJobs).toEqual([{ uuid: 'j-2' }, { uuid: 'j-3' }]);
        expect(next.schedulerJob).toEqual(schedulerJob);

        next = reducer({ ...next, isDeleting: true }, actions.bulkDeleteSchedulerJobsFailure({ error: 'err' }));
        expect(next.isDeleting).toBe(false);
    });
});
