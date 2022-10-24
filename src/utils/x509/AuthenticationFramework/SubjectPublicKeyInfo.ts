import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import AlgorithmIdentifier from "./AlgorithmIdentifier";
import PublicKey from "./PublicKey";

// SubjectPublicKeyInfo ::= SEQUENCE {
//     algorithm         AlgorithmIdentifier{{SupportedAlgorithms}},
//     subjectPublicKey  PublicKey,
//     ... }

// SubjectPublicKeyInfo  ::=  SEQUENCE  {
//     algorithm            AlgorithmIdentifier,
//     subjectPublicKey     BIT STRING  }

export default
class SubjectPublicKeyInfo {
    constructor (
        readonly algorithm: AlgorithmIdentifier,
        readonly subjectPublicKey: PublicKey
    ) {}

    public static fromElement (value: DERElement): SubjectPublicKeyInfo {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on SubjectPublicKeyInfo");
        case -2: throw new errors.X509Error("Invalid construction on SubjectPublicKeyInfo");
        case -3: throw new errors.X509Error("Invalid tag number on SubjectPublicKeyInfo");
        default: throw new errors.X509Error("Undefined error when validating SubjectPublicKeyInfo tag");
        }

        const subjectPublicKeyElements: DERElement[] = value.sequence;
        switch (subjectPublicKeyElements[1].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.bitString ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on SubjectPublicKeyInfo.subjectPublicKey");
        case -2: throw new errors.X509Error("Invalid construction on SubjectPublicKeyInfo.subjectPublicKey");
        case -3: throw new errors.X509Error("Invalid tag number on SubjectPublicKeyInfo.subjectPublicKey");
        default: {
            throw new errors.X509Error("Undefined error when validating SubjectPublicKeyInfo.subjectPublicKey tag");
        }
        }

        return new SubjectPublicKeyInfo(
            AlgorithmIdentifier.fromElement(subjectPublicKeyElements[0]),
            subjectPublicKeyElements[1].bitString
        );
    }

    public toElement (): DERElement {
        if (this.algorithm === undefined) throw new errors.X509Error("Algorithm is undefined");
        const ret: DERElement = new DERElement();
        ret.tagClass = ASN1TagClass.universal;
        ret.construction = ASN1Construction.constructed;
        ret.tagNumber = ASN1UniversalType.sequence;

        const subjectPublicKeyElement: DERElement = new DERElement();
        subjectPublicKeyElement.tagClass = ASN1TagClass.universal;
        subjectPublicKeyElement.construction = ASN1Construction.primitive;
        subjectPublicKeyElement.tagNumber = ASN1UniversalType.bitString;
        subjectPublicKeyElement.bitString = this.subjectPublicKey;

        ret.sequence = [ this.algorithm.toElement(), subjectPublicKeyElement ];
        return ret;
    }

    public static fromBytes (value: Uint8Array): SubjectPublicKeyInfo {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return SubjectPublicKeyInfo.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
