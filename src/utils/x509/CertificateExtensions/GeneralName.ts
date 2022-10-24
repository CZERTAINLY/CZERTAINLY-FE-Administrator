import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import EDIPartyName from "./EDIPartyName";
import { RDNSequence } from "../InformationFramework";
import * as errors from "../errors";

// GeneralName ::= CHOICE {
//   otherName                  [0]  INSTANCE OF OTHER-NAME,
//   rfc822Name                 [1]  IA5String,
//   dNSName                    [2]  IA5String,
//   x400Address                [3]  ORAddress,
//   directoryName              [4]  Name,
//   ediPartyName               [5]  EDIPartyName,
//   uniformResourceIdentifier  [6]  IA5String,
//   iPAddress                  [7]  OCTET STRING,
//   registeredID               [8]  OBJECT IDENTIFIER,
//   ...
// }

// OTHER-NAME ::= TYPE-IDENTIFIER

// From ITU X.681:
// TYPE-IDENTIFIER ::= CLASS {
//     &id OBJECT IDENTIFIER UNIQUE,
//     &Type }
//     WITH SYNTAX {&Type IDENTIFIED BY &id}

// I had to go to WIKIPEDIA to get this freaking abbreviation, because I could
// not find it in the X.400 specifications:
// "An X.400 address is technically referred to as an Originator/Recipient (OR)
// address."

// ORAddress ::= SEQUENCE {
//     built-in-standard-attributes        BuiltInStandardAttributes,
//     built-in-domain-defined-attributes  BuiltInDomainDefinedAttributes OPTIONAL,
//     -- see also teletex-domain-defined-attributes
//     extension-attributes                ExtensionAttributes OPTIONAL
//   }

//   --	The OR-address is semantically absent from the OR-name if the built-in-standard-attribute
//   --	sequence is empty and the built-in-domain-defined-attributes and extension-attributes are both omitted.
//   --	Built-in Standard Attributes
//   BuiltInStandardAttributes ::= SEQUENCE {
//     country-name                CountryName OPTIONAL,
//     administration-domain-name  AdministrationDomainName OPTIONAL,
//     network-address             [0]  NetworkAddress OPTIONAL,
//     -- see also extended-network-address
//     terminal-identifier         [1]  TerminalIdentifier OPTIONAL,
//     private-domain-name         [2]  PrivateDomainName OPTIONAL,
//     organization-name           [3]  OrganizationName OPTIONAL,
//     -- see also teletex-organization-name
//     numeric-user-identifier     [4]  NumericUserIdentifier OPTIONAL,
//     personal-name               [5]  PersonalName OPTIONAL,
//     -- see also teletex-personal-name
//     organizational-unit-names   [6]  OrganizationalUnitNames OPTIONAL
//     -- see also teletex-organizational-unit-names
//   }

// BuiltInDomainDefinedAttributes ::=
//   SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//     BuiltInDomainDefinedAttribute

// BuiltInDomainDefinedAttribute ::= SEQUENCE {
//   type   PrintableString(SIZE (1..ub-domain-defined-attribute-type-length)),
//   value  PrintableString(SIZE (1..ub-domain-defined-attribute-value-length))
// }

// ExtensionAttributes ::=
//   SET SIZE (1..ub-extension-attributes) OF ExtensionAttribute

// ExtensionAttribute ::= SEQUENCE {
//   extension-attribute-type
//     [0]  EXTENSION-ATTRIBUTE.&id({ExtensionAttributeTable}),
//   extension-attribute-value
//     [1]  EXTENSION-ATTRIBUTE.&Type
//            ({ExtensionAttributeTable}{@extension-attribute-type})
// }

// EXTENSION-ATTRIBUTE ::= CLASS {
//   &id    INTEGER(0..ub-extension-attributes) UNIQUE,
//   &Type
// }WITH SYNTAX {&Type
//               IDENTIFIED BY &id
// }

// EDIPartyName ::= SEQUENCE {
//     nameAssigner  [0]  UnboundedDirectoryString OPTIONAL,
//     partyName     [1]  UnboundedDirectoryString,
//     ...
//   }

// toString()
// UnboundedDirectoryString ::= CHOICE {
//     teletexString    TeletexString(SIZE (1..MAX)),
//     printableString  PrintableString(SIZE (1..MAX)),
//     bmpString        BMPString(SIZE (1..MAX)),
//     universalString  UniversalString(SIZE (1..MAX)),
//     uTF8String       UTF8String(SIZE (1..MAX)) }

type GeneralName = DERElement;
export default GeneralName;

export
function printGeneralName (value: DERElement): string {
    if (value.tagClass !== ASN1TagClass.context) return "";
    switch (value.tagNumber) {
    case (0): { // otherName
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.external ])
        ) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on INSTANCE OF OTHER-NAME");
        case -2: throw new errors.X509Error("Invalid construction on INSTANCE OF OTHER-NAME");
        case -3: throw new errors.X509Error("Invalid tag number on INSTANCE OF OTHER-NAME");
        default: throw new errors.X509Error("Undefined error when validating INSTANCE OF OTHER-NAME tag");
        }

        const otherNameElements: DERElement[] = value.sequence;
        if (otherNameElements.length !== 2) {
            throw new errors.X509Error("Invalid number of elements in INSTANCE OF OTHER-NAME");
        }

        switch (otherNameElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ])
        ) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on OTHER-NAME.id");
        case -2: throw new errors.X509Error("Invalid construction on OTHER-NAME.id");
        case -3: throw new errors.X509Error("Invalid tag number on OTHER-NAME.id");
        default: throw new errors.X509Error("Undefined error when validating OTHER-NAME.id tag");
        }

        return `otherName:${otherNameElements[0].objectIdentifier}:${otherNameElements[1].value}`;
    }
    case (1): { // rfc822Name
        return `rfc822Name:${value.ia5String}`;
    }
    case (2): { // dNSName
        return `dnsName:${value.ia5String}`;
    }
    /**
         * From https://en.wikipedia.org/wiki/X.400:
         * The standards themselves originally did not specify how these email
         * addresses should be written (for instance on a business card) or
         * even whether the field identifiers should be upper or lower case, or
         * what character sets were allowed. RFC 1685 specified one encoding,
         * based on a 1993 draft of ITU-T Recommendation F.401, which looked
         * like: "G=Harald;S=Alvestrand;O=Uninett;PRMD=Uninett;A=;C=no"
         */
    case (3): { // x400Address
        return ""; // TODO:
    }
    case (4): { // directoryName
        const rdn: RDNSequence = RDNSequence.fromElement(value);
        return rdn.toString();
    }
    case (5): { // ediPartyName
        const epn: EDIPartyName = EDIPartyName.fromElement(value);
        return `ediPartyName:${epn.partyName}`;
    }
    case (6): { // uniformResourceIdentifier
        return `uniformResourceIdentifier:${value.ia5String}`;
    }
    case (7): { // iPAddress
        return `iPAddress:${value.octetString}`;
    }
    case (8): { // registeredID
        return `registeredID:${value.objectIdentifier}`;
    }
    default: return "UNKNOWN NAME SYNTAX";
    }
}
