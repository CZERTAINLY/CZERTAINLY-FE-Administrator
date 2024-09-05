import { of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';

import * as slice from './rules';
import { transformActionDtoToModel } from './transform/auth';
import {
    tranformExecutionRequestModelToDto,
    transformActionDetailDtoToModel,
    transformActionRequestModelToDto,
    transformConditionDtoToModel,
    transformConditionRequestModelToDto,
    transformExecutionDtoToModel,
    transformRuleDetailDtoToModel,
    transformRuleDtoToModel,
    transformRuleRequestModelToDto,
    transformTriggerDetailDtoToModel,
    transformTriggerDtoToModel,
    transformTriggerHistoryDtoToModel,
    transformTriggerHistorySummaryDtoToModel,
    transformTriggerRequestModelToDto,
    transformUpdateActionRequestModelToDto,
    transformUpdateConditionRequestModelToDto,
    transformUpdateExecutionRequestModelToDto,
    transformUpdateRuleRequestModelToDto,
    transformUpdateTriggerRequestModelToDto,
} from './transform/rules';

const listRules: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listRules.match),
        switchMap((action) =>
            deps.apiClients.rules.listRules({ resource: action.payload.resource }).pipe(
                switchMap((rules) => of(slice.actions.listRulesSuccess({ rules: rules.map((rule) => transformRuleDtoToModel(rule)) }))),

                catchError((err) =>
                    of(
                        slice.actions.listRulesFailure({ error: extractError(err, 'Failed to get rules list') }),
                        alertActions.error(extractError(err, 'Failed to get rules list')),
                    ),
                ),
            ),
        ),
    );
};

const listExecutions: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listExecutions.match),
        switchMap((action) =>
            deps.apiClients.actions.listExecutions({ resource: action.payload.resource }).pipe(
                switchMap((executions) =>
                    of(
                        slice.actions.listExecutionsSuccess({
                            executions: executions.map((execution) => transformExecutionDtoToModel(execution)),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listExecutionsFailure({ error: extractError(err, 'Failed to get Executions list') }),
                        alertActions.error(extractError(err, 'Failed to get Executions list')),
                    ),
                ),
            ),
        ),
    );
};

const listActions: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listActions.match),
        switchMap((action) =>
            deps.apiClients.actions.listActions({ resource: action.payload.resource }).pipe(
                switchMap((actions) =>
                    of(
                        slice.actions.listActionsSuccess({
                            actionsList: actions.map((action) => transformActionDtoToModel(action)),
                        }),
                    ),
                ),
                catchError((err) => of(slice.actions.listActionsFailure({ error: extractError(err, 'Failed to get actions list') }))),
            ),
        ),
    );
};

const listConditions: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listConditions.match),
        switchMap((action) =>
            deps.apiClients.rules.listConditions({ resource: action.payload.resource }).pipe(
                switchMap((conditions) =>
                    of(
                        slice.actions.listConditionsSuccess({
                            conditions: conditions.map((condition) => transformConditionDtoToModel(condition)),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listConditionsFailure({ error: extractError(err, 'Failed to get conditions list') }),
                        alertActions.error(extractError(err, 'Failed to get conditions list')),
                    ),
                ),
            ),
        ),
    );
};

const listTriggers: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listTriggers.match),
        switchMap((action) =>
            deps.apiClients.triggers.listTriggers({ resource: action.payload.resource, eventResource: action.payload.eventResource }).pipe(
                switchMap((triggers) =>
                    of(
                        slice.actions.listTriggersSuccess({
                            triggers: triggers.map((trigger) => transformTriggerDtoToModel(trigger)),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listTriggersFailure({ error: extractError(err, 'Failed to get triggers list') }),
                        alertActions.error(extractError(err, 'Failed to get triggers list')),
                    ),
                ),
            ),
        ),
    );
};

const createExecution: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createExecution.match),
        switchMap((action) =>
            deps.apiClients.actions
                .createExecution({
                    executionRequestDto: tranformExecutionRequestModelToDto(action.payload.executionRequestModel),
                })
                .pipe(
                    switchMap((execution) =>
                        of(
                            slice.actions.createExecutionSuccess({ execution: transformExecutionDtoToModel(execution) }),
                            appRedirectActions.redirect({ url: `../executions/detail/${execution.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.createExecutionFailure({ error: extractError(err, 'Failed to create Execution') }),
                            alertActions.error(extractError(err, 'Failed to create Execution')),
                        ),
                    ),
                ),
        ),
    );
};

const createAction: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createAction.match),
        switchMap((action) =>
            deps.apiClients.actions.createAction({ actionRequestDto: transformActionRequestModelToDto(action.payload.action) }).pipe(
                switchMap((action) =>
                    of(
                        slice.actions.createActionSuccess({ action: transformActionDetailDtoToModel(action) }),
                        appRedirectActions.redirect({ url: `../actions/detail/${action.uuid}` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.createActionFailure({ error: extractError(err, 'Failed to create action') }),
                        alertActions.error(extractError(err, 'Failed to create action')),
                    ),
                ),
            ),
        ),
    );
};

const createCondition: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createCondition.match),
        switchMap((action) =>
            deps.apiClients.rules
                .createCondition({
                    conditionRequestDto: transformConditionRequestModelToDto(action.payload.conditionRequestModel),
                })
                .pipe(
                    switchMap((condition) =>
                        of(
                            slice.actions.createConditionSuccess({
                                condition: transformConditionDtoToModel(condition),
                            }),
                            appRedirectActions.redirect({ url: `../conditions/detail/${condition.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.createConditionFailure({ error: extractError(err, 'Failed to create condition') }),
                            alertActions.error(extractError(err, 'Failed to create condition')),
                        ),
                    ),
                ),
        ),
    );
};
const createRule: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createRule.match),
        switchMap((action) =>
            deps.apiClients.rules.createRule({ ruleRequestDto: transformRuleRequestModelToDto(action.payload.rule) }).pipe(
                switchMap((rule) =>
                    of(
                        slice.actions.createRuleSuccess({ rule: transformRuleDetailDtoToModel(rule) }),
                        appRedirectActions.redirect({ url: `../rules/detail/${rule.uuid}` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.createRuleFailure({ error: extractError(err, 'Failed to create rule') }),
                        alertActions.error(extractError(err, 'Failed to create rule')),
                    ),
                ),
            ),
        ),
    );
};

const createTrigger: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createTrigger.match),
        switchMap((action) =>
            deps.apiClients.triggers.createTrigger({ triggerRequestDto: transformTriggerRequestModelToDto(action.payload.trigger) }).pipe(
                switchMap((trigger) =>
                    of(
                        slice.actions.createTriggerSuccess({ trigger: transformTriggerDetailDtoToModel(trigger) }),
                        appRedirectActions.redirect({ url: `../../triggers/detail/${trigger.uuid}` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.createTriggerFailure({ error: extractError(err, 'Failed to create trigger') }),
                        alertActions.error(extractError(err, 'Failed to create trigger')),
                    ),
                ),
            ),
        ),
    );
};

const deleteExecution: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteExecution.match),
        switchMap((action) =>
            deps.apiClients.actions.deleteExecution({ executionUuid: action.payload.executionUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteExecutionSuccess({ executionUuid: action.payload.executionUuid }),
                        appRedirectActions.redirect({ url: `../../actions/1` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteExecutionFailure({ error: extractError(err, 'Failed to delete Execution') }),
                        alertActions.error(extractError(err, 'Failed to delete Execution')),
                    ),
                ),
            ),
        ),
    );
};

const deleteAction: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteAction.match),
        switchMap((action) =>
            deps.apiClients.actions.deleteAction({ actionUuid: action.payload.actionUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteActionSuccess({ actionUuid: action.payload.actionUuid }),
                        appRedirectActions.redirect({ url: `../actions/0` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteActionFailure({ error: extractError(err, 'Failed to delete action') }),
                        alertActions.error(extractError(err, 'Failed to delete action')),
                    ),
                ),
            ),
        ),
    );
};

const deleteCondition: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteCondition.match),
        switchMap((action) =>
            deps.apiClients.rules.deleteCondition({ conditionUuid: action.payload.conditionUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteConditionSuccess({ conditionUuid: action.payload.conditionUuid }),
                        appRedirectActions.redirect({ url: `../../rules/1` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteConditionFailure({ error: extractError(err, 'Failed to delete condition') }),
                        alertActions.error(extractError(err, 'Failed to delete condition')),
                    ),
                ),
            ),
        ),
    );
};

const deleteRule: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteRule.match),
        switchMap((action) =>
            deps.apiClients.rules.deleteRule({ ruleUuid: action.payload.ruleUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteRuleSuccess({ ruleUuid: action.payload.ruleUuid }),
                        appRedirectActions.redirect({ url: `../rules/0` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteRuleFailure({ error: extractError(err, 'Failed to delete rule') }),
                        alertActions.error(extractError(err, 'Failed to delete rule')),
                    ),
                ),
            ),
        ),
    );
};

const deleteTrigger: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteTrigger.match),
        switchMap((action) =>
            deps.apiClients.triggers.deleteTrigger({ triggerUuid: action.payload.triggerUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteTriggerSuccess({ triggerUuid: action.payload.triggerUuid }),
                        appRedirectActions.redirect({ url: `../../triggers` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteTriggerFailure({ error: extractError(err, 'Failed to delete trigger') }),
                        alertActions.error(extractError(err, 'Failed to delete trigger')),
                    ),
                ),
            ),
        ),
    );
};

const getExecution: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getExecution.match),
        switchMap((action) =>
            deps.apiClients.actions.getExecution({ executionUuid: action.payload.executionUuid }).pipe(
                switchMap((actionGroup) => of(slice.actions.getExecutionSuccess({ execution: transformExecutionDtoToModel(actionGroup) }))),
                catchError((err) =>
                    of(
                        (slice.actions.getExecutionFailure({ error: extractError(err, 'Failed to get Execution') }),
                        alertActions.error(extractError(err, 'Failed to get Execution'))),
                    ),
                ),
            ),
        ),
    );
};

const getAction: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getAction.match),
        switchMap((action) =>
            deps.apiClients.actions.getAction({ actionUuid: action.payload.actionUuid }).pipe(
                switchMap((actionGroup) => of(slice.actions.getActionSuccess({ action: transformActionDetailDtoToModel(actionGroup) }))),
                catchError((err) =>
                    of(
                        slice.actions.getActionFailure({ error: extractError(err, 'Failed to get Action') }),
                        alertActions.error(extractError(err, 'Failed to get Action')),
                    ),
                ),
            ),
        ),
    );
};

const getCondition: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getCondition.match),
        switchMap((action) =>
            deps.apiClients.rules.getCondition({ conditionUuid: action.payload.conditionUuid }).pipe(
                switchMap((conditionGroup) =>
                    of(
                        slice.actions.getConditionSuccess({
                            condition: transformConditionDtoToModel(conditionGroup),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getConditionFailure({ error: extractError(err, 'Failed to get Condition') }),
                        alertActions.error(extractError(err, 'Failed to get Condition')),
                    ),
                ),
            ),
        ),
    );
};

const getRule: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getRule.match),
        switchMap((action) =>
            deps.apiClients.rules.getRule({ ruleUuid: action.payload.ruleUuid }).pipe(
                switchMap((rule) => of(slice.actions.getRuleSuccess({ rule: transformRuleDetailDtoToModel(rule) }))),
                catchError((err) =>
                    of(
                        slice.actions.getRuleFailure({ error: extractError(err, 'Failed to get rule') }),
                        alertActions.error(extractError(err, 'Failed to get rule')),
                    ),
                ),
            ),
        ),
    );
};

const getTrigger: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getTrigger.match),
        switchMap((action) =>
            deps.apiClients.triggers.getTrigger({ triggerUuid: action.payload.triggerUuid }).pipe(
                switchMap((trigger) => of(slice.actions.getTriggerSuccess({ trigger: transformTriggerDetailDtoToModel(trigger) }))),
                catchError((err) =>
                    of(
                        slice.actions.getTriggerFailure({ error: extractError(err, 'Failed to get trigger') }),
                        alertActions.error(extractError(err, 'Failed to get trigger')),
                    ),
                ),
            ),
        ),
    );
};

const updateExecution: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateExecution.match),
        switchMap((action) =>
            deps.apiClients.actions
                .updateExecution({
                    executionUuid: action.payload.executionUuid,
                    updateExecutionRequestDto: transformUpdateExecutionRequestModelToDto(action.payload.execution),
                })
                .pipe(
                    switchMap((execution) =>
                        of(
                            slice.actions.updateExecutionSuccess({
                                execution: transformExecutionDtoToModel(execution),
                            }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateExecutionFailure({ error: extractError(err, 'Failed to update action group') }),
                            alertActions.error(extractError(err, 'Failed to update action group')),
                            slice.actions.getExecution({ executionUuid: action.payload.executionUuid }),
                        ),
                    ),
                ),
        ),
    );
};

const updateAction: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateAction.match),
        switchMap((action) =>
            deps.apiClients.actions
                .updateAction({
                    actionUuid: action.payload.actionUuid,
                    updateActionRequestDto: transformUpdateActionRequestModelToDto(action.payload.action),
                })
                .pipe(
                    switchMap((actionDetail) =>
                        of(
                            slice.actions.updateActionSuccess({
                                action: transformActionDetailDtoToModel(actionDetail),
                            }),
                            ...(action?.payload?.noRedirect
                                ? []
                                : [appRedirectActions.redirect({ url: `../actions/detail/${actionDetail.uuid}` })]),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateActionFailure({ error: extractError(err, 'Failed to update action group') }),
                            alertActions.error(extractError(err, 'Failed to update action group')),
                            slice.actions.getAction({ actionUuid: action.payload.actionUuid }),
                        ),
                    ),
                ),
        ),
    );
};

const updateCondition: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateCondition.match),
        switchMap((action) =>
            deps.apiClients.rules
                .updateCondition({
                    conditionUuid: action.payload.conditionUuid,
                    updateConditionRequestDto: transformUpdateConditionRequestModelToDto(action.payload.condition),
                })
                .pipe(
                    switchMap((condition) =>
                        of(
                            slice.actions.updateConditionSuccess({
                                condition: transformConditionDtoToModel(condition),
                            }),
                            appRedirectActions.redirect({ url: `../../conditions/detail/${condition.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateConditionFailure({ error: extractError(err, 'Failed to update condition group') }),
                            alertActions.error(extractError(err, 'Failed to update Condition Group')),
                            slice.actions.getCondition({ conditionUuid: action.payload.conditionUuid }),
                        ),
                    ),
                ),
        ),
    );
};

const updateRule: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateRule.match),
        switchMap((action) =>
            deps.apiClients.rules
                .updateRule({
                    ruleUuid: action.payload.ruleUuid,
                    updateRuleRequestDto: transformUpdateRuleRequestModelToDto(action.payload.rule),
                })
                .pipe(
                    switchMap((rule) =>
                        of(
                            slice.actions.updateRuleSuccess({ rule: transformRuleDetailDtoToModel(rule) }),
                            ...(action?.payload?.noRedirect ? [] : [appRedirectActions.redirect({ url: `../rules/detail/${rule.uuid}` })]),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateRuleFailure({ error: extractError(err, 'Failed to update rule') }),
                            alertActions.error(extractError(err, 'Failed to update rule')),
                            slice.actions.getRule({ ruleUuid: action.payload.ruleUuid }),
                        ),
                    ),
                ),
        ),
    );
};

const updateTrigger: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateTrigger.match),
        switchMap((action) =>
            deps.apiClients.triggers
                .updateTrigger({
                    triggerUuid: action.payload.triggerUuid,
                    updateTriggerRequestDto: transformUpdateTriggerRequestModelToDto(action.payload.trigger),
                })
                .pipe(
                    switchMap((trigger) => of(slice.actions.updateTriggerSuccess({ trigger: transformTriggerDetailDtoToModel(trigger) }))),
                    catchError((err) =>
                        of(
                            slice.actions.updateTriggerFailure({ error: extractError(err, 'Failed to update trigger') }),
                            alertActions.error(extractError(err, 'Failed to update trigger')),
                            slice.actions.getTrigger({ triggerUuid: action.payload.triggerUuid }),
                        ),
                    ),
                ),
        ),
    );
};

const getTriggerHistory: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getTriggerHistory.match),
        switchMap((action) =>
            deps.apiClients.triggers
                .getTriggerHistory({ triggerUuid: action.payload.triggerUuid, associationObjectUuid: action.payload.triggerObjectUuid })
                .pipe(
                    switchMap((triggerHistory) =>
                        of(
                            slice.actions.getTriggerHistorySuccess({
                                triggerHistories: triggerHistory.map(transformTriggerHistoryDtoToModel),
                            }),
                        ),
                    ),
                    catchError((err) =>
                        of(slice.actions.getTriggerHistoryFailure({ error: extractError(err, 'Failed to get trigger history') })),
                    ),
                ),
        ),
    );
};

const getTriggerHistorySummary: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getTriggerHistorySummary.match),
        switchMap((action) =>
            deps.apiClients.triggers.getTriggerHistorySummary({ associationObjectUuid: action.payload.triggerObjectUuid }).pipe(
                switchMap((triggerHistorySummary) =>
                    of(
                        slice.actions.getTriggerHistorySummarySuccess({
                            triggerHistorySummary: transformTriggerHistorySummaryDtoToModel(triggerHistorySummary),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getTriggerHistorySummaryFailure({
                            error: extractError(err, 'Failed to get trigger history summary'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listRules,
    listExecutions,
    listConditions,
    listTriggers,
    listActions,
    createExecution,
    createCondition,
    createRule,
    createAction,
    createTrigger,
    deleteExecution,
    deleteAction,
    deleteCondition,
    deleteRule,
    deleteTrigger,
    getExecution,
    getAction,
    getCondition,
    getRule,
    getTrigger,
    updateAction,
    updateExecution,
    updateCondition,
    updateRule,
    updateTrigger,
    getTriggerHistory,
    getTriggerHistorySummary,
];

export default epics;
