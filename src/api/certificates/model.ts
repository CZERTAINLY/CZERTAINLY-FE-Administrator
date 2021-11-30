import { CertificateDetailResponse } from "models";
import { Observable } from "rxjs";

export interface CertificateManagementApi {
  getCertificatesList(): Observable<CertificateDetailResponse[]>;
  getCertificateDetail(uuid: string): Observable<CertificateDetailResponse>;
}
