import PolicyQualifierInfo from "./PolicyQualifierInfo";
import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";

// PolicyInformation ::= SEQUENCE {
//     policyIdentifier  CertPolicyId,
//     policyQualifiers  SEQUENCE SIZE (1..MAX) OF PolicyQualifierInfo OPTIONAL,
//     ...
//   }

// Example dump:
// 30 18
//    30 0C
//       06 0A
//          2B 06 01 04 01 D6 79 02 05 03 (1.3.6.1.4.1.11129.2.5.3)
//    30 08
//       06 06
//          67 81 0C 01 02 02 (2.23.140.1.2.2)

export default
class PolicyInformation {
    constructor (
        readonly policyIdentifier: ObjectIdentifier,
        readonly policyQualifiers? : PolicyQualifierInfo[]
    ) {}

    public static fromElement (value: DERElement): PolicyInformation {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on PolicyInformation");
        case -2: throw new errors.X509Error("Invalid construction on PolicyInformation");
        case -3: throw new errors.X509Error("Invalid tag number on PolicyInformation");
        default: throw new errors.X509Error("Undefined error when validating PolicyInformation tag");
        }

        const policyInformationElements: DERElement[] = value.sequence;
        let policyQualifiers: PolicyQualifierInfo[] | undefined;

        switch (policyInformationElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on PolicyInformation.policyIdentifier");
        case -2: throw new errors.X509Error("Invalid construction on PolicyInformation.policyIdentifier");
        case -3: throw new errors.X509Error("Invalid tag number on PolicyInformation.policyIdentifier");
        default: throw new errors.X509Error("Undefined error when validating PolicyInformation.policyIdentifier tag");
        }

        const policyIdentifier: ObjectIdentifier = policyInformationElements[0].objectIdentifier;
        let fixedPositionElementsEncountered: number = 1;
        if (policyInformationElements.length > 1) {
            policyQualifiers = policyInformationElements[1].sequence.map(
                (element: DERElement) => PolicyQualifierInfo.fromElement(element)
            );
            fixedPositionElementsEncountered++;
        }

        /*
            Then, the remaining elements should be confirmed to be in canonical
            order. The start of the remaining elements is indicated by
            fixedPositionElementsEncountered.
        */
        if (!DERElement.isInCanonicalOrder(policyInformationElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of PolicyInformation were not in canonical order");
        }

        return new PolicyInformation(policyIdentifier, policyQualifiers);
    }

    public toElement (): DERElement {
        const policyInformationElements: DERElement[] = [
            new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.objectIdentifier
            ),
        ];
        if (this.policyQualifiers) {
            const policyQualifiersElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.constructed,
                ASN1UniversalType.sequence
            );
            policyQualifiersElement.sequence = this.policyQualifiers.map((pqi: PolicyQualifierInfo) => pqi.toElement());
            policyInformationElements.push(policyQualifiersElement);
        }
        const policyInformationElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        policyInformationElement.sequence = policyInformationElements;
        return policyInformationElement;
    }

    public static fromBytes (value: Uint8Array): PolicyInformation {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return PolicyInformation.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
