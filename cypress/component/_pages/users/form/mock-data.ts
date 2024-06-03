import {
    AttributeContentType,
    AttributeType,
    CertificateRequestFormat,
    CertificateState,
    CertificateType,
    CertificateValidationStatus,
    ComplianceStatus,
} from 'types/openapi';

const userFormMockData = {
    resourceCustomAttributes: [
        {
            uuid: 'uuid-1234-department-custom-attribute',
            name: 'DepartmentAssociation',
            description: '',
            content: [
                {
                    data: 'IT',
                },
                {
                    data: 'HR',
                },
                {
                    data: 'Sales',
                },
            ],
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'Department',
                visible: true,
                group: 'Test',
                required: false,
                readOnly: false,
                list: true,
                multiSelect: true,
            },
        },
        {
            uuid: 'uuid-1234-text-custom-attribute',
            name: 'Text Me',
            description: '',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            properties: {
                label: 'Text Me',
                visible: true,
                group: '',
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'uuid-1234-some-custom-attribute',
            name: 'SomeCustom',
            description: 'SomeCustom',
            content: [
                {
                    data: '0',
                },
            ],
            type: AttributeType.Custom,
            contentType: AttributeContentType.Integer,
            properties: {
                label: 'SomeCustom',
                visible: true,
                group: '',
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
    ],
    rolesListPayload: {
        roles: [
            {
                uuid: 'uuid-1234-role',
                name: 'RB_web_admin_team1',
                description: '',
                email: 'tempkat@email.com',
                systemRole: false,
            },
            {
                uuid: 'uuid-4321-role',
                name: 'test-role',
                description: 'Test role',
                systemRole: false,
            },
        ],
    },
    groupListPayload: {
        groups: [
            {
                uuid: 'uuid-1234-group',
                name: 'Test Group 1',
                description: '',
                email: 'tempkat@email.com',
            },
            {
                uuid: 'uuid-4321-group',
                name: 'Test Group 2',
                description: '',
                email: 'tempkat@email.com',
            },
        ],
    },

    certificateListPayload: [
        {
            uuid: 'uuid-4321-certificate-keit',
            commonName: 'test-cert-00',
            serialNumber: '1234-certificate-serial',
            issuerCommonName: 'R3',
            issuerDn: "CN=R3, O=Let's Encrypt, C=US",
            subjectDn: 'CN=test-cert-00',
            notBefore: '2024-03-31T10:05:38.000+00:00',
            notAfter: '2024-06-29T10:05:37.000+00:00',
            publicKeyAlgorithm: 'RSA',
            signatureAlgorithm: 'SHA256withRSA',
            keySize: 2048,
            state: CertificateState.Issued,
            validationStatus: CertificateValidationStatus.Valid,
            fingerprint: '12345678fingerprint',
            groups: [],
            certificateType: CertificateType.X509,
            issuerSerialNumber: '912b084acf0c18a753f6d62e25a75f5a',
            complianceStatus: ComplianceStatus.NotChecked,
            issuerCertificateUuid: 'f8f51f0e-52f9-4c34-a73e-9aa4c7009aec',
            privateKeyAvailability: false,
            trustedCa: true,
        },
        {
            trustedCa: true,
            uuid: 'uuid-0011-certificate-test',
            commonName: 'test-cert-01',
            serialNumber: 'uuid-0011-serial-1234',
            issuerCommonName: 'Demo MS Sub CA',
            issuerDn: 'O=3Key Company s.r.o., CN=Demo MS Sub CA',
            subjectDn: 'CN=test-cert-01',
            notBefore: '2024-05-20T15:56:46.000+00:00',
            notAfter: '2026-05-20T15:56:46.000+00:00',
            publicKeyAlgorithm: 'RSA',
            signatureAlgorithm: 'SHA512withRSA',
            keySize: 2048,
            state: CertificateState.Issued,
            validationStatus: CertificateValidationStatus.Valid,
            raProfile: {
                uuid: 'uuid-0011-ra-profile-1234',
                name: 'ADCS-py-webserver',
                enabled: true,
                authorityInstanceUuid: 'uuid-1234-authority-instance-1234',
            },
            fingerprint: '12348765fingerprint',
            groups: [],
            certificateType: CertificateType.X509,
            issuerSerialNumber: '1234-serial-issuer',
            complianceStatus: ComplianceStatus.NotChecked,
            issuerCertificateUuid: 'uuid-1234-issuer-certificate',
            privateKeyAvailability: false,
        },
    ],

    userDetailsPayload: {
        user: {
            uuid: '12345useruuid',
            username: 'test user 001',
            firstName: 'test user 001',
            lastName: 'ns',
            description: 'test user 001',
            groups: [
                {
                    uuid: 'uuid-1234-group',
                    name: 'Test Group 1',
                },
            ],
            enabled: true,
            systemUser: false,
            certificate: {
                uuid: 'uuid-0011-certificate-test',
                fingerprint: '12348765fingerprint',
            },
            roles: [
                {
                    uuid: 'uuid-role-2134',
                    name: 'acme',
                    description: 'System role with all ACME permissions',
                    systemRole: true,
                },
            ],
            customAttributes: [
                {
                    uuid: 'uuid-1234-text-custom-attribute',
                    name: 'Text Me',
                    label: 'Text Me',
                    type: AttributeType.Custom,
                    contentType: AttributeContentType.Text,
                    content: [
                        {
                            data: 'test',
                        },
                    ],
                },
                {
                    uuid: 'uuid-1234-some-custom-attribute',
                    name: 'SomeCustom',
                    label: 'SomeCustom',
                    type: AttributeType.Custom,
                    contentType: AttributeContentType.Integer,

                    content: [
                        {
                            data: '1',
                        },
                    ],
                },
                {
                    uuid: 'uuid-1234-department-custom-attribute',
                    name: 'DepartmentAssociation',
                    label: 'Department',
                    type: AttributeType.Custom,
                    contentType: AttributeContentType.String,
                    content: [
                        {
                            data: 'IT',
                        },
                    ],
                },
            ],
        },
    },

    certificateDetailsPayload: {
        certificate: {
            trustedCa: true,
            uuid: 'uuid-0011-certificate-test',
            commonName: 'test-cert-01',
            serialNumber: 'uuid-0011-serial-1234',
            issuerCommonName: 'Demo MS Sub CA',
            issuerDn: 'O=3Key Company s.r.o., CN=Demo MS Sub CA',
            subjectDn: 'CN=test-cert-01',
            notBefore: '2024-05-20T15:56:46.000+00:00',
            notAfter: '2026-05-20T15:56:46.000+00:00',
            publicKeyAlgorithm: 'RSA',
            signatureAlgorithm: 'SHA512withRSA',
            keySize: 2048,
            state: CertificateState.Issued,
            validationStatus: CertificateValidationStatus.Valid,
            raProfile: {
                uuid: 'uuid-0011-ra-profile-1234',
                name: 'ADCS-py-webserver',
                enabled: true,
                authorityInstanceUuid: 'uuid-1234-authority-instance-1234',
            },
            fingerprint: '12348765fingerprint',
            certificateType: CertificateType.X509,
            issuerSerialNumber: '1234-serial-issuer',
            complianceStatus: ComplianceStatus.NotChecked,
            issuerCertificateUuid: 'uuid-1234-issuer-certificate',
            privateKeyAvailability: false,
            extendedKeyUsage: ['1.3.6.1.5.5.7.3.1'],
            keyUsage: ['digitalSignature', 'keyEncipherment'],
            basicConstraints: 'Subject Type=End Entity',
            metadata: [],
            certificateContent: '',
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
            customAttributes: [
                {
                    uuid: 'uuid-tempreadonly-1234',
                    name: 'tempreadonly',
                    label: 'tempreadonly',
                    type: AttributeType.Custom,
                    contentType: AttributeContentType.Text,
                    content: [
                        {
                            data: 'tempreadonly',
                        },
                    ],
                },
                {
                    uuid: 'uuid-tempreadonly-4321',
                    name: 'Test Date',
                    label: 'Test Date',
                    type: AttributeType.Custom,
                    contentType: AttributeContentType.Date,
                    content: [
                        {
                            data: '2024-01-03',
                        },
                    ],
                },
                {
                    uuid: 'uuid-tempreadonly-1122',
                    name: 'Test',
                    label: 'Testsdw',
                    type: AttributeType.Custom,
                    contentType: AttributeContentType.String,
                    content: [
                        {
                            data: 'Default content',
                        },
                    ],
                },
                {
                    uuid: 'uuid-1234-some-custom-attribute',
                    name: 'SomeCustom',
                    label: 'SomeCustom',
                    type: AttributeType.Custom,
                    contentType: AttributeContentType.Integer,
                    content: [
                        {
                            data: '0',
                        },
                    ],
                },
            ],
            certificateRequest: {
                certificateType: CertificateType.X509,
                certificateRequestFormat: CertificateRequestFormat.Pkcs10,
                publicKeyAlgorithm: 'RSA',
                signatureAlgorithm: 'SHA512withRSA',
                content: '',
                commonName: 'test-cert-01',
                subjectDn: 'CN=test-cert-01',
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
                attributes: [],
                signatureAttributes: [],
            },
            issueAttributes: [],
            revokeAttributes: [],
            relatedCertificates: [],
        },
    },
};

export { userFormMockData };
