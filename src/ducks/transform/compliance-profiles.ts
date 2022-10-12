import { ComplianceConnectorAndGroupsDTO, ComplianceConnectorAndRulesDTO, ComplianceGroupsDTO, ComplianceProfileDTO, ComplianceProfileListItemDTO, ComplianceRuleDTO } from "api/compliance-profile";
import { raComplianceProfileDTO } from "api/profiles";
import { raComplianceProfileModel } from "models";
import { ComplianceConnectorAndGroupsModel, ComplianceConnectorAndRulesModel, ComplianceGroupsModel, ComplianceProfileListItemModel, ComplianceProfileModel, ComplianceRuleModel } from "models/compliance-profiles";

export function transformComplianceProfileListDtoToModel(complianceProfileDto: ComplianceProfileListItemDTO): ComplianceProfileListItemModel {

   return {
      uuid: complianceProfileDto.uuid,
      name: complianceProfileDto.name,
      description: complianceProfileDto.description,
      rules: JSON.parse(JSON.stringify(complianceProfileDto.rules)),
   };

}


export function transformComplianceProfileDtoToModel(complianceProfileDto: ComplianceProfileDTO): ComplianceProfileModel {

   return {
      uuid: complianceProfileDto.uuid,
      name: complianceProfileDto.name,
      description: complianceProfileDto.description,
      rules: JSON.parse(JSON.stringify(complianceProfileDto.rules)),
      groups: JSON.parse(JSON.stringify(complianceProfileDto.groups)),
      raProfiles: JSON.parse(JSON.stringify(complianceProfileDto.raProfiles)),
   };

}

export function transformRaComplianceProfileDtoToModel(complianceProfileDto: raComplianceProfileDTO): raComplianceProfileModel {

   return {
      uuid: complianceProfileDto.uuid,
      name: complianceProfileDto.name,
      description: complianceProfileDto?.description,
   };

}


export function transformComplianceRuleDTOToModel(complianceRuleDto: ComplianceRuleDTO): ComplianceRuleModel {

   return {
      uuid: complianceRuleDto.uuid,
      name: complianceRuleDto.name,
      description: complianceRuleDto.description,
      groupUuid: complianceRuleDto.groupUuid,
      certificateType: complianceRuleDto.certificateType,
      attributes: JSON.parse(JSON.stringify(complianceRuleDto.attributes)),
   };

}


export function transformComplianceGroupDTOToModel(complianceGroupDto: ComplianceGroupsDTO): ComplianceGroupsModel {

   return {
      uuid: complianceGroupDto.uuid,
      name: complianceGroupDto.name,
      description: complianceGroupDto.description,
   };

}

export function transformComplianceConnectorRuleDTOToModel(complianceRuleDto: ComplianceConnectorAndRulesDTO): ComplianceConnectorAndRulesModel {

   return {
      connectorName: complianceRuleDto.connectorName,
      connectorUuid: complianceRuleDto.connectorUuid,
      rules: JSON.parse(JSON.stringify(complianceRuleDto.rules)),
      kind: complianceRuleDto.kind,
   };

}


export function transformComplianceConnectorGroupDTOToModel(complianceGroupDto: ComplianceConnectorAndGroupsDTO): ComplianceConnectorAndGroupsModel {

   return {
      connectorName: complianceGroupDto.connectorName,
      connectorUuid: complianceGroupDto.connectorUuid,
      groups: JSON.parse(JSON.stringify(complianceGroupDto.groups)),
      kind: complianceGroupDto.kind,
   };

}