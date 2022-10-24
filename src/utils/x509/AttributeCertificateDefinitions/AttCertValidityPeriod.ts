import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import validateTag from "../validateTag";

// AttCertValidityPeriod ::= SEQUENCE {
//     notBeforeTime  GeneralizedTime,
//     notAfterTime   GeneralizedTime,
//     ... }

export default
class AttCertValidityPeriod {
    constructor (
        readonly notBefore: Date,
        readonly notAfter: Date
    ) {}

    public static fromElement (value: DERElement): AttCertValidityPeriod {
        validateTag(value, "AttCertValidityPeriod",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );

        const validityElements: DERElement[] = value.sequence;
        if (validityElements.length < 2) {
            throw new errors.X509Error("AttCertValidityPeriod contained fewer than two ASN.1 elements.");
        }

        validateTag(validityElements[0], "AttCertValidityPeriod.notBefore",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.generalizedTime ],
        );

        validateTag(validityElements[1], "AttCertValidityPeriod.notAfter",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.generalizedTime ],
        );

        return new AttCertValidityPeriod(
            validityElements[0].generalizedTime,
            validityElements[1].generalizedTime,
        );
    }

    public toElement (): DERElement {
        const notBeforeElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.generalizedTime,
        );
        notBeforeElement.generalizedTime = this.notBefore;
        const notAfterElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.generalizedTime,
        );
        notAfterElement.generalizedTime = this.notAfter;
        const validityElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        validityElement.sequence = [ notBeforeElement, notAfterElement ];
        return validityElement;
    }

    public static fromBytes (value: Uint8Array): AttCertValidityPeriod {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return AttCertValidityPeriod.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
