import { Observable } from "rxjs";
import { AttributeDTO } from "api/.common/AttributeDTO";
import { DeleteObjectErrorDTO } from "api/.common/DeleteObjectErrorDTO";


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

   getAuthorityDetail(uuid: string): Observable<AuthorityDTO>;

   updateAuthority(uuid: string, attributes: AttributeDTO[]): Observable<AuthorityDTO>;

   deleteAuthority(uuid: string): Observable<void>;

   getAuthoritiesList(): Observable<AuthorityDTO[]>;

   createNewAuthority(name: string, attributes: AttributeDTO[], connectorUuid: string, kind: string): Observable<string>;

   bulkDeleteAuthority(uuids: string[]): Observable<DeleteObjectErrorDTO[]>;

   listRAProfileAttributes(uuid: string): Observable<AttributeDTO[]>;

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
