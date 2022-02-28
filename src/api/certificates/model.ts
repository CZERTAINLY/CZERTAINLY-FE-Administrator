import { CertificateDetailResponse } from "models";
import {
  CertificateRequestInfo,
  CertificateResponseDto,
} from "models/certificates";
import { Observable } from "rxjs";

export interface CertificateManagementApi {
  getCertificatesList(
    searchField: CertificateRequestInfo
  ): Observable<CertificateResponseDto>;
  getCertificateDetail(uuid: string): Observable<CertificateDetailResponse>;
}
