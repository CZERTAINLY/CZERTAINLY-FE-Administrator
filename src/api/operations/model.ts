import { Observable } from "rxjs";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { CertificateRevocationReason } from "types/certificate";


export interface CertificateIssuanceDTO {
   uuid: string;
   certificateData: string;
}


export interface OperationsApi {

   issueCertificate(
      raProfileUuid: string,
      pkcs10: string,
      attributes: AttributeDTO[],
   ): Observable<{ uuid: string, certificateData: string }>;


   revokeCertificate(
      uuid: string,
      raProfileUuid: string,
      reason: CertificateRevocationReason,
      attributes: AttributeDTO[]
   ): Observable<void>;


   renewCertificate(
      uuid: string,
      raProfileUuid: string,
      pkcs10: string,
   ): Observable<CertificateIssuanceDTO>;


   getIssuanceAttributes(raProfileUuid: string): Observable<AttributeDescriptorDTO[]>;


   getRevocationAttributes(raProfileUuid: string): Observable<AttributeDescriptorDTO[]>;


}
