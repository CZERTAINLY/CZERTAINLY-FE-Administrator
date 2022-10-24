import { DERElement } from "asn1-ts";

//   DistributionPointName ::= CHOICE {
//     fullName                 [0]  GeneralNames,
//     nameRelativeToCRLIssuer  [1]  RelativeDistinguishedName,
//     ...
//   }

type DistributionPointName = DERElement;
export default DistributionPointName;
