import { DashboardDTO } from "api/dashboard";
import { DashboardModal } from "models/dashboard";

export function transformDashbaordDTOToModel(dashboardDTO: DashboardDTO): DashboardModal {

   return {
      totalCertificates: dashboardDTO.totalCertificates,
      totalGroups: dashboardDTO.totalGroups,
      totalEntities: dashboardDTO.totalEntities,
      totalDiscoveries: dashboardDTO.totalDiscoveries,
      totalRaProfiles: dashboardDTO.totalRaProfiles,
      groupStatByCertificateCount: dashboardDTO.groupStatByCertificateCount,
      raProfileStatByCertificateCount: dashboardDTO.raProfileStatByCertificateCount,
      certificateStatByType: dashboardDTO.certificateStatByType,
      certificateStatByExpiry: dashboardDTO.certificateStatByExpiry,
      certificateStatByKeySize: dashboardDTO.certificateStatByKeySize,
      certificateStatByBasicConstraints: dashboardDTO.certificateStatByBasicConstraints,
      certificateStatByStatus: dashboardDTO.certificateStatByStatus,
   };

}