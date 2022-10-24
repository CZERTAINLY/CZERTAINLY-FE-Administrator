import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";

// BasicConstraintsSyntax ::= SEQUENCE {
//     cA                 BOOLEAN DEFAULT FALSE,
//     pathLenConstraint  INTEGER(0..MAX) OPTIONAL,
//     ...
//   }

export default
class BasicConstraintsSyntax {
    constructor (
        readonly ca: boolean,
        readonly pathLenConstraint? : number
    ) {}

    public static fromElement (value: DERElement): BasicConstraintsSyntax {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on BasicConstraintsSyntax");
        case -2: throw new errors.X509Error("Invalid construction on BasicConstraintsSyntax");
        case -3: throw new errors.X509Error("Invalid tag number on BasicConstraintsSyntax");
        default: throw new errors.X509Error("Undefined error when validating BasicConstraintsSyntax tag");
        }

        let ca: boolean | undefined;
        let pathLenConstraint: number | undefined;
        let fixedPositionElementsEncountered: number = 0;

        const basicConstraintsSyntaxElements: DERElement[] = value.sequence;

        /*
            Doing the check for unique tags here will prevent us from
            encountering multiple ca or pathLenConstraint elements in the loop
            that follows.
        */
        if (!DERElement.isUniquelyTagged(basicConstraintsSyntaxElements)) {
            throw new errors.X509Error("Elements of BasicConstraintsSyntax were not uniquely tagged");
        }

        /*
            The rules for parsing the elements that follow are like so:
            1. Because of the extensibility marker, BasicConstraintsSyntax can
               contain elements with any tag class, construction, or tag
               number.
            2. There should be, at most, one element that is universal,
               with tag number 1, which will be the `ca` element. This element,
               if present, must be the first in the sequence.
            3. There should be, at most, one element that is universal,
               with tag number 2, which will be the `pathLenConstraint`
               element. This element, if present, must be the first or second
               in the sequence.

            After each of the fixed elements are found,
            `fixedPositionElementsEncountered` should be incremented. This will
            serve as the index for the start of the extensions, and hence the
            subject of the canonical ordering check.
        */
        basicConstraintsSyntaxElements.forEach((element: DERElement, index: number) => {
            if (element.tagClass === ASN1TagClass.universal) {
                if (element.tagNumber === ASN1UniversalType.boolean) {
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error("BasicConstraintsSyntax.ca was not primitively constructed");
                    }
                    if (index !== 0) {
                        throw new errors.X509Error("BasicConstraintsSyntax.ca was not the first element");
                    }
                    ca = element.boolean;
                    fixedPositionElementsEncountered++;
                } else if (element.tagNumber === ASN1UniversalType.integer) {
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "BasicConstraintsSyntax.pathLenConstraint was not primitively constructed"
                        );
                    }
                    if (index > 1) {
                        throw new errors.X509Error(
                            "BasicConstraintsSyntax.pathLenConstraint was not the first or second element"
                        );
                    }

                    /*
                        If we have run into pathLenConstraint, and its the
                        second element in the sequence, the first element
                        in the sequence MUST be ca, which is what the
                        following checks.
                    */
                    if (
                        index === 1
                        && (
                            basicConstraintsSyntaxElements[0].tagClass !== ASN1TagClass.universal
                            || basicConstraintsSyntaxElements[0].construction !== ASN1Construction.primitive
                            || basicConstraintsSyntaxElements[0].tagNumber !== ASN1UniversalType.boolean
                        )
                    ) {
                        throw new errors.X509Error(
                            "BasicConstraintsSyntax missing ca element before "
                            + "pathLenConstraint when pathLenConstraint was "
                            + "the second element.",
                        );
                    }

                    pathLenConstraint = element.integer;
                    fixedPositionElementsEncountered++;
                }
            }
        });

        /*
            Then, the remaining elements should be confirmed to be in canonical
            order. The start of the remaining elements is indicated by
            fixedPositionElementsEncountered.
        */
        if (!DERElement.isInCanonicalOrder(basicConstraintsSyntaxElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of BasicConstraintsSyntax were not in canonical order");
        }

        /*
            "The encoding of a set value or sequence value shall not include
            an encoding for any component value which is equal to its default
            value" -- ITU X.690 Section 11.5
        */
        if (ca === false) {
            throw new errors.X509Error(
                "BasicConstraintsSyntax.cA was encoded with the default "
                + "value, which is prohibited by the Distinguished Encoding "
                + "Rules."
            );
        }
        if (ca === undefined) ca = false;

        return new BasicConstraintsSyntax(ca, pathLenConstraint);
    }

    public toElement (): DERElement {
        const basicConstraintsSyntaxElements: DERElement[] = [];

        if (this.ca === true) {
            const caElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.boolean
            );
            caElement.boolean = true;
            basicConstraintsSyntaxElements.push(caElement);
        }

        if (this.pathLenConstraint) {
            const pathLenConstraintElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.integer
            );
            pathLenConstraintElement.integer = this.pathLenConstraint;
            basicConstraintsSyntaxElements.push(pathLenConstraintElement);
        }

        const basicConstraintsSyntaxElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        basicConstraintsSyntaxElement.sequence = basicConstraintsSyntaxElements;
        return basicConstraintsSyntaxElement;
    }

    public static fromBytes (value: Uint8Array): BasicConstraintsSyntax {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return BasicConstraintsSyntax.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
