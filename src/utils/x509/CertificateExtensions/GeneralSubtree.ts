import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import GeneralName from "./GeneralName";
import BaseDistance from "./BaseDistance";

//   GeneralSubtree ::= SEQUENCE {
//     base     GeneralName,
//     minimum  [0]  BaseDistance DEFAULT 0,
//     maximum  [1]  BaseDistance OPTIONAL,
//     ...
//   }

export default
class GeneralSubtree {
    constructor (
        readonly base: GeneralName,
        readonly minimum: BaseDistance = 0,
        readonly maximum? : BaseDistance
    ) {}

    public static fromElement (value: DERElement): GeneralSubtree {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on GeneralSubtree");
        case -2: throw new errors.X509Error("Invalid construction on GeneralSubtree");
        case -3: throw new errors.X509Error("Invalid tag number on GeneralSubtree");
        default: throw new errors.X509Error("Undefined error when validating GeneralSubtree tag");
        }

        const generalSubtreeElements: DERElement[] = value.sequence;
        if (generalSubtreeElements.length === 0) {
            throw new errors.X509Error("Invalid number of elements in GeneralSubtree");
        }

        // GeneralName is extensible, so tag validation cannot be done.
        const base: DERElement = generalSubtreeElements[0];
        let minimum: BaseDistance | undefined;
        let maximum: BaseDistance | undefined;
        let fixedPositionElementsEncountered: number = 1;
        generalSubtreeElements.slice(1).forEach((element: DERElement) => {
            if (element.tagClass === ASN1TagClass.context) {
                if (element.tagNumber === 0) { // minimum
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error("GeneralSubtree.minimum was not primitively constructed");
                    }
                    if (minimum) throw new errors.X509Error("GeneralSubtree.minimum already defined");
                    minimum = element.integer;
                    fixedPositionElementsEncountered++;
                } else if (element.tagNumber === 1) { // maximum
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error("GeneralSubtree.maximum was not primitively constructed");
                    }
                    if (maximum) throw new errors.X509Error("GeneralSubtree.maximum already defined");
                    maximum = element.integer;
                    fixedPositionElementsEncountered++;
                }
            }
        });

        if (!DERElement.isUniquelyTagged(generalSubtreeElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Elements of GeneralSubtree were not uniquely tagged");
        }

        if (!DERElement.isInCanonicalOrder(generalSubtreeElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of GeneralSubtree were not in canonical order");
        }

        if (minimum === 0) {
            throw new errors.X509Error(
                "GeneralSubtree.minimum was encoded with the default value, "
                + "which is prohibited by the Distinguished Encoding Rules.",
            );
        }
        if (minimum === undefined) minimum = 0;

        return new GeneralSubtree(base, minimum, maximum);
    }

    public toElement (): DERElement {
        const generalSubtreeElements: DERElement[] = [ this.base ];
        if (this.minimum) {
            const minimumElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                0
            );
            minimumElement.integer = this.minimum;
            generalSubtreeElements.push(minimumElement);
        }
        if (this.maximum) {
            const maximumElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                1
            );
            maximumElement.integer = this.minimum;
            generalSubtreeElements.push(maximumElement);
        }
        const generalSubtreeElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        generalSubtreeElement.sequence = generalSubtreeElements;
        return generalSubtreeElement;
    }

    public static fromBytes (value: Uint8Array): GeneralSubtree {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return GeneralSubtree.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
