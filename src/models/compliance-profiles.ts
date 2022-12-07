import { CertificateType } from "types/certificate";
import { AttributeDescriptorModel } from "../types/attributes";

export interface ComplianceProfileListItemModel {
   name: string;
   uuid: string;
   description?: string;
   rules: ComplianceListItemRuleModel[];
}

export interface ComplianceListItemRuleModel {
   connectorName: string;
   numberOfRules: number;
   numberOfGroups: number;
}

export interface ComplianceProfileModel {
   name: string;
   uuid: string;
   description?: string;
   rules: ComplianceConnectorAndRulesModel[];
   groups: ComplianceConnectorAndGroupsModel[];
   raProfiles: ComplianceRaProfileModel[];
}

export interface ComplianceConnectorAndRulesModel {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   rules: ComplianceRuleModel[];
}

export interface ComplianceRulesListItemModel {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   rules: ComplianceRuleModel[];
}

export interface ComplianceGroupsListItemModel {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   groups: ComplianceGroupsModel[];
}

export interface ComplianceRuleModel {
   name: string;
   uuid: string;
   description?: string;
   groupUuid?: string;
   certificateType?: CertificateType;
   attributes?: AttributeDescriptorModel[];
}

export interface ComplianceConnectorAndGroupsModel {
   connectorName: string;
   connectorUuid: string;
   kind: string;
   groups: ComplianceGroupsModel[];
}

export interface ComplianceGroupsModel {
   name: string;
   uuid: string;
   description?: string;
}

export interface ComplianceRaProfileModel {
   name: string;
   uuid: string;
   enabled: boolean;
   authorityInstanceUuid: string
}