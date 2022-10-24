import CertificateListContent from "./CertificateListContent";
import AlgorithmIdentifier from "./AlgorithmIdentifier";
import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import validateTag from "../validateTag";

// CertificateList ::= SIGNED{CertificateListContent}
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
class CertificateList {
    public static maximumX509CertificateSizeInBytes: number = 100000;

    constructor (
        readonly certificateListContent: CertificateListContent,
        readonly signatureAlgorithm: AlgorithmIdentifier,
        readonly signatureValue: boolean[],
    ) {}

    public static fromElement (value: DERElement): CertificateList {
        validateTag(value, "CertificateList",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );

        const certificateListElements: DERElement[] = value.sequence;
        if (certificateListElements.length !== 3) {
            throw new errors.X509Error("Invalid number of elements in CertificateList");
        }

        validateTag(certificateListElements[2], "CertificateList.signatureValue",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.bitString ],
        );

        return new CertificateList(
            CertificateListContent.fromElement(certificateListElements[0]),
            AlgorithmIdentifier.fromElement(certificateListElements[1]),
            certificateListElements[2].bitString,
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
            this.certificateListContent.toElement(),
            this.signatureAlgorithm.toElement(),
            signatureValueElement,
        ];
        return ret;
    }

    public static fromBytes (value: Uint8Array): CertificateList {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return CertificateList.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
