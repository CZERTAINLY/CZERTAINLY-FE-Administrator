import DistributionPoint from "./DistributionPoint";

//   CRLDistPointsSyntax ::= SEQUENCE SIZE (1..MAX) OF DistributionPoint

type CRLDistPointsSyntax = DistributionPoint[];
export default CRLDistPointsSyntax;
