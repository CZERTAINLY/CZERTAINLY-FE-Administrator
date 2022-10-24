import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";

// PolicyMappingsSyntax ::=
//   SEQUENCE SIZE (1..MAX) OF
//     SEQUENCE {issuerDomainPolicy   CertPolicyId,
//               subjectDomainPolicy  CertPolicyId,
//               ...}

export default
class PolicyMapping {
    constructor (
        readonly issuerDomainPolicy: ObjectIdentifier,
        readonly subjectDomainPolicy: ObjectIdentifier
    ) {}

    public static fromElement (value: DERElement): PolicyMapping {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on inner sequence of PolicyMappingsSyntax");
        case -2: throw new errors.X509Error("Invalid construction on inner sequence of PolicyMappingsSyntax");
        case -3: throw new errors.X509Error("Invalid tag number on inner sequence of PolicyMappingsSyntax");
        default: {
            throw new errors.X509Error("Undefined error when validating inner sequence of PolicyMappingsSyntax tag");
        }
        }

        const policyMappingElements: DERElement[] = value.sequence;
        if (policyMappingElements.length < 2) {
            throw new errors.X509Error("Too few elements in inner sequence of PolicyMappingsSyntax");
        }

        switch (policyMappingElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ]
        )) {
        case 0: break;
        case -1: {
            throw new errors.X509Error(
                "Invalid tag class on inner sequence of PolicyMappingsSyntax."
                + "SEQUENCE.SEQUENCE.subjectDomainPolicy.",
            );
        }
        case -2: {
            throw new errors.X509Error(
                "Invalid construction on inner sequence of "
                + "PolicyMappingsSyntax.SEQUENCE.SEQUENCE.subjectDomainPolicy.",
            );
        }
        case -3: {
            throw new errors.X509Error(
                "Invalid tag number on inner sequence of PolicyMappingsSyntax"
                + ".SEQUENCE.SEQUENCE.subjectDomainPolicy.",
            );
        }
        default: {
            throw new errors.X509Error(
                "Undefined error when validating inner sequence of "
                + "PolicyMappingsSyntax.SEQUENCE.SEQUENCE.subjectDomainPolicy "
                + "tag.",
            );
        }
        }

        switch (policyMappingElements[1].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ]
        )) {
        case 0: break;
        case -1: {
            throw new errors.X509Error(
                "Invalid tag class on inner sequence of PolicyMappingsSyntax"
                + ".SEQUENCE.SEQUENCE.issuerDomainPolicy.",
            );
        }
        case -2: {
            throw new errors.X509Error(
                "Invalid construction on inner sequence of "
                + "PolicyMappingsSyntax.SEQUENCE.SEQUENCE.issuerDomainPolicy.",
            );
        }
        case -3: {
            throw new errors.X509Error(
                "Invalid tag number on inner sequence of "
                + "PolicyMappingsSyntax.SEQUENCE.SEQUENCE.issuerDomainPolicy.",
            );
        }
        default: {
            throw new errors.X509Error(
                "Undefined error when validating inner sequence of "
                + "PolicyMappingsSyntax.SEQUENCE.SEQUENCE.issuerDomainPolicy "
                + "tag.",
            );
        }
        }

        return new PolicyMapping(
            policyMappingElements[0].objectIdentifier,
            policyMappingElements[1].objectIdentifier
        );
    }

    public toElement (): DERElement {
        const issuerDomainPolicyElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier
        );
        issuerDomainPolicyElement.objectIdentifier = this.issuerDomainPolicy;
        const subjectDomainPolicyElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier
        );
        subjectDomainPolicyElement.objectIdentifier = this.subjectDomainPolicy;
        const policyMappingElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        policyMappingElement.sequence = [
            issuerDomainPolicyElement,
            subjectDomainPolicyElement,
        ];
        return policyMappingElement;
    }

    public static fromBytes (value: Uint8Array): PolicyMapping {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return PolicyMapping.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
