import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// KeyUsage ::= BIT STRING {
//     digitalSignature(0), contentCommitment(1), keyEncipherment(2),
//     dataEncipherment(3), keyAgreement(4), keyCertSign(5), cRLSign(6),
//     encipherOnly(7), decipherOnly(8)}

export default
class KeyUsage {
    // eslint-disable-next-line max-params
    constructor (
        readonly digitalSignature: boolean,
        readonly contentCommitment: boolean,
        readonly keyEncipherment: boolean,
        readonly dataEncipherment: boolean,
        readonly keyAgreement: boolean,
        readonly keyCertSign: boolean,
        readonly cRLSign: boolean,
        readonly encipherOnly: boolean,
        readonly decipherOnly: boolean
    ) {}

    public static fromElement (value: DERElement): KeyUsage {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.bitString ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on KeyUsage");
        case -2: throw new errors.X509Error("Invalid construction on KeyUsage");
        case -3: throw new errors.X509Error("Invalid tag number on KeyUsage");
        default: throw new errors.X509Error("Undefined error when validating KeyUsage tag");
        }

        const bits: boolean[] = value.bitString;
        return new KeyUsage(
            ((bits.length > 0) ? bits[0] : false),
            ((bits.length > 1) ? bits[1] : false),
            ((bits.length > 2) ? bits[2] : false),
            ((bits.length > 3) ? bits[3] : false),
            ((bits.length > 4) ? bits[4] : false),
            ((bits.length > 5) ? bits[5] : false),
            ((bits.length > 6) ? bits[6] : false),
            ((bits.length > 7) ? bits[7] : false),
            ((bits.length > 8) ? bits[8] : false)
        );
    }

    public toElement (): DERElement {
        const keyUsageElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.bitString
        );
        keyUsageElement.bitString = [
            this.digitalSignature,
            this.contentCommitment,
            this.keyEncipherment,
            this.dataEncipherment,
            this.keyAgreement,
            this.keyCertSign,
            this.cRLSign,
            this.encipherOnly,
            this.decipherOnly,
        ];
        return keyUsageElement;
    }

    public static fromBytes (value: Uint8Array): KeyUsage {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return KeyUsage.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
