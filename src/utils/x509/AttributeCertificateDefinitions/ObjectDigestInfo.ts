import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
import validateTag from "../validateTag";
import DigestedObjectType from "./DigestedObjectType";
import AlgorithmIdentifier from "../AuthenticationFramework/AlgorithmIdentifier";

// ObjectDigestInfo ::= SEQUENCE {
//     digestedObjectType   ENUMERATED {
//       publicKey        (0),
//       publicKeyCert    (1),
//       otherObjectTypes (2)},
//     otherObjectTypeID   OBJECT IDENTIFIER OPTIONAL,
//     digestAlgorithm     AlgorithmIdentifier{{SupportedAlgorithms}},
//     objectDigest        BIT STRING,
//     ... }
export default
class ObjectDigestInfo {
    constructor (
        readonly digestedObjectType: DigestedObjectType,
        readonly otherObjectTypeID: ObjectIdentifier | undefined,
        readonly digestAlgorithm: AlgorithmIdentifier,
        readonly objectDigest: boolean[],
    ) {}

    public static fromElement (value: DERElement): ObjectDigestInfo {
        validateTag(value, "ObjectDigestInfo",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );
        const objectDigestInfoElements: DERElement[] = value.sequence;
        if (objectDigestInfoElements.length < 3) {
            throw new errors.X509Error(
                `Too few elements in ObjectDigestInfo: ${objectDigestInfoElements.length}.`,
            );
        }

        const elements: Map<string, DERElement> = new Map<string, DERElement>([
            ["digestedObjectType", objectDigestInfoElements[0]],
        ]);

        if (objectDigestInfoElements[1].tagNumber === ASN1UniversalType.objectIdentifier) {
            if (objectDigestInfoElements.length < 4) {
                throw new errors.X509Error(
                    `Too few elements in ObjectDigestInfo: ${objectDigestInfoElements.length}.`,
                );
            }
            elements.set("otherObjectTypeID", objectDigestInfoElements[1]);
            elements.set("digestAlgorithm", objectDigestInfoElements[2]);
            elements.set("objectDigest", objectDigestInfoElements[3]);
        } else {
            elements.set("digestAlgorithm", objectDigestInfoElements[1]);
            elements.set("objectDigest", objectDigestInfoElements[2]);
        }

        validateTag(
            (elements.get("digestedObjectType") as DERElement),
            "ObjectDigestInfo.digestedObjectType",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.enumerated ],
        );

        if (elements.has("otherObjectTypeID")) {
            validateTag(
                (elements.get("otherObjectTypeID") as DERElement),
                "ObjectDigestInfo.otherObjectTypeID",
                [ ASN1TagClass.universal ],
                [ ASN1Construction.primitive ],
                [ ASN1UniversalType.objectIdentifier ],
            );
        }

        // digestAlgorithm is validated in AlgorithIdentifier.fromElement().

        validateTag(
            (elements.get("objectDigest") as DERElement),
            "ObjectDigestInfo.objectDigest",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.bitString ],
        );

        const digestedObjectType: DigestedObjectType = (elements.get("digestedObjectType") as DERElement).enumerated;
        const otherObjectTypeID: ObjectIdentifier | undefined = elements.has("otherObjectTypeID")
            ? (elements.get("otherObjectTypeID") as DERElement).objectIdentifier
            : undefined;
        const digestAlgorithm: AlgorithmIdentifier = AlgorithmIdentifier
            .fromElement(elements.get("digestAlgorithm") as DERElement);
        const objectDigest: boolean[] = (elements.get("objectDigest") as DERElement).bitString;

        return new ObjectDigestInfo(
            digestedObjectType,
            otherObjectTypeID,
            digestAlgorithm,
            objectDigest,
        );
    }

    public toElement (): DERElement {
        const objectDigestInfoElements: DERElement[] = [];

        const digestedObjectTypeElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.enumerated,
        );
        digestedObjectTypeElement.enumerated = this.digestedObjectType;
        objectDigestInfoElements.push(digestedObjectTypeElement);

        if (this.otherObjectTypeID) {
            const otherObjectTypeIDElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.objectIdentifier,
            );
            otherObjectTypeIDElement.objectIdentifier = this.otherObjectTypeID;
            objectDigestInfoElements.push(otherObjectTypeIDElement);
        }

        const digestAlgorithmElement: DERElement = this.digestAlgorithm.toElement();
        objectDigestInfoElements.push(digestAlgorithmElement);

        const objectDigestElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.bitString,
        );
        objectDigestElement.bitString = this.objectDigest;
        objectDigestInfoElements.push(objectDigestElement);

        const objectDigestInfoElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        objectDigestInfoElement.sequence = objectDigestInfoElements;
        return objectDigestInfoElement;
    }

    public static fromBytes (value: Uint8Array): ObjectDigestInfo {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return ObjectDigestInfo.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
