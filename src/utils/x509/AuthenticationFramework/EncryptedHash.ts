// ENCRYPTED-HASH{ToBeSigned} ::= BIT STRING (CONSTRAINED BY {
//     --shall be the result of applying a hashing procedure to the DER-encoded (see 6.2)
//     --octets of a value of -- ToBeSigned -- and then applying an encipherment procedure
//     --to those octets -- } )

// FINGERPRINT {ToBeFingerprinted} ::= SEQUENCE {
//     algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//     fingerprint          BIT STRING,
//     ... }

// ALGORITHM ::= CLASS {
//     &Type          OPTIONAL,
//     &id            OBJECT IDENTIFIER UNIQUE }
// WITH SYNTAX {
//     [PARMS        &Type]
//     IDENTIFIED BY &id
// }

// AlgorithmIdentifier{ALGORITHM:SupportedAlgorithms} ::= SEQUENCE {
//     algorithm   ALGORITHM.&id({SupportedAlgorithms}),
//     parameters  ALGORITHM.&Type({SupportedAlgorithms}{@algorithm}) OPTIONAL,
//     ... }

/* The definitions of the following information object set is deferred to
referencing specifications having a requirement for specific information
object sets.*/

// SupportedAlgorithms ALGORITHM ::= {...}

/* The definitions of the following information value set is deferred to
referencingspecifications having a requirement for specific value sets.*/

// SupportedCurves OBJECT IDENTIFIER ::= {dummyCurv, ...}

// dummyCurv OBJECT IDENTIFIER ::= {2 5 5}
