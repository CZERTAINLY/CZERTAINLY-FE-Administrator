import { AttributeDescriptorModel, AttributeRequestModel, AttributeResponseModel } from './attributes';
import { RaProfileSimplifiedModel } from './certificate';
import {
    ComplianceGroupDto,
    ComplianceGroupRequestDto,
    ComplianceGroupsListResponseDto,
    ComplianceGroupsResponseDto,
    ComplianceProfileDto,
    ComplianceProfileListDto as ComplianceProfileListDtoOpenApi,
    ComplianceProfileRequestDto as ComplianceProfileRequestDtoOpenApi,
    ComplianceProfileRuleDto,
    ComplianceProfilesListDto,
    ComplianceProviderSummaryDto,
    ComplianceRuleAdditionRequestDto,
    ComplianceRuleDeletionRequestDto,
    ComplianceRuleDto,
    ComplianceRulesListResponseDto,
    ComplianceRulesResponseDto,
} from './openapi';

export type ComplianceProfileListRuleDto = ComplianceProviderSummaryDto;
export type ComplianceProfileListRuleModel = ComplianceProfileListRuleDto;

export type ComplianceProfileListDto = ComplianceProfileListDtoOpenApi;
export type ComplianceProfileListModel =
    ComplianceProfileListDto; /* Omit<ComplianceProfileListDto, 'rules'> & { rules: Array<ComplianceProfileListRuleModel> };
 */
//---
export type ComplianceProfileResponseRuleRuleDto = ComplianceRuleDto;
export type ComplianceProfileResponseRuleRuleModel = Omit<ComplianceProfileResponseRuleRuleDto, 'attributes'> & {
    attributes?: Array<AttributeResponseModel>;
};

export type ComplianceProfileResponseRuleDto = ComplianceRuleDto;
export type ComplianceProfileResponseRuleModel = Omit<ComplianceProfileResponseRuleDto, 'rules'> & {
    rules?: Array<ComplianceProfileResponseRuleRuleModel>;
};
//-
export type ComplianceProfileResponseGroupGroupDto = ComplianceGroupDto;
export type ComplianceProfileResponseGroupGroupModel = ComplianceProfileResponseGroupGroupDto;

export type ComplianceProfileResponseGroupDto = ComplianceGroupDto;
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

export type ComplianceProfileRequestRuleRuleDto = ComplianceRuleDto;
export type ComplianceProfileRequestRuleRuleModel = Omit<ComplianceProfileRequestRuleRuleDto, 'attributes'> & {
    attributes?: Array<AttributeRequestModel>;
};

export type ComplianceProfileRequestRuleDto = ComplianceRuleDto;
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
