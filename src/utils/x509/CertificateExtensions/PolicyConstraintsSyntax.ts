import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import SkipCerts from "./SkipCerts";

// PolicyConstraintsSyntax ::= SEQUENCE {
//     requireExplicitPolicy  [0]  SkipCerts OPTIONAL,
//     inhibitPolicyMapping   [1]  SkipCerts OPTIONAL,
//     ...
//   }
//   (WITH COMPONENTS {
//      ...,
//      requireExplicitPolicy  PRESENT
//    } | WITH COMPONENTS {
//          ...,
//          inhibitPolicyMapping  PRESENT
//        })

export default
class PolicyConstraintsSyntax {
    constructor (
        readonly requireExplicitPolicy? : SkipCerts,
        readonly inhibitPolicyMapping? : SkipCerts
    ) {
        if (!requireExplicitPolicy && !inhibitPolicyMapping) {
            throw new errors.X509Error(
                "PolicyConstraintsSyntax must have either requireExplicitPolicy or inhibitPolicyMapping set.",
            );
        }
    }

    public static fromElement (value: DERElement): PolicyConstraintsSyntax {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on PolicyConstraintsSyntax");
        case -2: throw new errors.X509Error("Invalid construction on PolicyConstraintsSyntax");
        case -3: throw new errors.X509Error("Invalid tag number on PolicyConstraintsSyntax");
        default: throw new errors.X509Error("Undefined error when validating PolicyConstraintsSyntax tag");
        }

        const policyConstraintsSyntaxElements: DERElement[] = value.sequence;
        if (policyConstraintsSyntaxElements.length === 0) {
            throw new errors.X509Error("PolicyConstraintsSyntax SEQUENCE was constituted from zero elements");
        }

        let requireExplicitPolicy: SkipCerts | undefined;
        let inhibitPolicyMapping: SkipCerts | undefined;
        let fixedPositionElementsEncountered: number = 0;
        policyConstraintsSyntaxElements.forEach((element: DERElement, index: number) => {
            if (element.tagClass === ASN1TagClass.context) {
                if (element.tagNumber === 0) { // requireExplicitPolicy
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "PolicyConstraintsSyntax.requireExplicitPolicy was not primitively constructed.",
                        );
                    }
                    if (requireExplicitPolicy) {
                        throw new errors.X509Error("PolicyConstraintsSyntax.requireExplicitPolicy already defined.");
                    }
                    requireExplicitPolicy = element.integer;
                    fixedPositionElementsEncountered++;
                } else if (element.tagNumber === 1) { // inhibitPolicyMapping
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "PolicyConstraintsSyntax.inhibitPolicyMapping was not primitively constructed.",
                        );
                    }
                    if (inhibitPolicyMapping) {
                        throw new errors.X509Error("PolicyConstraintsSyntax.inhibitPolicyMapping already defined.");
                    }

                    if (
                        index === 1
                        && (
                            policyConstraintsSyntaxElements[0].tagClass !== ASN1TagClass.universal
                            || policyConstraintsSyntaxElements[0].construction !== ASN1Construction.primitive
                            || policyConstraintsSyntaxElements[0].tagNumber !== ASN1UniversalType.integer
                        )
                    ) {
                        throw new errors.X509Error(
                            "PolicyConstraintsSyntax missing "
                            + "requireExplicitPolicy element before "
                            + "inhibitPolicyMapping when "
                            + "inhibitPolicyMapping was the second element.",
                        );
                    }

                    inhibitPolicyMapping = element.integer;
                    fixedPositionElementsEncountered++;
                }
            }
        });

        if (!DERElement.isUniquelyTagged(policyConstraintsSyntaxElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Elements of PolicyConstraintsSyntax were not uniquely tagged");
        }

        if (!DERElement.isInCanonicalOrder(policyConstraintsSyntaxElements.slice(fixedPositionElementsEncountered))) {
            throw new errors.X509Error("Extended elements of PolicyConstraintsSyntax were not in canonical order");
        }

        return new PolicyConstraintsSyntax(requireExplicitPolicy, inhibitPolicyMapping);
    }

    public toElement (): DERElement {
        const policyConstraintsSyntaxElements: DERElement[] = [];
        if (this.requireExplicitPolicy) {
            const requireExplicitPolicyElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                0
            );
            requireExplicitPolicyElement.integer = this.requireExplicitPolicy;
            policyConstraintsSyntaxElements.push(requireExplicitPolicyElement);
        }
        if (this.inhibitPolicyMapping) {
            const inhibitPolicyMappingElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                1
            );
            inhibitPolicyMappingElement.integer = this.inhibitPolicyMapping;
            policyConstraintsSyntaxElements.push(inhibitPolicyMappingElement);
        }
        const policyConstraintsSyntaxElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        policyConstraintsSyntaxElement.sequence = policyConstraintsSyntaxElements;
        return policyConstraintsSyntaxElement;
    }

    public static fromBytes (value: Uint8Array): PolicyConstraintsSyntax {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return PolicyConstraintsSyntax.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
