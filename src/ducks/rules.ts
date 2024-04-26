import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource } from 'types/openapi';
import {
    // ActionRuleGroupDetailModel,
    ActionRuleGroupModel,
    ActionRuleGroupRequestModel,
    // ConditionRuleGroupDetailModel,
    ConditionRuleGroupModel,
    ConditionRuleGroupRequestModel,
    DetailRuleModel,
    RequestRuleModel,
    RuleModel,
    RuleTriggerUpdateRequestModel,
    RuleUpdateRequestModel,
    TriggerRuleDetailModel,
    TriggerRuleModel,
    TriggerRuleRequestModel,
    UpdateGroupRuleConditionRequestModel,
} from 'types/rules';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    rules: RuleModel[];
    ruleDetails?: DetailRuleModel;
    actionRuleGroups: ActionRuleGroupModel[];
    actionGroupDetails?: ActionRuleGroupModel;
    conditionRuleGroups: ConditionRuleGroupModel[];
    conditionGroupDetails?: ConditionRuleGroupModel;
    ruleTriggers: TriggerRuleModel[];
    ruleTriggerDetail?: TriggerRuleDetailModel;

    isFetchingRulesList: boolean;
    isFetchingActionGroups: boolean;
    isFetchingConditionGroups: boolean;
    isFetchingTriggers: boolean;
    isFetchingRuleDetail: boolean;
    isFetchingActionGroup: boolean;
    isFetchingConditionGroup: boolean;
    isFetchingTriggerDetail: boolean;
    isDeletingRule: boolean;
    isCreatingRule: boolean;
    isCreatingActionGroup: boolean;
    isDeletingActionGroup: boolean;
    isCreatingConditionGroup: boolean;
    isDeletingConditionGroup: boolean;
    isCreatingTrigger: boolean;
    isUpdatingConditionGroup: boolean;
    isUpdatingRule: boolean;
    isUpdatingTrigger: boolean;
};

export const initialState: State = {
    rules: [],
    actionRuleGroups: [],
    conditionRuleGroups: [],
    ruleTriggers: [],
    isFetchingRulesList: false,
    isFetchingActionGroups: false,
    isFetchingActionGroup: false,
    isFetchingConditionGroup: false,
    isFetchingTriggerDetail: false,

    isFetchingConditionGroups: false,
    isFetchingTriggers: false,
    isCreatingRule: false,
    isFetchingRuleDetail: false,

    isCreatingActionGroup: false,
    isDeletingActionGroup: false,
    isCreatingConditionGroup: false,
    isDeletingConditionGroup: false,
    isCreatingTrigger: false,
    isUpdatingConditionGroup: false,
    isUpdatingRule: false,
    isUpdatingTrigger: false,
    isDeletingRule: false,
};

export const slice = createSlice({
    name: 'rules',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        listRules: (state, action: PayloadAction<{ resource?: Resource }>) => {
            state.isFetchingRulesList = true;
        },
        listRulesSuccess: (state, action: PayloadAction<{ rules: RuleModel[] }>) => {
            state.rules = action.payload.rules;
            state.isFetchingRulesList = false;
        },

        listRulesFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingRulesList = false;
        },

        listActionGroups: (state, action: PayloadAction<{ resource: Resource }>) => {
            state.isFetchingActionGroups = true;
        },
        listActionGroupsSuccess: (state, action: PayloadAction<{ actionGroups: ActionRuleGroupModel[] }>) => {
            state.actionRuleGroups = action.payload.actionGroups;
            state.isFetchingActionGroups = false;
        },

        listActionGroupsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingActionGroups = false;
        },

        listConditionGroups: (state, action: PayloadAction<{ resource?: Resource }>) => {
            state.isFetchingConditionGroups = true;
        },

        listConditionGroupsSuccess: (state, action: PayloadAction<{ conditionGroups: ConditionRuleGroupModel[] }>) => {
            state.conditionRuleGroups = action.payload.conditionGroups;
            state.isFetchingConditionGroups = false;
        },

        listConditionGroupsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingConditionGroups = false;
        },

        listTriggers: (state, action: PayloadAction<{ resource: Resource }>) => {
            state.isFetchingTriggers = true;
        },
        listTriggersSuccess: (state, action: PayloadAction<{ triggers: TriggerRuleModel[] }>) => {
            state.ruleTriggers = action.payload.triggers;
            state.isFetchingTriggers = false;
        },

        listTriggersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingTriggers = false;
        },

        createActionGroup: (state, action: PayloadAction<{ ruleActionGroupRequest: ActionRuleGroupRequestModel }>) => {
            state.isCreatingActionGroup = true;
        },
        createActionGroupSuccess: (state, action: PayloadAction<{ actionGroup: ActionRuleGroupModel }>) => {
            state.actionRuleGroups.push(action.payload.actionGroup);
            state.isCreatingActionGroup = false;
        },

        createActionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingActionGroup = false;
        },

        createConditionGroup: (state, action: PayloadAction<{ ruleConditionGroupRequest: ConditionRuleGroupRequestModel }>) => {
            state.isCreatingConditionGroup = true;
        },

        createConditionGroupSuccess: (state, action: PayloadAction<{ conditionGroup: ConditionRuleGroupModel }>) => {
            state.conditionRuleGroups.push(action.payload.conditionGroup);
            state.isCreatingConditionGroup = false;
        },

        createConditionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingConditionGroup = false;
        },

        createRule: (state, action: PayloadAction<{ rule: RequestRuleModel }>) => {
            state.isCreatingRule = true;
        },
        createRuleSuccess: (state, action: PayloadAction<{ rule: RuleModel }>) => {
            state.rules.push(action.payload.rule);
            state.isCreatingRule = false;
        },

        createRuleFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingRule = false;
        },

        createTrigger: (state, action: PayloadAction<{ trigger: TriggerRuleRequestModel }>) => {
            state.isCreatingTrigger = true;
        },

        createTriggerSuccess: (state, action: PayloadAction<{ trigger: TriggerRuleModel }>) => {
            state.ruleTriggers.push(action.payload.trigger);
            state.isCreatingTrigger = false;
        },

        createTriggerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingTrigger = false;
        },

        deleteActionGroup: (state, action: PayloadAction<{ actionGroupUuid: string }>) => {
            state.isDeletingActionGroup = true;
        },
        deleteActionGroupSuccess: (state, action: PayloadAction<{ actionGroupUuid: string }>) => {
            state.actionRuleGroups = state.actionRuleGroups.filter((group) => group.uuid !== action.payload.actionGroupUuid);
            state.isDeletingActionGroup = false;
        },
        deleteActionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeletingActionGroup = false;
        },

        deleteConditionGroup: (state, action: PayloadAction<{ conditionGroupUuid: string }>) => {
            state.isDeletingConditionGroup = true;
        },
        deleteConditionGroupSuccess: (state, action: PayloadAction<{ conditionGroupUuid: string }>) => {
            state.conditionRuleGroups = state.conditionRuleGroups.filter((group) => group.uuid !== action.payload.conditionGroupUuid);
            state.isDeletingConditionGroup = false;
        },
        deleteConditionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeletingConditionGroup = false;
        },

        deleteRule: (state, action: PayloadAction<{ ruleUuid: string }>) => {
            state.isDeletingRule = true;
        },
        deleteRuleSuccess: (state, action: PayloadAction<{ ruleUuid: string }>) => {
            state.rules = state.rules.filter((rule) => rule.uuid !== action.payload.ruleUuid);
            state.isDeletingRule = false;
        },
        deleteRuleFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeletingRule = false;
        },

        deleteTrigger: (state, action: PayloadAction<{ triggerUuid: string }>) => {
            state.isCreatingTrigger = true;
        },
        deleteTriggerSuccess: (state, action: PayloadAction<{ triggerUuid: string }>) => {
            state.ruleTriggers = state.ruleTriggers.filter((trigger) => trigger.uuid !== action.payload.triggerUuid);
            state.isCreatingTrigger = false;
        },

        deleteTriggerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingTrigger = false;
        },

        getActionGroup: (state, action: PayloadAction<{ actionGroupUuid: string }>) => {
            state.isFetchingActionGroup = true;
        },
        getActionGroupSuccess: (state, action: PayloadAction<{ actionGroup: ActionRuleGroupModel }>) => {
            state.actionGroupDetails = action.payload.actionGroup;
            state.isFetchingActionGroup = false;
        },
        getActionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingActionGroup = false;
        },

        getConditionGroup: (state, action: PayloadAction<{ conditionGroupUuid: string }>) => {
            state.isFetchingConditionGroup = true;
        },
        getConditionGroupSuccess: (state, action: PayloadAction<{ conditionGroup: ConditionRuleGroupModel }>) => {
            state.conditionGroupDetails = action.payload.conditionGroup;
            state.isFetchingConditionGroup = false;
        },
        getConditionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingConditionGroup = false;
        },
        getRule: (state, action: PayloadAction<{ ruleUuid: string }>) => {
            state.isFetchingRuleDetail = true;
        },
        getRuleSuccess: (state, action: PayloadAction<{ rule: DetailRuleModel }>) => {
            state.ruleDetails = action.payload.rule;
            state.isFetchingRuleDetail = false;
        },
        getRuleFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingRuleDetail = false;
        },

        getTrigger: (state, action: PayloadAction<{ triggerUuid: string }>) => {
            state.isFetchingTriggerDetail = true;
        },
        getTriggerSuccess: (state, action: PayloadAction<{ trigger: TriggerRuleDetailModel }>) => {
            state.ruleTriggerDetail = action.payload.trigger;
            state.isFetchingTriggerDetail = false;
        },
        getTriggerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingTriggerDetail = false;
        },

        updateConditionGroup: (
            state,
            action: PayloadAction<{ conditionGroupUuid: string; conditionGroup: UpdateGroupRuleConditionRequestModel }>,
        ) => {
            state.isUpdatingConditionGroup = true;
        },

        updateConditionGroupSuccess: (state, action: PayloadAction<{ conditionGroup: ConditionRuleGroupModel }>) => {
            state.conditionRuleGroups = state.conditionRuleGroups.map((group) =>
                group.uuid === action.payload.conditionGroup.uuid ? action.payload.conditionGroup : group,
            );

            if (state.conditionGroupDetails?.uuid === action.payload.conditionGroup.uuid) {
                state.conditionGroupDetails = action.payload.conditionGroup;
            }

            state.isUpdatingConditionGroup = false;
        },

        updateConditionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingConditionGroup = false;
        },

        updateRule: (state, action: PayloadAction<{ ruleUuid: string; rule: RuleUpdateRequestModel }>) => {
            state.isUpdatingRule = true;
        },
        updateRuleSuccess: (state, action: PayloadAction<{ rule: DetailRuleModel }>) => {
            state.rules = state.rules.map((rule) => (rule.uuid === action.payload.rule.uuid ? action.payload.rule : rule));
            state.isUpdatingRule = false;

            if (state.ruleDetails?.uuid === action.payload.rule.uuid) {
                state.ruleDetails = action.payload.rule;
            }
        },
        updateRuleFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingRule = false;
        },

        updateTrigger: (state, action: PayloadAction<{ triggerUuid: string; trigger: RuleTriggerUpdateRequestModel }>) => {
            state.isUpdatingTrigger = true;
        },

        updateTriggerSuccess: (state, action: PayloadAction<{ trigger: TriggerRuleDetailModel }>) => {
            state.ruleTriggers = state.ruleTriggers.map((trigger) =>
                trigger.uuid === action.payload.trigger.uuid ? action.payload.trigger : trigger,
            );

            if (state.ruleTriggerDetail?.uuid === action.payload.trigger.uuid) {
                state.ruleTriggerDetail = action.payload.trigger;
            }

            state.isUpdatingTrigger = false;
        },

        updateTriggerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isUpdatingTrigger = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const rules = createSelector(state, (state) => state.rules);
const conditionGroupDetails = createSelector(state, (state) => state.conditionGroupDetails);
const ruleDetails = createSelector(state, (state) => state.ruleDetails);

const isCreatingConditionGroup = createSelector(state, (state) => state.isCreatingConditionGroup);
const isUpdatingConditionGroup = createSelector(state, (state) => state.isUpdatingConditionGroup);

const isCreatingRule = createSelector(state, (state) => state.isCreatingRule);
const isUpdatingRule = createSelector(state, (state) => state.isUpdatingRule);
const isDeletingRule = createSelector(state, (state) => state.isDeletingRule);
const isFetchingRulesList = createSelector(state, (state) => state.isFetchingRulesList);
const conditionRuleGroups = createSelector(state, (state) => state.conditionRuleGroups);
const isFetchingConditionGroups = createSelector(state, (state) => state.isFetchingConditionGroups);
const isDeletingConditionGroup = createSelector(state, (state) => state.isDeletingConditionGroup);
const isFetchingConditionGroup = createSelector(state, (state) => state.isFetchingConditionGroup);
const isFetchingRuleDetail = createSelector(state, (state) => state.isFetchingRuleDetail);

export const selectors = {
    rules,
    conditionRuleGroups,
    conditionGroupDetails,
    ruleDetails,
    isDeletingRule,
    isFetchingConditionGroups,
    isDeletingConditionGroup,
    isFetchingRulesList,
    isCreatingConditionGroup,
    isCreatingRule,
    isUpdatingConditionGroup,
    isFetchingConditionGroup,
    isUpdatingRule,
    isFetchingRuleDetail,
};

export const actions = slice.actions;

export default slice.reducer;
