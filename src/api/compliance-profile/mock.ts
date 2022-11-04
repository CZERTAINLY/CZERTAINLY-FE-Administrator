import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "utils/FetchHttpService";

import { dbData } from "api/_mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { CertificateType } from "types/certificate";
import { ComplianceRuleDTO } from "./model";

export class ComplianceProfileManagementMock implements model.ComplianceProfileManagementApi {
   getComplianceProfileList(): Observable<model.ComplianceProfileListItemDTO[]> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               return dbData.complianceProfilesList.map(

                  complianceProfile => ({
                     uuid: complianceProfile.uuid,
                     name: complianceProfile.name,
                     description: complianceProfile.description,
                     rules: complianceProfile.rules,
                  })

               )

            }

         )

      );
   }

   getComplianceProfileDetail(uuid: string): Observable<model.ComplianceProfileDTO> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {
               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               if (!complianceProfile) throw new HttpErrorResponse({ status: 404 });
               return complianceProfile;
            }

         )

      )
   }
   createComplianceProfile(name: string, description?: string | undefined): Observable<{ uuid: string }> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const uuid = crypto.randomUUID();

               dbData.complianceProfiles.push({
                  uuid,
                  name,
                  description,
                  rules: [],
                  groups: [],
                  raProfiles: [],

               })

               return { uuid };

            }

         )

      );
   }

   deleteComplianceProfile(uuid: string): Observable<void> {
      return of(
         dbData.complianceProfiles.findIndex(complianceProfile => complianceProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            complianceProfileIndex => {

               if (complianceProfileIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.acmeProfiles.splice(complianceProfileIndex, 1);

            }

         )

      )
   }

   bulkDeleteComplianceProfiles(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {
      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {
                     const complianceProfileIndex = dbData.complianceProfiles.findIndex(complianceProfile => complianceProfile.uuid === uuid);
                     if (complianceProfileIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `Compliance profile ${uuid} not found` });
                     dbData.complianceProfiles.splice(complianceProfileIndex, -1);
                  }

               )

               return [];

            }

         )

      )
   }

   bulkForceDeleteComplianceProfiles(uuids: string[]): Observable<void> {
      return of(uuids).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {
                     const complianceProfileIndex = dbData.complianceProfiles.findIndex(complianceProfile => complianceProfile.uuid === uuid);
                     if (complianceProfileIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `Compliance profile ${uuid} not found` });
                     dbData.complianceProfiles.splice(complianceProfileIndex, -1);
                  }

               )

            }

         )

      )
   }

   checkCompliance(uuids: string[]): Observable<void> {
      return of(uuids).pipe(
         delay(randomDelay()),
         map(
            uuids => {
               console.log("Compliance Check Completed for the certificates", uuids);
            }
         )
      )
   }

   addRuleToComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string, attributes: AttributeDTO[]): Observable<ComplianceRuleDTO> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               if (!complianceProfile) throw new HttpErrorResponse({ status: 404, statusText: "Compliance profile not found" });

               const rule = {
                  uuid,
                  name: "",
                  connectorName: "Test",
                  connectorUuid,
                  kind,
                  rules: [{
                     uuid: ruleUuid,
                     name: "Test",
                  }],
               }

               complianceProfile.rules.push(rule);

               return rule;
            }

         ))
   }

   deleteRuleFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, ruleUuid: string): Observable<void> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               if (!complianceProfile) throw new HttpErrorResponse({ status: 404, statusText: "Compliance profile not found" });

               complianceProfile.rules = complianceProfile.rules.filter(
                  rule => rule.connectorUuid !== connectorUuid || rule.kind !== kind || rule.rules.find(rule => rule.uuid !== ruleUuid)
               )
            }
         ))
   }

   addGroupToComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               if (!complianceProfile) throw new HttpErrorResponse({ status: 404, statusText: "Compliance profile not found" });

               complianceProfile.groups.push({
                  connectorName: "Test",
                  connectorUuid,
                  kind,
                  groups: [{
                     uuid: groupUuid,
                     name: "Test",
                  }],
               }
               )
            }
         ))
   }
   deleteGroupFromComplianceProfile(uuid: string, connectorUuid: string, kind: string, groupUuid: string): Observable<void> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               if (!complianceProfile) throw new HttpErrorResponse({ status: 404, statusText: "Compliance profile not found" });

               complianceProfile.groups = complianceProfile.groups.filter(
                  group => group.connectorUuid !== connectorUuid || group.kind !== kind || group.groups.find(group => group.uuid !== groupUuid)
               )
            }
         ))
   }

   associateComplianceProfileToRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               if (!complianceProfile) throw new HttpErrorResponse({ status: 404, statusText: "Compliance profile not found" });

               complianceProfile.raProfiles.push({
                  name: "Test",
                  uuid: raProfileUuids[0],
                  enabled: true,
                  authorityInstanceUuid: "ransom-uuid"
               }
               )
            }
         ))
   }

   dissociateComplianceProfileFromRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               if (!complianceProfile) throw new HttpErrorResponse({ status: 404, statusText: "Compliance profile not found" });
               complianceProfile.raProfiles = complianceProfile.raProfiles.filter(raProfile => raProfileUuids.includes(raProfile.uuid));
            }
         )
      )
   }

   getAssociatedRaProfiles(uuid: string): Observable<model.ComplianceRaProfileDto[]> {
      return of(
         dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid)?.raProfiles
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const complianceProfile = dbData.complianceProfiles.find(complianceProfile => complianceProfile.uuid === uuid);
               return complianceProfile?.raProfiles || [];
            }
         )
      )
   }

   getComplianceProfileRules(connectorUuid?: string | undefined, kind?: string | undefined, certificateType?: CertificateType | undefined): Observable<model.ComplianceConnectorAndRulesDTO[]> {

      return of(dbData.complianceRules);

   }

   getComplianceProfileGroups(connectorUuid?: string | undefined, kind?: string | undefined): Observable<model.ComplianceConnectorAndGroupsDTO[]> {

      return of(dbData.complianceGroups);

   }
}
