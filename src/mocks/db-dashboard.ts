import { DashboardDTO } from "api/dashboard";


export const dbDashboard: DashboardDTO = {

   totalCertificates: 6,
   totalGroups: 3,
   totalEntities: 3,
   totalDiscoveries: 5,
   totalRaProfiles: 7,

   groupStatByCertificateCount: {
      RomanGroup: 0,
      Unassigned: 5,
      Default: 0,
      "Default Group 2": 1,
   },

   raProfileStatByCertificateCount: {
      "TLS Profile": 0,
      TestProf2: 0,
      TestingProfile: 0,
      "Yet another testing profile": 0,
      "DEMO-RA-PROFILE": 1,
      RomanTesting: 0,
      Unassigned: 5,
      "Test Profile": 0,
   },

   certificateStatByType: {
      Unknown: 0,
      "X.509": 6,
   },

   certificateStatByExpiry: {
      "90": 2,
      "60": 1,
      "30": 1,
      "20": 1,
      "10": 0,
   },

   certificateStatByKeySize: {
      "4096": 2,
      Unknown: 0,
      "2048": 4,
   },

   certificateStatByBasicConstraints: {
      "Subject Type=CA": 3,
      Unknown: 0,
      "Subject Type=End Entity": 3,
   },

   certificateStatByStatus: { Unknown: 25, Valid: 100 },
}