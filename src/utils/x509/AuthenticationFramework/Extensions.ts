import Extension from "./Extension";

// Extensions ::= SEQUENCE SIZE (1..MAX) OF Extension

// -- For those extensions where ordering of individual extensions within the SEQUENCE is
// -- significant, the specification of those individual extensions shall include the
// -- rules for the significance of the order therein

type Extensions = Extension[];
export default Extensions;
