import { Observable } from "rxjs";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";


export interface AuthorityDTO {
   uuid: string;
   name: string;
   attributes?: AttributeDTO[];
   status: string;
   connectorUuid: string;
   connectorName: string;
   kind: string;
}


export interface AuthorityManagementApi {

   validateRAProfileAttributes(uuid: string, attributes: AttributeDTO[]): Observable<void>;

   listRAProfileAttributesDescriptors(uuid: string): Observable<AttributeDescriptorDTO[]>;

   getAuthorityDetail(uuid: string): Observable<AuthorityDTO>;

   updateAuthority(uuid: string, attributes: AttributeDTO[]): Observable<AuthorityDTO>;

   deleteAuthority(uuid: string): Observable<void>;

   getAuthoritiesList(): Observable<AuthorityDTO[]>;

   createNewAuthority(name: string, attributes: AttributeDTO[], connectorUuid: string, kind: string): Observable<string>;

   bulkDeleteAuthority(uuids: string[]): Observable<DeleteObjectErrorDTO[]>;

   bulkForceDeleteAuthority(uuids: string[]): Observable<void>;

   // Following items are probably not implemented on server or were deleted

   // listCertificateProfiles(uuid: string, endEntityProfileId: string): Observable<...>

   // listCAsInProfile(uuid: string, endEntityProfileId: string): Observable<...>

   // listEntityProfiles(uuid: string): Observable<...>

   /*
   getAuthorityProviderAttributes(
      uuid: string,
      kind: string,
      functionGroup: string
   ): Observable<AttributeDTO[]>;
   */

}
