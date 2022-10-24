import { DERElement, ASN1TagClass, ASN1Construction } from "asn1-ts";
import * as errors from "./errors";

export default
function validateTag (
    element: DERElement,
    name: string,
    acceptableTagClasses: ASN1TagClass[],
    acceptableConstructions: ASN1Construction[],
    acceptableTagNumbers: number[],
): void {
    switch (element.validateTag(acceptableTagClasses, acceptableConstructions, acceptableTagNumbers)) {
    case 0: break;
    case -1: {
        const tagClassName: string = ({
            0: "UNIVERSAL",
            1: "APPLICATION",
            2: "CONTEXT-SPECIFIC",
            3: "PRIVATE",
        })[element.tagClass];
        throw new errors.X509Error(`Invalid tag class on ${name}. Actual class: ${tagClassName}.`);
    }
    case -2: throw new errors.X509Error(`Invalid construction on ${name}.`);
    case -3: throw new errors.X509Error(
        `Invalid tag number on ${name}. Actual number was ${element.tagNumber}.`,
    );
    default: throw new errors.X509Error(`Undefined error when validating ${name} tag.`);
    }
}
