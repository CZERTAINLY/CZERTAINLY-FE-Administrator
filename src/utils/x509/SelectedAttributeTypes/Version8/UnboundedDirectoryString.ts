import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../../errors";

// UnboundedDirectoryString ::= CHOICE {
//     teletexString    TeletexString(SIZE (1..MAX)),
//     printableString  PrintableString(SIZE (1..MAX)),
//     bmpString        BMPString(SIZE (1..MAX)),
//     universalString  UniversalString(SIZE (1..MAX)),
//     uTF8String       UTF8String(SIZE (1..MAX)) }

export default
class UnboundedDirectoryString {
    constructor (readonly value: string) {}

    public toString (): string {
        return this.value;
    }

    public static print (element: DERElement): string {
        const uds: UnboundedDirectoryString = UnboundedDirectoryString.fromElement(element);
        return uds.toString();
    }

    public static fromElement (value: DERElement): UnboundedDirectoryString {
        if (value.tagClass !== ASN1TagClass.universal) {
            throw new errors.X509Error("UnboundedDirectoryString must be of universal class");
        }

        if (value.construction !== ASN1Construction.primitive) {
            throw new errors.X509Error("UnboundedDirectoryString must be of primitive construction");
        }

        switch (value.tagNumber) {
        case (ASN1UniversalType.teletexString): {
            // REVIEW: Should this throw instead?
            return new UnboundedDirectoryString("");
        }
        case (ASN1UniversalType.printableString): {
            return new UnboundedDirectoryString(value.printableString);
        }
        case (ASN1UniversalType.bmpString): {
            return new UnboundedDirectoryString(value.bmpString);
        }
        case (ASN1UniversalType.universalString): {
            return new UnboundedDirectoryString(value.universalString);
        }
        case (ASN1UniversalType.utf8String): {
            return new UnboundedDirectoryString(value.utf8String);
        }
        default:
            throw new errors.X509Error("UnboundedDirectoryString was constituted of an invalid CHOICE");
        }
    }

    public toElement (): DERElement {
        const unboundedDirectoryStringElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.utf8String
        );
        unboundedDirectoryStringElement.utf8String = this.value;
        return unboundedDirectoryStringElement;
    }

    public static fromBytes (value: Uint8Array): UnboundedDirectoryString {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return this.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
