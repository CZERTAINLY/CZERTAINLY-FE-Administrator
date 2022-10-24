import GeneralSubtrees from "./GeneralSubtrees";
import GeneralSubtree from "./GeneralSubtree";
import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// NameConstraintsSyntax ::= SEQUENCE {
//     permittedSubtrees  [0]  GeneralSubtrees OPTIONAL,
//     excludedSubtrees   [1]  GeneralSubtrees OPTIONAL,
//     ...
//   }
//   (WITH COMPONENTS {
//      ...,
//      permittedSubtrees  PRESENT
//    } | WITH COMPONENTS {
//          ...,
//          excludedSubtrees  PRESENT
//        })

export default
class NameConstraintsSyntax {
    constructor (
        readonly permittedSubtrees? : GeneralSubtrees,
        readonly excludedSubtrees? : GeneralSubtrees
    ) {
        if (!permittedSubtrees && !excludedSubtrees) {
            throw new errors.X509Error(
                "NameConstraintsSyntax requires either permittedSubtrees or excludedSubtrees to be defined.",
            );
        }
    }

    public static fromElement (value: DERElement): NameConstraintsSyntax {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on NameConstraintsSyntax");
        case -2: throw new errors.X509Error("Invalid construction on NameConstraintsSyntax");
        case -3: throw new errors.X509Error("Invalid tag number on NameConstraintsSyntax");
        default: throw new errors.X509Error("Undefined error when validating NameConstraintsSyntax tag");
        }

        const nameConstraintsSyntaxElements: DERElement[] = value.sequence;
        if (nameConstraintsSyntaxElements.length === 0) {
            throw new errors.X509Error("NameConstraintsSyntax SEQUENCE was constituted from zero elements");
        }

        let permittedSubtrees: GeneralSubtrees | undefined;
        let excludedSubtrees: GeneralSubtrees | undefined;
        let fixedPositionElementsEncountered: number = 0;
        nameConstraintsSyntaxElements.forEach((element: DERElement) => {
            if (element.tagClass === ASN1TagClass.context) {
                if (element.tagNumber === 0) { // permittedSubtrees
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "NameConstraintsSyntax.permittedSubtrees was not primitively constructed"
                        );
                    }
                    if (permittedSubtrees) {
                        throw new errors.X509Error("NameConstraintsSyntax.permittedSubtrees already defined");
                    }
                    permittedSubtrees = element.sequence.map(GeneralSubtree.fromElement);
                    fixedPositionElementsEncountered++;
                } else if (element.tagNumber === 1) { // excludedSubtrees
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "NameConstraintsSyntax.excludedSubtrees was not primitively constructed"
                        );
                    }
                    if (excludedSubtrees) {
                        throw new errors.X509Error("NameConstraintsSyntax.excludedSubtrees already defined");
                    }
                    excludedSubtrees = element.sequence.map((xsub: DERElement) => GeneralSubtree.fromElement(xsub));
                    fixedPositionElementsEncountered++;
                }
            }
        });

        if (!DERElement.isUniquelyTagged(nameConstraintsSyntaxElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Elements of GeneralSubtree were not uniquely tagged");
        }

        if (!DERElement.isInCanonicalOrder(nameConstraintsSyntaxElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of GeneralSubtree were not in canonical order");
        }

        return new NameConstraintsSyntax(permittedSubtrees, excludedSubtrees);
    }

    public toElement (): DERElement {
        const nameConstraintsSyntaxElements: DERElement[] = [];
        if (this.permittedSubtrees) {
            const permittedSubtreesElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                0
            );
            permittedSubtreesElement.sequence
                = this.permittedSubtrees.map((psub: GeneralSubtree) => psub.toElement());
            nameConstraintsSyntaxElements.push(permittedSubtreesElement);
        }
        if (this.excludedSubtrees) {
            const excludedSubtreesElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                1
            );
            excludedSubtreesElement.sequence
                = this.excludedSubtrees.map((xsub: GeneralSubtree) => xsub.toElement());
            nameConstraintsSyntaxElements.push(excludedSubtreesElement);
        }
        const nameConstraintsSyntaxElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        nameConstraintsSyntaxElement.sequence = nameConstraintsSyntaxElements;
        return nameConstraintsSyntaxElement;
    }

    public static fromBytes (value: Uint8Array): NameConstraintsSyntax {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return NameConstraintsSyntax.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
