import RelativeDistinguishedName from "./RelativeDistinguishedName";
import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// RDNSequence ::= SEQUENCE OF RelativeDistinguishedName

export default
class RDNSequence {
    constructor (
        readonly value: RelativeDistinguishedName[]
    ) {}

    public toString (): string {
        return this.value.map((rdn: RelativeDistinguishedName): string => rdn.toString()).join(",");
    }

    public static fromElement (value: DERElement): RDNSequence {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ])
        ) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on RDNSequence");
        case -2: throw new errors.X509Error("Invalid construction on RDNSequence");
        case -3: throw new errors.X509Error("Invalid tag number on RDNSequence");
        default: throw new errors.X509Error("Undefined error when validating RDNSequence tag");
        }

        const rdnSequenceElements: DERElement[] = value.set;
        return new RDNSequence(rdnSequenceElements.map(RelativeDistinguishedName.fromElement));
    }

    public toElement (): DERElement {
        const rdnSequenceElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        rdnSequenceElement.set = this.value.map((rdn: RelativeDistinguishedName): DERElement => rdn.toElement());
        return rdnSequenceElement;
    }

    public static fromBytes (value: Uint8Array): RDNSequence {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return this.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
