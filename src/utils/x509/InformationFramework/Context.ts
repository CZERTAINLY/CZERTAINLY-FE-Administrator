import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
import validateTag from "../validateTag";

// Context ::= SEQUENCE {
//     contextType    CONTEXT.&id({SupportedContexts}),
//     contextValues
//       SET SIZE (1..MAX) OF CONTEXT.&Type({SupportedContexts}{@contextType}),
//     fallback       BOOLEAN DEFAULT FALSE,
//     ... }

export default
class Context {
    constructor (
        readonly contextType: ObjectIdentifier,
        readonly contextValues: DERElement[],
        readonly fallback: boolean = false,
    ) {}

    public static fromElement (value: DERElement): Context {
        validateTag(value, "Context",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );
        const contextElements: DERElement[] = value.sequence;
        if (contextElements.length < 2) {
            throw new errors.X509Error(`Invalid number of elements in Context: ${contextElements.length}.`);
        }
        if (!DERElement.isInCanonicalOrder(contextElements)) {
            throw new errors.X509Error("Elements of Context were not in canonical order.");
        }

        validateTag(contextElements[0], "Context.contextType",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ],
        );

        validateTag(contextElements[1], "Context.contextValues",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.set ],
        );

        const contextType: ObjectIdentifier = contextElements[0].objectIdentifier;
        const contextValues: DERElement[] = contextElements[1].set;
        const fallback: boolean | undefined = ((): boolean | undefined => {
            if (
                contextElements.length > 2
                && contextElements[2].tagClass === ASN1TagClass.universal
                && contextElements[2].construction === ASN1Construction.primitive
                && contextElements[2].tagNumber === ASN1UniversalType.boolean
            ) {
                return contextElements[2].boolean;
            }
            return undefined;
        })();

        return new Context(contextType, contextValues, fallback);
    }

    public toElement (): DERElement {
        const contextElements: DERElement[] = [];

        const contextTypeElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier,
        );
        contextTypeElement.objectIdentifier = this.contextType;
        contextElements.push(contextTypeElement);

        const contextValuesElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.set,
        );
        contextValuesElement.set = this.contextValues;
        contextElements.push(contextValuesElement);

        if (this.fallback === true) {
            const fallbackElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.boolean,
            );
            fallbackElement.boolean = this.fallback;
            contextElements.push(fallbackElement);
        }

        const contextElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        contextElement.sequence = contextElements;
        return contextElement;
    }

    public static fromBytes (value: Uint8Array): Context {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return Context.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
