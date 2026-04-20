import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './rules';

describe('rules slice succeeded flags', () => {
    test('initial state sets succeeded flags to false', () => {
        expect(initialState.createActionSucceeded).toBe(false);
        expect(initialState.createRuleSucceeded).toBe(false);
        expect(initialState.createTriggerSucceeded).toBe(false);
    });

    test('createRule / success / failure', () => {
        let next = reducer(initialState, actions.createRule({ rule: {} as any }));
        expect(next.isCreatingRule).toBe(true);
        expect(next.createRuleSucceeded).toBe(false);

        next = reducer(next, actions.createRuleSuccess({ rule: { uuid: 'r-1' } as any }));
        expect(next.isCreatingRule).toBe(false);
        expect(next.createRuleSucceeded).toBe(true);

        next = reducer({ ...next, isCreatingRule: true }, actions.createRuleFailure({ error: 'err' }));
        expect(next.isCreatingRule).toBe(false);
        expect(next.createRuleSucceeded).toBe(false);
    });

    test('createTrigger / success / failure', () => {
        let next = reducer(initialState, actions.createTrigger({ trigger: {} as any }));
        expect(next.isCreatingTrigger).toBe(true);
        expect(next.createTriggerSucceeded).toBe(false);

        next = reducer(next, actions.createTriggerSuccess({ trigger: { uuid: 't-1' } as any }));
        expect(next.isCreatingTrigger).toBe(false);
        expect(next.createTriggerSucceeded).toBe(true);

        next = reducer({ ...next, isCreatingTrigger: true }, actions.createTriggerFailure({ error: 'err' }));
        expect(next.isCreatingTrigger).toBe(false);
        expect(next.createTriggerSucceeded).toBe(false);
    });

    test('createAction / success / failure', () => {
        let next = reducer(initialState, actions.createAction({ action: {} as any }));
        expect(next.isCreatingAction).toBe(true);
        expect(next.createActionSucceeded).toBe(false);

        next = reducer(next, actions.createActionSuccess({ action: { uuid: 'a-1' } as any }));
        expect(next.isCreatingAction).toBe(false);
        expect(next.createActionSucceeded).toBe(true);

        next = reducer({ ...next, isCreatingAction: true }, actions.createActionFailure({ error: 'err' }));
        expect(next.isCreatingAction).toBe(false);
        expect(next.createActionSucceeded).toBe(false);
    });
});

describe('rules selectors', () => {
    test('selectors read succeeded flags from feature state', () => {
        const rulesState = {
            ...initialState,
            createActionSucceeded: true,
            createRuleSucceeded: true,
            createTriggerSucceeded: true,
        } as any;

        const state = { rules: rulesState } as any;

        expect(selectors.createActionSucceeded(state)).toBe(true);
        expect(selectors.createRuleSucceeded(state)).toBe(true);
        expect(selectors.createTriggerSucceeded(state)).toBe(true);
    });
});

describe('bulk delete reducers', () => {
    const rule1 = { uuid: 'r-1', name: 'Rule 1' } as any;
    const rule2 = { uuid: 'r-2', name: 'Rule 2' } as any;
    const action1 = { uuid: 'a-1', name: 'Action 1' } as any;
    const action2 = { uuid: 'a-2', name: 'Action 2' } as any;
    const condition1 = { uuid: 'c-1', name: 'Condition 1' } as any;
    const condition2 = { uuid: 'c-2', name: 'Condition 2' } as any;
    const trigger1 = { uuid: 't-1', name: 'Trigger 1' } as any;
    const trigger2 = { uuid: 't-2', name: 'Trigger 2' } as any;
    const execution1 = { uuid: 'e-1', name: 'Execution 1' } as any;
    const execution2 = { uuid: 'e-2', name: 'Execution 2' } as any;

    test('initial state has all isBulkDeleting flags set to false', () => {
        expect(initialState.isBulkDeletingRules).toBe(false);
        expect(initialState.isBulkDeletingActions).toBe(false);
        expect(initialState.isBulkDeletingConditions).toBe(false);
        expect(initialState.isBulkDeletingTriggers).toBe(false);
        expect(initialState.isBulkDeletingExecutions).toBe(false);
    });

    test('bulkDeleteRules / success / failure', () => {
        const withRules = { ...initialState, rules: [rule1, rule2] };

        let next = reducer(withRules, actions.bulkDeleteRules({ ruleUuids: ['r-1'] }));
        expect(next.isBulkDeletingRules).toBe(true);

        next = reducer(next, actions.bulkDeleteRulesSuccess({ ruleUuids: ['r-1'] }));
        expect(next.isBulkDeletingRules).toBe(false);
        expect(next.rules).toHaveLength(1);
        expect(next.rules[0].uuid).toBe('r-2');

        next = reducer({ ...next, isBulkDeletingRules: true }, actions.bulkDeleteRulesFailure({ error: 'err' }));
        expect(next.isBulkDeletingRules).toBe(false);
    });

    test('bulkDeleteRulesSuccess removes all specified uuids', () => {
        const withRules = { ...initialState, rules: [rule1, rule2] };
        const next = reducer(withRules, actions.bulkDeleteRulesSuccess({ ruleUuids: ['r-1', 'r-2'] }));
        expect(next.rules).toHaveLength(0);
    });

    test('bulkDeleteActions / success / failure', () => {
        const withActions = { ...initialState, actionsList: [action1, action2] };

        let next = reducer(withActions, actions.bulkDeleteActions({ actionUuids: ['a-1'] }));
        expect(next.isBulkDeletingActions).toBe(true);

        next = reducer(next, actions.bulkDeleteActionsSuccess({ actionUuids: ['a-1'] }));
        expect(next.isBulkDeletingActions).toBe(false);
        expect(next.actionsList).toHaveLength(1);
        expect(next.actionsList[0].uuid).toBe('a-2');

        next = reducer({ ...next, isBulkDeletingActions: true }, actions.bulkDeleteActionsFailure({ error: 'err' }));
        expect(next.isBulkDeletingActions).toBe(false);
    });

    test('bulkDeleteConditions / success / failure', () => {
        const withConditions = { ...initialState, conditions: [condition1, condition2] };

        let next = reducer(withConditions, actions.bulkDeleteConditions({ conditionUuids: ['c-1'] }));
        expect(next.isBulkDeletingConditions).toBe(true);

        next = reducer(next, actions.bulkDeleteConditionsSuccess({ conditionUuids: ['c-1'] }));
        expect(next.isBulkDeletingConditions).toBe(false);
        expect(next.conditions).toHaveLength(1);
        expect(next.conditions[0].uuid).toBe('c-2');

        next = reducer({ ...next, isBulkDeletingConditions: true }, actions.bulkDeleteConditionsFailure({ error: 'err' }));
        expect(next.isBulkDeletingConditions).toBe(false);
    });

    test('bulkDeleteTriggers / success / failure', () => {
        const withTriggers = { ...initialState, triggers: [trigger1, trigger2] };

        let next = reducer(withTriggers, actions.bulkDeleteTriggers({ triggerUuids: ['t-1'] }));
        expect(next.isBulkDeletingTriggers).toBe(true);

        next = reducer(next, actions.bulkDeleteTriggersSuccess({ triggerUuids: ['t-1'] }));
        expect(next.isBulkDeletingTriggers).toBe(false);
        expect(next.triggers).toHaveLength(1);
        expect(next.triggers[0].uuid).toBe('t-2');

        next = reducer({ ...next, isBulkDeletingTriggers: true }, actions.bulkDeleteTriggersFailure({ error: 'err' }));
        expect(next.isBulkDeletingTriggers).toBe(false);
    });

    test('bulkDeleteExecutions / success / failure', () => {
        const withExecutions = { ...initialState, executions: [execution1, execution2] };

        let next = reducer(withExecutions, actions.bulkDeleteExecutions({ executionUuids: ['e-1'] }));
        expect(next.isBulkDeletingExecutions).toBe(true);

        next = reducer(next, actions.bulkDeleteExecutionsSuccess({ executionUuids: ['e-1'] }));
        expect(next.isBulkDeletingExecutions).toBe(false);
        expect(next.executions).toHaveLength(1);
        expect(next.executions[0].uuid).toBe('e-2');

        next = reducer({ ...next, isBulkDeletingExecutions: true }, actions.bulkDeleteExecutionsFailure({ error: 'err' }));
        expect(next.isBulkDeletingExecutions).toBe(false);
    });
});
