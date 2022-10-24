import { ObjectIdentifier } from "asn1-ts";
export const pkiPmiExternalDataTypesVersion8OID: ObjectIdentifier = new ObjectIdentifier([ 2, 5, 1, 40, 8 ]);

export { default as AccessDescription } from "./AccessDescription";
export { default as AuthorityInfoAccessSyntax } from "./AuthorityInfoAccessSyntax";
export { default as SubjectInfoAccessSyntax } from "./SubjectInfoAccessSyntax";
