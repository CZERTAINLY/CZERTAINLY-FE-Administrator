import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import validateTag from "../validateTag";
import AttCertVersion from "./AttCertVersion";
import CertificateSerialNumber from "../AuthenticationFramework/CertificateSerialNumber";
import AlgorithmIdentifier from "../AuthenticationFramework/AlgorithmIdentifier";
import Holder from "./Holder";
import AttCertIssuer from "./AttCertIssuer";
import AttCertValidityPeriod from "./AttCertValidityPeriod";
import Attribute from "../InformationFramework/Attribute";
import { UniqueIdentifier } from "../SelectedAttributeTypes";
import Extensions from "../AuthenticationFramework/Extensions";
import { Extension } from "../AuthenticationFramework";

// TBSAttributeCertificate ::= SEQUENCE {
//     version                 AttCertVersion, -- version is v2
//     holder                  Holder,
//     issuer                  AttCertIssuer,
//     signature               AlgorithmIdentifier{{SupportedAlgorithms}},
//     serialNumber            CertificateSerialNumber,
//     attrCertValidityPeriod  AttCertValidityPeriod,
//     attributes              SEQUENCE OF Attribute{{SupportedAttributes}},
//     issuerUniqueID          UniqueIdentifier OPTIONAL,
//     ...,
//     ...,
//     extensions              Extensions OPTIONAL
//    }  (CONSTRAINED BY { -- shall be DER encoded -- } )

export default
class TBSAttributeCertificate {
    // eslint-disable-next-line max-params
    constructor (
        readonly ver: AttCertVersion = AttCertVersion.v2,
        readonly holder: Holder,
        readonly issuer: AttCertIssuer,
        readonly signature: AlgorithmIdentifier,
        readonly serialNumber: CertificateSerialNumber,
        readonly attrCertValidityPeriod: AttCertValidityPeriod,
        readonly attributes: Attribute[],
        readonly issuerUniqueID: UniqueIdentifier | undefined,
        readonly extensions: Extensions | undefined,
    ) {}

    public static fromElement (value: DERElement): TBSAttributeCertificate {
        validateTag(value, "TBSAttributeCertificate",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );

        const attributeCertificateElements: DERElement[] = value.sequence;
        if (attributeCertificateElements.length < 7) {
            throw new errors.X509Error(
                `TBSAttributeCertificate was too short. It contained ${attributeCertificateElements.length} elements.`,
            );
        }

        validateTag(attributeCertificateElements[0], "TBSAttributeCertificate.version",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.integer ],
        );

        validateTag(attributeCertificateElements[4], "TBSAttributeCertificate.serialNumber",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.integer ],
        );

        validateTag(attributeCertificateElements[6], "TBSAttributeCertificate.attributes",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );

        const ver: AttCertVersion = attributeCertificateElements[0].integer;
        const holder: Holder = Holder.fromElement(attributeCertificateElements[1]);
        const issuer: AttCertIssuer = AttCertIssuer.fromElement(attributeCertificateElements[2]);
        const signature: AlgorithmIdentifier = AlgorithmIdentifier.fromElement(attributeCertificateElements[3]);
        const serialNumber: CertificateSerialNumber = attributeCertificateElements[4].octetString;
        const attrCertValidityPeriod: AttCertValidityPeriod = AttCertValidityPeriod.fromElement(attributeCertificateElements[5]);
        const attributes: Attribute[] = attributeCertificateElements[6].sequence.map(Attribute.fromElement);

        let encounteredElements: number = 7;

        let issuerUniqueID: UniqueIdentifier | undefined = undefined;
        if (
            attributeCertificateElements.length > 7
            && attributeCertificateElements[7].tagClass === ASN1TagClass.universal
            && attributeCertificateElements[7].construction === ASN1Construction.primitive
            && attributeCertificateElements[7].tagNumber === ASN1UniversalType.bitString
        ) {
            issuerUniqueID = attributeCertificateElements[7].bitString;
            encounteredElements++;
        }

        let extensions: Extensions | undefined = undefined;
        if (
            attributeCertificateElements.length > 8
            && attributeCertificateElements[attributeCertificateElements.length - 1].tagClass === ASN1TagClass.universal
            && attributeCertificateElements[attributeCertificateElements.length - 1].construction === ASN1Construction.constructed
            && attributeCertificateElements[attributeCertificateElements.length - 1].tagNumber === ASN1UniversalType.sequence
        ) {
            extensions = attributeCertificateElements[attributeCertificateElements.length - 1].sequence.map(Extension.fromElement);
        }

        DERElement.isInCanonicalOrder(
            attributeCertificateElements.slice(
                encounteredElements,
                extensions ? (attributeCertificateElements.length - 1) : undefined
            ),
        );

        DERElement.isUniquelyTagged(
            attributeCertificateElements.slice(
                encounteredElements,
                extensions ? (attributeCertificateElements.length - 1) : undefined
            ),
        );

        return new TBSAttributeCertificate(
            ver,
            holder,
            issuer,
            signature,
            serialNumber,
            attrCertValidityPeriod,
            attributes,
            issuerUniqueID,
            extensions,
        );
    }

    public toElement (): DERElement {
        const attributeCertificateElements: DERElement[] = [];

        const versionElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
        );
        versionElement.integer = this.ver;
        attributeCertificateElements.push(versionElement);

        attributeCertificateElements.push(this.holder.toElement());
        attributeCertificateElements.push(this.issuer.toElement());
        attributeCertificateElements.push(this.signature.toElement());

        const serialNumberElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
        );
        serialNumberElement.octetString = this.serialNumber;
        attributeCertificateElements.push(serialNumberElement);

        attributeCertificateElements.push(this.attrCertValidityPeriod.toElement());

        const attributesElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        attributesElement.sequence = this.attributes.map(a => a.toElement());
        attributeCertificateElements.push(attributesElement);

        if (this.issuerUniqueID) {
            const issuerUniqueIDElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.bitString,
            );
            issuerUniqueIDElement.bitString = this.issuerUniqueID;
            attributeCertificateElements.push(issuerUniqueIDElement);
        }

        if (this.extensions) {
            const extensionsElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.constructed,
                ASN1UniversalType.sequence,
            );
            extensionsElement.sequence = this.extensions.map(e => e.toElement());
            attributeCertificateElements.push(extensionsElement);
        }

        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        ret.sequence = attributeCertificateElements;
        return ret;
    }

    public fromBytes (value: Uint8Array): TBSAttributeCertificate {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return TBSAttributeCertificate.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
