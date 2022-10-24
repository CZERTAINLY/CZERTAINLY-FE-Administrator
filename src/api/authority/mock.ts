import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "utils/FetchHttpService";

import * as model from "./model";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";

export class AuthorityManagementMock implements model.AuthorityManagementApi {


   validateRAProfileAttributes(uuid: string, attributes: AttributeDTO[]): Observable<void> {

      return of(
         dbData.raProfiles.find(raProfile => raProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            raProfile => {
               // !!! This is not gonna be used by frontend
            }
         )

      )

   }


   getAuthorityDetail(uuid: string): Observable<model.AuthorityDTO> {

      return of(
         dbData.authorities.find(authority => authority.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            authority => {
               if (!authority) throw new HttpErrorResponse({ status: 404 });
               return authority;
            }

         )

      )
   }


   updateAuthority(uuid: string, attributes: AttributeDTO[]): Observable<model.AuthorityDTO> {

      return of(
         dbData.authorities.find(authority => authority.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            authority => {

               if (!authority) throw new HttpErrorResponse({ status: 404 });

               attributes.forEach(

                  attribute => {

                     const authorityAttribute = authority.attributes?.find(authorityAttribute => authorityAttribute.uuid === attribute.uuid);

                     if (authorityAttribute) {
                        authorityAttribute.content = attribute.content;
                     } else {

                        authority.attributes = authority.attributes || [];

                        authority.attributes.push({
                           uuid: attribute.uuid,
                           name: attribute.name,
                           content: attribute.content
                        });

                     }

                  }

               )

               return authority;

            }

         )
      );

   }


   deleteAuthority(uuid: string): Observable<void> {

      return of(
         dbData.authorities.findIndex(authority => authority.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            authorityIndex => {

               if (authorityIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.authorities.splice(authorityIndex, 1);

            }

         )

      )
   }


   getAuthoritiesList(): Observable<model.AuthorityDTO[]> {

      return of(
         dbData.authorities
      ).pipe(

         delay(randomDelay()),
         map(
            authorities => authorities
         )

      );

   }


   createNewAuthority(
      name: string,
      attributes: AttributeDTO[],
      connectorUuid: string,
      kind: string
   ): Observable<{ uuid: string}> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const uuid = crypto.randomUUID();

               const connector = dbData.connectors.find(connector => connector.uuid === connectorUuid);
               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });

               dbData.authorities.push({
                  uuid,
                  name,
                  connectorName: connector.name,
                  connectorUuid: connector.uuid,
                  kind,
                  attributes,
                  status: "",
                  raProfileAttributes: [],
                  issueAttributes: [],
                  revokeAttributes: [],
               })

               return { uuid };
            }

         )
      );

   }


   bulkDeleteAuthority(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               const errors: DeleteObjectErrorDTO[] = [];

               uuids.forEach(

                  uuid => {

                     const authorityIndex = dbData.authorities.findIndex(authority => authority.uuid === uuid);

                     if (authorityIndex < 0) {
                        errors.push({ uuid, name: "", message: "Failed to delete specified authority." });
                        return;
                     }

                     dbData.authorities.splice(authorityIndex, -1);

                  }

               )

               return errors;

            }
         )

      )

   }


   listRAProfileAttributesDescriptors(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.authorities.find(authority => authority.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            authority => {
               if (!authority) throw new HttpErrorResponse({ status: 404 });
               return authority.raProfileAttributes || [];
            }

         )

      )

   }


   bulkForceDeleteAuthority(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const authorityIndex = dbData.authorities.findIndex(authority => authority.uuid === uuid);
                     if (authorityIndex < 0) throw new HttpErrorResponse({ status: 404 });
                     dbData.authorities.splice(authorityIndex, 1);

                  }

               )


            }

         )
      )

   }


   getAuthorityProviderList(): Observable<model.AuthorityDTO[]> {

      return of(
         dbData.authorities
      ).pipe(

         delay(randomDelay()),
         map(
            authorityProviders => authorityProviders
         )

      );

   }

}
