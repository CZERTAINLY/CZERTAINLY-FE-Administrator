import AccessDescription from "./AccessDescription";

// AuthorityInfoAccessSyntax ::= SEQUENCE SIZE (1..MAX) OF AccessDescription

type AuthorityInfoAccessSyntax = AccessDescription[];
export default AuthorityInfoAccessSyntax;
