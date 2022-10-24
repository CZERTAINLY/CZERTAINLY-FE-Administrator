import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import Name from "../InformationFramework/Name";
import Validity from "./Validity";
import Version from "./Version";
import SubjectPublicKeyInfo from "./SubjectPublicKeyInfo";
import Extensions from "./Extensions";
import CertificateSerialNumber from "./CertificateSerialNumber";
import AlgorithmIdentifier from "./AlgorithmIdentifier";
import RelativeDistinguishedName from "../InformationFramework/RelativeDistinguishedName";
import AttributeTypeAndValue from "../InformationFramework/AttributeTypeAndValue";
import UniqueIdentifier from "../SelectedAttributeTypes/Version8/UniqueIdentifier";
import Extension from "./Extension";
import { RDNSequence } from "../InformationFramework";

// TBSCertificate ::= SEQUENCE {
//     version                  [0]  Version DEFAULT v1,
//     serialNumber                  CertificateSerialNumber,
//     signature                     AlgorithmIdentifier{{SupportedAlgorithms}},
//     issuer                        Name,
//     validity                      Validity,
//     subject                       Name,
//     subjectPublicKeyInfo          SubjectPublicKeyInfo,
//     issuerUniqueIdentifier   [1] IMPLICIT UniqueIdentifier OPTIONAL,
//     ...,
//     [[2: -- if present, version shall be v2 or v3
//     subjectUniqueIdentifier  [2] IMPLICIT UniqueIdentifier OPTIONAL]],
//     [[3: -- if present, version shall be v2 or v3
//     extensions               [3]  Extensions OPTIONAL]]
//     -- If present, version shall be v3]]
//    } (CONSTRAINED BY { -- shall be DER encoded -- } )

export default
class TBSCertificate {
    // eslint-disable-next-line max-params
    constructor (
        readonly ver: Version = Version.v1,
        readonly serialNumber: CertificateSerialNumber,
        readonly signature: AlgorithmIdentifier,
        readonly issuer: Name,
        readonly validity: Validity,
        readonly subject: Name,
        readonly subjectPublicKeyInfo: SubjectPublicKeyInfo,
        readonly issuerUniqueID? : UniqueIdentifier,
        readonly subjectUniqueID? : UniqueIdentifier,
        readonly extensions? : Extensions
    ) {}

    public static fromElement (value: DERElement): TBSCertificate {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on TBSCertificate");
        case -2: throw new errors.X509Error("Invalid construction on TBSCertificate");
        case -3: throw new errors.X509Error("Invalid tag number on TBSCertificate");
        default: throw new errors.X509Error("Undefined error when validating TBSCertificate tag");
        }

        const tbsCertificateElements: DERElement[] = value.sequence;
        if (tbsCertificateElements.length < 6) {
            throw new errors.X509Error(
                `TBSCertificate was too short. It contained ${tbsCertificateElements.length} elements.`,
            );
        }

        let ver: Version = Version.v1;
        let serialNumber: CertificateSerialNumber;
        // let signature: AlgorithmIdentifier;
        // let issuer: Name;
        // let validity: Validity;
        // let subject: Name;
        // let subjectPublicKeyInfo: SubjectPublicKeyInfo;
        let issuerUniqueID: UniqueIdentifier | undefined = undefined;
        let subjectUniqueID: UniqueIdentifier | undefined = undefined;
        let extensions: Extensions | undefined = undefined;

        let encounteredElements: number = 0;

        // version
        {
            if (
                tbsCertificateElements[encounteredElements].tagClass === ASN1TagClass.context
                && tbsCertificateElements[encounteredElements].construction === ASN1Construction.constructed
                && tbsCertificateElements[encounteredElements].tagNumber === 0
            ) {
                const versionElements: DERElement[] = tbsCertificateElements[encounteredElements].sequence;
                if (versionElements.length !== 1) throw new errors.X509Error("version can only contain one element.");
                switch (versionElements[0].validateTag(
                    [ ASN1TagClass.universal ],
                    [ ASN1Construction.primitive ],
                    [ ASN1UniversalType.integer ]
                )) {
                case 0: break;
                case -1: throw new errors.X509Error("Invalid tag class on TBSCertificate.version inner element");
                case -2: throw new errors.X509Error("Invalid construction on TBSCertificate.version inner element");
                case -3: throw new errors.X509Error("Invalid tag number on TBSCertificate.version inner element");
                default: {
                    throw new errors.X509Error(
                        "Undefined error when validating TBSCertificate.version inner element tag",
                    );
                }
                }

                switch (versionElements[0].integer) {
                case 0: ver = Version.v1; break;
                case 1: ver = Version.v2; break;
                case 2: ver = Version.v3; break;
                default:
                    throw new errors.X509Error("Invalid X.509 Certificate version.");
                }
                encounteredElements++;
            }
        }

        // serialNumber
        {
            switch (tbsCertificateElements[encounteredElements].validateTag(
                [ ASN1TagClass.universal ],
                [ ASN1Construction.primitive ],
                [ ASN1UniversalType.integer ]
            )) {
            case 0: break;
            case -1: throw new errors.X509Error("Invalid tag class on TBSCertificate.serialNumber");
            case -2: throw new errors.X509Error("Invalid construction on TBSCertificate.serialNumber");
            case -3: throw new errors.X509Error("Invalid tag number on TBSCertificate.serialNumber");
            default: throw new errors.X509Error("Undefined error when validating TBSCertificate.serialNumber tag");
            }
            serialNumber = tbsCertificateElements[encounteredElements++].octetString;
        }

        const signature: AlgorithmIdentifier = AlgorithmIdentifier.fromElement(
            tbsCertificateElements[encounteredElements++]
        );
        const issuer: Name = RDNSequence.fromElement(tbsCertificateElements[encounteredElements++]);
        const validity: Validity = Validity.fromElement(tbsCertificateElements[encounteredElements++]);
        const subject: Name = RDNSequence.fromElement(tbsCertificateElements[encounteredElements++]);
        const subjectPublicKeyInfo: SubjectPublicKeyInfo = SubjectPublicKeyInfo.fromElement(
            tbsCertificateElements[encounteredElements++]
        );

        // issuerUniqueIdentifier
        if (
            encounteredElements < tbsCertificateElements.length
            && tbsCertificateElements[encounteredElements].tagClass === ASN1TagClass.context
            && tbsCertificateElements[encounteredElements].construction === ASN1Construction.primitive
            && tbsCertificateElements[encounteredElements].tagNumber === 1
        ) {
            if (ver === Version.v1) {
                throw new errors.X509Error("issuerUniqueIdentifier not allowed in Version 1 X.509 certificate.");
            }
            issuerUniqueID = tbsCertificateElements[encounteredElements].bitString;
            encounteredElements++;
        }

        /**
         * This loop just determines where the ASN.1 extension marker "..."
         * begins and ends. (Not to be confused with the X.509 v3 Extensions.)
         * This is done so we can check that the extensions are in canonical
         * order as required by the distinguished encoding rules (DER) in the
         * next step.
         */
        let endOfTBSCertficateExtensionsIndex: number = encounteredElements;
        while (
            endOfTBSCertficateExtensionsIndex < tbsCertificateElements.length
            && !(
                tbsCertificateElements[encounteredElements].tagClass === ASN1TagClass.context
                && (
                    tbsCertificateElements[encounteredElements].tagNumber === 2
                    || tbsCertificateElements[encounteredElements].tagNumber === 3
                )
            )
        ) endOfTBSCertficateExtensionsIndex++;

        /**
         * The ASN.1 extensions to the TBSCertificate occur in the middle of
         * the TBSCertificate, rather than at the end, like most extensible
         * types. So we have to check everything within the extensibility
         * range is in canonical order.
         */
        DERElement.isInCanonicalOrder(
            tbsCertificateElements.slice(
                encounteredElements,
                endOfTBSCertficateExtensionsIndex
            )
        );

        DERElement.isUniquelyTagged(
            tbsCertificateElements.slice(
                encounteredElements,
                endOfTBSCertficateExtensionsIndex
            )
        );

        while (encounteredElements < tbsCertificateElements.length) {
            if (tbsCertificateElements[encounteredElements].tagClass === ASN1TagClass.context) {
                switch (tbsCertificateElements[encounteredElements].tagNumber) {
                case (2): {
                    if (ver === Version.v1) {
                        throw new errors.X509Error(
                            "subjectUniqueIdentifier not allowed in Version 1 X.509 certificate."
                        );
                    }
                    if ((tbsCertificateElements.length - encounteredElements) > 2) {
                        throw new errors.X509Error(
                            "subjectUniqueIdentifier must be last or second to last in the TBSCertificate."
                        );
                    }
                    subjectUniqueID = tbsCertificateElements[encounteredElements].bitString;
                    break;
                }
                case (3): {
                    if (ver !== Version.v3) {
                        throw new errors.X509Error("extensions not allowed in Version 1 or 2 X.509 certificate.");
                    }

                    if ((tbsCertificateElements.length - encounteredElements) !== 1) {
                        throw new errors.X509Error("extensions must be the last element in the TBSCertificate.");
                    }

                    switch (tbsCertificateElements[encounteredElements].validateTag(
                        [ ASN1TagClass.context ],
                        [ ASN1Construction.constructed ],
                        [ 3 ]
                    )) {
                    case 0: break;
                    case -1: {
                        throw new errors.X509Error("Invalid tag class on a TBSCertificate.extensions outer element");
                    }
                    case -2: {
                        throw new errors.X509Error("Invalid construction on a TBSCertificate.extensions outer element");
                    }
                    case -3: {
                        throw new errors.X509Error("Invalid tag number on a TBSCertificate.extensions outer element");
                    }
                    default: {
                        throw new errors.X509Error(
                            "Undefined error when validating a TBSCertificate.extensions outer element tag"
                        );
                    }
                    }

                    const extensionsElement: DERElement = new DERElement();
                    extensionsElement.fromBytes(tbsCertificateElements[encounteredElements].value);
                    const extensionElements: DERElement[] = extensionsElement.sequence;
                    if (extensionElements.length === 0) {
                        throw new errors.X509Error(
                            "extensions element may not be present in X.509 "
                            + "TBSCertificate if there are no extensions in it."
                        );
                    }
                    if (typeof extensions === "undefined") extensions = [];
                    extensions = extensions.concat(extensionElements.map(Extension.fromElement));
                    break;
                }
                default: break;
                }
            }
            encounteredElements++;
        }

        return new TBSCertificate(
            ver,
            serialNumber,
            signature,
            issuer,
            validity,
            subject,
            subjectPublicKeyInfo,
            issuerUniqueID,
            subjectUniqueID,
            extensions
        );
    }

    public toElement (): DERElement {
        const retSequence: DERElement[] = [];

        // version
        {
            const versionInnerElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.integer
            );
            versionInnerElement.integer = this.ver;

            const versionOuterElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                0
            );
            versionOuterElement.sequence = [ versionInnerElement ];
            retSequence.push(versionOuterElement);
        }

        // serialNumber
        {
            const serialNumberElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.integer
            );
            serialNumberElement.octetString = this.serialNumber;
            retSequence.push(serialNumberElement);
        }

        // signature
        {
            retSequence.push(this.signature.toElement());
        }

        // issuer
        {
            const issuerElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.constructed,
                ASN1UniversalType.sequence
            );

            issuerElement.sequence = this.issuer.value.map((rdn: RelativeDistinguishedName) => {
                const rdnElement: DERElement = new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.constructed,
                    ASN1UniversalType.set
                );
                rdnElement.sequence = rdn.value.map(
                    (rdnValue: AttributeTypeAndValue): DERElement => rdnValue.toElement()
                );
                return rdnElement;
            });

            retSequence.push(issuerElement);
        }

        // validity
        {
            retSequence.push(this.validity.toElement());
        }

        // subject
        {
            const subjectElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.constructed,
                ASN1UniversalType.sequence
            );

            subjectElement.sequence = this.subject.value.map((rdn: RelativeDistinguishedName) => {
                const rdnElement: DERElement = new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.constructed,
                    ASN1UniversalType.set
                );
                rdnElement.sequence = rdn.value.map(
                    (rdnValue: AttributeTypeAndValue): DERElement => rdnValue.toElement()
                );
                return rdnElement;
            });

            retSequence.push(subjectElement);
        }

        // subjectPublicKeyInfo
        {
            retSequence.push(this.subjectPublicKeyInfo.toElement());
        }

        if (this.ver !== Version.v1) {
            // issuerUniqueIdentifier
            if (this.issuerUniqueID) {
                const issuerUniqueIdentifierElement: DERElement = new DERElement(
                    ASN1TagClass.context,
                    ASN1Construction.primitive,
                    1
                );
                issuerUniqueIdentifierElement.bitString = this.issuerUniqueID;
                retSequence.push(issuerUniqueIdentifierElement);
            }

            // subjectUniqueIdentifier
            if (this.subjectUniqueID) {
                const subjectUniqueIdentifierElement: DERElement = new DERElement(
                    ASN1TagClass.context,
                    ASN1Construction.primitive,
                    2
                );
                subjectUniqueIdentifierElement.bitString = this.subjectUniqueID;
                retSequence.push(subjectUniqueIdentifierElement);
            }
        }

        if (this.ver === Version.v3) {
            // extensions
            if (this.extensions) {
                const extensionElements: DERElement[] = [];
                this.extensions.forEach((extension) => {
                    extensionElements.push(extension.toElement());
                });
                const extensionsElement: DERElement = new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.constructed,
                    ASN1UniversalType.sequence
                );
                extensionsElement.sequence = extensionElements;
                const extensionsOuterElement: DERElement = new DERElement(
                    ASN1TagClass.context,
                    ASN1Construction.constructed,
                    3
                );
                extensionsOuterElement.sequence = [ extensionsElement ];
                retSequence.push(extensionsOuterElement);
            }
        }

        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        ret.sequence = retSequence;
        return ret;
    }

    public fromBytes (value: Uint8Array): TBSCertificate {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return TBSCertificate.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
