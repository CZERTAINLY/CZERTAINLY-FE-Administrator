import { Observable } from "rxjs";

export interface DashboardDTO {
  totalCertificates: number;
  totalGroups: number;
  totalEntities: number;
  totalDiscoveries: number;
  totalRaProfiles: number;
  groupStatByCertificateCount: DashboardDict;
  raProfileStatByCertificateCount: DashboardDict;
  certificateStatByType: DashboardDict;
  certificateStatByExpiry: DashboardDict;
  certificateStatByKeySize: DashboardDict;
  certificateStatByBasicConstraints: DashboardDict;
  certificateStatByStatus: DashboardDict;
  certificateStatByComplianceStatus: DashboardDict;
}

export interface DashboardDict {
  [key: string]: number;
}

export interface DashboardManagementApi {
  getDashboardData(): Observable<DashboardDTO>;
}
