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

describe('rules execution updates', () => {
    test('updateExecutionSuccess synchronizes executions, actionDetails.executions and executionDetails', () => {
        const executionBefore = {
            uuid: 'exec-1',
            name: 'Execution 1',
            description: 'before',
            resource: 'actions',
            type: 'setField',
            items: [{ fieldSource: 'meta', fieldIdentifier: 'status', data: 'old' }],
        } as any;

        const executionAfter = {
            ...executionBefore,
            description: 'after',
            items: [{ fieldSource: 'meta', fieldIdentifier: 'status', data: 'new' }],
        } as any;

        const next = reducer(
            {
                ...initialState,
                isUpdatingExecution: true,
                executions: [executionBefore],
                executionDetails: executionBefore,
                actionDetails: {
                    uuid: 'action-1',
                    name: 'Action 1',
                    resource: 'actions',
                    description: 'desc',
                    executions: [executionBefore],
                } as any,
            },
            actions.updateExecutionSuccess({ execution: executionAfter }),
        );

        expect(next.isUpdatingExecution).toBe(false);
        expect(next.executions[0]).toEqual(executionAfter);
        expect(next.executionDetails).toEqual(executionAfter);
        expect(next.actionDetails?.executions[0]).toEqual(executionAfter);
    });

    test('updateExecutionSuccess keeps unrelated action executions unchanged', () => {
        const targetExecution = {
            uuid: 'exec-1',
            name: 'Execution 1',
            resource: 'actions',
            type: 'setField',
            items: [],
        } as any;
        const untouchedExecution = {
            uuid: 'exec-2',
            name: 'Execution 2',
            resource: 'actions',
            type: 'setField',
            items: [{ fieldSource: 'meta', fieldIdentifier: 'env', data: 'prod' }],
        } as any;

        const next = reducer(
            {
                ...initialState,
                executions: [targetExecution, untouchedExecution],
                actionDetails: {
                    uuid: 'action-1',
                    name: 'Action 1',
                    resource: 'actions',
                    executions: [targetExecution, untouchedExecution],
                } as any,
            },
            actions.updateExecutionSuccess({ execution: { ...targetExecution, items: [{ data: 'changed' }] } as any }),
        );

        expect(next.actionDetails?.executions[1]).toEqual(untouchedExecution);
        expect(next.executions[1]).toEqual(untouchedExecution);
    });
});

describe('rules reducer smoke coverage', () => {
    test('handles major list/create/delete/get/update/history/association reducers', () => {
        let state = {
            ...initialState,
            rules: [{ uuid: 'rule-1' } as any],
            executions: [{ uuid: 'exec-1' } as any],
            actionsList: [{ uuid: 'action-1' } as any],
            conditions: [{ uuid: 'cond-1' } as any],
            triggers: [{ uuid: 'trig-1' } as any],
            triggerDetails: { uuid: 'trig-1' } as any,
            executionDetails: { uuid: 'exec-1' } as any,
            conditionDetails: { uuid: 'cond-1' } as any,
            ruleDetails: { uuid: 'rule-1' } as any,
            actionDetails: {
                uuid: 'action-1',
                executions: [{ uuid: 'exec-1' }],
            } as any,
            eventTriggerAssociation: { created: ['trig-1'] } as any,
        } as any;

        state = reducer(state, actions.listRules({ resource: 'actions' as any }));
        state = reducer(state, actions.listRulesSuccess({ rules: [{ uuid: 'rule-2' } as any] }));
        state = reducer(state, actions.listRulesFailure({ error: 'err' }));

        state = reducer(state, actions.listExecutions({ resource: 'actions' as any }));
        state = reducer(state, actions.listExecutionsSuccess({ executions: [{ uuid: 'exec-2' } as any] }));
        state = reducer(state, actions.listExecutionsFailure({ error: 'err' }));

        state = reducer(state, actions.listActions({ resource: 'actions' as any }));
        state = reducer(state, actions.listActionsSuccess({ actionsList: [{ uuid: 'action-2' } as any] }));
        state = reducer(state, actions.listActionsFailure({ error: 'err' }));

        state = reducer(state, actions.listConditions({ resource: 'actions' as any }));
        state = reducer(state, actions.listConditionsSuccess({ conditions: [{ uuid: 'cond-2' } as any] }));
        state = reducer(state, actions.listConditionsFailure({ error: 'err' }));

        state = reducer(state, actions.listTriggers({ resource: 'actions' as any }));
        state = reducer(state, actions.listTriggersSuccess({ triggers: [{ uuid: 'trig-2' } as any] }));
        state = reducer(state, actions.listTriggersFailure({ error: 'err' }));

        state = reducer(state, actions.createExecution({ executionRequestModel: {} as any }));
        state = reducer(state, actions.createExecutionSuccess({ execution: { uuid: 'exec-3' } as any }));
        state = reducer(state, actions.createExecutionFailure({ error: 'err' }));

        state = reducer(state, actions.createAction({ action: {} as any }));
        state = reducer(state, actions.createActionSuccess({ action: { uuid: 'action-3' } as any }));
        state = reducer(state, actions.createActionFailure({ error: 'err' }));

        state = reducer(state, actions.createCondition({ conditionRequestModel: {} as any }));
        state = reducer(state, actions.createConditionSuccess({ condition: { uuid: 'cond-3' } as any }));
        state = reducer(state, actions.createConditionFailure({ error: 'err' }));

        state = reducer(state, actions.createRule({ rule: {} as any }));
        state = reducer(state, actions.createRuleSuccess({ rule: { uuid: 'rule-3' } as any }));
        state = reducer(state, actions.createRuleFailure({ error: 'err' }));

        state = reducer(state, actions.createTrigger({ trigger: {} as any }));
        state = reducer(state, actions.createTriggerSuccess({ trigger: { uuid: 'trig-3' } as any }));
        state = reducer(state, actions.createTriggerFailure({ error: 'err' }));

        state = reducer(state, actions.deleteExecution({ executionUuid: 'exec-2' }));
        state = reducer(state, actions.deleteExecutionSuccess({ executionUuid: 'exec-2' }));
        state = reducer(state, actions.deleteExecutionFailure({ error: 'err' }));

        state = reducer(state, actions.deleteAction({ actionUuid: 'action-2' }));
        state = reducer(state, actions.deleteActionSuccess({ actionUuid: 'action-2' }));
        state = reducer(state, actions.deleteActionFailure({ error: 'err' }));

        state = reducer(state, actions.deleteCondition({ conditionUuid: 'cond-2' }));
        state = reducer(state, actions.deleteConditionSuccess({ conditionUuid: 'cond-2' }));
        state = reducer(state, actions.deleteConditionFailure({ error: 'err' }));

        state = reducer(state, actions.deleteRule({ ruleUuid: 'rule-2' }));
        state = reducer(state, actions.deleteRuleSuccess({ ruleUuid: 'rule-2' }));
        state = reducer(state, actions.deleteRuleFailure({ error: 'err' }));

        state = reducer(state, actions.deleteTrigger({ triggerUuid: 'trig-2' }));
        state = reducer(state, actions.deleteTriggerSuccess({ triggerUuid: 'trig-2' }));
        state = reducer(state, actions.deleteTriggerFailure({ error: 'err' }));

        state = reducer(state, actions.getExecution({ executionUuid: 'exec-1' }));
        state = reducer(state, actions.getExecutionSuccess({ execution: { uuid: 'exec-1' } as any }));
        state = reducer(state, actions.getExecutionFailure({ error: 'err' }));

        state = reducer(state, actions.getAction({ actionUuid: 'action-1' }));
        state = reducer(state, actions.getActionSuccess({ action: { uuid: 'action-1', executions: [] } as any }));
        state = reducer(state, actions.getActionFailure({ error: 'err' }));

        state = reducer(state, actions.getCondition({ conditionUuid: 'cond-1' }));
        state = reducer(state, actions.getConditionSuccess({ condition: { uuid: 'cond-1' } as any }));
        state = reducer(state, actions.getConditionFailure({ error: 'err' }));

        state = reducer(state, actions.getRule({ ruleUuid: 'rule-1' }));
        state = reducer(state, actions.getRuleSuccess({ rule: { uuid: 'rule-1' } as any }));
        state = reducer(state, actions.getRuleFailure({ error: 'err' }));

        state = reducer(state, actions.getTrigger({ triggerUuid: 'trig-1' }));
        state = reducer(state, actions.getTriggerSuccess({ trigger: { uuid: 'trig-1' } as any }));
        state = reducer(state, actions.getTriggerFailure({ error: 'err' }));

        state = reducer(state, actions.updateExecution({ executionUuid: 'exec-1', execution: {} as any }));
        state = reducer(state, actions.updateExecutionFailure({ error: 'err' }));

        state = reducer(state, actions.updateAction({ actionUuid: 'action-1', action: {} as any }));
        state = reducer(state, actions.updateActionSuccess({ action: { uuid: 'action-1', executions: [] } as any }));
        state = reducer(state, actions.updateActionFailure({ error: 'err' }));

        state = reducer(state, actions.updateCondition({ conditionUuid: 'cond-1', condition: {} as any }));
        state = reducer(state, actions.updateConditionSuccess({ condition: { uuid: 'cond-1' } as any }));
        state = reducer(state, actions.updateConditionFailure({ error: 'err' }));

        state = reducer(state, actions.updateRule({ ruleUuid: 'rule-1', rule: {} as any }));
        state = reducer(state, actions.updateRuleSuccess({ rule: { uuid: 'rule-1' } as any }));
        state = reducer(state, actions.updateRuleFailure({ error: 'err' }));

        state = reducer(state, actions.updateTrigger({ triggerUuid: 'trig-1', trigger: {} as any }));
        state = reducer(state, actions.updateTriggerSuccess({ trigger: { uuid: 'trig-1' } as any }));
        state = reducer(state, actions.updateTriggerFailure({ error: 'err' }));

        state = reducer(state, actions.getTriggerHistory({ triggerUuid: 'trig-1', triggerObjectUuid: 'obj-1' }));
        state = reducer(state, actions.getTriggerHistorySuccess({ triggerHistories: [{ triggerUuid: 'trig-1' } as any] }));
        state = reducer(state, actions.getTriggerHistoryFailure({ error: 'err' }));

        state = reducer(state, actions.getTriggerHistorySummary({ triggerObjectUuid: 'obj-1' }));
        state = reducer(state, actions.getTriggerHistorySummarySuccess({ triggerHistorySummary: { failed: 0 } as any }));
        state = reducer(state, actions.getTriggerHistorySummaryFailure({ error: 'err' }));

        state = reducer(state, actions.getEventTriggersAssociations({ resource: 'actions' as any, associationObjectUuid: 'assoc-1' }));
        state = reducer(state, actions.getEventTriggersAssociationsSuccess({ eventTriggerAssociation: { created: ['trig-1'] } as any }));
        state = reducer(state, actions.getEventTriggersAssociationsFailure({ error: 'err' }));

        state = reducer(
            state,
            actions.associateEventTriggers({
                triggerEventAssociationRequestModel: { event: 'created', triggerUuids: ['trig-1', 'trig-2'] } as any,
            }),
        );
        state = reducer(
            state,
            actions.associateEventTriggersSuccess({
                triggerEventAssociationRequestModel: { event: 'created', triggerUuids: ['trig-1', 'trig-2'] } as any,
            }),
        );
        state = reducer(
            state,
            actions.associateEventTriggersSuccess({
                triggerEventAssociationRequestModel: { event: 'created', triggerUuids: [] } as any,
            }),
        );
        state = reducer(state, actions.associateEventTriggersFailure({ error: 'err' }));

        expect(state.isUpdatingExecution).toBe(false);
        expect(state.isFetchingTriggerHistorySummary).toBe(false);
        expect(state.isFetchingEventTriggersAssociation).toBe(false);

        const reset = reducer(state, actions.resetState());
        expect(reset).toEqual(initialState);
    });
});
