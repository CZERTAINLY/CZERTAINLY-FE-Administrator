import { ObjectIdentifier } from "asn1-ts";
export const informationFrameworkOID: ObjectIdentifier = new ObjectIdentifier([ 2, 5, 1, 1 ]);

export { default as AttributeTypeAndValue } from "./AttributeTypeAndValue";
// export { default as AttributeUsage } from "./AttributeUsage";
export { default as Name } from "./Name";
export { default as RDNSequence } from "./RDNSequence";
export { default as RelativeDistinguishedName } from "./RelativeDistinguishedName";
