import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import * as model from "./model";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";

export class CertificateManagementMock implements model.CertificateManagementApi {


   getCertificatesList(
      itemsPerPage: number = 100,
      pageNumber: number = 0,
      filters: model.CertificateListFilterDTO[] = []
   ): Observable<model.CertificateListDTO> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),

         map(
            () => {

               const startItem = (pageNumber - 1) * itemsPerPage;

               return {
                  certificates: dbData.certificates.slice(startItem, startItem + itemsPerPage),
                  itemsPerPage: itemsPerPage,
                  pageNumber: pageNumber,
                  totalPages: Math.ceil(dbData.certificates.length / itemsPerPage),
                  totalItems: dbData.certificates.length
               }
            }
         )
      );

   }


   getCertificateDetail(uuid: string): Observable<model.CertificateDTO> {

      return of(
         dbData.certificates.find((c) => c.uuid.toString() === uuid.toString())
      ).pipe(

         delay(randomDelay()),

         map(

            (detail) => {

               if (!detail) throw new HttpErrorResponse({ status: 404, });

               return {
                  commonName: detail.commonName,
                  serialNumber: detail.serialNumber,
                  issuerCommonName: detail.issuerCommonName,
                  certificateContent: detail.certificateContent,
                  issuerDn: detail.issuerDn,
                  subjectDn: detail.subjectDn,
                  notAfter: detail.notAfter,
                  notBefore: detail.notBefore,
                  publicKeyAlgorithm: detail.publicKeyAlgorithm,
                  signatureAlgorithm: detail.signatureAlgorithm,
                  uuid: detail.uuid,
                  fingerprint: detail.fingerprint,
                  meta: detail.meta,
                  subjectAlternativeNames: detail.subjectAlternativeNames,
                  status: detail.status,
                  entity: detail.entity,
                  group: detail.group,
                  owner: detail.owner,
                  //raProfileId: detail.raProfileId,
                  keyUsage: detail.keyUsage,
                  extendedKeyUsage: detail.extendedKeyUsage,
                  keySize: detail.keySize,
                  basicConstraints: detail.basicConstraints,
                  certificateValidationResult: detail.certificateValidationResult,
               };
            }

         )

      );

   }


}
