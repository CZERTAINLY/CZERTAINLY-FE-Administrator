import CertificateAttributes from "components/CertificateAttributes";
import Widget from "components/Widget";
import { CertificateDetailResponseModel } from "types/certificate";
import {
    CertificateRequestDtoCertificateRequestFormatEnum,
    CertificateState,
    CertificateType,
    CertificateValidationStatus,
    ComplianceStatus,
} from "types/openapi";
import "../../src/resources/styles/theme.scss";
const cert: CertificateDetailResponseModel = {
    uuid: "9681f2d6-ba06-4d71-81f0-8d8d63d7b494",
    commonName: "demo.3key.test",
    serialNumber: "18000002d184a284af0c9ec3c20000000002d1",
    issuerCommonName: "Demo MS Sub CA",
    issuerDn: "O=3Key Company s.r.o., CN=Demo MS Sub CA",
    subjectDn: "CN=demo.3key.test",
    notBefore: "2023-08-30T11:29:55.000+00:00",
    notAfter: "2025-08-29T11:29:55.000+00:00",
    publicKeyAlgorithm: "RSA",
    signatureAlgorithm: "SHA512withRSA",
    keySize: 2048,
    trustedCa: true,
    state: CertificateState.Issued,
    validationStatus: CertificateValidationStatus.Valid,
    // status: CertificateStatus.Valid,
    raProfile: {
        uuid: "cee6bfee-850f-4033-87e5-2708d13c3bcb",
        name: "ms-adcs-webserver",
        enabled: true,
        authorityInstanceUuid: "e244af09-f043-4db9-8f73-3201d3ab87b9",
    },
    fingerprint: "d9c27d9cc937357833af4bbf80dbea26b7814adbe38dafce337ac51aae9627d7",
    owner: "acme",
    ownerUuid: "36e3edcf-2a11-4c52-a5fb-da00c753288c",
    certificateType: CertificateType.X509,
    issuerSerialNumber: "656879dc6dfcc35c431488317ddb331f486a3847",
    complianceStatus: ComplianceStatus.Ok,
    // issuerCertificateUuid: "14406aa5-99c0-44d8-bd70-c4b00e4f6489",
    privateKeyAvailability: false,
    extendedKeyUsage: ["1.3.6.1.5.5.7.3.1"],
    keyUsage: ["digitalSignature", "keyEncipherment"],
    basicConstraints: "Subject Type=End Entity",
    metadata: [],
    certificateContent:
        "MIIFPTCCAyWgAwIBAgITGAAAAtGEooSvDJ7DwgAAAAAC0TANBgkqhkiG9w0BAQ0FADA3MRcwFQYDVQQDDA5EZW1vIE1TIFN1YiBDQTEcMBoGA1UECgwTM0tleSBDb21wYW55IHMuci5vLjAeFw0yMzA4MzAxMTI5NTVaFw0yNTA4MjkxMTI5NTVaMBkxFzAVBgNVBAMTDmRlbW8uM2tleS50ZXN0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlTyqOzXfWzlfiBc5HqmW6safyZnB57cJwlLakJqc17VoZXdxxs3kpk2xQnonVFAVIxfjjJRw502phJvtYT1lwFP2IYwG0wtsJV39pCkigcwT/IWbBtvHfUYJCte1NRoSmiA6AVcyQO4+TEMzrKG7appdz+ny8FecVTuy7maUvBb07aiUD0UWQZWkjj7wCJURd/QxxqJispSsxGlWQK46gT5Wrz3sTlhqn1BxeXpIcz2oalpJD3TMh/AejL4oqQqKeNBEza+riscTJZiDAysTC3zpo4ifo/+1B3zFbNOpE4F3ZthgUYiPhcBOCieuALVO6fqDNzXL9Fvkk74AApka1QIDAQABo4IBXjCCAVowKAYDVR0RBCEwH4IOZGVtby4za2V5LnRlc3SCDXd3dy4za2V5LnRlc3QwHQYDVR0OBBYEFMUpu86iuKwXsPKmsvZyzr/z5e0GMB8GA1UdIwQYMBaAFJLCvN9VxcGThUkH96zJHQtoAQdRME0GA1UdHwRGMEQwQqBAoD6GPGh0dHA6Ly9sYWIwMi4za2V5LmNvbXBhbnkvY3Jscy9kZW1vL0RlbW8lMjBNUyUyMFN1YiUyMENBLmNybDBXBggrBgEFBQcBAQRLMEkwRwYIKwYBBQUHMAGGO2h0dHA6Ly9sYWIwMi4za2V5LmNvbXBhbnkvY2FzL2RlbW8vRGVtbyUyME1TJTIwU3ViJTIwQ0EuY3J0MCEGCSsGAQQBgjcUAgQUHhIAVwBlAGIAUwBlAHIAdgBlAHIwDgYDVR0PAQH/BAQDAgWgMBMGA1UdJQQMMAoGCCsGAQUFBwMBMA0GCSqGSIb3DQEBDQUAA4ICAQBxvOkkS85leihFVQeDFc003HCOB+VIqEJcjRvRec4bOimp0rlfJuXVlcYscuvN0PLITlQCcZQRZpAlYmpjnjVX6e5qxjBCbEFQJ1Vj6fsK7AD+mlbfdgUji/ldy8nwSgmKocnhRG2h6W1Z6FO+J7VO0IZkCkuA9jSsY0EY2FC+dkuvDJQriKvSZISqPd6AEWcGMRrwqSNjgfTm+i25ZktLy5ErohAzeypb/cevFriZiGMg2jDrQe3df9eU7+hOZFNP1jjAE5prfUbgGB5d0Hsq/lqEiOF3pXbAMjAyFmk+GKroa+WGYqKC5ADQ2tKZMNiwcl7ZqWzmyCI/ywtuQXJn1leHQRldI3101mOWlXwnmMG0c4jlSQjdLtqYQh0VCOfsWuE5Qal/okDcyYNbMlKeWL9sRir9hwxKQ6bH+6zoZl6a/E+r/treAqlNeAg7sssQpBb2XWrfikW+1xCxBKy714GPddsiflOz/5wLEsczJ7o7OOaJD7mn4rBUvggwWfaWDRLQEDMeX776x4qe05pYze0VeFe67PTBmrOSD/uL3UQI6X7aKQ7C+cUJiSD+hGxofrVYopFaEZPwAiVNrl7Fj77FRo6xhpOp+mx8O15GRajWrQiz0JDdQFRrZr2XwTNV6458G74agXm15nTrddXTmt3YPcztrhiqADWo5B4mxg==",
    subjectAlternativeNames: {
        registeredID: [],
        ediPartyName: [],
        iPAddress: [],
        x400Address: [],
        rfc822Name: [],
        otherName: [],
        dNSName: ["demo.3key.test", "www.3key.test"],
        directoryName: [],
        uniformResourceIdentifier: [],
    },
    nonCompliantRules: [],
    customAttributes: [],
    certificateRequest: {
        certificateType: CertificateType.X509,
        certificateRequestFormat: CertificateRequestDtoCertificateRequestFormatEnum.Pkcs10,
        publicKeyAlgorithm: "RSA",
        signatureAlgorithm: "SHA256withRSA",
        content:
            "MIICmTCCAYECAQAwGTEXMBUGA1UEAxMOZGVtby4za2V5LnRlc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCVPKo7Nd9bOV+IFzkeqZbqxp/JmcHntwnCUtqQmpzXtWhld3HGzeSmTbFCeidUUBUjF+OMlHDnTamEm+1hPWXAU/YhjAbTC2wlXf2kKSKBzBP8hZsG28d9RgkK17U1GhKaIDoBVzJA7j5MQzOsobtqml3P6fLwV5xVO7LuZpS8FvTtqJQPRRZBlaSOPvAIlRF39DHGomKylKzEaVZArjqBPlavPexOWGqfUHF5ekhzPahqWkkPdMyH8B6MviipCop40ETNr6uKxxMlmIMDKxMLfOmjiJ+j/7UHfMVs06kTgXdm2GBRiI+FwE4KJ64AtU7p+oM3Ncv0W+STvgACmRrVAgMBAAGgOzA5BgkqhkiG9w0BCQ4xLDAqMCgGA1UdEQQhMB+CDmRlbW8uM2tleS50ZXN0gg13d3cuM2tleS50ZXN0MA0GCSqGSIb3DQEBCwUAA4IBAQBHgeFe/yAgdAXQKraF/KvcwjsNfznTVLg+0nieUuFipJoCWZJDGwfZWTgtpXdOnNV5aAcwmeCb7gg7HMIAuMfF1gyoposn7IPmn/U+6Tfa0g+ylpQskyrfjKr3bGngFAg1ZqT9kC/0llkpJsplpjEm1VjExSKu8VeRBg5FksEZq+OksIuU/tg4LpnDtqO+JOE/nVrXmt69/QbAcbBFjcrp79gBwlH+KZGeYYHSOOa+2y1yDZxNIQgpFv8fsbRXgK5LnZeyI2kjlxnSa/er3ZQPT6BEB6zi4lwY0otDiDV5ylKC/J7mbQtU22mjVCM8r1LAz7GE9ymMAOtu7wpK9m+I",
        commonName: "demo.3key.test",
        subjectDn: "CN=demo.3key.test",
        subjectAlternativeNames: {
            registeredID: [],
            ediPartyName: [],
            iPAddress: [],
            x400Address: [],
            rfc822Name: [],
            otherName: [],
            dNSName: ["demo.3key.test", "www.3key.test"],
            directoryName: [],
            uniformResourceIdentifier: [],
        },
        attributes: [],
        signatureAttributes: [],
    },
    issueAttributes: [],
    revokeAttributes: [],
    relatedCertificates: [],
};

const TestCertificateAttributes = () => {
    return (
        <Widget title="Certificate Attributes">
            <CertificateAttributes certificate={cert} />
        </Widget>
    );
};

describe("CertificateAttributes component", () => {
    it("should render certificate attributes", () => {
        cy.mount(<TestCertificateAttributes />);
        cy.get("h5").should("have.text", "Certificate Attributes");
        cy.wait(500);
    });
});
