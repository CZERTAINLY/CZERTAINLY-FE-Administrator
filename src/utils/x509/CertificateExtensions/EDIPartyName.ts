import UnboundedDirectoryString from "../SelectedAttributeTypes/Version8/UnboundedDirectoryString";
import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// EDIPartyName ::= SEQUENCE {
//     nameAssigner  [0]  UnboundedDirectoryString OPTIONAL,
//     partyName     [1]  UnboundedDirectoryString,
//     ...
//   }

export default
class EDIPartyName {
    constructor (
        readonly nameAssigner: UnboundedDirectoryString | undefined,
        readonly partyName: UnboundedDirectoryString
    ) {}

    public toString (): string {
        return this.partyName.toString();
    }

    public static fromElement (value: DERElement): EDIPartyName {
        switch(value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on EDIPartyName");
        case -2: throw new errors.X509Error("Invalid construction on EDIPartyName");
        case -3: throw new errors.X509Error("Invalid tag number on EDIPartyName");
        default: throw new errors.X509Error("Undefined error when validating EDIPartyName tag");
        }

        const ediPartNameElements: DERElement[] = value.sequence;

        if (!DERElement.isUniquelyTagged(ediPartNameElements)) {
            throw new errors.X509Error("Elements of EDIPartyName were not uniquely tagged");
        }

        let nameAssigner: UnboundedDirectoryString | undefined;
        let partyName: UnboundedDirectoryString | undefined;
        let fixedPositionElementsEncountered: number = 0;

        ediPartNameElements.forEach((element: DERElement, index: number) => {
            if (element.tagClass === ASN1TagClass.context) {
                if (element.tagNumber === 0) { // nameAssigner
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error("EDIPartyName.nameAssigner was not primitively constructed");
                    }
                    if (index !== 0) throw new errors.X509Error("nameAssigner out of order in EDIPartyName");
                    nameAssigner = UnboundedDirectoryString.fromElement(element);
                    fixedPositionElementsEncountered++;
                } else if (element.tagNumber === 1) { // partyName
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error("EDIPartyName.partyName was not primitively constructed");
                    }
                    if (index > 1) {
                        throw new errors.X509Error("partyName out of order in EDIPartyName");
                    }

                    /*
                        If we have run into partyName, and its the
                        second element in the sequence, the first element
                        in the sequence MUST be nameAssigner, which is what the
                        following checks.
                    */
                    if (
                        index === 1
                        && (
                            ediPartNameElements[0].tagClass !== ASN1TagClass.context
                            || ediPartNameElements[0].construction !== ASN1Construction.primitive
                            || ediPartNameElements[0].tagNumber !== 1
                        )
                    ) {
                        throw new errors.X509Error(
                            "EDIPartyName missing nameAssigner element before "
                            + "partyName when partyName was the second "
                            + "element.",
                        );
                    }

                    partyName = UnboundedDirectoryString.fromElement(element);
                    fixedPositionElementsEncountered++;
                }
            }
        });

        if (!partyName) throw new errors.X509Error("EDIPartyName.partyName was not defined");

        /*
            Then, the remaining elements should be confirmed to be in canonical
            order. The start of the remaining elements is indicated by
            fixedPositionElementsEncountered.
        */
        if (!DERElement.isInCanonicalOrder(ediPartNameElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of EDIPartyName were not in canonical order");
        }

        return new EDIPartyName(nameAssigner, partyName);
    }

    public toElement (): DERElement {
        const ediPartNameElements: DERElement[] = [];
        if (this.nameAssigner) {
            ediPartNameElements.push(this.nameAssigner.toElement());
            ediPartNameElements[0].tagNumber = 0;
        }
        ediPartNameElements.push(this.partyName.toElement());
        ediPartNameElements[(ediPartNameElements.length - 1)].tagNumber = 1;
        const ediPartNameElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        ediPartNameElement.sequence = ediPartNameElements;
        return ediPartNameElement;
    }

    public static fromBytes (value: Uint8Array): EDIPartyName {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return this.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
