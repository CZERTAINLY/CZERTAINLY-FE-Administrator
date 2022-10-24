// HASH{ToBeHashed} ::= SEQUENCE {
//     algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
//     hashValue            BIT STRING (CONSTRAINED BY {
//         --shall be the result of applying a hashing procedure to the DER-encoded
//         --octets of a value of
//         --ToBeHashed } ),
//     ... }
