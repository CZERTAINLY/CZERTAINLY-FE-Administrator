import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

//   ReasonFlags ::= BIT STRING {
//     unused(0), keyCompromise(1), cACompromise(2), affiliationChanged(3),
//     superseded(4), cessationOfOperation(5), certificateHold(6),
//     privilegeWithdrawn(7), aACompromise(8), weakAlgorithmOrKey(9)}(SIZE (0..9,...,10))

export default
class ReasonFlags {
    // eslint-disable-next-line max-params
    constructor (
        readonly unused: boolean = false,
        readonly keyCompromise: boolean = false,
        readonly cACompromise: boolean = false,
        readonly affiliationChanged: boolean = false,
        readonly superseded: boolean = false,
        readonly cessationOfOperation: boolean = false,
        readonly certificateHold: boolean = false,
        readonly privilegeWithdrawn: boolean = false,
        readonly aACompromise: boolean = false,
        readonly weakAlgorithmOrKeySize: boolean = false
    ) {}

    public static fromElement (value: DERElement): ReasonFlags {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.bitString ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on ReasonFlags");
        case -2: throw new errors.X509Error("Invalid construction on ReasonFlags");
        case -3: throw new errors.X509Error("Invalid tag number on ReasonFlags");
        default: throw new errors.X509Error("Undefined error when validating ReasonFlags tag");
        }

        const bits: boolean[] = value.bitString;
        return new ReasonFlags(
            ((bits.length >=  1) ? bits[0] : false),
            ((bits.length >=  2) ? bits[1] : false),
            ((bits.length >=  3) ? bits[2] : false),
            ((bits.length >=  4) ? bits[3] : false),
            ((bits.length >=  5) ? bits[4] : false),
            ((bits.length >=  6) ? bits[5] : false),
            ((bits.length >=  7) ? bits[6] : false),
            ((bits.length >=  8) ? bits[7] : false),
            ((bits.length >=  9) ? bits[8] : false),
            ((bits.length >= 10) ? bits[9] : false)
        );
    }

    public toElement (): DERElement {
        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.bitString
        );
        ret.bitString = [
            this.unused,
            this.keyCompromise,
            this.cACompromise,
            this.affiliationChanged,
            this.superseded,
            this.cessationOfOperation,
            this.certificateHold,
            this.privilegeWithdrawn,
            this.aACompromise,
            this.weakAlgorithmOrKeySize,
        ];
        return ret;
    }

    public static fromBytes (value: Uint8Array): ReasonFlags {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return ReasonFlags.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
