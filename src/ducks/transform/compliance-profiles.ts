import {
    ComplianceProfileGroupListResponseDto,
    ComplianceProfileGroupListResponseGroupDto,
    ComplianceProfileGroupListResponseGroupModel,
    ComplianceProfileGroupListResponseModel,
    ComplianceProfileGroupRequestDto,
    ComplianceProfileGroupRequestModel,
    ComplianceProfileListDto,
    ComplianceProfileListModel,
    ComplianceProfileListRuleDto,
    ComplianceProfileListRuleModel,
    ComplianceProfileRequestDto,
    ComplianceProfileRequestModel,
    ComplianceProfileRequestRuleDto,
    ComplianceProfileRequestRuleModel,
    ComplianceProfileRequestRuleRuleDto,
    ComplianceProfileRequestRuleRuleModel,
    ComplianceProfileResponseDto,
    ComplianceProfileResponseGroupDto,
    ComplianceProfileResponseGroupGroupDto,
    ComplianceProfileResponseGroupGroupModel,
    ComplianceProfileResponseGroupModel,
    ComplianceProfileResponseModel,
    ComplianceProfileResponseRuleDto,
    ComplianceProfileResponseRuleModel,
    ComplianceProfileResponseRuleRuleDto,
    ComplianceProfileResponseRuleRuleModel,
    ComplianceProfileRuleAddRequestDto,
    ComplianceProfileRuleAddRequestModel,
    ComplianceProfileRuleAddResponseDto,
    ComplianceProfileRuleAddResponseModel,
    ComplianceProfileRuleDeleteRequestDto,
    ComplianceProfileRuleDeleteRequestModel,
    ComplianceProfileRuleListResponseDto,
    ComplianceProfileRuleListResponseModel,
    ComplianceProfileRuleListResponseRuleDto,
    ComplianceProfileRuleListResponseRuleModel,
} from 'types/complianceProfiles';
import {
    transformAttributeDescriptorDtoToModel,
    transformAttributeRequestModelToDto,
    transformAttributeResponseDtoToModel,
} from './attributes';
import { transformRaProfileSimplifiedDtoToModel } from './certificates';

export function transformComplianceProfileListRuleModelToDto(profileRule: ComplianceProfileListRuleModel): ComplianceProfileListRuleDto {
    return { ...profileRule };
}

export function transformComplianceProfileListModelToDto(list: ComplianceProfileListModel): ComplianceProfileListDto {
    return {
        ...list,
        rules: list.rules.map(transformComplianceProfileListRuleModelToDto),
    };
}

export function transformComplianceProfileResponseRuleRuleDtoToModel(
    rule: ComplianceProfileResponseRuleRuleDto,
): ComplianceProfileResponseRuleRuleModel {
    return {
        ...rule,
        attributes: rule.attributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformComplianceProfileResponseRuleDtoToModel(
    rule: ComplianceProfileResponseRuleDto,
): ComplianceProfileResponseRuleModel {
    return {
        ...rule,
        rules: rule.rules?.map(transformComplianceProfileResponseRuleRuleDtoToModel),
    };
}

export function transformComplianceProfileResponseGroupGroupDtoToModel(
    group: ComplianceProfileResponseGroupGroupDto,
): ComplianceProfileResponseGroupGroupModel {
    return { ...group };
}

export function transformComplianceProfileResponseGroupDtoToModel(
    group: ComplianceProfileResponseGroupDto,
): ComplianceProfileResponseGroupModel {
    return {
        ...group,
        groups: group.groups?.map(transformComplianceProfileResponseGroupGroupDtoToModel),
    };
}

export function transformComplianceProfileResponseDtoToModel(profile: ComplianceProfileResponseDto): ComplianceProfileResponseModel {
    return {
        ...profile,
        rules: profile.rules.map(transformComplianceProfileResponseRuleDtoToModel),
        groups: profile.groups.map(transformComplianceProfileResponseGroupDtoToModel),
        raProfiles: profile.raProfiles?.map(transformRaProfileSimplifiedDtoToModel),
        customAttributes: profile.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformComplianceProfileRequestRuleRuleModelToDto(
    rule: ComplianceProfileRequestRuleRuleModel,
): ComplianceProfileRequestRuleRuleDto {
    return {
        ...rule,
        attributes: rule.attributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformComplianceProfileRequestRuleModel(rule: ComplianceProfileRequestRuleModel): ComplianceProfileRequestRuleDto {
    return {
        ...rule,
        rules: rule.rules?.map(transformComplianceProfileRequestRuleRuleModelToDto),
    };
}

export function transformComplianceProfileRequestModelToDto(profile: ComplianceProfileRequestModel): ComplianceProfileRequestDto {
    return {
        ...profile,
        rules: profile.rules?.map(transformComplianceProfileRequestRuleModel),
        customAttributes: profile.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformComplianceProfileRuleAddRequestModelToDto(
    addRule: ComplianceProfileRuleAddRequestModel,
): ComplianceProfileRuleAddRequestDto {
    return {
        ...addRule,
        attributes: addRule.attributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformComplianceProfileRuleAddResponseDtoToModel(
    rule: ComplianceProfileRuleAddResponseDto,
): ComplianceProfileRuleAddResponseModel {
    return {
        ...rule,
        attributes: rule.attributes.map(transformAttributeResponseDtoToModel),
    };
}

export function transformComplianceProfileGroupRequestModelToDto(
    addGroup: ComplianceProfileGroupRequestModel,
): ComplianceProfileGroupRequestDto {
    return { ...addGroup };
}

export function transformComplianceProfileRuleDeleteRequestModelToDto(
    deleteRule: ComplianceProfileRuleDeleteRequestModel,
): ComplianceProfileRuleDeleteRequestDto {
    return { ...deleteRule };
}

export function transformComplianceProfileRuleListResponseRuleDtoToModel(
    rule: ComplianceProfileRuleListResponseRuleDto,
): ComplianceProfileRuleListResponseRuleModel {
    return {
        ...rule,
        attributes: rule.attributes?.map(transformAttributeDescriptorDtoToModel),
    };
}

export function transformComplianceProfileRuleListResponseDtoToModel(
    ruleList: ComplianceProfileRuleListResponseDto,
): ComplianceProfileRuleListResponseModel {
    return {
        ...ruleList,
        rules: ruleList.rules.map(transformComplianceProfileRuleListResponseRuleDtoToModel),
    };
}

export function transformComplianceProfileGroupListResponseGroupDtoToModel(
    group: ComplianceProfileGroupListResponseGroupDto,
): ComplianceProfileGroupListResponseGroupModel {
    return { ...group };
}

export function transformComplianceProfileGroupListResponseDtoToModel(
    groupList: ComplianceProfileGroupListResponseDto,
): ComplianceProfileGroupListResponseModel {
    return {
        ...groupList,
        groups: groupList.groups.map(transformComplianceProfileGroupListResponseGroupDtoToModel),
    };
}
