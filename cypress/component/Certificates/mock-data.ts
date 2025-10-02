import { CertificateDetailResponseModel, ValidationCertificateResultModel } from 'types/certificate';
import { EnumItemDto } from 'types/enums';
import {
    CertificateState,
    CertificateType,
    CertificateValidationStatus,
    ComplianceStatus,
    CertificateSubjectType,
    CertificateKeyUsage,
    AttributeContentType,
    AttributeType,
    CertificateRelationsDto,
    CertificateRelationType,
    CertificateDto,
    ComplianceCheckResultDto,
    ComplianceRuleStatus,
    Resource,
    CertificateValidationCheck,
} from 'types/openapi';

export const mockCertificate: CertificateDetailResponseModel = {
    uuid: '2240525d-6a31-4703-878e-9d775e998145',
    commonName: 'aa',
    serialNumber: '18000004bc42c935c40d1694610000000004bc',
    issuerCommonName: 'Demo MS Sub CA',
    issuerDn: 'O=3Key Company s.r.o., CN=Demo MS Sub CA',
    subjectDn: 'CN=aa',
    notBefore: '2025-03-03T11:23:17.000+00:00',
    notAfter: '2027-03-03T11:23:17.000+00:00',
    publicKeyAlgorithm: 'RSA',
    signatureAlgorithm: 'SHA512withRSA',
    hybridCertificate: false,
    keySize: 2048,
    state: CertificateState.Issued,
    validationStatus: CertificateValidationStatus.Valid,
    raProfile: {
        uuid: '0bddee3a-8206-4a1a-a5ec-ee0d25445ab3',
        name: 'czertainly',
        enabled: true,
        authorityInstanceUuid: '7e8fd404-921d-4d9a-a92a-920e196a5112',
    },
    fingerprint: 'd3ca2f534a80110e8601733f101806395b7fc9f90d8afecc3cc7640417459f07',
    owner: 'czertainly-admin',
    ownerUuid: '5fa60bbf-a76c-423e-a701-07f30f3f7450',
    certificateType: CertificateType.X509,
    issuerSerialNumber: '656879dc6dfcc35c431488317ddb331f486a3847',
    complianceStatus: ComplianceStatus.NotChecked,
    issuerCertificateUuid: '9fbd54bf-7233-40d7-93f0-451e98495ce6',
    privateKeyAvailability: false,
    archived: false,
    extendedKeyUsage: ['TLS Web Server Authentication'],
    keyUsage: [CertificateKeyUsage.DigitalSignature, CertificateKeyUsage.KeyEncipherment],
    subjectType: CertificateSubjectType.EndEntity,
    certificateContent:
        'MIIFBzCCAu+gAwIBAgITGAAABLxCyTXEDRaUYQAAAAAEvDANBgkqhkiG9w0BAQ0FADA3MRcwFQYDVQQDDA5EZW1vIE1TIFN1YiBDQTEcMBoGA1UECgwTM0tleSBDb21wYW55IHMuci5vLjAeFw0yNTAzMDMxMTIzMTdaFw0yNzAzMDMxMTIzMTdaMA0xCzAJBgNVBAMTAmFhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0HYXIdL9DMJ4ryv9+2qPD3sz7QLcWXaP8Oz+vLC9LJF/fDdLnycGkqnaO2ddAixq0yeHKf7FMllegmVC4j9pbX/Es/lso3lSs+yTnqX2W5VyrJ48jg/2u5qDyzOeiDp1Oy9iN6aYV0OEpXGR5isLTw/pBcVo7l2LircR3q2p1VH9mCeHhh6yadVONosKf+BHYJPUa2V4EqJXyFc81jy07BdMV4TQnj8HchdJATZvzH2t9wWjK8zeapdTWgXF8RoUD8C9myDInZhcr9SCUjV42D5JxgQkNXS+5k01+DhC4u5UQ2VOUhA+dEhA4Gef3woy6h+A8cHL8FanP3O0wrdW3wIDAQABo4IBNDCCATAwHQYDVR0OBBYEFOhY/Hnl8T/wS2O4b6ao8Kgfu7siMB8GA1UdIwQYMBaAFJLCvN9VxcGThUkH96zJHQtoAQdRME0GA1UdHwRGMEQwQqBAoD6GPGh0dHA6Ly9sYWIwMi4za2V5LmNvbXBhbnkvY3Jscy9kZW1vL0RlbW8lMjBNUyUyMFN1YiUyMENBLmNybDBXBggrBgEFBQcBAQRLMEkwRwYIKwYBBQUHMAGGO2h0dHA6Ly9sYWIwMi4za2V5LmNvbXBhbnkvY2FzL2RlbW8vRGVtbyUyME1TJTIwU3ViJTIwQ0EuY3J0MCEGCSsGAQQBgjcUAgQUHhIAVwBlAGIAUwBlAHIAdgBlAHIwDgYDVR0PAQH/BAQDAgWgMBMGA1UdJQQMMAoGCCsGAQUFBwMBMA0GCSqGSIb3DQEBDQUAA4ICAQBFeX8SHOH3l2wWGGajXqYtJiDV3HHs+iMGai9Q09S68YBGYZDrk1UJPhQcMt+ZBwTVLEEa81x8LIVzo0l8j/kNEjXIBLBdAE6oaqkf3okDOtKMhKyjroHB7O5dkXNAMyqK6VS0y8Gobi5Gvgxu3dzeUHjnBggN43d0DjmCRR3kYozXE/aeQk3B4F8bkcrYBCz39cwY8OJiUGeGi6Ds1EE1Z8Z7o9nVIX8OlqQRkprgXv4xlUhU64w5k4lFm7sTN208kEsp92clUQm03ofsTTjEf3JPQkuz182k2jfnm54sPZLVdSPp6t1aUZAzKE2VI3/Eywo/bcnRVO1g4H2TjQgt2WIV+jNHFbyevV898RI6bdvru26YubXH5gkpTB3FZDONPbRqWKRcWzFJY1KWlFptPKYXYoOYPjX/uOOhXITjqYsqWD/iGYABlNKT7PxA2U2ZBhSxQi+q9iM9nVZGyZC2ufsL0YKtVPFI3gLjAx4jjIZaftj5/M4NseBRjdf2bHWRdO3tv6dBLlbt1CkS6eQrLFL3fGy9Mcxi0SutT1q041IyB/C5N2+k9UcMVzikAnEdOpBC965hpSmJYYEI+zr2naoWNGAidi0cdfpcx5djO25CKg6k/D5VTx4JQeOb3ofTuJZ4g2gENa/zuhHeshD7oeEukmbSiCBEk82o8Vacfw==',
    subjectAlternativeNames: {
        registeredID: [],
        ediPartyName: [],
        iPAddress: [],
        x400Address: [],
        rfc822Name: [],
        otherName: [],
        dNSName: [],
        uniformResourceIdentifier: [],
        directoryName: [],
    },
    nonCompliantRules: [],
    customAttributes: [
        {
            uuid: '92de3778-d990-4d31-9b87-b0086882e2b2',
            name: 'textCustomAttrExecution',
            label: 'textCustomAttrExecution',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            content: [
                {
                    data: 't1',
                },
            ],
        },
    ],
    relatedCertificates: [
        {
            uuid: '7ac2c660-cc33-45b8-a98d-5760bf561ea5',
            commonName: 'cve.3key.company',
            serialNumber: '616f8cb09da14c24e77550595c487921662',
            issuerCommonName: 'R13',
            issuerDn: "CN=R13, O=Let's Encrypt, C=US",
            subjectDn: 'CN=cve.3key.company',
            notBefore: '2025-08-21T08:03:16.000+00:00',
            notAfter: '2025-11-19T08:03:15.000+00:00',
            publicKeyAlgorithm: 'RSA',
            signatureAlgorithm: 'SHA256withRSA',
            hybridCertificate: false,
            keySize: 2048,
            state: CertificateState.Issued,
            validationStatus: CertificateValidationStatus.Invalid,
            fingerprint: '7dd7adfad1566eb42b2262eb5909eecb58e4b80e68412ad8490848a585180972',
            groups: [
                {
                    uuid: '03af02ef-cdac-4943-b8d6-8e55d3466fe8',
                    name: '3key-info',
                    description: 'For the notifications to 3Key',
                    email: 'info@3key.company',
                },
            ],
            certificateType: CertificateType.X509,
            issuerSerialNumber: '5a00f212d8d4b480f3924157ea298305',
            complianceStatus: ComplianceStatus.NotChecked,
            issuerCertificateUuid: '5a47c8a0-14d9-4950-bc31-8e1019e84ff6',
            privateKeyAvailability: false,
            archived: false,
        },
    ],
};

export const mockCertificateRelations: CertificateRelationsDto = {
    certificateUuid: '2240525d-6a31-4703-878e-9d775e998145',
    successorCertificates: [
        {
            uuid: 'ebcd4e0f-a3a2-4080-beac-6c9ea3972768',
            certificateType: CertificateType.X509,
            state: CertificateState.Issued,
            relationType: CertificateRelationType.Replacement,
            commonName: 'test.cve.3key.company',
            subjectDn: 'CN=test.cve.3key.company',
            issuerCommonName: 'R13',
            issuerDn: "CN=R13, O=Let's Encrypt, C=US",
            serialNumber: '50420bbf08248743ece9245917eb84465ac',
            fingerprint: '59b4c812d13542ba3af016c553b994584fccfa7bc65600477834e35bcebee28f',
            publicKeyAlgorithm: 'RSA',
            signatureAlgorithm: 'SHA256withRSA',
            notBefore: '2025-08-21T08:03:25.000+00:00',
            notAfter: '2025-11-19T08:03:24.000+00:00',
        },
        {
            uuid: 'be359e0a-040e-42f3-af82-1a5d488f0629',
            certificateType: CertificateType.X509,
            state: CertificateState.Issued,
            relationType: CertificateRelationType.Replacement,
            commonName: 'csc-api.3key.company',
            subjectDn: 'CN=csc-api.3key.company',
            issuerCommonName: 'R11',
            issuerDn: "CN=R11, O=Let's Encrypt, C=US",
            serialNumber: '50382483b2ba95ea9cb36f0fa2a23562df2',
            fingerprint: 'b0622c38adaf711eaa08b072b592f5b14fbcb21bcc2e3be7f6d54373221f6d9e',
            publicKeyAlgorithm: 'RSA',
            signatureAlgorithm: 'SHA256withRSA',
            notBefore: '2025-08-18T00:22:55.000+00:00',
            notAfter: '2025-11-16T00:22:54.000+00:00',
        },
    ],
    predecessorCertificates: [],
};

export const mockCertificates: CertificateDto[] = [
    {
        uuid: '6e44eca0-cb63-43eb-a916-32df1b442801',
        commonName: 'jakub',
        serialNumber: '1800009884c7b93eaa80f353e8000000009884',
        issuerCommonName: 'Demo MS Sub CA',
        issuerDn: 'O=3Key Company s.r.o., CN=Demo MS Sub CA',
        subjectDn: 'CN=jakub, O=KB, L=Praha, ST=Czechia, C=CZ',
        notBefore: '2025-08-26T08:25:01.000+00:00',
        notAfter: '2027-08-26T08:25:01.000+00:00',
        publicKeyAlgorithm: 'RSA',
        signatureAlgorithm: 'SHA512withRSA',
        hybridCertificate: false,
        keySize: 2048,
        state: CertificateState.Issued,
        validationStatus: CertificateValidationStatus.Valid,
        raProfile: {
            uuid: '0bddee3a-8206-4a1a-a5ec-ee0d25445ab3',
            name: 'czertainly',
            enabled: true,
            authorityInstanceUuid: '7e8fd404-921d-4d9a-a92a-920e196a5112',
        },
        fingerprint: '5aae6d3c52874a33204655bd73299974ea6b982fcdc1f0b3606f89a02117b448',
        groups: [
            {
                uuid: 'b9f33da1-595d-4747-a30b-b381700046ce',
                name: 'test-group-1',
                description: 'test-group-1',
                email: 'test-group-1@email.com',
            },
        ],
        owner: 'czertainly-admin',
        ownerUuid: '5fa60bbf-a76c-423e-a701-07f30f3f7450',
        certificateType: CertificateType.X509,
        issuerSerialNumber: '656879dc6dfcc35c431488317ddb331f486a3847',
        complianceStatus: ComplianceStatus.NotChecked,
        issuerCertificateUuid: '9fbd54bf-7233-40d7-93f0-451e98495ce6',
        privateKeyAvailability: false,
        archived: false,
    },
];

export const mockComplianceCheckResult: ComplianceCheckResultDto = {
    status: ComplianceStatus.Nok,
    timestamp: '2025-10-01T17:11:20.05Z',
    failedRules: [
        {
            uuid: '7ed00480-e706-11ec-8fea-0242ac120002',
            name: 'cus_key_length',
            description: 'Public Key length of the certificate should be',
            status: ComplianceRuleStatus.Nok,
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            connectorName: 'X509-Compliance-Provider',
            kind: 'x509',
            resource: Resource.Certificates,
            attributes: [
                {
                    uuid: '7ed00782-e706-11ec-8fea-0242ac120002',
                    name: 'condition',
                    label: 'Condition',
                    type: AttributeType.Data,
                    contentType: AttributeContentType.String,
                    content: [
                        {
                            data: 'Equals',
                        },
                    ],
                },
                {
                    uuid: '7ed00886-e706-11ec-8fea-0242ac120002',
                    name: 'length',
                    label: 'Key Length',
                    type: AttributeType.Data,
                    contentType: AttributeContentType.Integer,
                    content: [
                        {
                            data: '1',
                        },
                    ],
                },
            ],
        },
        {
            uuid: '40f0ac10-ddc1-11ec-b1bf-34cff65c6ee3',
            name: 'e_subject_organizational_unit_name_max_length',
            description: "The 'Organizational Unit Name' field of the subject MUST be less than 65 characters",
            status: ComplianceRuleStatus.NotAvailable,
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            connectorName: 'X509-Compliance-Provider',
            kind: 'x509',
            resource: Resource.Certificates,
        },
        {
            uuid: '40f0850d-ddc1-11ec-93a4-34cff65c6ee3',
            name: 'e_ext_ian_no_entries',
            description: 'If present, the IAN extension must contain at least one entry',
            status: ComplianceRuleStatus.Na,
            connectorUuid: '8d8a6610-9623-40d2-b113-444fe59579dd',
            connectorName: 'X509-Compliance-Provider',
            kind: 'x509',
            resource: Resource.Certificates,
        },
    ],
};

export const mockValidationResult: ValidationCertificateResultModel = {
    resultStatus: CertificateValidationStatus.NotChecked,
    validationChecks: {
        certificate_chain: {
            validationCheck: CertificateValidationCheck.CertificateChain,
            status: CertificateValidationStatus.Valid,
            message: 'Certificate chain is complete.',
        },
        signature: {
            validationCheck: CertificateValidationCheck.Signature,
            status: CertificateValidationStatus.Valid,
            message: 'Signature verification successful.',
        },
        certificate_validity: {
            validationCheck: CertificateValidationCheck.CertificateValidity,
            status: CertificateValidationStatus.Valid,
            message: 'Certificate is valid.',
        },
        ocsp_verification: {
            validationCheck: CertificateValidationCheck.OcspVerification,
            status: CertificateValidationStatus.NotChecked,
            message: 'Certificate does not contain AIA extension or OCSP URL is not present',
        },
        crl_verification: {
            validationCheck: CertificateValidationCheck.CrlVerification,
            status: CertificateValidationStatus.NotChecked,
            message: 'No available working CRL URL found in cRLDistributionPoints extension.',
        },
        basic_constraints: {
            validationCheck: CertificateValidationCheck.BasicConstraints,
            status: CertificateValidationStatus.Valid,
            message: 'Certificate basic constraints verification successful.',
        },
        key_usage: {
            validationCheck: CertificateValidationCheck.KeyUsage,
            status: CertificateValidationStatus.NotChecked,
            message: 'Certificate is not CA.',
        },
    },
    message: 'Validation of certificates in RA Profile ejbca-webserver is disabled.',
    validationTimestamp: '2025-09-25T20:50:00Z',
};

export const mockCertificateValidationCheck: {
    [key: string]: EnumItemDto;
} = {
    certificate_validity: {
        code: 'certificate_validity',
        label: 'Certificate Validity',
    },
    key_usage: {
        code: 'key_usage',
        label: 'Certificate Key Usage',
    },
    signature: {
        code: 'signature',
        label: 'Signature Verification',
    },
    ocsp_verification: {
        code: 'ocsp_verification',
        label: 'OCSP Verification',
    },
    crl_verification: {
        code: 'crl_verification',
        label: 'CRL Verification',
    },
    basic_constraints: {
        code: 'basic_constraints',
        label: 'Basic Constraints',
    },
    certificate_chain: {
        code: 'certificate_chain',
        label: 'Certificate chain',
    },
};
