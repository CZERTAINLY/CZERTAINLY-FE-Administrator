import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// PrivateKeyUsagePeriod ::= SEQUENCE {
//     notBefore  [0]  GeneralizedTime OPTIONAL,
//     notAfter   [1]  GeneralizedTime OPTIONAL,
//     ...
//   }
//   (WITH COMPONENTS {
//      ...,
//      notBefore  PRESENT
//    } | WITH COMPONENTS {
//          ...,
//          notAfter  PRESENT
//        })

export default
class PrivateKeyUsagePeriod {
    constructor (
        readonly notBefore? : Date,
        readonly notAfter? : Date
    ) {
        if (!notBefore && !notAfter) {
            throw new errors.X509Error("Either notBefore or notAfter must be set in PrivateKeyUsagePeriod");
        }
    }

    public static fromElement (value: DERElement): PrivateKeyUsagePeriod {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on inner sequence of PrivateKeyUsagePeriod");
        case -2: throw new errors.X509Error("Invalid construction on inner sequence of PrivateKeyUsagePeriod");
        case -3: throw new errors.X509Error("Invalid tag number on inner sequence of PrivateKeyUsagePeriod");
        default: {
            throw new errors.X509Error("Undefined error when validating inner sequence of PrivateKeyUsagePeriod tag");
        }
        }

        const privateKeyUsagePeriodElements: DERElement[] = value.sequence;
        if (privateKeyUsagePeriodElements.length === 0) {
            throw new errors.X509Error("PrivateKeyUsagePeriod must have at least one element in SEQUENCE");
        }

        let notBefore: Date | undefined;
        let notAfter: Date | undefined;
        let fixedPositionElementsEncountered: number = 0;

        privateKeyUsagePeriodElements.forEach((element: DERElement) => {
            if (element.tagClass === ASN1TagClass.context) {
                if (element.tagNumber === 0) {
                    if (notBefore) throw new errors.X509Error("PrivateKeyUsagePeriod.notBefore already defined");
                    notBefore = element.generalizedTime;
                    fixedPositionElementsEncountered++;
                } else if (element.tagNumber === 1) {
                    if (notAfter) throw new errors.X509Error("PrivateKeyUsagePeriod.notAfter already defined");
                    notAfter = element.generalizedTime;
                    fixedPositionElementsEncountered++;
                }
            }
        });

        /*
            Then, the remaining elements should be confirmed to be in canonical
            order. The start of the remaining elements is indicated by
            fixedPositionElementsEncountered.
        */
        if (!DERElement.isInCanonicalOrder(privateKeyUsagePeriodElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of PrivateKeyUsagePeriod were not in canonical order");
        }

        return new PrivateKeyUsagePeriod(notBefore, notAfter);
    }

    public toElement (): DERElement {
        const privateKeyUsagePeriodElements: DERElement[] = [];
        if (this.notBefore) {
            const notBeforeElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.generalizedTime
            );
            notBeforeElement.generalizedTime = this.notBefore;
            privateKeyUsagePeriodElements.push(notBeforeElement);
        }
        if (this.notAfter) {
            const notAfterElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.generalizedTime
            );
            notAfterElement.generalizedTime = this.notAfter;
            privateKeyUsagePeriodElements.push(notAfterElement);
        }
        const privateKeyUsagePeriodElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        privateKeyUsagePeriodElement.sequence = privateKeyUsagePeriodElements;
        return privateKeyUsagePeriodElement;
    }

    public static fromBytes (value: Uint8Array): PrivateKeyUsagePeriod {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return PrivateKeyUsagePeriod.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
