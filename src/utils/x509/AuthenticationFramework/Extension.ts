import { DERElement,ObjectIdentifier, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
// import { Byteable,Elementable } from "../interfaces";
import * as errors from "../errors";

// Extension ::= SEQUENCE {
//   extnId     EXTENSION.&id({ExtensionSet}),
//   critical   BOOLEAN DEFAULT FALSE,
//   extnValue  OCTET STRING
//     (CONTAINING EXTENSION.&ExtnType({ExtensionSet}{@extnId})
//        ENCODED BY der),
//   ... }

/**
    Extension  ::=  SEQUENCE  {
        extnID      OBJECT IDENTIFIER,
        critical    BOOLEAN DEFAULT FALSE,
        extnValue   OCTET STRING }
*/
export default
class Extension { // implements Byteable,Elementable {
    constructor (
        readonly extnID: ObjectIdentifier,
        readonly critical: boolean,
        readonly extnValue: Uint8Array
    ) {}

    public static fromElement (value: DERElement): Extension {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on Extension");
        case -2: throw new errors.X509Error("Invalid construction on Extension");
        case -3: throw new errors.X509Error("Invalid tag number on Extension");
        default: throw new errors.X509Error("Undefined error when validating Extension tag");
        }

        const extensionElements: DERElement[] = value.sequence;
        if (extensionElements.length > 3) {
            throw new errors.X509Error("An Extension encoded more than three elements");
        } else if (extensionElements.length < 2) {
            throw new errors.X509Error("An Extension encoded fewer than two elements");
        }

        switch (extensionElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on Extension.identifier");
        case -2: throw new errors.X509Error("Invalid construction on Extension.identifier");
        case -3: throw new errors.X509Error("Invalid tag number on Extension.identifier");
        default: throw new errors.X509Error("Undefined error when validating Extension.identifier tag");
        }

        let critical: boolean = false;
        if (extensionElements.length === 3) {
            switch (extensionElements[1].validateTag(
                [ ASN1TagClass.universal ],
                [ ASN1Construction.primitive ],
                [ ASN1UniversalType.boolean ]
            )) {
            case 0: break;
            case -1: throw new errors.X509Error("Invalid tag class on Extension.critical");
            case -2: throw new errors.X509Error("Invalid construction on Extension.critical");
            case -3: throw new errors.X509Error("Invalid tag number on Extension.critical");
            default: throw new errors.X509Error("Undefined error when validating Extension.critical tag");
            }
            critical = extensionElements[1].boolean;
        }

        switch (extensionElements[extensionElements.length - 1].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive, ASN1Construction.constructed ],
            [ ASN1UniversalType.octetString ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on Extension.extnValue");
        case -2: throw new errors.X509Error("Invalid construction on Extension.extnValue");
        case -3: throw new errors.X509Error("Invalid tag number on Extension.extnValue");
        default: throw new errors.X509Error("Undefined error when validating Extension.extnValue tag");
        }

        const extnID: ObjectIdentifier= extensionElements[0].objectIdentifier;
        const extnValue: Uint8Array = extensionElements[extensionElements.length - 1].octetString;

        return new Extension(extnID, critical, extnValue);
    }

    public toElement (): DERElement {
        if (this.extnID === undefined) throw new errors.X509Error("extnID is undefined");
        const extnIDElement: DERElement = new DERElement();
        extnIDElement.tagClass = ASN1TagClass.universal;
        extnIDElement.construction = ASN1Construction.primitive;
        extnIDElement.tagNumber = ASN1UniversalType.objectIdentifier;
        extnIDElement.objectIdentifier = this.extnID;

        const extnValueElement: DERElement = new DERElement();
        extnValueElement.tagClass = ASN1TagClass.universal;
        extnValueElement.construction = ASN1Construction.primitive;
        extnValueElement.tagNumber = ASN1UniversalType.octetString;
        extnValueElement.octetString = this.extnValue;

        const ret: DERElement = new DERElement();
        ret.tagClass = ASN1TagClass.universal;
        ret.construction = ASN1Construction.constructed;
        ret.tagNumber = ASN1UniversalType.sequence;

        if (this.critical) {
            const criticalElement: DERElement = new DERElement();
            criticalElement.tagClass = ASN1TagClass.universal;
            criticalElement.construction = ASN1Construction.primitive;
            criticalElement.tagNumber = ASN1UniversalType.boolean;
            criticalElement.boolean = this.critical;
            ret.sequence = [ extnIDElement, criticalElement, extnValueElement ];
        } else {
            ret.sequence = [ extnIDElement, extnValueElement ];
        }
        return ret;
    }

    public fromBytes (value: Uint8Array): void {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        Extension.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
