import { of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { AppEpic } from 'ducks';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';

import * as slice from './rules';
import {
    tranformRuleActionGroupRequestModelToDto,
    transformConditionRuleGroupDtoToModel,
    transformConditionRuleGroupRequestModelToDto,
    transformDetailRuleDtoToModel,
    transformDtoRuleToModel,
    // transformRuleActionGroupDetailDtoToModel,
    transformRuleActionGroupDtoToModel,
    transformRuleConditionGroupDetailDtoToModel,
    transformRuleConditionGroupDtoToModel,
    // transformRuleConditionGroupDetailDtoToModel,
    transformRuleRequestModelToDto,
    transformRuleTriggerUpdateRequestModelToDto,
    transformRuleUpdateRequestModelToDto,
    transformTriggerRuleDetailDtoToModel,
    transformTriggerRuleDtoToModel,
    transformTriggerRuleRequestModelToDto,
    transformUpdateActionGroupRequestModelToDto,
    transformUpdateGroupRuleConditionRequestModelToDto,
} from './transform/rules';

const listRules: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listRules.match),
        switchMap((action) =>
            deps.apiClients.rules.listRules({ resource: action.payload.resource }).pipe(
                switchMap((rules) => of(slice.actions.listRulesSuccess({ rules: rules.map((rule) => transformDtoRuleToModel(rule)) }))),

                catchError((err) => of(slice.actions.listRulesFailure({ error: extractError(err, 'Failed to get rules list') }))),
            ),
        ),
    );
};

const listActionGroups: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listActionGroups.match),
        switchMap((action) =>
            deps.apiClients.rules.listActionGroups({ resource: action.payload.resource }).pipe(
                switchMap((actionGroups) =>
                    of(
                        slice.actions.listActionGroupsSuccess({
                            actionGroups: actionGroups.map((actionGroup) => transformRuleActionGroupDtoToModel(actionGroup)),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(slice.actions.listActionGroupsFailure({ error: extractError(err, 'Failed to get action groups list') })),
                ),
            ),
        ),
    );
};

const listConditionGroups: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listConditionGroups.match),
        switchMap((action) =>
            deps.apiClients.rules.listConditionGroups({ resource: action.payload.resource }).pipe(
                switchMap((conditionGroups) =>
                    of(
                        slice.actions.listConditionGroupsSuccess({
                            conditionGroups: conditionGroups.map((conditionGroup) => transformConditionRuleGroupDtoToModel(conditionGroup)),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(slice.actions.listConditionGroupsFailure({ error: extractError(err, 'Failed to get condition groups list') })),
                ),
            ),
        ),
    );
};

const listTriggers: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listTriggers.match),
        switchMap((action) =>
            deps.apiClients.rules.listTriggers({ resource: action.payload.resource }).pipe(
                switchMap((triggers) =>
                    of(slice.actions.listTriggersSuccess({ triggers: triggers.map((trigger) => transformTriggerRuleDtoToModel(trigger)) })),
                ),
                catchError((err) => of(slice.actions.listTriggersFailure({ error: extractError(err, 'Failed to get triggers list') }))),
            ),
        ),
    );
};

const createActionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createActionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules
                .createActionGroup({
                    ruleActionGroupRequestDto: tranformRuleActionGroupRequestModelToDto(action.payload.ruleActionGroupRequest),
                })
                .pipe(
                    switchMap((actionGroup) =>
                        of(
                            slice.actions.createActionGroupSuccess({ actionGroup: transformRuleActionGroupDtoToModel(actionGroup) }),
                            appRedirectActions.redirect({ url: `../actiongroups/detail/${actionGroup.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(slice.actions.createActionGroupFailure({ error: extractError(err, 'Failed to create action group') })),
                    ),
                ),
        ),
    );
};

const createConditionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createConditionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules
                .createConditionGroup({
                    ruleConditionGroupRequestDto: transformConditionRuleGroupRequestModelToDto(action.payload.ruleConditionGroupRequest),
                })
                .pipe(
                    switchMap((conditionGroup) =>
                        of(
                            slice.actions.createConditionGroupSuccess({
                                conditionGroup: transformRuleConditionGroupDetailDtoToModel(conditionGroup),
                            }),
                            appRedirectActions.redirect({ url: `../conditiongroups/detail/${conditionGroup.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(slice.actions.createConditionGroupFailure({ error: extractError(err, 'Failed to create condition group') })),
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
                        slice.actions.createRuleSuccess({ rule: transformDetailRuleDtoToModel(rule) }),
                        appRedirectActions.redirect({ url: `../rules/detail/${rule.uuid}` }),
                    ),
                ),
                catchError((err) => of(slice.actions.createRuleFailure({ error: extractError(err, 'Failed to create rule') }))),
            ),
        ),
    );
};

const createTrigger: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createTrigger.match),
        switchMap((action) =>
            deps.apiClients.rules
                .createTrigger({ ruleTriggerRequestDto: transformTriggerRuleRequestModelToDto(action.payload.trigger) })
                .pipe(
                    switchMap((trigger) =>
                        of(
                            slice.actions.createTriggerSuccess({ trigger: transformTriggerRuleDtoToModel(trigger) }),
                            appRedirectActions.redirect({ url: `../../triggers` }),
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

const deleteActionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteActionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules.deleteActionGroup({ actionGroupUuid: action.payload.actionGroupUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteActionGroupSuccess({ actionGroupUuid: action.payload.actionGroupUuid }),
                        appRedirectActions.redirect({ url: `../../actiongroups` }),
                    ),
                ),
                catchError((err) =>
                    of(slice.actions.deleteActionGroupFailure({ error: extractError(err, 'Failed to delete action group') })),
                ),
            ),
        ),
    );
};

const deleteConditionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteConditionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules.deleteConditionGroup({ conditionGroupUuid: action.payload.conditionGroupUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteConditionGroupSuccess({ conditionGroupUuid: action.payload.conditionGroupUuid }),
                        appRedirectActions.redirect({ url: `../../conditiongroups` }),
                    ),
                ),
                catchError((err) =>
                    of(slice.actions.deleteConditionGroupFailure({ error: extractError(err, 'Failed to delete condition group') })),
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
                        appRedirectActions.redirect({ url: `../rules` }),
                    ),
                ),
                catchError((err) => of(slice.actions.deleteRuleFailure({ error: extractError(err, 'Failed to delete rule') }))),
            ),
        ),
    );
};

const deleteTrigger: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteTrigger.match),
        switchMap((action) =>
            deps.apiClients.rules.deleteTrigger({ triggerUuid: action.payload.triggerUuid }).pipe(
                switchMap(() =>
                    of(
                        slice.actions.deleteTriggerSuccess({ triggerUuid: action.payload.triggerUuid }),
                        appRedirectActions.redirect({ url: `../../rules` }),
                    ),
                ),
                catchError((err) => of(slice.actions.deleteTriggerFailure({ error: extractError(err, 'Failed to delete trigger') }))),
            ),
        ),
    );
};

const getActionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getActionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules.getActionGroup({ actionGroupUuid: action.payload.actionGroupUuid }).pipe(
                switchMap((actionGroup) =>
                    of(slice.actions.getActionGroupSuccess({ actionGroup: transformRuleActionGroupDtoToModel(actionGroup) })),
                ),
                catchError((err) => of(slice.actions.getActionGroupFailure({ error: extractError(err, 'Failed to get action group') }))),
            ),
        ),
    );
};

const getConditionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getConditionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules.getConditionGroup({ conditionGroupUuid: action.payload.conditionGroupUuid }).pipe(
                switchMap((conditionGroup) =>
                    of(
                        slice.actions.getConditionGroupSuccess({
                            conditionGroup: transformRuleConditionGroupDetailDtoToModel(conditionGroup),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(slice.actions.getConditionGroupFailure({ error: extractError(err, 'Failed to get condition group') })),
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
                switchMap((rule) => of(slice.actions.getRuleSuccess({ rule: transformDetailRuleDtoToModel(rule) }))),
                catchError((err) => of(slice.actions.getRuleFailure({ error: extractError(err, 'Failed to get rule') }))),
            ),
        ),
    );
};

const getTrigger: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getTrigger.match),
        switchMap((action) =>
            deps.apiClients.rules.getTrigger({ triggerUuid: action.payload.triggerUuid }).pipe(
                switchMap((trigger) => of(slice.actions.getTriggerSuccess({ trigger: transformTriggerRuleDetailDtoToModel(trigger) }))),
                catchError((err) => of(slice.actions.getTriggerFailure({ error: extractError(err, 'Failed to get trigger') }))),
            ),
        ),
    );
};

const updateActionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateActionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules
                .updateActionGroup({
                    actionGroupUuid: action.payload.actionGroupUuid,
                    updateRuleActionGroupRequestDto: transformUpdateActionGroupRequestModelToDto(action.payload.actionGroup),
                })
                .pipe(
                    switchMap((actionGroup) =>
                        of(
                            slice.actions.updateActionGroupSuccess({
                                actionGroup: transformRuleActionGroupDtoToModel(actionGroup),
                            }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateActionGroupFailure({ error: extractError(err, 'Failed to update action group') }),
                            alertActions.error(extractError(err, 'Failed to update action group')),
                            slice.actions.getActionGroup({ actionGroupUuid: action.payload.actionGroupUuid }),
                        ),
                    ),
                ),
        ),
    );
};

const updateConditionGroup: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateConditionGroup.match),
        switchMap((action) =>
            deps.apiClients.rules
                .updateConditionGroup({
                    conditionGroupUuid: action.payload.conditionGroupUuid,
                    updateRuleConditionGroupRequestDto: transformUpdateGroupRuleConditionRequestModelToDto(action.payload.conditionGroup),
                })
                .pipe(
                    switchMap((conditionRuleGroupDetail) =>
                        of(
                            slice.actions.updateConditionGroupSuccess({
                                conditionGroup: transformRuleConditionGroupDtoToModel(conditionRuleGroupDetail),
                            }),
                            appRedirectActions.redirect({ url: `../../conditiongroups/detail/${conditionRuleGroupDetail.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateConditionGroupFailure({ error: extractError(err, 'Failed to update condition group') }),
                            alertActions.error('Failed to update Condition Group'),
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
                    updateRuleRequestDto: transformRuleUpdateRequestModelToDto(action.payload.rule),
                })
                .pipe(
                    switchMap((rule) =>
                        of(
                            slice.actions.updateRuleSuccess({ rule: transformDetailRuleDtoToModel(rule) }),
                            appRedirectActions.redirect({ url: `../rules/detail/${rule.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateRuleFailure({ error: extractError(err, 'Failed to update rule') }),
                            alertActions.error('Failed to update rule'),
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
            deps.apiClients.rules
                .updateTrigger({
                    triggerUuid: action.payload.triggerUuid,
                    updateRuleTriggerRequestDto: transformRuleTriggerUpdateRequestModelToDto(action.payload.trigger),
                })
                .pipe(
                    switchMap((trigger) =>
                        of(slice.actions.updateTriggerSuccess({ trigger: transformTriggerRuleDetailDtoToModel(trigger) })),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateTriggerFailure({ error: extractError(err, 'Failed to update trigger') }),
                            alertActions.error(extractError(err, 'Failed to create trigger')),
                            slice.actions.getTrigger({ triggerUuid: action.payload.triggerUuid }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [
    listRules,
    listActionGroups,
    listConditionGroups,
    listTriggers,
    createActionGroup,
    createConditionGroup,
    createRule,
    createTrigger,
    deleteActionGroup,
    deleteConditionGroup,
    deleteRule,
    deleteTrigger,
    getActionGroup,
    getConditionGroup,
    getRule,
    getTrigger,
    updateActionGroup,
    updateConditionGroup,
    updateRule,
    updateTrigger,
];

export default epics;
