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
