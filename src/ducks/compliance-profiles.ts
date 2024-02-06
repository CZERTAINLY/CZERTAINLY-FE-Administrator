import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RaProfileSimplifiedModel } from 'types/certificate';
import {
    ComplianceProfileGroupListResponseModel,
    ComplianceProfileGroupRequestModel,
    ComplianceProfileListModel,
    ComplianceProfileRequestModel,
    ComplianceProfileResponseModel,
    ComplianceProfileRuleAddRequestModel,
    ComplianceProfileRuleAddResponseModel,
    ComplianceProfileRuleDeleteRequestModel,
    ComplianceProfileRuleListResponseModel,
} from 'types/complianceProfiles';
import { BulkActionModel } from 'types/connectors';
import { createFeatureSelector } from 'utils/ducks';

export type State = {
    checkedRows: string[];

    deleteErrorMessage: string;
    bulkDeleteErrorMessages: BulkActionModel[];

    complianceProfile?: ComplianceProfileResponseModel;
    complianceProfiles: ComplianceProfileListModel[];

    rules: ComplianceProfileRuleListResponseModel[];
    groups: ComplianceProfileGroupListResponseModel[];

    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    isAddingRule: boolean;
    isDeletingRule: boolean;
    isAddingGroup: boolean;
    isDeletingGroup: boolean;
    isBulkDeleting: boolean;
    isBulkForceDeleting: boolean;
    isFetchingRaProfile: boolean;
    isFetchingRules: boolean;
    isFetchingGroups: boolean;
    isAssociatingRaProfile: boolean;
    isDissociatingRaProfile: boolean;
    isCheckingCompliance: boolean;
};

export const initialState: State = {
    checkedRows: [],

    complianceProfiles: [],

    deleteErrorMessage: '',
    bulkDeleteErrorMessages: [],

    rules: [],
    groups: [],

    isFetchingList: false,
    isFetchingDetail: false,
    isCreating: false,
    isDeleting: false,
    isAddingRule: false,
    isDeletingRule: false,
    isAddingGroup: false,
    isDeletingGroup: false,
    isBulkDeleting: false,
    isBulkForceDeleting: false,
    isFetchingRaProfile: false,
    isFetchingRules: false,
    isFetchingGroups: false,
    isAssociatingRaProfile: false,
    isDissociatingRaProfile: false,
    isCheckingCompliance: false,
};

export const slice = createSlice({
    name: 'complianceProfiles',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {
            state.checkedRows = action.payload.checkedRows;
        },

        clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {
            state.deleteErrorMessage = '';
            state.bulkDeleteErrorMessages = [];
        },

        listComplianceProfiles: (state, action: PayloadAction<void>) => {
            state.isFetchingList = true;
        },

        listComplianceProfilesSuccess: (state, action: PayloadAction<{ complianceProfileList: ComplianceProfileListModel[] }>) => {
            state.complianceProfiles = action.payload.complianceProfileList;
            state.isFetchingList = false;
        },

        listComplianceProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingList = false;
        },

        getComplianceProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingDetail = true;
        },

        getComplianceProfileSuccess: (state, action: PayloadAction<{ complianceProfile: ComplianceProfileResponseModel }>) => {
            state.isFetchingDetail = false;

            state.complianceProfile = action.payload.complianceProfile;
        },

        getComplianceProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingDetail = false;
        },

        createComplianceProfile: (state, action: PayloadAction<ComplianceProfileRequestModel>) => {
            state.isCreating = true;
        },

        createComplianceProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isCreating = false;
        },

        createComplianceProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCreating = false;
        },

        deleteComplianceProfile: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = true;
            state.deleteErrorMessage = '';
        },

        deleteComplianceProfileSuccess: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isDeleting = false;

            const profileIndex = state.complianceProfiles.findIndex((profile) => profile.uuid === action.payload.uuid);

            if (profileIndex >= 0) state.complianceProfiles.splice(profileIndex, 1);

            if (state.complianceProfile?.uuid === action.payload.uuid) state.complianceProfile = undefined;
        },

        deleteComplianceProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeleting = false;
            state.deleteErrorMessage = action.payload.error || 'Unknown error';
        },

        bulkDeleteComplianceProfiles: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.bulkDeleteErrorMessages = [];

            state.isBulkDeleting = true;
        },

        bulkDeleteComplianceProfilesSuccess: (state, action: PayloadAction<{ uuids: string[]; errors: BulkActionModel[] }>) => {
            state.isBulkDeleting = false;
            if (action.payload.errors?.length > 0) {
                state.bulkDeleteErrorMessages = action.payload.errors;
                return;
            }

            action.payload.uuids.forEach((uuid) => {
                const profileIndex = state.complianceProfiles.findIndex((profile) => profile.uuid === uuid);
                if (profileIndex >= 0) state.complianceProfiles.splice(profileIndex, 1);
            });

            if (state.complianceProfile && action.payload.uuids.includes(state.complianceProfile.uuid)) state.complianceProfile = undefined;
        },

        bulkDeleteComplianceProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkDeleting = false;
        },

        bulkForceDeleteComplianceProfiles: (state, action: PayloadAction<{ uuids: string[]; redirect?: string }>) => {
            state.isBulkForceDeleting = true;
        },

        bulkForceDeleteComplianceProfilesSuccess: (state, action: PayloadAction<{ uuids: string[]; redirect?: string }>) => {
            state.isBulkForceDeleting = false;

            action.payload.uuids.forEach((uuid) => {
                const profileIndex = state.complianceProfiles.findIndex((profile) => profile.uuid === uuid);
                if (profileIndex >= 0) state.complianceProfiles.splice(profileIndex, 1);
            });

            if (state.complianceProfile && action.payload.uuids.includes(state.complianceProfile.uuid)) state.complianceProfile = undefined;
        },

        bulkForceDeleteComplianceProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isBulkForceDeleting = false;
        },

        addRule: (state, action: PayloadAction<{ uuid: string; addRequest: ComplianceProfileRuleAddRequestModel }>) => {
            state.isAddingRule = true;
        },

        addRuleSuccess: (
            state,
            action: PayloadAction<{
                connectorUuid: string;
                connectorName: string;
                kind: string;
                rule: ComplianceProfileRuleAddResponseModel;
            }>,
        ) => {
            state.isAddingRule = false;
            let found = false;
            if (!state.complianceProfile) return;

            if (state.complianceProfile?.rules === undefined) {
                state.complianceProfile.rules = [
                    {
                        connectorUuid: action.payload.connectorUuid,
                        kind: action.payload.kind,
                        connectorName: action.payload.connectorName,
                        rules: [
                            {
                                uuid: action.payload.rule.uuid,
                                name: action.payload.rule.name,
                                description: action.payload.rule.description,
                                // groupUuid: action.payload.rule.groupUuid,
                                attributes: action.payload.rule.attributes,
                                certificateType: action.payload.rule.certificateType,
                            },
                        ],
                    },
                ];
            } else {
                for (let connector of state.complianceProfile.rules || []) {
                    if (connector.connectorUuid === action.payload.connectorUuid && connector.kind === action.payload.kind) {
                        found = true;
                        connector.rules?.push({
                            uuid: action.payload.rule.uuid,
                            name: action.payload.rule.name,
                            description: action.payload.rule.description,
                            // groupUuid: action.payload.rule.groupUuid,
                            attributes: action.payload.rule.attributes,
                            certificateType: action.payload.rule.certificateType,
                        });
                    }
                }

                if (!found) {
                    state.complianceProfile?.rules.push({
                        connectorUuid: action.payload.connectorUuid,
                        kind: action.payload.kind,
                        connectorName: action.payload.connectorName,
                        rules: [
                            {
                                uuid: action.payload.rule.uuid,
                                name: action.payload.rule.name,
                                description: action.payload.rule.description,
                                // groupUuid: action.payload.rule.groupUuid,
                                attributes: action.payload.rule.attributes,
                                certificateType: action.payload.rule.certificateType,
                            },
                        ],
                    });
                }
            }
        },

        addRuleFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isAddingRule = false;
        },

        deleteRule: (state, action: PayloadAction<{ uuid: string; deleteRequest: ComplianceProfileRuleDeleteRequestModel }>) => {
            state.isDeletingRule = true;
        },

        deleteRuleSuccess: (state, action: PayloadAction<{ connectorUuid: string; kind: string; ruleUuid: string }>) => {
            state.isDeletingRule = false;
            if (!state.complianceProfile) return;

            for (let connector of state.complianceProfile.rules || []) {
                if (connector.connectorUuid === action.payload.connectorUuid && connector.kind === action.payload.kind) {
                    const ruleIndex = connector.rules?.findIndex((rule) => rule.uuid === action.payload.ruleUuid) ?? -1;
                    if (ruleIndex >= 0) connector.rules!.splice(ruleIndex, 1);
                }
            }
        },

        deleteRuleFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeletingRule = false;
        },

        addGroup: (
            state,
            action: PayloadAction<{
                uuid: string;
                connectorUuid: string;
                connectorName: string;
                kind: string;
                groupUuid: string;
                groupName: string;
                description: string;
                addRequest: ComplianceProfileGroupRequestModel;
            }>,
        ) => {
            state.isAddingGroup = true;
        },

        addGroupSuccess: (
            state,
            action: PayloadAction<{
                uuid: string;
                connectorUuid: string;
                connectorName: string;
                kind: string;
                groupUuid: string;
                groupName: string;
                description: string;
            }>,
        ) => {
            state.isAddingGroup = false;
            let found = false;
            if (!state.complianceProfile) return;

            if (state.complianceProfile?.groups === undefined) {
                state.complianceProfile.groups = [
                    {
                        connectorUuid: action.payload.connectorUuid,
                        kind: action.payload.kind,
                        connectorName: action.payload.connectorName,
                        groups: [
                            {
                                uuid: action.payload.groupUuid,
                                name: action.payload.groupName,
                                description: action.payload.description,
                            },
                        ],
                    },
                ];
            } else {
                for (let connector of state.complianceProfile.groups || []) {
                    if (connector.connectorUuid === action.payload.connectorUuid && connector.kind === action.payload.kind) {
                        found = true;
                        connector.groups?.push({
                            uuid: action.payload.groupUuid,
                            name: action.payload.groupName,
                            description: action.payload.description,
                        });
                    }
                }
                if (!found) {
                    state.complianceProfile?.groups.push({
                        connectorUuid: action.payload.connectorUuid,
                        kind: action.payload.kind,
                        connectorName: action.payload.connectorName,
                        groups: [
                            {
                                uuid: action.payload.groupUuid,
                                name: action.payload.groupName,
                                description: action.payload.description,
                            },
                        ],
                    });
                }
            }
        },

        addGroupFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isAddingGroup = false;
        },

        deleteGroup: (state, action: PayloadAction<{ uuid: string; deleteRequest: ComplianceProfileGroupRequestModel }>) => {
            state.isDeletingGroup = true;
        },

        deleteGroupSuccess: (state, action: PayloadAction<{ connectorUuid: string; kind: string; groupUuid: string }>) => {
            state.isDeletingGroup = false;
            if (!state.complianceProfile) return;

            for (let connector of state.complianceProfile.groups || []) {
                if (connector.connectorUuid === action.payload.connectorUuid && connector.kind === action.payload.kind) {
                    const groupIndex = connector.groups?.findIndex((group) => group.uuid === action.payload.groupUuid) ?? -1;
                    if (groupIndex >= 0) connector.groups!.splice(groupIndex, 1);
                }
            }
        },

        deleteGroupFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDeletingGroup = false;
        },

        associateRaProfile: (state, action: PayloadAction<{ uuid: string; raProfileUuids: RaProfileSimplifiedModel[] }>) => {
            state.isAssociatingRaProfile = true;
        },

        associateRaProfileSuccess: (state, action: PayloadAction<{ uuid: string; raProfileUuids: RaProfileSimplifiedModel[] }>) => {
            state.isAssociatingRaProfile = false;

            if (!state.complianceProfile) return;

            state.complianceProfile.raProfiles = state.complianceProfile.raProfiles?.concat(action.payload.raProfileUuids);
        },

        associateRaProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isAssociatingRaProfile = false;
        },

        dissociateRaProfile: (state, action: PayloadAction<{ uuid: string; raProfileUuids: string[] }>) => {
            state.isDissociatingRaProfile = true;
        },

        dissociateRaProfileSuccess: (state, action: PayloadAction<{ uuid: string; raProfileUuids: string[] }>) => {
            state.isDissociatingRaProfile = false;

            if (!state.complianceProfile) return;

            for (let profile of state.complianceProfile.raProfiles || []) {
                for (let requestUuid of action.payload.raProfileUuids) {
                    if (profile.uuid === requestUuid) {
                        const raProfileIndex =
                            state.complianceProfile.raProfiles?.findIndex((raProfile) => raProfile.uuid === requestUuid) ?? -1;
                        if (raProfileIndex >= 0) state.complianceProfile.raProfiles!.splice(raProfileIndex, 1);
                    }
                }
            }
        },

        dissociateRaProfileFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isDissociatingRaProfile = false;
        },

        getAssociatedRaProfiles: (state, action: PayloadAction<{ uuid: string }>) => {
            state.isFetchingRaProfile = true;
        },

        getAssociatedRaProfilesSuccess: (state, action: PayloadAction<{ raProfiles: RaProfileSimplifiedModel[] }>) => {
            state.isFetchingRaProfile = false;
            state.complianceProfile!.raProfiles = action.payload.raProfiles;
        },

        getAssociatedRaProfilesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingRaProfile = false;
        },

        listComplianceRules: (state, action: PayloadAction<void>) => {
            state.isFetchingRules = true;
        },

        listComplianceRulesSuccess: (state, action: PayloadAction<ComplianceProfileRuleListResponseModel[]>) => {
            state.isFetchingRules = false;
            state.rules = action.payload;
        },

        listComplianceRulesFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingRules = false;
        },

        listComplianceGroups: (state, action: PayloadAction<void>) => {
            state.isFetchingGroups = true;
        },

        listComplianceGroupsSuccess: (state, action: PayloadAction<ComplianceProfileGroupListResponseModel[]>) => {
            state.isFetchingGroups = false;
            state.groups = action.payload;
        },

        listComplianceGroupsFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isFetchingGroups = false;
        },

        checkCompliance: (state, action: PayloadAction<{ uuids: string[] }>) => {
            state.isCheckingCompliance = true;
        },

        checkComplianceSuccess: (state, action: PayloadAction<void>) => {
            state.isCheckingCompliance = false;
        },

        checkComplianceFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {
            state.isCheckingCompliance = false;
        },
    },
});

const state = createFeatureSelector<State>(slice.name);

const complianceProfile = createSelector(state, (state) => state.complianceProfile);
const complianceProfiles = createSelector(state, (state) => state.complianceProfiles);

const deleteErrorMessage = createSelector(state, (state) => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, (state) => state.bulkDeleteErrorMessages);

const checkedRows = createSelector(state, (state) => state.checkedRows);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isFetchingRules = createSelector(state, (state) => state.isFetchingRules);
const isFetchingGroups = createSelector(state, (state) => state.isFetchingGroups);

const isAddingRule = createSelector(state, (state) => state.isAddingRule);
const isDeletingRule = createSelector(state, (state) => state.isDeletingRule);
const isAddingGroup = createSelector(state, (state) => state.isAddingGroup);
const isDeletingGroup = createSelector(state, (state) => state.isDeletingGroup);
const isAssociatingRaProfile = createSelector(state, (state) => state.isAssociatingRaProfile);
const isDissociatingRaProfile = createSelector(state, (state) => state.isDissociatingRaProfile);
const isFetchingRaProfile = createSelector(state, (state) => state.isFetchingRaProfile);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);
const isBulkForceDeleting = createSelector(state, (state) => state.isBulkForceDeleting);
const rules = createSelector(state, (state) => state.rules);
const groups = createSelector(state, (state) => state.groups);

export const selectors = {
    state,

    checkedRows,

    deleteErrorMessage,
    bulkDeleteErrorMessages,

    complianceProfile,
    complianceProfiles,

    isFetchingList,
    isFetchingDetail,
    isCreating,
    isDeleting,
    isFetchingRules,
    isFetchingGroups,

    isAddingRule,
    isDeletingRule,
    isAddingGroup,
    isDeletingGroup,
    isAssociatingRaProfile,
    isDissociatingRaProfile,
    isFetchingRaProfile,

    isBulkDeleting,
    isBulkForceDeleting,

    rules,
    groups,
};

export const actions = slice.actions;

export default slice.reducer;
