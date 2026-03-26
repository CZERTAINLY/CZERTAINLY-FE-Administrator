import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { actions as rulesActions } from './rules';
import { actions as alertActions } from './alerts';

type EpicDeps = {
    apiClients: {
        rules: {
            deleteRule: (args: any) => any;
            deleteCondition: (args: any) => any;
        };
        actions: {
            deleteAction: (args: any) => any;
            deleteExecution: (args: any) => any;
        };
        triggers: {
            deleteTrigger: (args: any) => any;
        };
    };
};

enum RulesEpicIndex {
    BulkDeleteRules = 29,
    BulkDeleteActions = 30,
    BulkDeleteConditions = 31,
    BulkDeleteTriggers = 32,
    BulkDeleteExecutions = 33,
}

vi.mock('../App', () => ({
    store: {
        dispatch: vi.fn(),
        getState: vi.fn(() => ({})),
    },
}));

const defaultDeps: EpicDeps = {
    apiClients: {
        rules: {
            deleteRule: () => of(undefined),
            deleteCondition: () => of(undefined),
        },
        actions: {
            deleteAction: () => of(undefined),
            deleteExecution: () => of(undefined),
        },
        triggers: {
            deleteTrigger: () => of(undefined),
        },
    },
};

function mergeDeps(overrides: Partial<EpicDeps['apiClients']>): EpicDeps {
    return {
        apiClients: {
            rules: overrides.rules ? { ...defaultDeps.apiClients.rules, ...overrides.rules } : defaultDeps.apiClients.rules,
            actions: overrides.actions ? { ...defaultDeps.apiClients.actions, ...overrides.actions } : defaultDeps.apiClients.actions,
            triggers: overrides.triggers ? { ...defaultDeps.apiClients.triggers, ...overrides.triggers } : defaultDeps.apiClients.triggers,
        },
    };
}

async function runEpic(
    epicIndex: number,
    action: any,
    depsOverrides: Partial<EpicDeps['apiClients']> = {},
    takeCount = 1,
): Promise<UnknownAction[]> {
    const { default: epics } = await import('./rules-epics');
    const epic = (epics as any)[epicIndex];
    const deps = mergeDeps(depsOverrides);
    const output$ = epic(of(action), of({}) as any, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('bulkDeleteRules epic', () => {
    test('success emits bulkDeleteRulesSuccess and success alert', async () => {
        const emitted = await runEpic(RulesEpicIndex.BulkDeleteRules, rulesActions.bulkDeleteRules({ ruleUuids: ['r-1', 'r-2'] }), {}, 2);

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteRulesSuccess({ ruleUuids: ['r-1', 'r-2'] }));
        expect(emitted[1]).toEqual(alertActions.success('Selected rules successfully deleted.'));
    });

    test('calls deleteRule for each uuid', async () => {
        const capturedUuids: string[] = [];

        await runEpic(
            RulesEpicIndex.BulkDeleteRules,
            rulesActions.bulkDeleteRules({ ruleUuids: ['r-1', 'r-2'] }),
            {
                rules: {
                    deleteRule: ({ ruleUuid }: { ruleUuid: string }) => {
                        capturedUuids.push(ruleUuid);
                        return of(undefined);
                    },
                } as any,
            },
            2,
        );

        expect(capturedUuids).toContain('r-1');
        expect(capturedUuids).toContain('r-2');
    });

    test('failure emits bulkDeleteRulesFailure and error alert', async () => {
        const err = new Error('delete failed');
        const expectedMessage = 'Failed to delete rules. delete failed';
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteRules,
            rulesActions.bulkDeleteRules({ ruleUuids: ['r-1'] }),
            { rules: { deleteRule: () => throwError(() => err) } as any },
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteRulesFailure({ error: expectedMessage }));
        expect(emitted[1]).toEqual(alertActions.error(expectedMessage));
    });
});

describe('bulkDeleteActions epic', () => {
    test('success emits bulkDeleteActionsSuccess and success alert', async () => {
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteActions,
            rulesActions.bulkDeleteActions({ actionUuids: ['a-1', 'a-2'] }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteActionsSuccess({ actionUuids: ['a-1', 'a-2'] }));
        expect(emitted[1]).toEqual(alertActions.success('Selected actions successfully deleted.'));
    });

    test('calls deleteAction for each uuid', async () => {
        const capturedUuids: string[] = [];

        await runEpic(
            RulesEpicIndex.BulkDeleteActions,
            rulesActions.bulkDeleteActions({ actionUuids: ['a-1', 'a-2'] }),
            {
                actions: {
                    deleteAction: ({ actionUuid }: { actionUuid: string }) => {
                        capturedUuids.push(actionUuid);
                        return of(undefined);
                    },
                } as any,
            },
            2,
        );

        expect(capturedUuids).toContain('a-1');
        expect(capturedUuids).toContain('a-2');
    });

    test('failure emits bulkDeleteActionsFailure and error alert', async () => {
        const err = new Error('delete failed');
        const expectedMessage = 'Failed to delete actions. delete failed';
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteActions,
            rulesActions.bulkDeleteActions({ actionUuids: ['a-1'] }),
            { actions: { deleteAction: () => throwError(() => err) } as any },
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteActionsFailure({ error: expectedMessage }));
        expect(emitted[1]).toEqual(alertActions.error(expectedMessage));
    });
});

describe('bulkDeleteConditions epic', () => {
    test('success emits bulkDeleteConditionsSuccess and success alert', async () => {
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteConditions,
            rulesActions.bulkDeleteConditions({ conditionUuids: ['c-1', 'c-2'] }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteConditionsSuccess({ conditionUuids: ['c-1', 'c-2'] }));
        expect(emitted[1]).toEqual(alertActions.success('Selected conditions successfully deleted.'));
    });

    test('calls deleteCondition for each uuid', async () => {
        const capturedUuids: string[] = [];

        await runEpic(
            RulesEpicIndex.BulkDeleteConditions,
            rulesActions.bulkDeleteConditions({ conditionUuids: ['c-1', 'c-2'] }),
            {
                rules: {
                    deleteCondition: ({ conditionUuid }: { conditionUuid: string }) => {
                        capturedUuids.push(conditionUuid);
                        return of(undefined);
                    },
                } as any,
            },
            2,
        );

        expect(capturedUuids).toContain('c-1');
        expect(capturedUuids).toContain('c-2');
    });

    test('failure emits bulkDeleteConditionsFailure and error alert', async () => {
        const err = new Error('delete failed');
        const expectedMessage = 'Failed to delete conditions. delete failed';
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteConditions,
            rulesActions.bulkDeleteConditions({ conditionUuids: ['c-1'] }),
            { rules: { deleteCondition: () => throwError(() => err) } as any },
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteConditionsFailure({ error: expectedMessage }));
        expect(emitted[1]).toEqual(alertActions.error(expectedMessage));
    });
});

describe('bulkDeleteTriggers epic', () => {
    test('success emits bulkDeleteTriggersSuccess and success alert', async () => {
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteTriggers,
            rulesActions.bulkDeleteTriggers({ triggerUuids: ['t-1', 't-2'] }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteTriggersSuccess({ triggerUuids: ['t-1', 't-2'] }));
        expect(emitted[1]).toEqual(alertActions.success('Selected triggers successfully deleted.'));
    });

    test('calls deleteTrigger for each uuid', async () => {
        const capturedUuids: string[] = [];

        await runEpic(
            RulesEpicIndex.BulkDeleteTriggers,
            rulesActions.bulkDeleteTriggers({ triggerUuids: ['t-1', 't-2'] }),
            {
                triggers: {
                    deleteTrigger: ({ triggerUuid }: { triggerUuid: string }) => {
                        capturedUuids.push(triggerUuid);
                        return of(undefined);
                    },
                } as any,
            },
            2,
        );

        expect(capturedUuids).toContain('t-1');
        expect(capturedUuids).toContain('t-2');
    });

    test('failure emits bulkDeleteTriggersFailure and error alert', async () => {
        const err = new Error('delete failed');
        const expectedMessage = 'Failed to delete triggers. delete failed';
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteTriggers,
            rulesActions.bulkDeleteTriggers({ triggerUuids: ['t-1'] }),
            { triggers: { deleteTrigger: () => throwError(() => err) } as any },
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteTriggersFailure({ error: expectedMessage }));
        expect(emitted[1]).toEqual(alertActions.error(expectedMessage));
    });
});

describe('bulkDeleteExecutions epic', () => {
    test('success emits bulkDeleteExecutionsSuccess and success alert', async () => {
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteExecutions,
            rulesActions.bulkDeleteExecutions({ executionUuids: ['e-1', 'e-2'] }),
            {},
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteExecutionsSuccess({ executionUuids: ['e-1', 'e-2'] }));
        expect(emitted[1]).toEqual(alertActions.success('Selected executions successfully deleted.'));
    });

    test('calls deleteExecution for each uuid', async () => {
        const capturedUuids: string[] = [];

        await runEpic(
            RulesEpicIndex.BulkDeleteExecutions,
            rulesActions.bulkDeleteExecutions({ executionUuids: ['e-1', 'e-2'] }),
            {
                actions: {
                    deleteExecution: ({ executionUuid }: { executionUuid: string }) => {
                        capturedUuids.push(executionUuid);
                        return of(undefined);
                    },
                } as any,
            },
            2,
        );

        expect(capturedUuids).toContain('e-1');
        expect(capturedUuids).toContain('e-2');
    });

    test('failure emits bulkDeleteExecutionsFailure and error alert', async () => {
        const err = new Error('delete failed');
        const expectedMessage = 'Failed to delete executions. delete failed';
        const emitted = await runEpic(
            RulesEpicIndex.BulkDeleteExecutions,
            rulesActions.bulkDeleteExecutions({ executionUuids: ['e-1'] }),
            { actions: { deleteExecution: () => throwError(() => err) } as any },
            2,
        );

        expect(emitted[0]).toEqual(rulesActions.bulkDeleteExecutionsFailure({ error: expectedMessage }));
        expect(emitted[1]).toEqual(alertActions.error(expectedMessage));
    });
});
