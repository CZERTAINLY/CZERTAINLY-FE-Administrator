import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import GeneralNames from "./GeneralNames";
import * as errors from "../errors";

// AuthorityKeyIdentifier ::= SEQUENCE {
//     keyIdentifier              [0]  KeyIdentifier OPTIONAL,
//     authorityCertIssuer        [1]  GeneralNames OPTIONAL,
//     authorityCertSerialNumber  [2]  CertificateSerialNumber OPTIONAL,
//     ...
//   }
//   (WITH COMPONENTS {
//      ...,
//      authorityCertIssuer        PRESENT,
//      authorityCertSerialNumber  PRESENT
//    } |
//    WITH COMPONENTS {
//      ...,
//      authorityCertIssuer        ABSENT,
//      authorityCertSerialNumber  ABSENT
//    })

//   KeyIdentifier ::= OCTET STRING

export default
class AuthorityKeyIdentifier {
    constructor (
        readonly keyIdentifier: Uint8Array,
        readonly authorityCertIssuer? : GeneralNames,
        readonly authorityCertSerialNumber? : Uint8Array
    ) {}

    public static fromElement (value: DERElement): AuthorityKeyIdentifier {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on AuthorityKeyIdentifier");
        case -2: throw new errors.X509Error("Invalid construction on AuthorityKeyIdentifier");
        case -3: throw new errors.X509Error("Invalid tag number on AuthorityKeyIdentifier");
        default: throw new errors.X509Error("Undefined error when validating AuthorityKeyIdentifier tag");
        }

        const authorityKeyIdentifierElements: DERElement[] = value.sequence;

        if (
            authorityKeyIdentifierElements.length !== 1
            && authorityKeyIdentifierElements.length !== 3
        ) throw new errors.X509Error("Invalid number of elements in AuthorityKeyIdentifier");

        // keyIdentifier
        switch (authorityKeyIdentifierElements[0].validateTag(
            [ ASN1TagClass.context ],
            [ ASN1Construction.primitive ],
            [ 0 ])
        ) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on AuthorityKeyIdentifier.keyIdentifier");
        case -2: throw new errors.X509Error("Invalid construction on AuthorityKeyIdentifier.keyIdentifier");
        case -3: throw new errors.X509Error("Invalid tag number on AuthorityKeyIdentifier.keyIdentifier");
        default: throw new errors.X509Error("Undefined error when validating AuthorityKeyIdentifier.keyIdentifier tag");
        }

        const keyIdentifier: Uint8Array = authorityKeyIdentifierElements[0].octetString;
        let authorityCertIssuer: GeneralNames | undefined;
        let authorityCertSerialNumber: Uint8Array | undefined;

        if (authorityKeyIdentifierElements.length === 3) {
            // authorityCertIssuer
            switch (authorityKeyIdentifierElements[1].validateTag(
                [ ASN1TagClass.context ],
                [ ASN1Construction.constructed ],
                [ 1 ])
            ) {
            case 0: break;
            case -1: throw new errors.X509Error("Invalid tag class on AuthorityKeyIdentifier.authorityCertIssuer");
            case -2: throw new errors.X509Error("Invalid construction on AuthorityKeyIdentifier.authorityCertIssuer");
            case -3: throw new errors.X509Error("Invalid tag number on AuthorityKeyIdentifier.authorityCertIssuer");
            default: {
                throw new errors.X509Error(
                    "Undefined error when validating AuthorityKeyIdentifier.authorityCertIssuer tag"
                );
            }
            }

            // authorityCertSerialNumber
            switch (authorityKeyIdentifierElements[2].validateTag(
                [ ASN1TagClass.context ],
                [ ASN1Construction.primitive ],
                [ 2 ])
            ) {
            case 0: break;
            case -1: {
                throw new errors.X509Error("Invalid tag class on AuthorityKeyIdentifier.authorityCertSerialNumber");
            }
            case -2: {
                throw new errors.X509Error("Invalid construction on AuthorityKeyIdentifier.authorityCertSerialNumber");
            }
            case -3: {
                throw new errors.X509Error("Invalid tag number on AuthorityKeyIdentifier.authorityCertSerialNumber");
            }
            default: {
                throw new errors.X509Error(
                    "Undefined error when validating AuthorityKeyIdentifier.authorityCertSerialNumber tag"
                );
            }
            }

            authorityCertIssuer = authorityKeyIdentifierElements[1].sequence;
            authorityCertSerialNumber = authorityKeyIdentifierElements[2].octetString;
        }

        return new AuthorityKeyIdentifier(
            keyIdentifier,
            authorityCertIssuer,
            authorityCertSerialNumber
        );
    }

    public toElement (): DERElement {
        const authorityKeyIdentifierElements: DERElement[] = [];

        const keyIdentifierElement: DERElement = new DERElement(
            ASN1TagClass.context,
            ASN1Construction.primitive,
            0
        );
        keyIdentifierElement.octetString = this.keyIdentifier;
        authorityKeyIdentifierElements.push(keyIdentifierElement);

        if (
            (this.authorityCertIssuer && !this.authorityCertSerialNumber)
            || (!this.authorityCertIssuer && this.authorityCertSerialNumber)
        ) {
            throw new errors.X509Error(
                "AuthorityKeyIdentifer must have both authorityCertIssuer and "
                + "authorityCertSerialNumber PRESENT or ABSENT.",
            );
        } else if (this.authorityCertIssuer && this.authorityCertSerialNumber) {
            const authorityCertIssuer: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                1
            );

            const authorityCertSerialNumber: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                2
            );

            authorityKeyIdentifierElements.push(authorityCertIssuer);
            authorityKeyIdentifierElements.push(authorityCertSerialNumber);
        }

        const authorityKeyIdentifierElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        authorityKeyIdentifierElement.sequence = authorityKeyIdentifierElements;
        return authorityKeyIdentifierElement;
    }

    public static fromBytes (value: Uint8Array): AuthorityKeyIdentifier {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return AuthorityKeyIdentifier.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
