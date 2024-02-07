import { AttributeDescriptorModel, AttributeRequestModel, AttributeResponseModel } from './attributes';
import { RaProfileSimplifiedModel } from './certificate';
import {
    ComplianceConnectorAndGroupsDto,
    ComplianceConnectorAndRulesDto,
    ComplianceGroupRequestDto,
    ComplianceGroupsDto,
    ComplianceGroupsListResponseDto,
    ComplianceGroupsResponseDto,
    ComplianceProfileDto,
    ComplianceProfileRequestDto as ComplianceProfileRequestDtoOpenApi,
    ComplianceProfileRuleDto,
    ComplianceProfileRulesRequestDto,
    ComplianceProfilesListDto,
    ComplianceProviderSummaryDto,
    ComplianceRequestRulesDto,
    ComplianceRuleAdditionRequestDto,
    ComplianceRuleDeletionRequestDto,
    ComplianceRulesDto,
    ComplianceRulesListResponseDto,
    ComplianceRulesResponseDto,
} from './openapi';

export type ComplianceProfileListRuleDto = ComplianceProviderSummaryDto;
export type ComplianceProfileListRuleModel = ComplianceProfileListRuleDto;

export type ComplianceProfileListDto = ComplianceProfilesListDto;
export type ComplianceProfileListModel = Omit<ComplianceProfileListDto, 'rules'> & { rules: Array<ComplianceProfileListRuleModel> };

//---
export type ComplianceProfileResponseRuleRuleDto = ComplianceRulesDto;
export type ComplianceProfileResponseRuleRuleModel = Omit<ComplianceProfileResponseRuleRuleDto, 'attributes'> & {
    attributes?: Array<AttributeResponseModel>;
};

export type ComplianceProfileResponseRuleDto = ComplianceConnectorAndRulesDto;
export type ComplianceProfileResponseRuleModel = Omit<ComplianceProfileResponseRuleDto, 'rules'> & {
    rules?: Array<ComplianceProfileResponseRuleRuleModel>;
};
//-
export type ComplianceProfileResponseGroupGroupDto = ComplianceGroupsDto;
export type ComplianceProfileResponseGroupGroupModel = ComplianceProfileResponseGroupGroupDto;

export type ComplianceProfileResponseGroupDto = ComplianceConnectorAndGroupsDto;
export type ComplianceProfileResponseGroupModel = Omit<ComplianceProfileResponseGroupDto, 'groups'> & {
    groups?: Array<ComplianceProfileResponseGroupGroupModel>;
};
//-
export type ComplianceProfileResponseDto = ComplianceProfileDto;
export type ComplianceProfileResponseModel = Omit<ComplianceProfileResponseDto, 'rules | groups | raProfiles | customAttributes'> & {
    rules: Array<ComplianceProfileResponseRuleModel>;
    groups: Array<ComplianceProfileResponseGroupModel>;
    raProfiles?: Array<RaProfileSimplifiedModel>;
    customAttributes?: Array<AttributeResponseModel>;
};
//---

export type ComplianceProfileRequestRuleRuleDto = ComplianceRequestRulesDto;
export type ComplianceProfileRequestRuleRuleModel = Omit<ComplianceProfileRequestRuleRuleDto, 'attributes'> & {
    attributes?: Array<AttributeRequestModel>;
};

export type ComplianceProfileRequestRuleDto = ComplianceProfileRulesRequestDto;
export type ComplianceProfileRequestRuleModel = Omit<ComplianceProfileRequestRuleDto, 'rules'> & {
    rules?: Array<ComplianceProfileRequestRuleRuleModel>;
};

export type ComplianceProfileRequestDto = ComplianceProfileRequestDtoOpenApi;
export type ComplianceProfileRequestModel = Omit<ComplianceProfileRequestDto, 'rules | customAttributes'> & {
    rules?: Array<ComplianceProfileRequestRuleModel>;
    customAttributes?: Array<AttributeRequestModel>;
};
//---

export type ComplianceProfileRuleAddRequestDto = ComplianceRuleAdditionRequestDto;
export type ComplianceProfileRuleAddRequestModel = Omit<ComplianceProfileRuleAddRequestDto, 'attributes'> & {
    attributes?: Array<AttributeRequestModel>;
};

export type ComplianceProfileRuleAddResponseDto = ComplianceProfileRuleDto;
export type ComplianceProfileRuleAddResponseModel = Omit<ComplianceProfileRuleAddResponseDto, 'attributes'> & {
    attributes: Array<AttributeResponseModel>;
};
//---

export type ComplianceProfileGroupRequestDto = ComplianceGroupRequestDto;
export type ComplianceProfileGroupRequestModel = ComplianceProfileGroupRequestDto;

export type ComplianceProfileRuleDeleteRequestDto = ComplianceRuleDeletionRequestDto;
export type ComplianceProfileRuleDeleteRequestModel = ComplianceProfileRuleDeleteRequestDto;

// export type ComplianceProfileRaProfileRequestDto = RaProfileAssociationRequestDto;
// export type ComplianceProfileRaProfileRequestModel = ComplianceProfileRaProfileRequestDto;

//---
export type ComplianceProfileRuleListResponseRuleDto = ComplianceRulesResponseDto;
export type ComplianceProfileRuleListResponseRuleModel = Omit<ComplianceProfileRuleListResponseRuleDto, 'attributes'> & {
    attributes?: Array<AttributeDescriptorModel>;
};

export type ComplianceProfileRuleListResponseDto = ComplianceRulesListResponseDto;
export type ComplianceProfileRuleListResponseModel = Omit<ComplianceProfileRuleListResponseDto, 'rules'> & {
    rules: Array<ComplianceProfileRuleListResponseRuleModel>;
};

//---
export type ComplianceProfileGroupListResponseGroupDto = ComplianceGroupsResponseDto;
export type ComplianceProfileGroupListResponseGroupModel = ComplianceProfileGroupListResponseGroupDto;

export type ComplianceProfileGroupListResponseDto = ComplianceGroupsListResponseDto;
export type ComplianceProfileGroupListResponseModel = Omit<ComplianceProfileGroupListResponseDto, 'groups'> & {
    groups: Array<ComplianceProfileGroupListResponseGroupModel>;
};
