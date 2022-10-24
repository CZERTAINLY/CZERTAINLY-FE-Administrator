import PolicyMapping from "./PolicyMapping";

// PolicyMappingsSyntax ::=
//   SEQUENCE SIZE (1..MAX) OF
//     SEQUENCE {issuerDomainPolicy   CertPolicyId,
//               subjectDomainPolicy  CertPolicyId,
//               ...}
// The inner sequence is provided by PolicyMapping.ts

type PolicyMappingsSyntax = PolicyMapping[];
export default PolicyMappingsSyntax;
