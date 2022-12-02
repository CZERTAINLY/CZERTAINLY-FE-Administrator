import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { Observable } from "rxjs";
import { CertificateType } from "types/certificate";

export interface ComplianceProfileListItemDTO {
   name: string;
   uuid: string;
   description?: string;
   rules: ComplianceListItemRuleDTO[];
}

export interface ComplianceListItemRuleDTO {
   connectorName: string;
   numberOfRules: number;
   numberOfGroups: number;
}

export interface ComplianceProfileDTO {
   name: string;
   uuid: string;
   description?: string;
   rules: ComplianceConnectorAndRulesDTO[];
   groups: ComplianceConnectorAndGroupsDTO[];
   raProfiles: ComplianceRaProfileDto[];
}

export interface ComplianceConnectorAndRulesDTO {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   rules: ComplianceRuleDTO[];
}

export interface ComplianceRulesListItemDTO {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   rules: ComplianceRuleDTO[];
}

export interface ComplianceGroupsListItemDTO {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   groups: ComplianceGroupsDTO[];
}

export interface ComplianceRuleDTO {
   name: string;
   uuid: string;
   description?: string;
   groupUuid?: string;
   certificateType?: CertificateType;
   attributes?: AttributeDescriptorDTO[];
}

export interface ComplianceConnectorAndGroupsDTO {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   groups: ComplianceGroupsDTO[];
}

export interface ComplianceGroupsDTO {
   name: string;
   uuid: string;
   description?: string;
}

export interface ComplianceRaProfileDto {
   name: string;
   uuid: string;
   enabled: boolean;
   authorityInstanceUuid: string
}
