import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// Validity ::= SEQUENCE {
//     notBefore  Time,
//     notAfter   Time,
//     ... }

// Time ::= CHOICE {
//     utcTime          UTCTime,
//     generalizedTime  GeneralizedTime }

export default
class Validity {
    constructor (
        readonly notBefore: Date,
        readonly notAfter: Date
    ) {}

    public static fromElement (value: DERElement): Validity {
        switch(value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on validity");
        case -2: throw new errors.X509Error("Invalid construction on validity");
        case -3: throw new errors.X509Error("Invalid tag number on validity");
        default: throw new errors.X509Error("Undefined error when validating validity tag");
        }
        const validityElements: DERElement[] = value.sequence;
        if (validityElements.length !== 2) {
            throw new errors.X509Error("validity contained more than two ASN.1 elements");
        }

        // notBefore
        switch(validityElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.utcTime, ASN1UniversalType.generalizedTime ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on validity.notBefore");
        case -2: throw new errors.X509Error("Invalid construction on validity.notBefore");
        case -3: throw new errors.X509Error("Invalid tag number on validity.notBefore");
        default: throw new errors.X509Error("Undefined error when validating validity.notBefore tag");
        }

        // notAfter
        switch(validityElements[1].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.utcTime, ASN1UniversalType.generalizedTime ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on validity.notBefore");
        case -2: throw new errors.X509Error("Invalid construction on validity.notBefore");
        case -3: throw new errors.X509Error("Invalid tag number on validity.notBefore");
        default: throw new errors.X509Error("Undefined error when validating validity.notBefore tag");
        }

        return new Validity(
            (validityElements[0].tagNumber === ASN1UniversalType.generalizedTime)
                ? validityElements[0].generalizedTime : validityElements[0].utcTime,
            (validityElements[1].tagNumber === ASN1UniversalType.generalizedTime)
                ? validityElements[1].generalizedTime : validityElements[1].utcTime
        );
    }

    public toElement (): DERElement {
        /* From RFC 5280, Section 4.1.2.5:
            CAs conforming to this profile MUST always encode certificate
            validity dates through the year 2049 as UTCTime; certificate
            validity dates in 2050 or later MUST be encoded as
            GeneralizedTime. Conforming applications MUST be able to
            process validity dates that are encoded in either UTCTime or
            GeneralizedTime.
        */
        const notBeforeElement: DERElement = new DERElement();
        if (this.notBefore.getFullYear() >= 2050) {
            notBeforeElement.tagNumber = ASN1UniversalType.generalizedTime;
            notBeforeElement.generalizedTime = this.notBefore;
        } else {
            notBeforeElement.tagNumber = ASN1UniversalType.utcTime;
            notBeforeElement.utcTime = this.notBefore;
        }

        const notAfterElement: DERElement = new DERElement();
        if (this.notAfter.getFullYear() >= 2050) {
            notAfterElement.tagNumber = ASN1UniversalType.generalizedTime;
            notAfterElement.generalizedTime = this.notAfter;
        } else {
            notAfterElement.tagNumber = ASN1UniversalType.utcTime;
            notAfterElement.utcTime = this.notAfter;
        }

        const validityElement: DERElement = new DERElement();
        validityElement.tagClass = ASN1TagClass.universal;
        validityElement.construction = ASN1Construction.constructed;
        validityElement.tagNumber = ASN1UniversalType.sequence;
        validityElement.sequence = [ notBeforeElement, notAfterElement ];
        return validityElement;
    }

    public static fromBytes (value: Uint8Array): Validity {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return Validity.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
