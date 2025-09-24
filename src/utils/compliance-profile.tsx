import { TRuleGroupType } from 'components/_pages/compliance-profiles/detail/AvailableRulesAndGroups/AvailableRulesAndGroups';
import { ComplianceGroupListDto, ComplianceProfileDtoV2, ComplianceRuleListDto, Resource } from 'types/openapi';
import { ComplianceRuleAvailabilityStatus } from 'types/openapi/models/ComplianceRuleAvailabilityStatus';

export const getComplianceProfileStatusColor = (status: ComplianceRuleAvailabilityStatus) => {
    switch (status) {
        case ComplianceRuleAvailabilityStatus.Available:
            return '#14B8A6';
        case ComplianceRuleAvailabilityStatus.NotAvailable:
            return '#EF4444';
        case ComplianceRuleAvailabilityStatus.Updated:
            return '#EAB308';
    }
};

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '…';
}

export const rulesSourceOptions = [
    {
        label: 'Provider',
        value: 'Provider',
    },
    {
        label: 'Internal',
        value: 'Internal',
    },
];

export function getRulesAndGroupsTableHeaders(type: 'assigned' | 'available') {
    return [
        ...(type === 'assigned' ? [{ id: 'status', content: 'Status', sortable: true }] : []),
        {
            id: 'name',
            content: 'Name',
            sortable: true,
        },
        {
            id: 'resource',
            content: 'Resource',
            sortable: true,
        },
        {
            id: 'type',
            content: 'Type',
            sortable: true,
        },
        {
            id: 'action',
            content: 'Action',
        },
    ];
}

export const getAssignedInternalListOfGroupsAndRules = (profile: ComplianceProfileDtoV2 | undefined, resource?: Resource) => {
    if (!profile) return [];
    const internalRules = profile.internalRules
        .filter((rule) => (resource ? rule.resource === resource : true))
        .map((rule) => ({
            ...rule,
            entityDetails: {
                entityType: 'rule',
            },
        }));
    return internalRules as TRuleGroupType[];
};

export const getAssignedProviderListOfGroupsAndRules = (
    profile: ComplianceProfileDtoV2 | undefined,
    resource?: Resource,
    providerUuid?: string | null,
    kind?: string | null,
) => {
    if (!profile) return [];
    const providerRulesAndGroupsList = profile.providerRules
        .filter((providerRule) => (providerUuid ? providerRule.connectorUuid === providerUuid : true))
        .filter((providerRule) => (kind ? providerRule.kind === kind : true))
        .map((providerRule) => {
            return [
                ...providerRule.rules
                    .filter((rule) => (resource ? rule.resource === resource : true))
                    .map((rule) => ({
                        ...rule,
                        entityDetails: {
                            connectorUuid: providerRule.connectorUuid,
                            connectorName: providerRule.connectorName,
                            kind: providerRule.kind,
                            entityType: 'rule',
                        },
                    })),
                ...providerRule.groups
                    .filter((group) => (resource ? group.resource === resource : true))
                    .map((group) => ({
                        ...group,
                        entityDetails: {
                            connectorUuid: providerRule.connectorUuid,
                            connectorName: providerRule.connectorName,
                            kind: providerRule.kind,
                            entityType: 'group',
                        },
                    })),
            ];
        })
        .flat();
    return providerRulesAndGroupsList as TRuleGroupType[];
};

export const formatAvailableRulesAndGroups = (
    type: 'rule' | 'group',
    rulesAndGroups: ComplianceRuleListDto[] | ComplianceGroupListDto[],
) => {
    return rulesAndGroups.map((ruleOrGroup) => {
        return {
            ...ruleOrGroup,
            entityDetails: {
                entityType: type,
            },
        };
    });
};

export const getListOfResources = (rulesAndGroupsList: any[]) => {
    const list = Array.from(new Set(rulesAndGroupsList.map((ruleOrGroup) => ruleOrGroup.resource)));
    return ['All', ...list];
};

export function makeOptions<T extends { uuid: string; name: string }>(profiles: T[], associations: { objectUuid: string }[]) {
    return profiles
        .filter((profile) => !associations.some((a) => a.objectUuid === profile.uuid))
        .map((profile) => ({
            value: profile,
            label: profile.name,
        }));
}
