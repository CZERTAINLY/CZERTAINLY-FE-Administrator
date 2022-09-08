import { AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/complianceProfiles";

export class ComplianceProfileManagementBackend implements model.ComplianceProfileManagementApi {

   private _fetchService: FetchHttpService;


   constructor() {
      this._fetchService = new FetchHttpService();
   }

   getComplianceProfileList(): Observable<model.ComplianceProfileListItemDTO[]> {
      
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "GET")
      );

   }

   getComplianceProfileDetail(uuid: string): Observable<model.ComplianceProfileDTO> {
      
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      
         );
   }

   createComplianceProfile(name: string, description?: string | undefined): Observable<string> {
      return createNewResource(baseUrl, {
         name,
         description
         }).pipe(
               map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
            );
   }

   deleteComplianceProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
         );
   
      }

   bulkDeleteComplianceProfiles(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {
      
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuids)
      );

   }

   bulkForceDeleteComplianceProfiles(uuids: string[]): Observable<void> {
      
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/force`, "DELETE", uuids)
      );

   }

   checkCompliance(uuids: string[]): Observable<void> {
      
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/compliance`, "POST", {
            complianceProfileUuids: uuids
         })
      );

   }
   
   addRuleToComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string, attributes: AttributeDTO[]): Observable<void> {
      
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrl}/${uuid}/rules`, "POST", {
            connectorUuid,
            kind,
            ruleUuid,
            attributes
         })

      );

   }

   deleteRuleFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string): Observable<void> {
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrl}/${uuid}/rules`, "DELETE", {
            connectorUuid,
            kind,
            ruleUuid
         })
         
      );
   }

   addGroupToComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void> {
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrl}/${uuid}/groups`, "POST", {
            connectorUuid,
            kind,
            groupUuid
         })
         
      );
   }

   deleteGroupFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void> {
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrl}/${uuid}/groups`, "DELETE", {
            connectorUuid,
            kind,
            groupUuid
         })
         
      );
   }

   associateComplianceProfileToRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrl}/${uuid}/raProfile/associate`, "PATCH", {
            raProfileUuids: raProfileUuids
         })
         
      );
   }

   dissociateComplianceProfileFromRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrl}/${uuid}/raProfile/disassociate`, "PATCH", {
            raProfileUuids: raProfileUuids
         })
         
      );
   }

   getAssociatedRaProfiles(uuid: string): Observable<model.ComplianceRaProfileDto[]> {
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/raprofiles`, "GET")
      );

   }

   getComplianceProfileRules(connectorUuid?: string | undefined, kind?: string | undefined, certificateType?: string | undefined): Observable<model.ComplianceConnectorAndRulesDTO[]> {
      const cuid = connectorUuid ? `connectorUuid=${connectorUuid}` : "";
      const k = kind ? `kind=${kind}` : "";
      const ct = certificateType ? `certificateType=${certificateType}` : "";

      const search = cuid ? `?${cuid}` + (k ? `&${k}` : "") + (ct ? `&${ct}` : "") : "";
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/rules${search}`, "GET")
      );
   }
   
   getComplianceProfileGroups(connectorUuid?: string | undefined, kind?: string | undefined): Observable<model.ComplianceConnectorAndGroupsDTO[]> {
      const cuid = connectorUuid ? `connectorUuid=${connectorUuid}` : "";
      const k = kind ? `kind=${kind}` : "";

      const search = cuid ? `?${cuid}` + (k ? `&${k}` : "") : "";
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/groups${search}`, "GET")
      );
   }
}
