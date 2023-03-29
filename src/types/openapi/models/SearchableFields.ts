// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 1.6.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @enum {string}
 */
export enum SearchableFields {
    CommonName = "commonName",
    SerialNumber = "serialNumber",
    RaProfileName = "raProfile.name",
    Entity = "entity",
    Status = "status",
    ComplianceStatus = "complianceStatus",
    GroupName = "group.name",
    Owner = "owner",
    IssuerCommonName = "issuerCommonName",
    SignatureAlgorithm = "signatureAlgorithm",
    Fingerprint = "fingerprint",
    NotAfter = "notAfter",
    NotBefore = "notBefore",
    PublicKeyAlgorithm = "publicKeyAlgorithm",
    KeySize = "keySize",
    KeyUsage = "keyUsage",
    BasicConstraints = "basicConstraints",
    Meta = "meta",
    SubjectAlternativeNames = "subjectAlternativeNames",
    SubjectDn = "subjectDn",
    IssuerDn = "issuerDn",
    IssuerSerialNumber = "issuerSerialNumber",
    OcspValidation = "ocspValidation",
    CrlValidation = "crlValidation",
    SignatureValidation = "signatureValidation",
    Name = "name",
    CryptographicKeyGroupName = "cryptographicKey.group.name",
    CryptographicKeyOwner = "cryptographicKey.owner",
    CryptographicKeyTokenProfileName = "cryptographicKey.tokenProfile.name",
    CryptographicKeyTokenInstanceReferenceName = "cryptographicKey.tokenInstanceReference.name",
    Type = "type",
    Format = "format",
    State = "state",
    Length = "length",
    Usage = "usage",
    CryptographicAlgorithm = "cryptographicAlgorithm",
}
