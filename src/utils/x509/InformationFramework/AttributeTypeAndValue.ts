import { DERElement,ObjectIdentifier, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import UnboundedDirectoryString from "../SelectedAttributeTypes/Version8/UnboundedDirectoryString";
import * as errors from "../errors";

// AttributeTypeAndValue ::= SEQUENCE {
//   type                  ATTRIBUTE.&id({SupportedAttributes}),
//   value                 ATTRIBUTE.&Type({SupportedAttributes}{@type}),
//   ... }

// ATTRIBUTE ::= CLASS {
//     &derivation               ATTRIBUTE OPTIONAL,
//     &Type                     OPTIONAL, -- either &Type or &derivation required
//     &equality-match           MATCHING-RULE OPTIONAL,
//     &ordering-match           MATCHING-RULE OPTIONAL,
//     &substrings-match         MATCHING-RULE OPTIONAL,
//     &single-valued            BOOLEAN DEFAULT FALSE,
//     &collective               BOOLEAN DEFAULT FALSE,
//     &dummy                    BOOLEAN DEFAULT FALSE,
//     -- operational extensions
//     &no-user-modification     BOOLEAN DEFAULT FALSE,
//     &usage                    AttributeUsage DEFAULT userApplications,
//     &ldapSyntax               SYNTAX-NAME.&id OPTIONAL,
//     &ldapName                 SEQUENCE SIZE(1..MAX) OF UTF8String OPTIONAL,
//     &ldapDesc                 UTF8String OPTIONAL,
//     &obsolete                 BOOLEAN DEFAULT FALSE,
//     &id                       OBJECT IDENTIFIER UNIQUE }
//   WITH SYNTAX {
//     [SUBTYPE OF               &derivation]
//     [WITH SYNTAX              &Type]
//     [EQUALITY MATCHING RULE   &equality-match]
//     [ORDERING MATCHING RULE   &ordering-match]
//     [SUBSTRINGS MATCHING RULE &substrings-match]
//     [SINGLE VALUE             &single-valued]
//     [COLLECTIVE               &collective]
//     [DUMMY                    &dummy]
//     [NO USER MODIFICATION     &no-user-modification]
//     [USAGE                    &usage]
//     [LDAP-SYNTAX              &ldapSyntax]
//     [LDAP-NAME                &ldapName]
//     [LDAP-DESC                &ldapDesc]
//     [OBSOLETE                 &obsolete]
//     ID                        &id }

// MATCHING-RULE ::= CLASS {
//     &ParentMatchingRules    MATCHING-RULE OPTIONAL,
//     &AssertionType          OPTIONAL,
//     &uniqueMatchIndicator   ATTRIBUTE OPTIONAL,
//     &ldapSyntax             SYNTAX-NAME.&id OPTIONAL,
//     &ldapName               SEQUENCE SIZE(1..MAX) OF UTF8String OPTIONAL,
//     &ldapDesc               UTF8String OPTIONAL,
//     &id                     OBJECT IDENTIFIER UNIQUE }
//   WITH SYNTAX {
//     [PARENT                 &ParentMatchingRules]
//     [SYNTAX                 &AssertionType]
//     [UNIQUE-MATCH-INDICATOR &uniqueMatchIndicator]
//     [LDAP-SYNTAX            &ldapSyntax]
//     [LDAP-NAME              &ldapName]
//     [LDAP-DESC              &ldapDesc]
//     ID                      &id }

// SYNTAX-NAME ::= CLASS {
//     &ldapDesc               UTF8String,
//     &Type                   OPTIONAL,
//     &id                     OBJECT IDENTIFIER UNIQUE }
//   WITH SYNTAX {
//     LDAP-DESC               &ldapDesc
//     [DIRECTORY SYNTAX       &Type]
//     ID                      &id }

export default
class AttributeTypeAndValue {
    constructor (
        readonly type: ObjectIdentifier,
        readonly value: DERElement
    ) {}

    public static escapeDirectoryCharacters (unescaped: string): string {
        // REVIEW: Will this replace all occurences?
        return unescaped.replace(",", "\\,").replace("+", "\\+");
    }

    public toString (): string {
        const oidString: string = this.type.toString();
        if (
            oidString in AttributeTypeAndValue.attributeToNameMapping
            && oidString in AttributeTypeAndValue.attributeToValuePrinterMapping
        ) {
            const attributeNameString: string = AttributeTypeAndValue.attributeToNameMapping[oidString];
            const valueString: string
                = AttributeTypeAndValue.escapeDirectoryCharacters(
                    AttributeTypeAndValue.attributeToValuePrinterMapping[oidString](this.value)
                );
            return `${attributeNameString}=${valueString}`;
        } else {
            // TODO: Improve this output
            return `${oidString}=${this.value.toBytes()}`;
        }
    }

    public static attributeToNameMapping: { [ oid: string ]: string }= {
        "2.5.4.3": "cn",
        "2.5.4.7.1": "c-l",
        "2.5.4.8.1": "c-st",
        "2.5.4.9.1": "c-street",
        "2.5.4.10.1": "c-o",
        "2.5.4.11.1": "c-ou",
        "2.5.4.16.1": "c-PostalAddress",
        "2.5.4.17.1": "c-PostalCode",
        "2.5.4.18.1": "c-PostOfficeBox",
        "2.5.4.19.1": "c-PhysicalDeliveryOfficeName",
        "2.5.4.20.1": "c-TelephoneNumber",
        "2.5.4.21.1": "c-TelexNumber",
        "2.5.4.23.1": "c-FacsimileTelephoneNumber",
        "2.5.4.25.1": "c-InternationalISDNNumber",
        "2.5.4.2": "knowledgeInformation",
        "2.5.4.4": "sn",
        "2.5.4.5": "serialNumber",
        "2.5.4.6": "c",
        "2.5.4.7": "l",
        "2.5.4.8": "st",
        "2.5.4.9": "streetAddress",
        "2.5.4.10": "o",
        "2.5.4.11": "ou",
        "2.5.4.12": "title",
        "2.5.4.14": "searchGuide",
        "2.5.4.15": "businessCategory",
        "2.5.4.16": "postalAddress",
        "2.5.4.17": "postalCode",
        "2.5.4.18": "postOfficeBox",
        "2.5.4.19": "physicalDeliveryOfficeName",
        "2.5.4.20": "telephoneNumber",
        "2.5.4.21": "telexNumber",
        "2.5.4.22": "teletexTerminalIdentifier",
        "2.5.4.23": "facsimileTelephoneNumber",
        "2.5.4.24": "x121Address",
        "2.5.4.25": "internationaliSDNNumber",
        "2.5.4.26": "registeredAddress",
        "2.5.4.27": "destinationIndicator",
        "2.5.4.28": "preferredDeliveryMethod",
        "2.5.4.29": "presentationAddress",
        "2.5.4.30": "supportedApplicationContext",
        "2.5.4.31": "member",
        "2.5.4.32": "owner",
        "2.5.4.33": "roleOccupant",
        "2.5.4.36": "userCertificate",
        "2.5.4.37": "cACertificate",
        "2.5.4.38": "authorityRevocationList",
        "2.5.4.39": "certificateRevocationList",
        "2.5.4.40": "crossCertificatePair",
        "2.5.4.42": "gn",
        "2.5.4.43": "initials",
        "2.5.4.44": "generationQualifier",
        "2.5.4.45": "x500UniqueIdentifier",
        "2.5.4.46": "dnQualifier",
        "2.5.4.47": "enhancedSearchGuide",
        "2.5.4.48": "protocolInformation",
        "2.5.4.50": "uniqueMember",
        "2.5.4.51": "houseIdentifier",
        "2.5.4.52": "supportedAlgorithms",
        "2.5.4.53": "deltaRevocationList",
        "2.5.4.54": "dmdName",
        "2.5.4.65": "pseudonym",
        "0.9.2342.19200300.100.1.3": "mail",
        "0.9.2342.19200300.100.1.25": "dc",
        "0.9.2342.19200300.100.1.37": "associatedDomain",
        "1.2.840.113549.1.9.1": "emailAddress",
        "0.9.2342.19200300.100.1.2": "textEncodedORAddress",
        "0.9.2342.19200300.100.1.4": "info",
        "0.9.2342.19200300.100.1.5": "favouriteDrink",
        "0.9.2342.19200300.100.1.6": "roomNumber",
        "0.9.2342.19200300.100.1.7": "photo",
        "0.9.2342.19200300.100.1.8": "userClass",
        "0.9.2342.19200300.100.1.9": "host",
        "0.9.2342.19200300.100.1.10": "manager",
        "0.9.2342.19200300.100.1.11": "documentIdentifier",
        "0.9.2342.19200300.100.1.12": "documentTitle",
        "0.9.2342.19200300.100.1.13": "documentVersion",
        "0.9.2342.19200300.100.1.14": "documentAuthor",
        "0.9.2342.19200300.100.1.15": "documentLocation",
        "0.9.2342.19200300.100.1.20": "homeTelephoneNumber",
        "0.9.2342.19200300.100.1.21": "secretary",
        "0.9.2342.19200300.100.1.22": "otherMailbox",
        "0.9.2342.19200300.100.1.26": "aRecord",
        "0.9.2342.19200300.100.1.27": "mDRecord",
        "0.9.2342.19200300.100.1.28": "mXRecord",
        "0.9.2342.19200300.100.1.29": "nSRecord",
        "0.9.2342.19200300.100.1.30": "sOARecord",
        "0.9.2342.19200300.100.1.31": "cNAMERecord",
        "0.9.2342.19200300.100.1.38": "associatedName",
        "0.9.2342.19200300.100.1.39": "homePostalAddress",
        "0.9.2342.19200300.100.1.40": "personalTitle",
        "0.9.2342.19200300.100.1.41": "mobileTelephoneNumber",
        "0.9.2342.19200300.100.1.42": "pagerTelephoneNumber",
        "0.9.2342.19200300.100.1.43": "friendlyCountryName",
        "0.9.2342.19200300.100.1.44": "uniqueIdentifier",
        "0.9.2342.19200300.100.1.45": "organizationalStatus",
        "0.9.2342.19200300.100.1.46": "janetMailbox",
        "0.9.2342.19200300.100.1.47": "mailPreferenceOption",
        "0.9.2342.19200300.100.1.48": "buildingName",
        "0.9.2342.19200300.100.1.49": "dSAQuality",
        "0.9.2342.19200300.100.1.50": "singleLevelQuality",
        "0.9.2342.19200300.100.1.51": "subtreeMinimumQuality",
        "0.9.2342.19200300.100.1.52": "subtreeMaximumQuality",
        "0.9.2342.19200300.100.1.53": "personalSignature",
        "0.9.2342.19200300.100.1.54": "dITRedirect",
        "0.9.2342.19200300.100.1.55": "audio",
        "0.9.2342.19200300.100.1.56": "documentPublisher",
        "2.16.840.1.113730.3.1.1": "carLicense",
        "2.16.840.1.113730.3.1.2": "departmentNumber",
        "2.16.840.1.113730.3.1.241": "displayName",
        "2.16.840.1.113730.3.1.3": "employeeNumber",
        "2.16.840.1.113730.3.1.4": "employeeType",
        "0.9.2342.19200300.100.1.60": "jpegPhoto",
        "2.16.840.1.113730.3.1.39": "preferredLanguage",
        "2.16.840.1.113730.3.1.40": "userSMIMECertificate",
        "2.16.840.1.113730.3.1.216": "userPKCS12",
        "2.16.840.1.113730.3.1.13": "mailLocalAddress",
        "2.16.840.1.113730.3.1.18": "mailHost",
        "2.16.840.1.113730.3.1.47": "mailRoutingAddress",
        "1.3.6.1.4.1.42.2.27.2.1.15": "rfc822MailMember",
        "1.3.6.1.1.1.1.2": "gecos",
        "1.3.6.1.1.1.1.3": "homeDirectory",
        "1.3.6.1.1.1.1.4": "loginShell",
        "1.3.6.1.1.1.1.5": "shadowLastChange",
        "1.3.6.1.1.1.1.6": "shadowMin",
        "1.3.6.1.1.1.1.7": "shadowMax",
        "1.3.6.1.1.1.1.8": "shadowWarning",
        "1.3.6.1.1.1.1.9": "shadowInactive",
        "1.3.6.1.1.1.1.10": "shadowExpire",
        "1.3.6.1.1.1.1.11": "shadowFlag",
        "1.3.6.1.1.1.1.12": "memberUid",
        "1.3.6.1.1.1.1.13": "memberNisNetgroup",
        "1.3.6.1.1.1.1.14": "nisNetgroupTriple",
        "1.3.6.1.1.1.1.15": "ipServicePort",
        "1.3.6.1.1.1.1.16": "ipServiceProtocol",
        "1.3.6.1.1.1.1.17": "ipProtocolNumber",
        "1.3.6.1.1.1.1.18": "oncRpcNumber",
        "1.3.6.1.1.1.1.19": "ipHostNumber",
        "1.3.6.1.1.1.1.20": "ipNetworkNumber",
        "1.3.6.1.1.1.1.21": "ipNetmaskNumber",
        "1.3.6.1.1.1.1.22": "macAddress",
        "1.3.6.1.1.1.1.23": "bootParameter",
        "1.3.6.1.1.1.1.24": "bootFile",
        "1.3.6.1.1.1.1.26": "nisMapName",
        "1.3.6.1.1.1.1.27": "nisMapEntry",
        "2.5.4.72": "role",
        "2.5.4.75": "xmlPrivilegeInfo",
        "2.5.4.58": "attributeCertificateA",
        "2.5.4.61": "aACertificate",
        "2.5.4.62": "attributeDescriptorCertificate",
        "2.5.4.59": "attributeCertificateRevocationList",
        "2.5.4.63": "attributeAuthorityRevocationList",
        "2.5.4.73": "delegationPath",
        "2.5.4.71": "privPolicy",
        "2.5.4.74": "protPrivPolicy",
        "2.5.4.76": "xmlPrivPolicy",
    };

    public static attributeToValuePrinterMapping: { [ oid: string ]: (element: DERElement) => string }= {

        // commonName, cn
        "2.5.4.3": (element: DERElement) => UnboundedDirectoryString.print(element),
        // "2.5.4.7.1": "c-l",
        // "2.5.4.8.1": "c-st",
        // "2.5.4.9.1": "c-street",
        // "2.5.4.10.1": "c-o",
        // "2.5.4.11.1": "c-ou",
        // "2.5.4.16.1": "c-PostalAddress",
        // "2.5.4.17.1": "c-PostalCode",
        // "2.5.4.18.1": "c-PostOfficeBox",
        // "2.5.4.19.1": "c-PhysicalDeliveryOfficeName",
        // "2.5.4.20.1": "c-TelephoneNumber",
        // "2.5.4.21.1": "c-TelexNumber",
        // "2.5.4.23.1": "c-FacsimileTelephoneNumber",
        // "2.5.4.25.1": "c-InternationalISDNNumber",
        // "2.5.4.2": "knowledgeInformation",

        // surName, sn
        "2.5.4.4": (element: DERElement) => UnboundedDirectoryString.print(element),

        // serialNumber
        "2.5.4.5": (element: DERElement) => element.printableString,

        // countryName
        "2.5.4.6": (element: DERElement) => element.printableString,

        // localityName, l
        "2.5.4.7": (element: DERElement) => UnboundedDirectoryString.print(element),

        // stateOrProvinceName, st
        "2.5.4.8": (element: DERElement) => UnboundedDirectoryString.print(element),

        // streetAddress
        "2.5.4.9": (element: DERElement) => UnboundedDirectoryString.print(element),

        // organizationName, o
        "2.5.4.10": (element: DERElement) => UnboundedDirectoryString.print(element),

        // organizationalUnit, ou
        "2.5.4.11": (element: DERElement) => UnboundedDirectoryString.print(element),

        // title
        "2.5.4.12": (element: DERElement) => UnboundedDirectoryString.print(element),
        // "2.5.4.14": "searchGuide",

        // businessCategory
        "2.5.4.15": (element: DERElement) => UnboundedDirectoryString.print(element),

        // "2.5.4.16": "postalAddress", // SEQUENCE

        // postalCode
        "2.5.4.17": (element: DERElement) => UnboundedDirectoryString.print(element),

        // postOfficeBox
        "2.5.4.18": (element: DERElement) => UnboundedDirectoryString.print(element),

        // physicalDeliveryOfficeName
        "2.5.4.19": (element: DERElement) => UnboundedDirectoryString.print(element),

        // telephoneNumber
        "2.5.4.20": (element: DERElement) => element.printableString,

        // "2.5.4.21": "telexNumber", // SEQUENCE
        // "2.5.4.22": "teletexTerminalIdentifier",
        // "2.5.4.23": "facsimileTelephoneNumber", // SEQUENCE

        // x121Address
        "2.5.4.24": (element: DERElement) => element.numericString,

        // internationaliSDNNumber
        "2.5.4.25": (element: DERElement) => element.numericString,

        // "2.5.4.26": "registeredAddress", // SEQUENCE

        // destinationIndicator
        "2.5.4.27": (element: DERElement) => element.printableString,

        // "2.5.4.28": "preferredDeliveryMethod",
        // "2.5.4.29": "presentationAddress",
        // "2.5.4.30": "supportedApplicationContext",
        // "2.5.4.31": "member",
        // "2.5.4.32": "owner",
        // "2.5.4.33": "roleOccupant",
        // "2.5.4.36": "userCertificate",
        // "2.5.4.37": "cACertificate",
        // "2.5.4.38": "authorityRevocationList",
        // "2.5.4.39": "certificateRevocationList",
        // "2.5.4.40": "crossCertificatePair",

        // givenName, gn
        "2.5.4.42": (element: DERElement) => UnboundedDirectoryString.print(element),

        // initials
        "2.5.4.43": (element: DERElement) => UnboundedDirectoryString.print(element),

        // generationQualifier
        "2.5.4.44": (element: DERElement) => UnboundedDirectoryString.print(element),

        // "2.5.4.45": "x500UniqueIdentifier",
        "2.5.4.46": (element: DERElement) => element.printableString,
        // "2.5.4.47": "enhancedSearchGuide", // See http://www.faqs.org/rfcs/rfc2256.html
        // "2.5.4.48": "protocolInformation",
        // "2.5.4.50": "uniqueMember",
        // "2.5.4.51": "houseIdentifier",
        // "2.5.4.52": "supportedAlgorithms",
        // "2.5.4.53": "deltaRevocationList",
        // "2.5.4.54": "dmdName",
        // "2.5.4.65": "pseudonym",
        // "0.9.2342.19200300.100.1.3": "mail",
        // "0.9.2342.19200300.100.1.25": "dc",
        // "0.9.2342.19200300.100.1.37": "associatedDomain",
        // "1.2.840.113549.1.9.1": "emailAddress",
        // "0.9.2342.19200300.100.1.2": "textEncodedORAddress",
        // "0.9.2342.19200300.100.1.4": "info",
        // "0.9.2342.19200300.100.1.5": "favouriteDrink",
        // "0.9.2342.19200300.100.1.6": "roomNumber",
        // "0.9.2342.19200300.100.1.7": "photo",
        // "0.9.2342.19200300.100.1.8": "userClass",
        // "0.9.2342.19200300.100.1.9": "host",
        // "0.9.2342.19200300.100.1.10": "manager",
        // "0.9.2342.19200300.100.1.11": "documentIdentifier",
        // "0.9.2342.19200300.100.1.12": "documentTitle",
        // "0.9.2342.19200300.100.1.13": "documentVersion",
        // "0.9.2342.19200300.100.1.14": "documentAuthor",
        // "0.9.2342.19200300.100.1.15": "documentLocation",
        // "0.9.2342.19200300.100.1.20": "homeTelephoneNumber",
        // "0.9.2342.19200300.100.1.21": "secretary",
        // "0.9.2342.19200300.100.1.22": "otherMailbox",
        // "0.9.2342.19200300.100.1.26": "aRecord",
        // "0.9.2342.19200300.100.1.27": "mDRecord",
        // "0.9.2342.19200300.100.1.28": "mXRecord",
        // "0.9.2342.19200300.100.1.29": "nSRecord",
        // "0.9.2342.19200300.100.1.30": "sOARecord",
        // "0.9.2342.19200300.100.1.31": "cNAMERecord",
        // "0.9.2342.19200300.100.1.38": "associatedName",
        // "0.9.2342.19200300.100.1.39": "homePostalAddress",
        // "0.9.2342.19200300.100.1.40": "personalTitle",
        // "0.9.2342.19200300.100.1.41": "mobileTelephoneNumber",
        // "0.9.2342.19200300.100.1.42": "pagerTelephoneNumber",
        // "0.9.2342.19200300.100.1.43": "friendlyCountryName",
        // "0.9.2342.19200300.100.1.44": "uniqueIdentifier",
        // "0.9.2342.19200300.100.1.45": "organizationalStatus",
        // "0.9.2342.19200300.100.1.46": "janetMailbox",
        // "0.9.2342.19200300.100.1.47": "mailPreferenceOption",
        // "0.9.2342.19200300.100.1.48": "buildingName",
        // "0.9.2342.19200300.100.1.49": "dSAQuality",
        // "0.9.2342.19200300.100.1.50": "singleLevelQuality",
        // "0.9.2342.19200300.100.1.51": "subtreeMinimumQuality",
        // "0.9.2342.19200300.100.1.52": "subtreeMaximumQuality",
        // "0.9.2342.19200300.100.1.53": "personalSignature",
        // "0.9.2342.19200300.100.1.54": "dITRedirect",
        // "0.9.2342.19200300.100.1.55": "audio",
        // "0.9.2342.19200300.100.1.56": "documentPublisher",
        // "2.16.840.1.113730.3.1.1": "carLicense",
        // "2.16.840.1.113730.3.1.2": "departmentNumber",
        // "2.16.840.1.113730.3.1.241": "displayName",
        // "2.16.840.1.113730.3.1.3": "employeeNumber",
        // "2.16.840.1.113730.3.1.4": "employeeType",
        // "0.9.2342.19200300.100.1.60": "jpegPhoto",
        // "2.16.840.1.113730.3.1.39": "preferredLanguage",
        // "2.16.840.1.113730.3.1.40": "userSMIMECertificate",
        // "2.16.840.1.113730.3.1.216": "userPKCS12",
        // "2.16.840.1.113730.3.1.13": "mailLocalAddress",
        // "2.16.840.1.113730.3.1.18": "mailHost",
        // "2.16.840.1.113730.3.1.47": "mailRoutingAddress",
        // "1.3.6.1.4.1.42.2.27.2.1.15": "rfc822MailMember",
        // "1.3.6.1.1.1.1.2": "gecos",
        // "1.3.6.1.1.1.1.3": "homeDirectory",
        // "1.3.6.1.1.1.1.4": "loginShell",
        // "1.3.6.1.1.1.1.5": "shadowLastChange",
        // "1.3.6.1.1.1.1.6": "shadowMin",
        // "1.3.6.1.1.1.1.7": "shadowMax",
        // "1.3.6.1.1.1.1.8": "shadowWarning",
        // "1.3.6.1.1.1.1.9": "shadowInactive",
        // "1.3.6.1.1.1.1.10": "shadowExpire",
        // "1.3.6.1.1.1.1.11": "shadowFlag",
        // "1.3.6.1.1.1.1.12": "memberUid",
        // "1.3.6.1.1.1.1.13": "memberNisNetgroup",
        // "1.3.6.1.1.1.1.14": "nisNetgroupTriple",
        // "1.3.6.1.1.1.1.15": "ipServicePort",
        // "1.3.6.1.1.1.1.16": "ipServiceProtocol",
        // "1.3.6.1.1.1.1.17": "ipProtocolNumber",
        // "1.3.6.1.1.1.1.18": "oncRpcNumber",
        // "1.3.6.1.1.1.1.19": "ipHostNumber",
        // "1.3.6.1.1.1.1.20": "ipNetworkNumber",
        // "1.3.6.1.1.1.1.21": "ipNetmaskNumber",
        // "1.3.6.1.1.1.1.22": "macAddress",
        // "1.3.6.1.1.1.1.23": "bootParameter",
        // "1.3.6.1.1.1.1.24": "bootFile",
        // "1.3.6.1.1.1.1.26": "nisMapName",
        // "1.3.6.1.1.1.1.27": "nisMapEntry",
        // "2.5.4.72": "role",
        // "2.5.4.75": "xmlPrivilegeInfo",
        // "2.5.4.58": "attributeCertificateA",
        // "2.5.4.61": "aACertificate",
        // "2.5.4.62": "attributeDescriptorCertificate",
        // "2.5.4.59": "attributeCertificateRevocationList",
        // "2.5.4.63": "attributeAuthorityRevocationList",
        // "2.5.4.73": "delegationPath",
        // "2.5.4.71": "privPolicy",
        // "2.5.4.74": "protPrivPolicy",
        // "2.5.4.76": "xmlPrivPolicy"
    };

    public static fromElement (value: DERElement): AttributeTypeAndValue {
        const attributeTypeAndValueElements: DERElement[] = value.sequence;
        if (attributeTypeAndValueElements.length !== 2) {
            throw new errors.X509Error("Invalid number of elements in AttributeTypeAndValue");
        }
        switch (attributeTypeAndValueElements[0].validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.primitive ],
            [ ASN1UniversalType.objectIdentifier ])
        ) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on AttributeTypeAndValue.type");
        case -2: throw new errors.X509Error("Invalid construction on AttributeTypeAndValue.type");
        case -3: throw new errors.X509Error("Invalid tag number on AttributeTypeAndValue.type");
        default: throw new errors.X509Error("Undefined error when validating AttributeTypeAndValue.type tag");
        }
        return new AttributeTypeAndValue(
            attributeTypeAndValueElements[0].objectIdentifier,
            attributeTypeAndValueElements[1]
        );
    }

    public toElement (): DERElement {
        const typeElement: DERElement = new DERElement();
        typeElement.tagNumber = ASN1UniversalType.objectIdentifier;
        typeElement.objectIdentifier = this.type;
        const attributeTypeAndValueElement: DERElement = new DERElement();
        attributeTypeAndValueElement.tagClass = ASN1TagClass.universal;
        attributeTypeAndValueElement.construction = ASN1Construction.constructed;
        attributeTypeAndValueElement.tagNumber = ASN1UniversalType.sequence;
        attributeTypeAndValueElement.sequence = [ typeElement, this.value ];
        return attributeTypeAndValueElement;
    }

    public static fromBytes (value: Uint8Array): AttributeTypeAndValue {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return AttributeTypeAndValue.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
