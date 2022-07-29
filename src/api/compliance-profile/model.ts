import { RaProfileDTO } from "api/profiles";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { Observable } from "rxjs";
import { CertificateType } from "types/certificate";

export interface ComplianceProfileListItemDTO {
   name: string;
   uuid: string;
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
   rules: ComplianceRulesDTO[];
}

export interface ComplianceRulesListItemDTO {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   rules: ComplianceRulesDTO[];
}

export interface ComplianceGroupsListItemDTO {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   groups: ComplianceGroupsDTO[];
}

export interface ComplianceRulesDTO {
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
}


export interface ComplianceProfileManagementApi {
   
   getComplianceProfileList(): Observable<ComplianceProfileListItemDTO[]>;
   
   getComplianceProfileDetail(uuid: string): Observable<ComplianceProfileDTO>;
   
   createComplianceProfile(name: string, description?: string): Observable<string>;
   
   deleteComplianceProfile(uuid: string): Observable<void>;
   
   bulkDeleteComplianceProfiles(uuids: string[]): Observable<DeleteObjectErrorDTO[]>;
   
   bulkForceDeleteComplianceProfiles(uuids: string[]): Observable<void>;
   
   checkCompliance(uuids: string[]): Observable<void>;
   
   addRuleToComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string, attributes: AttributeDTO[]): Observable<void>;
   
   deleteRuleFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string): Observable<void>;
   
   addGroupToComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void>;
   
   deleteGroupFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void>;
   
   associateComplianceProfileToRaProfile(uuid: string, raProfileUuids: string[]): Observable<void>;
   
   dissociateComplianceProfileFromRaProfile(uuid: string, raProfileUuids: string[]): Observable<void>;
   
   getAssociatedRaProfiles(uuid: string): Observable<ComplianceRaProfileDto[]>;
   
   getComplianceProfileRules(connectorUuid?: string, kind?: string, certificateType?: CertificateType): Observable<ComplianceConnectorAndRulesDTO[]>;
   
   getComplianceProfileGroups(connectorUuid?: string, kind?: string): Observable<ComplianceConnectorAndGroupsDTO[]>;
}
