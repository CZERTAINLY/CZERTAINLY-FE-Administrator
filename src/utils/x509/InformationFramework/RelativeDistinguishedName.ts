import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import AttributeTypeAndValue from "./AttributeTypeAndValue";
import * as errors from "../errors";

// RelativeDistinguishedName is a SET so you can have multi-valued RDNs
// So, for instance, if your DN was gn=Jonathan+sn=Wilbur,dc=example,dc=com,
// The RelativeDistinguishedName would contain an AttributeTypeAndValue
// for "Jonathan" and another for "Wilbur."

// RelativeDistinguishedName ::= SET SIZE (1..MAX) OF AttributeTypeAndValue

export default
class RelativeDistinguishedName {
    constructor (
        readonly value: AttributeTypeAndValue[]
    ) {
        if (value.length < 1) {
            throw new errors.X509Error("RelativeDistinguishedName must contain at least one AttributeTypeAndValue.");
        }
    }

    public toString (): string {
        return this.value.map((atav: AttributeTypeAndValue): string => atav.toString()).join("+");
    }

    public static fromElement (value: DERElement): RelativeDistinguishedName {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.set ])
        ) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on RelativeDistinguishedName");
        case -2: throw new errors.X509Error("Invalid construction on RelativeDistinguishedName");
        case -3: throw new errors.X509Error("Invalid tag number on RelativeDistinguishedName");
        default: throw new errors.X509Error("Undefined error when validating RelativeDistinguishedName tag");
        }

        const relativeDistinguishedNameElements: DERElement[] = value.set;
        return new RelativeDistinguishedName(relativeDistinguishedNameElements.map(AttributeTypeAndValue.fromElement));
    }

    public toElement (): DERElement {
        const relativeDistinguishedNameElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.set
        );
        relativeDistinguishedNameElement.set = this.value.map(
            (atav: AttributeTypeAndValue): DERElement => atav.toElement(),
        );
        return relativeDistinguishedNameElement;
    }

    public static fromBytes (value: Uint8Array): RelativeDistinguishedName {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return this.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
