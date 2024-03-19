import { Props as AttributeDescriptorViewerProps } from 'components/Attributes/AttributeDescriptorViewer';
import { CustomAttributeModel, DataAttributeModel, GroupAttributeModel, InfoAttributeModel } from 'types/attributes';
import { AttributeContentType, AttributeType } from 'types/openapi';

export const infoAttributeDescriptorProps: AttributeDescriptorViewerProps = {
    attributeDescriptors: [
        {
            content: [{ data: 'test-data-1', reference: 'test-reference-1' }],
            contentType: 'string',
            description: 'test-description-1',
            name: 'test-name-1',
            type: AttributeType.Info,
            uuid: 'test-uuid-1',
            properties: {
                label: 'Test Label 1',
                visible: true,
                group: 'test-group-1',
            },
        },
        {
            content: [{ data: 'test-data-2', reference: 'test-reference-2' }],
            contentType: 'string',
            description: 'test-description-2',
            name: 'test-name-2',
            type: AttributeType.Info,
            uuid: 'test-uuid-2',
            properties: {
                label: 'Test Label 2',
                visible: true,
                group: 'test-group-2',
            },
        },
    ] as InfoAttributeModel[],
};

export const customAttributeDescriptorProps: AttributeDescriptorViewerProps = {
    attributeDescriptors: [
        {
            uuid: 'test-uuid-1',
            name: 'test-name-1',
            description: 'test-description-1',
            type: AttributeType.Custom,
            contentType: 'string',
            properties: {
                label: 'Test Label 1',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            constraints: [
                {
                    description: 'Test Description 1',
                    errorMessage: 'Test Error Message 1',
                    type: 'test-type-1',
                    data: 'test-data-1',
                },
            ],
        },
        {
            uuid: 'test-uuid-2',
            name: 'test-name-2',
            description: 'test-description-2',
            content: [
                {
                    data: false,
                },
            ],
            type: AttributeType.Custom,
            contentType: 'boolean',
            properties: {
                label: 'Test Label 2',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-3',
            name: 'test-name-3',
            description: 'test-description-3',
            content: [
                {
                    data: 5985,
                },
            ],
            type: AttributeType.Custom,
            contentType: 'integer',
            properties: {
                label: 'Test Label 3',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-4',
            name: 'test-name-4',
            description: 'test-description-4',
            type: AttributeType.Custom,
            contentType: 'credential',
            properties: {
                label: 'Test Label 4',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
    ] as CustomAttributeModel[],
};

export const dataAttributeDescriptorProps: AttributeDescriptorViewerProps = {
    attributeDescriptors: [
        {
            uuid: 'd9f79ba6-47e5-437b-a7bc-82dbafa9cf01',
            name: 'https',
            description: 'Use https for connection with ADCS server.',
            content: [
                {
                    data: false,
                },
            ],
            type: AttributeType.Data,
            contentType: AttributeContentType.Boolean,
            properties: {
                label: 'HTTPS Enabled',
                visible: true,
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: '9587a320-a487-4084-9645-0b6c24636fa6',
            name: 'port',
            description: 'Define WinRM port, default port for http is 5985 and for https 5986.',
            content: [
                {
                    data: 5985,
                },
            ],
            type: AttributeType.Data,
            contentType: AttributeContentType.Integer,
            properties: {
                label: 'Port',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
    ] as DataAttributeModel[],
};

export const groupAttributeDescriptorProps: AttributeDescriptorViewerProps = {
    attributeDescriptors: [
        {
            uuid: '0f26f6a0-94ca-420b-bbd8-4324218d7692',
            name: 'raprofile_ca_select_group',
            description: 'For identification of select CA method',
            type: AttributeType.Group,
            attributeCallback: {
                mappings: [
                    {
                        from: 'raprofile_authority_uuid.data',
                        to: 'authority_instance_uuid',
                        targets: ['pathVariable'],
                    },
                    {
                        from: 'raprofile_select_ca_method.data',
                        to: 'ca_select_method',
                        targets: ['pathVariable'],
                    },
                ],
            },
        },
        {
            uuid: 'da285a61-822a-4508-a565-ce366de66980',
            name: 'raprofile_template_name',
            description: 'Select certificate templates to use',
            content: [
                {
                    reference: 'Administrator',
                    data: {
                        name: 'Administrator',
                        display_name: 'Administrator',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.7',
                    },
                },
                {
                    reference: 'Autorizace Pracovní Stanice - Čočka',
                    data: {
                        name: 'AutorizacePracovníStanice-Čočka',
                        display_name: 'Autorizace Pracovní Stanice - Čočka',
                        schema_version: '2',
                        version: '100.2',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.4239016.5997329',
                    },
                },
                {
                    reference: 'Root Certification Authority',
                    data: {
                        name: 'CA',
                        display_name: 'Root Certification Authority',
                        schema_version: '1',
                        version: '5.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.17',
                    },
                },
                {
                    reference: 'CA Exchange',
                    data: {
                        name: 'CAExchange',
                        display_name: 'CA Exchange',
                        schema_version: '2',
                        version: '106.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.26',
                    },
                },
                {
                    reference: 'CEP Encryption',
                    data: {
                        name: 'CEPEncryption',
                        display_name: 'CEP Encryption',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.22',
                    },
                },
                {
                    reference: 'Certificate authentication external client',
                    data: {
                        name: 'Certificateauthenticationexternalclient',
                        display_name: 'Certificate authentication external client',
                        schema_version: '2',
                        version: '100.4',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.2517003.8444064',
                    },
                },
                {
                    reference: 'Authenticated Session',
                    data: {
                        name: 'ClientAuth',
                        display_name: 'Authenticated Session',
                        schema_version: '1',
                        version: '3.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.4',
                    },
                },
                {
                    reference: 'Code Signing',
                    data: {
                        name: 'CodeSigning',
                        display_name: 'Code Signing',
                        schema_version: '1',
                        version: '3.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.9',
                    },
                },
                {
                    reference: 'Copy of Web Server',
                    data: {
                        name: 'Copy of Web Server',
                        display_name: 'Copy of Web Server',
                        schema_version: '2',
                        version: '100.4',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.4484942.314197',
                    },
                },
                {
                    reference: 'Cross Certification Authority',
                    data: {
                        name: 'CrossCA',
                        display_name: 'Cross Certification Authority',
                        schema_version: '2',
                        version: '105.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.25',
                    },
                },
                {
                    reference: 'Trust List Signing',
                    data: {
                        name: 'CTLSigning',
                        display_name: 'Trust List Signing',
                        schema_version: '1',
                        version: '3.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.10',
                    },
                },
                {
                    reference: 'Directory Email Replication',
                    data: {
                        name: 'DirectoryEmailReplication',
                        display_name: 'Directory Email Replication',
                        schema_version: '2',
                        version: '115.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.29',
                    },
                },
                {
                    reference: 'Domain Controller',
                    data: {
                        name: 'DomainController',
                        display_name: 'Domain Controller',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.15',
                    },
                },
                {
                    reference: 'Domain Controller Authentication',
                    data: {
                        name: 'DomainControllerAuthentication',
                        display_name: 'Domain Controller Authentication',
                        schema_version: '2',
                        version: '110.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.28',
                    },
                },
                {
                    reference: 'Basic EFS',
                    data: {
                        name: 'EFS',
                        display_name: 'Basic EFS',
                        schema_version: '1',
                        version: '3.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.6',
                    },
                },
                {
                    reference: 'EFS Recovery Agent',
                    data: {
                        name: 'EFSRecovery',
                        display_name: 'EFS Recovery Agent',
                        schema_version: '1',
                        version: '6.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.8',
                    },
                },
                {
                    reference: 'Enrollment Agent',
                    data: {
                        name: 'EnrollmentAgent',
                        display_name: 'Enrollment Agent',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.11',
                    },
                },
                {
                    reference: 'Exchange Enrollment Agent (Offline request)',
                    data: {
                        name: 'EnrollmentAgentOffline',
                        display_name: 'Exchange Enrollment Agent (Offline request)',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.12',
                    },
                },
                {
                    reference: 'Exchange User',
                    data: {
                        name: 'ExchangeUser',
                        display_name: 'Exchange User',
                        schema_version: '1',
                        version: '7.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.23',
                    },
                },
                {
                    reference: 'Exchange Signature Only',
                    data: {
                        name: 'ExchangeUserSignature',
                        display_name: 'Exchange Signature Only',
                        schema_version: '1',
                        version: '6.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.24',
                    },
                },
                {
                    reference: 'IPSec (Offline request)',
                    data: {
                        name: 'IPSECIntermediateOffline',
                        display_name: 'IPSec (Offline request)',
                        schema_version: '1',
                        version: '7.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.20',
                    },
                },
                {
                    reference: 'IPSec',
                    data: {
                        name: 'IPSECIntermediateOnline',
                        display_name: 'IPSec',
                        schema_version: '1',
                        version: '8.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.19',
                    },
                },
                {
                    reference: 'Kerberos Authentication',
                    data: {
                        name: 'KerberosAuthentication',
                        display_name: 'Kerberos Authentication',
                        schema_version: '2',
                        version: '110.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.33',
                    },
                },
                {
                    reference: 'Key Recovery Agent',
                    data: {
                        name: 'KeyRecoveryAgent',
                        display_name: 'Key Recovery Agent',
                        schema_version: '2',
                        version: '105.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.27',
                    },
                },
                {
                    reference: 'Computer',
                    data: {
                        name: 'Machine',
                        display_name: 'Computer',
                        schema_version: '1',
                        version: '5.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.14',
                    },
                },
                {
                    reference: 'Enrollment Agent (Computer)',
                    data: {
                        name: 'MachineEnrollmentAgent',
                        display_name: 'Enrollment Agent (Computer)',
                        schema_version: '1',
                        version: '5.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.13',
                    },
                },
                {
                    reference: 'OCSP Response Signing',
                    data: {
                        name: 'OCSPResponseSigning',
                        display_name: 'OCSP Response Signing',
                        schema_version: '3',
                        version: '101.3',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.32',
                    },
                },
                {
                    reference: 'Router (Offline request)',
                    data: {
                        name: 'OfflineRouter',
                        display_name: 'Router (Offline request)',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.21',
                    },
                },
                {
                    reference: 'RAS and IAS Server',
                    data: {
                        name: 'RASAndIASServer',
                        display_name: 'RAS and IAS Server',
                        schema_version: '2',
                        version: '101.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.31',
                    },
                },
                {
                    reference: 'Smartcard Logon',
                    data: {
                        name: 'SmartcardLogon',
                        display_name: 'Smartcard Logon',
                        schema_version: '1',
                        version: '6.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.5',
                    },
                },
                {
                    reference: 'Smartcard User',
                    data: {
                        name: 'SmartcardUser',
                        display_name: 'Smartcard User',
                        schema_version: '1',
                        version: '11.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.3',
                    },
                },
                {
                    reference: 'Subordinate Certification Authority',
                    data: {
                        name: 'SubCA',
                        display_name: 'Subordinate Certification Authority',
                        schema_version: '1',
                        version: '5.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.18',
                    },
                },
                {
                    reference: 'Test of Enrollment Agent',
                    data: {
                        name: 'TestofEnrollmentAgent',
                        display_name: 'Test of Enrollment Agent',
                        schema_version: '4',
                        version: '100.3',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.8007785.10868302',
                    },
                },
                {
                    reference: 'User',
                    data: {
                        name: 'User',
                        display_name: 'User',
                        schema_version: '1',
                        version: '3.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.1',
                    },
                },
                {
                    reference: 'User Signature Only',
                    data: {
                        name: 'UserSignature',
                        display_name: 'User Signature Only',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.2',
                    },
                },
                {
                    reference: 'Web Server',
                    data: {
                        name: 'WebServer',
                        display_name: 'Web Server',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.16',
                    },
                },
                {
                    reference: 'Workstation Authentication',
                    data: {
                        name: 'Workstation',
                        display_name: 'Workstation Authentication',
                        schema_version: '2',
                        version: '101.0',
                        oid: '1.3.6.1.4.1.311.21.8.16335329.656368.4341948.8708353.10624234.204.1.30',
                    },
                },
            ],
            type: AttributeType.Group,
            contentType: 'object',
            properties: {
                label: 'Certificate Template Name',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
    ] as GroupAttributeModel[],
};
