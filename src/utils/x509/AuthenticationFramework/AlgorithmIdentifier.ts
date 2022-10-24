import { DERElement, ObjectIdentifier, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// ALGORITHM ::= CLASS {
//     &Type          OPTIONAL,
//     &id            OBJECT IDENTIFIER UNIQUE }
//   WITH SYNTAX {
//     [PARMS        &Type]
//     IDENTIFIED BY &id }

//   AlgorithmIdentifier{ALGORITHM:SupportedAlgorithms} ::= SEQUENCE {
//     algorithm   ALGORITHM.&id({SupportedAlgorithms}),
//     parameters  ALGORITHM.&Type({SupportedAlgorithms}{@algorithm}) OPTIONAL,
//     ... }

// SupportedAlgorithms ALGORITHM ::= {...}

// SupportedAlgorithm ::= SEQUENCE {
//     algorithmIdentifier              AlgorithmIdentifier{{SupportedAlgorithms}},
//     intendedUsage               [0]  KeyUsage OPTIONAL,
//     intendedCertificatePolicies [1]  CertificatePoliciesSyntax OPTIONAL,
//     ... }

// supportedAlgorithms ATTRIBUTE ::= {
//     WITH SYNTAX              SupportedAlgorithm
//     EQUALITY MATCHING RULE   algorithmIdentifierMatch
//     LDAP-SYNTAX              x509SupportedAlgorithm.&id
//     LDAP-NAME                {"supportedAlgorithms"}
//     LDAP-DESC                "X.509 support algorithms"
//     ID                       id-at-supportedAlgorithms }

// AlgorithmIdentifier  ::=  SEQUENCE  {
//     algorithm               OBJECT IDENTIFIER,
//     parameters              ANY DEFINED BY algorithm OPTIONAL  }

export default
class AlgorithmIdentifier {
    constructor (
        readonly algorithm: ObjectIdentifier,
        readonly parameters?: DERElement,
    ) {}

    public static fromElement (value: DERElement): AlgorithmIdentifier {
        const algorithmIdentifierElements: DERElement[] = value.sequence;
        if (algorithmIdentifierElements.length === 0) {
            throw new errors.X509Error("AlgorithmIdentifier may not contain zero elements.");
        }
        if (algorithmIdentifierElements.length > 2) {
            throw new errors.X509Error("Too many elements in AlgorithmIdentifier.");
        }
        switch (algorithmIdentifierElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ])
        ) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on AlgorithmIdentifier.algorithm");
        case -2: throw new errors.X509Error("Invalid construction on AlgorithmIdentifier.algorithm");
        case -3: throw new errors.X509Error("Invalid tag number on AlgorithmIdentifier.algorithm");
        default: throw new errors.X509Error("Undefined error when validating AlgorithmIdentifier.algorithm tag");
        }
        return new AlgorithmIdentifier(
            algorithmIdentifierElements[0].objectIdentifier,
            algorithmIdentifierElements.length === 2 ? algorithmIdentifierElements[1] : undefined,
        );
    }

    public toElement (): DERElement {
        if (this.algorithm === undefined) throw new errors.X509Error("Algorithm is undefined");
        const algorithmElement: DERElement = new DERElement();
        algorithmElement.tagNumber = ASN1UniversalType.objectIdentifier;
        algorithmElement.objectIdentifier = this.algorithm;
        const algorithmIdentifierElement: DERElement = new DERElement();
        algorithmIdentifierElement.tagClass = ASN1TagClass.universal;
        algorithmIdentifierElement.construction = ASN1Construction.constructed;
        algorithmIdentifierElement.tagNumber = ASN1UniversalType.sequence;
        if (this.parameters === undefined) {
            algorithmIdentifierElement.sequence = [ algorithmElement ];
        } else {
            algorithmIdentifierElement.sequence = [ algorithmElement, this.parameters ];
        }
        return algorithmIdentifierElement;
    }

    public static fromBytes (value: Uint8Array): AlgorithmIdentifier {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return AlgorithmIdentifier.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
