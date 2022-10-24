import TBSAttributeCertificate from "./TBSAttributeCertificate";
import AlgorithmIdentifier from "../AuthenticationFramework/AlgorithmIdentifier";
import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import validateTag from "../validateTag";

// AttributeCertificate ::= SIGNED{TBSAttributeCertificate}
//
// SIGNED{ToBeSigned} ::= SEQUENCE {
//     toBeSigned ToBeSigned,
//     COMPONENTS OF SIGNATURE,
//     ... }
//
// SIGNATURE ::= SEQUENCE {
//     algorithmIdentifier AlgorithmIdentifier{{SupportedAlgorithms}},
//     signature           BIT STRING,
//     ... }

export default
class AttributeCertificate {
    public static maximumX509AttributeCertificateSizeInBytes: number = 100000;

    constructor (
        readonly tbsAttributeCertificate: TBSAttributeCertificate,
        readonly signatureAlgorithm: AlgorithmIdentifier,
        readonly signatureValue: boolean[],
    ) {}

    public static fromElement (value: DERElement): AttributeCertificate {
        validateTag(value, "AttributeCertificate",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );

        const attributeCertificateElements: DERElement[] = value.sequence;
        if (attributeCertificateElements.length !== 3) {
            throw new errors.X509Error("Invalid number of elements in AttributeCertificate");
        }

        validateTag(attributeCertificateElements[2], "AttributeCertificate.signatureValue",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.bitString ],
        );

        return new AttributeCertificate(
            TBSAttributeCertificate.fromElement(attributeCertificateElements[0]),
            AlgorithmIdentifier.fromElement(attributeCertificateElements[1]),
            attributeCertificateElements[2].bitString,
        );
    }

    public toElement (): DERElement {
        const signatureValueElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.bitString,
        );
        signatureValueElement.bitString = this.signatureValue;

        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        ret.sequence = [
            this.tbsAttributeCertificate.toElement(),
            this.signatureAlgorithm.toElement(),
            signatureValueElement,
        ];
        return ret;
    }

    public static fromBytes (value: Uint8Array): AttributeCertificate {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return AttributeCertificate.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
