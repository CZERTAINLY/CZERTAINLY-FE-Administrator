import AccessDescription from "./AccessDescription";

// SubjectInfoAccessSyntax ::= SEQUENCE SIZE (1..MAX) OF AccessDescription

type SubjectInfoAccessSyntax = AccessDescription[];
export default SubjectInfoAccessSyntax;
