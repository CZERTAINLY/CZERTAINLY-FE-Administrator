import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { RaProfileDTO } from "api/profiles";
import { AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { CertificateType } from "types/certificate";

export class ComplianceProfileManagementMock implements model.ComplianceProfileManagementApi {
   getComplianceProfileList(): Observable<model.ComplianceProfileListItemDTO[]> {
      throw new Error("Method not implemented.");
   }
   getComplianceProfileDetail(uuid: string): Observable<model.ComplianceProfileDTO> {
      throw new Error("Method not implemented.");
   }
   createComplianceProfile(name: string, description?: string | undefined): Observable<string> {
      throw new Error("Method not implemented.");
   }
   deleteComplianceProfile(uuid: string): Observable<void> {
      throw new Error("Method not implemented.");
   }
   bulkDeleteComplianceProfiles(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {
      throw new Error("Method not implemented.");
   }
   bulkForceDeleteComplianceProfiles(uuids: string[]): Observable<void> {
      throw new Error("Method not implemented.");
   }
   checkCompliance(uuids: string[]): Observable<void> {
      throw new Error("Method not implemented.");
   }
   addRuleToComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string, attributes: AttributeDTO[]): Observable<void> {
      throw new Error("Method not implemented.");
   }
   deleteRuleFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string): Observable<void> {
      throw new Error("Method not implemented.");
   }
   addGroupToComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void> {
      throw new Error("Method not implemented.");
   }
   deleteGroupFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void> {
      throw new Error("Method not implemented.");
   }
   associateComplianceProfileToRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      throw new Error("Method not implemented.");
   }
   dissociateComplianceProfileFromRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      throw new Error("Method not implemented.");
   }
   getAssociatedRaProfiles(uuid: string): Observable<RaProfileDTO[]> {
      throw new Error("Method not implemented.");
   }
   getComplianceProfileRules(connectorUuid?: string | undefined, kind?: string | undefined, certificateType?: CertificateType | undefined): Observable<model.ComplianceConnectorAndRulesDTO[]> {
      throw new Error("Method not implemented.");
   }
   getComplianceProfileGroups(connectorUuid?: string | undefined, kind?: string | undefined): Observable<model.ComplianceConnectorAndGroupsDTO[]> {
      throw new Error("Method not implemented.");
   }

   

}
