import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import validateTag from "../validateTag";
import Version from "./Version";
import CertificateSerialNumber from "../AuthenticationFramework/CertificateSerialNumber";
import AlgorithmIdentifier from "../AuthenticationFramework/AlgorithmIdentifier";
import Extensions from "../AuthenticationFramework/Extensions";
import { Extension } from "../AuthenticationFramework";
import RDNSequence from "../InformationFramework/RDNSequence";
import Name from "../InformationFramework/Name";

// CertificateListContent ::= SEQUENCE {
//     version              Version OPTIONAL,
//     -- if present, version shall be v2
//     signature            AlgorithmIdentifier{{SupportedAlgorithms}},
//     issuer               Name,
//     thisUpdate           Time,
//     nextUpdate           Time OPTIONAL,
//     revokedCertificates  SEQUENCE OF SEQUENCE {
//       serialNumber         CertificateSerialNumber,
//       revocationDate       Time,
//       crlEntryExtensions   Extensions OPTIONAL,
//       ...} OPTIONAL,
//     ...,
//     ...,
//     crlExtensions   [0]  Extensions OPTIONAL }

export default
class CertificateListContent {
    // eslint-disable-next-line max-params
    constructor (
        readonly ver: Version = Version.v2,
        readonly signature: AlgorithmIdentifier,
        readonly issuer: Name,
        readonly thisUpdate: Date,
        readonly nextUpdate: Date | undefined,
        readonly revokedCertificates: {
            serialNumber: CertificateSerialNumber;
            revocationDate: Date;
            crlEntryExtensions: Extensions | undefined;
        }[] | undefined,
        readonly crlExtensions: Extensions | undefined,
    ) {}

    public static fromElement (value: DERElement): CertificateListContent {
        validateTag(value, "CertificateListContent",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );

        const attributeCertificateElements: DERElement[] = value.sequence;
        if (attributeCertificateElements.length < 3) {
            throw new errors.X509Error(
                `CertificateListContent was too short. It contained ${attributeCertificateElements.length} elements.`,
            );
        }

        let encounteredElements: number = 0;

        let ver: Version | undefined = undefined;

        if (
            attributeCertificateElements[encounteredElements].tagClass === ASN1TagClass.universal
            && attributeCertificateElements[encounteredElements].construction === ASN1Construction.primitive
            && attributeCertificateElements[encounteredElements].tagNumber === ASN1UniversalType.integer
        ) {
            ver = attributeCertificateElements[encounteredElements++].integer;
        }

        const signature: AlgorithmIdentifier = AlgorithmIdentifier.fromElement(attributeCertificateElements[encounteredElements++]);
        const issuer: Name = RDNSequence.fromElement(attributeCertificateElements[encounteredElements++]);

        validateTag(attributeCertificateElements[encounteredElements], "CertificateListContent.thisUpdate",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.utcTime, ASN1UniversalType.generalizedTime ],
        );

        const thisUpdate: Date = ((): Date => {
            if (attributeCertificateElements[encounteredElements].tagNumber === ASN1UniversalType.utcTime) {
                return attributeCertificateElements[encounteredElements++].utcTime;
            } else {
                return attributeCertificateElements[encounteredElements++].generalizedTime;
            }
        })();

        let nextUpdate: Date | undefined = undefined;
        if (
            attributeCertificateElements[encounteredElements].tagClass === ASN1TagClass.universal
            && attributeCertificateElements[encounteredElements].construction === ASN1Construction.primitive
        ) {
            if (attributeCertificateElements[encounteredElements].tagNumber === ASN1UniversalType.generalizedTime) {
                validateTag(attributeCertificateElements[encounteredElements], "CertificateListContent.nextUpdate",
                    [ ASN1TagClass.universal ],
                    [ ASN1Construction.primitive ],
                    [ ASN1UniversalType.generalizedTime ],
                );
                nextUpdate = attributeCertificateElements[encounteredElements++].generalizedTime;
            } else if (attributeCertificateElements[encounteredElements].tagNumber === ASN1UniversalType.utcTime) {
                validateTag(attributeCertificateElements[encounteredElements], "CertificateListContent.nextUpdate",
                    [ ASN1TagClass.universal ],
                    [ ASN1Construction.primitive ],
                    [ ASN1UniversalType.utcTime ],
                );
                nextUpdate = attributeCertificateElements[encounteredElements++].utcTime;
            }
        }

        let revokedCertificates: {
            serialNumber: CertificateSerialNumber;
            revocationDate: Date;
            crlEntryExtensions: Extensions | undefined;
        }[] | undefined = undefined;
        if (
            attributeCertificateElements[encounteredElements].tagClass === ASN1TagClass.universal
            && attributeCertificateElements[encounteredElements].construction === ASN1Construction.primitive
            && attributeCertificateElements[encounteredElements].tagNumber === ASN1UniversalType.sequence
        ) {
            const revokedCertificatesElements: DERElement[] = attributeCertificateElements[encounteredElements].sequence;

            revokedCertificates = revokedCertificatesElements.map(rc => {
                validateTag(rc, "CertificateListContent.revokedCertificates[#]",
                    [ ASN1TagClass.universal ],
                    [ ASN1Construction.constructed ],
                    [ ASN1UniversalType.sequence ],
                );
                const rcElements: DERElement[] = rc.sequence;
                if (rcElements.length > 3) {
                    throw new errors.X509Error("Too few elements in CertificateListContent.revokedCertificates[#] element.");
                }

                validateTag(rcElements[0], "CertificateListContent.revokedCertificates[#].serialNumber",
                    [ ASN1TagClass.universal ],
                    [ ASN1Construction.primitive ],
                    [ ASN1UniversalType.octetString ],
                );
                validateTag(rcElements[1], "CertificateListContent.revokedCertificates[#].revocationDate",
                    [ ASN1TagClass.universal ],
                    [ ASN1Construction.primitive ],
                    [ ASN1UniversalType.utcTime, ASN1UniversalType.generalizedTime ],
                );

                const serialNumber: Uint8Array = rcElements[0].octetString;
                const revocationDate: Date = ((): Date => {
                    if (rcElements[1].tagNumber === ASN1UniversalType.generalizedTime) {
                        return rcElements[1].generalizedTime;
                    } else if (rcElements[1].tagNumber === ASN1UniversalType.utcTime) {
                        return rcElements[1].utcTime;
                    } else {
                        throw new errors.X509Error(
                            "CertificateListContent.revokedCertificates[#].revocationDate was not a Time type.",
                        );
                    }
                })();
                const crlEntryExtensions: Extensions | undefined  = ((): Extensions | undefined => {
                    if (
                        rcElements[2].tagClass !== ASN1TagClass.universal
                        || rcElements[2].construction !== ASN1Construction.constructed
                        || rcElements[2].tagNumber !== ASN1UniversalType.sequence
                    ) {
                        return undefined;
                    }
                    return rcElements[2].sequence.map(Extension.fromElement);
                })();

                // DERElement.isInCanonicalOrder(
                //     attributeCertificateElements.slice(
                //         encounteredElements,
                //         extensions ? (attributeCertificateElements.length - 1) : undefined
                //     ),
                // );

                // DERElement.isUniquelyTagged(
                //     attributeCertificateElements.slice(
                //         encounteredElements,
                //         extensions ? (attributeCertificateElements.length - 1) : undefined
                //     ),
                // );

                return {
                    serialNumber,
                    revocationDate: revocationDate,
                    crlEntryExtensions,
                }
            });
        }

        let crlExtensions: Extensions | undefined = undefined;
        const lastIndex: number = (attributeCertificateElements.length - 1);
        if (
            attributeCertificateElements[lastIndex].tagClass === ASN1TagClass.context
            && attributeCertificateElements[lastIndex].construction === ASN1Construction.constructed
            && attributeCertificateElements[lastIndex].tagNumber === 0
        ) {
            const crlExtensionsInnerElements: DERElement[] = attributeCertificateElements[lastIndex].sequence;
            if (crlExtensionsInnerElements.length !== 1) {
                throw new errors.X509Error(
                    "CertificateListContent.crlExtensions did not contain only one inner SEQUENCE.",
                );
            }
            validateTag(crlExtensionsInnerElements[0], "CertificateListContent.crlExtensions[0]",
                [ ASN1TagClass.universal ],
                [ ASN1Construction.constructed ],
                [ ASN1UniversalType.sequence ],
            );
            crlExtensions = crlExtensionsInnerElements[0].sequence.map(Extension.fromElement);
        }

        DERElement.isInCanonicalOrder(
            attributeCertificateElements.slice(
                encounteredElements,
                crlExtensions ? (attributeCertificateElements.length - 1) : undefined
            ),
        );

        DERElement.isUniquelyTagged(
            attributeCertificateElements.slice(
                encounteredElements,
                crlExtensions ? (attributeCertificateElements.length - 1) : undefined
            ),
        );

        return new CertificateListContent(
            ver,
            signature,
            issuer,
            thisUpdate,
            nextUpdate,
            revokedCertificates,
            crlExtensions,
        );
    }

    public toElement (): DERElement {
        const certificateListContentElements: DERElement[] = [];

        const versionElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
        );
        versionElement.integer = this.ver;
        certificateListContentElements.push(versionElement);

        certificateListContentElements.push(this.signature.toElement());
        certificateListContentElements.push(this.issuer.toElement());

        const thisUpdateElement: DERElement = new DERElement();
        if (this.thisUpdate.getFullYear() >= 2050) {
            thisUpdateElement.tagNumber = ASN1UniversalType.generalizedTime;
            thisUpdateElement.generalizedTime = this.thisUpdate;
        } else {
            thisUpdateElement.tagNumber = ASN1UniversalType.utcTime;
            thisUpdateElement.utcTime = this.thisUpdate;
        }
        certificateListContentElements.push(thisUpdateElement);

        if (this.nextUpdate) {
            const nextUpdateElement: DERElement = new DERElement();
            if (this.thisUpdate.getFullYear() >= 2050) {
                nextUpdateElement.tagNumber = ASN1UniversalType.generalizedTime;
                nextUpdateElement.generalizedTime = this.thisUpdate;
            } else {
                nextUpdateElement.tagNumber = ASN1UniversalType.utcTime;
                nextUpdateElement.utcTime = this.thisUpdate;
            }
            certificateListContentElements.push(nextUpdateElement);
        }

        if (this.revokedCertificates) {
            const revokedCertificatesElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.constructed,
                ASN1UniversalType.sequence,
            );

            revokedCertificatesElement.sequence = this.revokedCertificates.map(c => {
                const rcElements: DERElement[] = [];

                const rcElement: DERElement = new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.constructed,
                    ASN1UniversalType.sequence,
                );

                const serialNumberElement: DERElement = new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.primitive,
                    ASN1UniversalType.integer,
                );
                serialNumberElement.octetString = c.serialNumber;
                rcElements.push(serialNumberElement);

                const revocationDateElement: DERElement = new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.primitive,
                    ASN1UniversalType.integer,
                );
                if (c.revocationDate.getFullYear() >= 2050) {
                    revocationDateElement.tagNumber = ASN1UniversalType.generalizedTime;
                    revocationDateElement.generalizedTime = c.revocationDate;
                } else {
                    revocationDateElement.tagNumber = ASN1UniversalType.utcTime;
                    revocationDateElement.utcTime = c.revocationDate;
                }
                rcElements.push(revocationDateElement);

                if (c.crlEntryExtensions) {
                    const crlEntryExtensionsElement: DERElement = new DERElement(
                        ASN1TagClass.universal,
                        ASN1Construction.constructed,
                        ASN1UniversalType.sequence,
                    );
                    crlEntryExtensionsElement.sequence = c.crlEntryExtensions.map(e => e.toElement());
                    rcElements.push(crlEntryExtensionsElement);
                }

                rcElement.sequence = rcElements;
                return rcElement;
            });
            certificateListContentElements.push(revokedCertificatesElement);
        }

        if (this.crlExtensions) {
            const crlExtensionsOuterElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                0,
            );
            const crlExtensionsInnerElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.constructed,
                ASN1UniversalType.sequence,
            );
            crlExtensionsInnerElement.sequence = this.crlExtensions.map(e => e.toElement());
            crlExtensionsOuterElement.sequence = [ crlExtensionsInnerElement ];
            certificateListContentElements.push(crlExtensionsOuterElement);
        }

        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        ret.sequence = certificateListContentElements;
        return ret;
    }

    public fromBytes (value: Uint8Array): CertificateListContent {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return CertificateListContent.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}

