import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { HttpErrorResponse } from "ts-rest-client";
import { CertificateDetailResponse } from "models";

export class CertificateManagementMock
  implements model.CertificateManagementApi
{
  getCertificatesList(): Observable<CertificateDetailResponse[]> {
    return of(dbData.certificates).pipe(
      delay(randomDelay()),
      map((certificates) =>
        certificates.map(
          ({
            commonName,
            serialNumber,
            issuerCommonName,
            certificateContent,
            issuerDn,
            subjectDn,
            notAfter,
            notBefore,
            publicKeyAlgorithm,
            signatureAlgorithm,
            uuid,
            fingerprint,
            meta,
            subjectAlternativeNames,
            status,
            entityId,
            groupId,
            owner,
            keyUsage,
            extendedKeyUsage,
            keySize,
            basicConstraints,
            certificateType,
            issuerSerialNumber,
            certificateValidationResult,
          }) => ({
            commonName,
            serialNumber,
            issuerCommonName,
            certificateContent,
            issuerDn,
            subjectDn,
            notAfter,
            notBefore,
            publicKeyAlgorithm,
            signatureAlgorithm,
            uuid,
            fingerprint,
            meta,
            subjectAlternativeNames,
            status,
            entityId,
            groupId,
            owner,
            keyUsage,
            extendedKeyUsage,
            keySize,
            basicConstraints,
            certificateType,
            issuerSerialNumber,
            certificateValidationResult,
          })
        )
      )
    );
  }

  getCertificateDetail(uuid: string): Observable<CertificateDetailResponse> {
    return of(
      dbData.certificates.find((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((detail) => {
        if (detail) {
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
            entityId: detail.entityId,
            groupId: detail.groupId,
            owner: detail.owner,
            raProfileId: detail.raProfileId,
            keyUsage: detail.keyUsage,
            extendedKeyUsage: detail.extendedKeyUsage,
            keySize: detail.keySize,
            basicConstraints: detail.basicConstraints,
            certificateValidationResult: detail.certificateValidationResult,
          };
        }

        throw new HttpErrorResponse({
          status: 404,
        });
      })
    );
  }
}
