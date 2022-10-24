import { ObjectIdentifier, DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// PolicyQualifierInfo ::= SEQUENCE {
//     policyQualifierId  CERT-POLICY-QUALIFIER.&id({SupportedPolicyQualifiers}),
//     qualifier
//       CERT-POLICY-QUALIFIER.&Qualifier
//         ({SupportedPolicyQualifiers}{@policyQualifierId}) OPTIONAL,
//     ...
//   }

export default
class PolicyQualifierInfo {
    constructor (
        readonly policyQualifierId: ObjectIdentifier,
        readonly qualifier? : DERElement
    ) {}

    public static fromElement (value: DERElement): PolicyQualifierInfo {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on PolicyQualifierInfo");
        case -2: throw new errors.X509Error("Invalid construction on PolicyQualifierInfo");
        case -3: throw new errors.X509Error("Invalid tag number on PolicyQualifierInfo");
        default: throw new errors.X509Error("Undefined error when validating PolicyQualifierInfo tag");
        }

        const policyQualifierInfoElements: DERElement[] = value.sequence;
        let qualifier: DERElement | undefined;

        if (policyQualifierInfoElements.length === 0) {
            throw new errors.X509Error("PolicyQualifierInfo contained zero elements");
        }

        switch (policyQualifierInfoElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on PolicyQualifierInfo.policyQualifierId");
        case -2: throw new errors.X509Error("Invalid construction on PolicyQualifierInfo.policyQualifierId");
        case -3: throw new errors.X509Error("Invalid tag number on PolicyQualifierInfo.policyQualifierId");
        default: {
            throw new errors.X509Error("Undefined error when validating PolicyQualifierInfo.policyQualifierId tag");
        }
        }

        const policyQualifierId: ObjectIdentifier = policyQualifierInfoElements[0].objectIdentifier;
        let fixedPositionElementsEncountered: number = 1;
        if (policyQualifierInfoElements.length > 1) {
            qualifier = policyQualifierInfoElements[1];
            fixedPositionElementsEncountered++;
        }

        /*
            Then, the remaining elements should be confirmed to be in canonical
            order. The start of the remaining elements is indicated by
            fixedPositionElementsEncountered.
        */
        if (!DERElement.isInCanonicalOrder(policyQualifierInfoElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of PolicyQualifierInfo were not in canonical order");
        }

        return new PolicyQualifierInfo(policyQualifierId, qualifier);
    }

    public toElement (): DERElement {
        const policyQualifierInfoElements: DERElement[] = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.objectIdentifier
            ),
        ];
        if (this.qualifier) policyQualifierInfoElements.push(this.qualifier);
        const policyQualifierInfoElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        policyQualifierInfoElement.sequence = policyQualifierInfoElements;
        return policyQualifierInfoElement;
    }

    public static fromBytes (value: Uint8Array): PolicyQualifierInfo {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return PolicyQualifierInfo.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
