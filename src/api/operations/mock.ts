import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "utils/FetchHttpService";
import { CertificateRevocationReason } from "types/certificate";

import * as model from "./model";


export class OperationsMock implements model.OperationsApi {

   issueCertificate(
      raProfileUuid: string,
      pkcs10: string,
      attributes: AttributeDTO[],
      authorityUuid: string
   ): Observable<{ uuid: string, certificateData: string }> {

      throw new HttpErrorResponse({ status: 404, statusText: "Not Implemented"});

   }


   revokeCertificate(
      uuid: string,
      raProfileUuid: string,
      reason: CertificateRevocationReason,
      attributes: AttributeDTO[],
      authorityUuid: string
   ): Observable<void> {

      throw new HttpErrorResponse({ status: 404, statusText: "Not Implemented"});

   }


   renewCertificate(
      uuid: string,
      raProfileUuid: string,
      pkcs10: string,
      authorityUuid: string
   ): Observable<model.CertificateIssuanceDTO> {

      throw new HttpErrorResponse({ status: 404, statusText: "Not Implemented"});

   }


   getIssuanceAttributes(raProfileUuid: string, authorityUuid: string): Observable<AttributeDescriptorDTO[]> {

      throw new HttpErrorResponse({ status: 404, statusText: "Not Implemented"});

   }


   getRevocationAttributes(raProfileUuid: string, authorityUuid: string): Observable<AttributeDescriptorDTO[]> {

      throw new HttpErrorResponse({ status: 404, statusText: "Not Implemented"});

   }

}