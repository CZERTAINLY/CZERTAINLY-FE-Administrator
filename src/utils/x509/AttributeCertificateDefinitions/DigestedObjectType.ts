// ObjectDigestInfo ::= SEQUENCE {
//     digestedObjectType   ENUMERATED {
//       publicKey        (0),
//       publicKeyCert    (1),
//       otherObjectTypes (2)},
//     otherObjectTypeID   OBJECT IDENTIFIER OPTIONAL,
//     digestAlgorithm     AlgorithmIdentifier{{SupportedAlgorithms}},
//     objectDigest        BIT STRING,
//     ... }
const enum DigestedObjectType {
    publicKey = 0,
    publicKeyCert = 1,
    otherObjectTypes = 2,
}

export default DigestedObjectType;
