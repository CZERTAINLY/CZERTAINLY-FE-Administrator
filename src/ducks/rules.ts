import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource } from 'types/openapi';
import {
    ActionGroupModel,
    ActionRuleGroupRequestModel,
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
    UpdateActionGroupRequestModel,
    UpdateGroupRuleConditionRequestModel,
} from 'types/rules';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    rules: RuleModel[];
    ruleDetails?: DetailRuleModel;
    actionGroups: ActionGroupModel[];
    actionGroupDetails?: ActionGroupModel;
    conditionRuleGroups: ConditionRuleGroupModel[];
    conditionGroupDetails?: ConditionRuleGroupModel;
    triggers: TriggerRuleModel[];
    triggerDetails?: TriggerRuleDetailModel;

    isupdatingActionGroup: boolean;
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
    isDeletingTrigger: boolean;
    isUpdatingConditionGroup: boolean;
    isUpdatingRule: boolean;
    isUpdatingTrigger: boolean;
};

export const initialState: State = {
    rules: [],
    actionGroups: [],
    conditionRuleGroups: [],
    triggers: [],
    isFetchingRulesList: false,
    isFetchingActionGroups: false,
    isFetchingActionGroup: false,
    isFetchingConditionGroup: false,
    isFetchingTriggerDetail: false,

    isFetchingConditionGroups: false,
    isFetchingTriggers: false,
    isCreatingRule: false,
    isFetchingRuleDetail: false,

    isupdatingActionGroup: false,
    isCreatingActionGroup: false,
    isDeletingActionGroup: false,
    isCreatingConditionGroup: false,
    isDeletingConditionGroup: false,
    isCreatingTrigger: false,
    isDeletingTrigger: false,
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

        listActionGroups: (state, action: PayloadAction<{ resource?: Resource }>) => {
            state.isFetchingActionGroups = true;
        },
        listActionGroupsSuccess: (state, action: PayloadAction<{ actionGroups: ActionGroupModel[] }>) => {
            state.actionGroups = action.payload.actionGroups;
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

        listTriggers: (state, action: PayloadAction<{ resource?: Resource }>) => {
            state.isFetchingTriggers = true;
        },
        listTriggersSuccess: (state, action: PayloadAction<{ triggers: TriggerRuleModel[] }>) => {
            state.triggers = action.payload.triggers;
            state.isFetchingTriggers = false;
        },

        listTriggersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingTriggers = false;
        },

        createActionGroup: (state, action: PayloadAction<{ ruleActionGroupRequest: ActionRuleGroupRequestModel }>) => {
            state.isCreatingActionGroup = true;
        },
        createActionGroupSuccess: (state, action: PayloadAction<{ actionGroup: ActionGroupModel }>) => {
            state.actionGroups.push(action.payload.actionGroup);
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

        createTriggerSuccess: (state, action: PayloadAction<{ trigger: TriggerRuleDetailModel }>) => {
            state.isCreatingTrigger = false;
        },

        createTriggerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreatingTrigger = false;
        },

        deleteActionGroup: (state, action: PayloadAction<{ actionGroupUuid: string }>) => {
            state.isDeletingActionGroup = true;
        },

        deleteActionGroupSuccess: (state, action: PayloadAction<{ actionGroupUuid: string }>) => {
            state.actionGroups = state.actionGroups.filter((group) => group.uuid !== action.payload.actionGroupUuid);
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
            state.isDeletingTrigger = true;
        },
        deleteTriggerSuccess: (state, action: PayloadAction<{ triggerUuid: string }>) => {
            state.triggers = state.triggers.filter((trigger) => trigger.uuid !== action.payload.triggerUuid);
            state.isDeletingTrigger = false;
        },

        deleteTriggerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeletingTrigger = false;
        },

        getActionGroup: (state, action: PayloadAction<{ actionGroupUuid: string }>) => {
            state.isFetchingActionGroup = true;
        },
        getActionGroupSuccess: (state, action: PayloadAction<{ actionGroup: ActionGroupModel }>) => {
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
            state.triggerDetails = action.payload.trigger;
            state.isFetchingTriggerDetail = false;
        },
        getTriggerFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingTriggerDetail = false;
        },

        updateActionGroup: (state, action: PayloadAction<{ actionGroupUuid: string; actionGroup: UpdateActionGroupRequestModel }>) => {
            state.isupdatingActionGroup = true;
        },

        updateActionGroupSuccess: (state, action: PayloadAction<{ actionGroup: ActionGroupModel }>) => {
            state.actionGroups = state.actionGroups.map((group) =>
                group.uuid === action.payload.actionGroup.uuid ? action.payload.actionGroup : group,
            );

            if (state.actionGroupDetails?.uuid === action.payload.actionGroup.uuid) {
                state.actionGroupDetails = action.payload.actionGroup;
            }

            state.isupdatingActionGroup = false;
        },

        updateActionGroupFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isupdatingActionGroup = false;
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
            if (state.triggerDetails?.uuid === action.payload.trigger.uuid) {
                state.triggerDetails = action.payload.trigger;
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
const triggerDetails = createSelector(state, (state) => state.triggerDetails);
const triggers = createSelector(state, (state) => state.triggers);

const actionGroups = createSelector(state, (state) => state.actionGroups);
const actionGroupDetails = createSelector(state, (state) => state.actionGroupDetails);

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
const isCreatingActionGroup = createSelector(state, (state) => state.isCreatingActionGroup);
const isFetchingActionGroups = createSelector(state, (state) => state.isFetchingActionGroups);
const isDeletingActionGroup = createSelector(state, (state) => state.isDeletingActionGroup);
const isFetchingActionGroup = createSelector(state, (state) => state.isFetchingActionGroup);
const isupdatingActionGroup = createSelector(state, (state) => state.isupdatingActionGroup);
const isUpdatingTrigger = createSelector(state, (state) => state.isUpdatingTrigger);
const isFetchingTriggerDetail = createSelector(state, (state) => state.isFetchingTriggerDetail);
const isDeletingTrigger = createSelector(state, (state) => state.isDeletingTrigger);
const isFetchingTriggers = createSelector(state, (state) => state.isFetchingTriggers);
const isCreatingTrigger = createSelector(state, (state) => state.isCreatingTrigger);

export const selectors = {
    rules,
    triggers,
    triggerDetails,
    conditionRuleGroups,
    conditionGroupDetails,
    actionGroups,
    actionGroupDetails,
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
    isCreatingActionGroup,
    isFetchingActionGroups,
    isDeletingActionGroup,
    isFetchingActionGroup,
    isupdatingActionGroup,
    isUpdatingTrigger,
    isFetchingTriggerDetail,
    isDeletingTrigger,
    isFetchingTriggers,
    isCreatingTrigger,
};

export const actions = slice.actions;

export default slice.reducer;
