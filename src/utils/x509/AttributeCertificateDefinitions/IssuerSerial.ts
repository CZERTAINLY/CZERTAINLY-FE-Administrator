import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import GeneralNames from "../CertificateExtensions/GeneralNames";
import CertificateSerialNumber from "../AuthenticationFramework/CertificateSerialNumber";
import UniqueIdentifier from "../SelectedAttributeTypes/Version8/UniqueIdentifier";
import validateTag from "../validateTag";

// IssuerSerial ::= SEQUENCE {
//     issuer     GeneralNames,
//     serial     CertificateSerialNumber,
//     issuerUID  UniqueIdentifier OPTIONAL,
//     ... }
// GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
// CertificateSerialNumber ::= INTEGER
// UniqueIdentifier ::= BIT STRING

export default
class IssuerSerial {
    constructor (
        readonly issuer: GeneralNames,
        readonly serial: CertificateSerialNumber,
        readonly issuerUID?: UniqueIdentifier,
    ) {}

    public static fromElement (value: DERElement): IssuerSerial {
        validateTag(value, "IssuerElement",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ],
        );
        const issuerSerialElements: DERElement[] = value.sequence;
        if (issuerSerialElements.length < 2 || issuerSerialElements.length > 3) {
            throw new errors.X509Error(
                `Invalid number of elements in IssuerSerial: ${issuerSerialElements.length}`,
            );
        }
        validateTag(issuerSerialElements[0], "IssuerSerial.issuer",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        );
        validateTag(issuerSerialElements[1], "IssuerSerial.serial",
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.integer ]
        );

        if (issuerSerialElements.length === 3) {
            validateTag(issuerSerialElements[2], "IssuerSerial.issuerUID",
                [ ASN1TagClass.universal ],
                [ ASN1Construction.primitive ],
                [ ASN1UniversalType.bitString ]
            );
        }

        const issuer: GeneralNames = issuerSerialElements[0].sequence;
        if (issuer.length < 1) {
            throw new errors.X509Error("No GeneralNames provided in IssuerSerial.issuer.");
        }
        const serial: CertificateSerialNumber = issuerSerialElements[1].octetString;
        const issuerUID: UniqueIdentifier | undefined = ((): UniqueIdentifier | undefined => {
            if (issuerSerialElements.length === 3) return issuerSerialElements[2].bitString;
            else return undefined;
        })();

        return new IssuerSerial(issuer, serial, issuerUID);
    }

    public toElement (): DERElement {
        const issuerSerialElements: DERElement[] = [];

        const issuerElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        issuerElement.sequence = this.issuer;
        issuerSerialElements.push(issuerElement);

        const serialElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
        );
        serialElement.value = this.serial.subarray(0);
        issuerSerialElements.push(serialElement);

        if (this.issuerUID) {
            const issuerUIDElement: DERElement = new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                ASN1UniversalType.bitString,
            );
            issuerUIDElement.bitString = this.issuerUID;
            issuerSerialElements.push(issuerUIDElement);
        }

        const issuerSerialElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence,
        );
        issuerSerialElement.sequence = issuerSerialElements;
        return issuerSerialElement;
    }

    public static fromBytes (value: Uint8Array): IssuerSerial {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return IssuerSerial.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
