import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import GeneralNames from "../CertificateExtensions/GeneralNames";
import validateTag from "../validateTag";
import ObjectDigestInfo from "./ObjectDigestInfo";
import IssuerSerial from "./IssuerSerial";

// Holder ::= SEQUENCE {
//     baseCertificateID  [0]  IssuerSerial OPTIONAL,
//     entityName         [1]  GeneralNames OPTIONAL,
//     objectDigestInfo   [2]  ObjectDigestInfo OPTIONAL }
//     (WITH COMPONENTS {..., baseCertificateID  PRESENT } |
//      WITH COMPONENTS {..., entityName  PRESENT } |
//      WITH COMPONENTS {..., objectDigestInfo  PRESENT } )

export default
class Holder {
    constructor (
        readonly baseCertificateID: IssuerSerial | undefined,
        readonly entityName: GeneralNames | undefined,
        readonly objectDigestInfo: ObjectDigestInfo | undefined,
    ) {}

    public static fromElement (value: DERElement): Holder {
        validateTag(value, "Holder",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );
        const holderElements: DERElement[] = value.sequence;
        if (holderElements.length < 1) {
            throw new errors.X509Error(`Invalid number of elements in Holder: ${holderElements.length}.`);
        }
        if (!DERElement.isInCanonicalOrder(holderElements)) {
            throw new errors.X509Error("Elements of Holder were not in canonical order.");
        }

        let baseCertificateID: IssuerSerial | undefined;
        let entityName: GeneralNames | undefined;
        let objectDigestInfo: ObjectDigestInfo | undefined;

        holderElements.forEach((he: DERElement): void => {
            if (he.tagClass === ASN1TagClass.context && he.construction === ASN1Construction.constructed) {
                if (he.tagNumber === 0) {
                    if (baseCertificateID) {
                        throw new errors.X509Error("Holder.baseCertificateID already defined.");
                    }
                    baseCertificateID = IssuerSerial.fromElement(he);
                } else if (he.tagNumber === 1) {
                    if (entityName) {
                        throw new errors.X509Error("Holder.entityName already defined.");
                    }
                    entityName = he.sequence;
                } else if (he.tagNumber === 2) {
                    if (objectDigestInfo) {
                        throw new errors.X509Error("Holder.objectDigestInfo already defined.");
                    }
                    objectDigestInfo = ObjectDigestInfo.fromElement(he);
                }
            }
        });

        if (!baseCertificateID && !entityName && !objectDigestInfo) {
            throw new errors.X509Error(
                "One of { baseCertificateID, entityName, objectDigestInfo } "
                + "must be defined for a Holder element.",
            );
        }

        return new Holder(baseCertificateID, entityName, objectDigestInfo);
    }

    public toElement (): DERElement {
        const holderElements: DERElement[] = [];
        if (this.baseCertificateID) {
            const baseCertificateIDElement: DERElement = this.baseCertificateID.toElement();
            baseCertificateIDElement.tagClass = ASN1TagClass.context;
            baseCertificateIDElement.tagNumber = 0;
            holderElements.push(baseCertificateIDElement);
        }
        if (this.entityName) {
            const entityNameElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                1,
            );
            entityNameElement.sequence = this.entityName;
            holderElements.push(entityNameElement);
        }
        if (this.objectDigestInfo) {
            const objectDigestInfoElement: DERElement = this.objectDigestInfo.toElement();
            objectDigestInfoElement.tagClass = ASN1TagClass.context;
            objectDigestInfoElement.tagNumber = 2;
            holderElements.push(objectDigestInfoElement);
        }
        const holderElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        holderElement.sequence = holderElements;
        return holderElement;
    }

    public static fromBytes (value: Uint8Array): Holder {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return Holder.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
