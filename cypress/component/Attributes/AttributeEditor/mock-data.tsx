import { Props as AttributeEditorProps } from 'components/Attributes/AttributeEditor';
import CredentialForm from 'components/_pages/credentials/form';
import { SingleValue } from 'react-select';
import {
    AttributeDescriptorDto,
    AttributeDescriptorModel,
    AttributeResponseModel,
    CustomAttributeDto,
    CustomAttributeModel,
    InfoAttributeModel,
} from 'types/attributes';
import { ConnectorResponseDto } from 'types/connectors';
import { CryptographicKeyPairResponseModel } from 'types/cryptographic-keys';
import {
    AttributeConstraintType,
    AttributeContentType,
    AttributeType,
    AuthorityInstanceDto,
    BaseAttributeDto,
    ConnectorDto,
    DataAttribute,
    GroupAttribute,
    ProgrammingLanguageEnum,
    TokenProfileDto,
} from 'types/openapi';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { TokenProfileResponseModel } from 'types/token-profiles';
import { GlobalModalModel } from 'types/user-interface';

export const customAttributeEditorMockData: AttributeEditorProps = {
    id: 'test',
    attributeDescriptors: [
        {
            uuid: 'test-uuid-1',
            name: 'test-name-1',
            description: 'test-description-string-1',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'Test property string',
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
            description: 'test-description-boolean-2',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            properties: {
                label: 'Test property boolean',
                visible: true,
                required: true,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-3',
            name: 'test-name-3',
            description: 'test-description-integer-3',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Integer,
            properties: {
                label: 'Test property integer',
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
            description: 'test-description-drop-down-4',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Credential,
            properties: {
                label: 'Test property drop down',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: true,
            },
            content: [
                {
                    data: 'test-default-content-1',
                },
                {
                    data: 'test-default-content-2',
                },
            ],
        },
        {
            uuid: 'test-uuid-5',
            name: 'test-name-5',
            label: 'Test property codeblock',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Codeblock,
            properties: {
                label: 'Test property codeblock',
                required: true,
                group: 'test-group',
            },
            content: [
                {
                    data: {
                        code: '',
                        language: ProgrammingLanguageEnum.Html,
                    },
                },
            ],
        },
        {
            uuid: 'test-uuid-6',
            name: 'test-name-6',
            label: 'test float property',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Float,
            properties: {
                label: 'test float property',
                group: 'test-group',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-7',
            name: 'test-name-7',
            label: 'test date property',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Date,
            properties: {
                label: 'test date property',
                group: 'test-group',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-8',
            name: 'test-name-8',
            label: 'test datetime property',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Datetime,
            properties: {
                label: 'test datetime property',
                group: 'test-group',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-9',
            name: 'test-name-9',
            label: 'test text property',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            properties: {
                label: 'test-property-text',
                group: 'test-group',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-10',
            name: 'test-name-10',
            label: 'test date property',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Time,
            properties: {
                label: 'test-property-time',
                group: 'test-group',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-11',
            name: 'test-name-11',
            label: 'test date property',
            type: AttributeType.Custom,
            contentType: AttributeContentType.File,
            properties: {
                label: 'test-property-file',
                group: 'test-group',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-12',
            name: 'test-name-12',
            label: 'test object property',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Object,
            properties: {
                label: 'test-property-object',
                group: 'test-group',
                visible: false,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
    ] as CustomAttributeModel[],
};

export const customNonRequiredAttributeEditorMockData: AttributeEditorProps = {
    id: 'test',
    attributes: [
        {
            uuid: 'test-uuid-2',
            name: 'test-name-2',
            description: 'test-description-string-2',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            content: [{ data: 'test-content' }],
        },
        {
            uuid: 'test-uuid-4',
            name: 'test-name-4',
            description: 'test-description-boolean-4',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            content: [{ data: true }],
        },
        {
            uuid: 'test-uuid-5',
            name: 'test-name-5',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            content: [
                {
                    data: 'test-content-1',
                },
            ],
        },
        {
            uuid: 'test-uuid-6',
            name: 'test-name-6',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            content: [
                {
                    data: 'test-content-1',
                },
                {
                    data: 'test-content-2',
                },
            ],
        },
    ] as AttributeResponseModel[],

    attributeDescriptors: [
        {
            uuid: 'test-uuid-1',
            name: 'test-name-1',
            description: 'test-description-boolean-1',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            properties: {
                label: 'Test property boolean 1',
                visible: true,
                required: true,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-2',
            name: 'test-name-2',
            description: 'test-description-string-2',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'Test property string 2',
                visible: true,
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },

        {
            uuid: 'test-uuid-3',
            name: 'test-name-3',
            description: 'test-description-integer-3',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Integer,
            properties: {
                label: 'Test property integer 3',
                visible: true,
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-4',
            name: 'test-name-4',
            description: 'test-description-boolean-4',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            properties: {
                label: 'Test property boolean 4',
                visible: true,
                required: false,
                readOnly: true,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-5',
            name: 'test-name-5',
            description: 'test-description-drop-down-5',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            properties: {
                label: 'Test property select 5',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
            content: [
                {
                    data: 'test-default-content-1',
                },
                {
                    data: 'test-default-content-2',
                },
            ],
        },
        {
            uuid: 'test-uuid-6',
            name: 'test-name-6',
            description: 'test-description-drop-down-6',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Text,
            properties: {
                label: 'Test property multiselect 6',
                visible: true,
                required: false,
                readOnly: false,
                list: true,
                multiSelect: true,
            },
            content: [
                {
                    data: 'test-default-content-1',
                },
                {
                    data: 'test-default-content-2',
                },
            ],
        },
        {
            uuid: 'test-uuid-7',
            name: 'test-name-7',
            description: 'test-description-boolean-7',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            properties: {
                label: 'Test property boolean 7',
                visible: true,
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'test-uuid-8',
            name: 'test-name-8',
            description: 'test-description-boolean-8',
            type: AttributeType.Custom,
            contentType: AttributeContentType.Boolean,
            properties: {
                label: 'Test property boolean 8',
                visible: true,
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            content: [{ data: true }],
        },
        {
            uuid: 'test-uuid-9',
            name: 'test-name-9',
            description: 'test-description-string-9',
            type: AttributeType.Custom,
            contentType: AttributeContentType.String,
            properties: {
                label: 'Test property string 9',
                visible: true,
                required: false,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            content: [{ data: 'default-string' }],
        },
    ] as CustomAttributeModel[],
};

export const infoAttributeEditorMockData: AttributeEditorProps = {
    id: 'test1',
    attributeDescriptors: [
        {
            content: [{ data: 'test-data-1', reference: 'test-reference-1' }],
            contentType: AttributeContentType.String,
            description: 'test-description-1',
            name: 'test-name-1',
            type: AttributeType.Info,
            uuid: 'test-uuid-1',
            properties: {
                label: 'Test Label String 1',
                visible: true,
                group: 'test-group-1',
            },
        },
        {
            content: [{ data: 'test-data-2', reference: 'test-reference-2' }],
            contentType: AttributeContentType.Text,
            description: 'test-description-2',
            name: 'test-name-2',
            type: AttributeType.Info,
            uuid: 'test-uuid-2',
            properties: {
                label: 'Test Label Text 2',
                visible: true,
                group: 'test-group-1',
            },
        },
        {
            content: [
                {
                    data: '2022-01-01',
                },
            ],
            contentType: AttributeContentType.Date,
            description: 'test-description-3',
            name: 'test-name-3',
            type: AttributeType.Info,
            uuid: 'test-uuid-3',
            properties: {
                label: 'Test Label date 3',
                visible: true,
                group: 'test-group-2',
            },
        },
        {
            contentType: AttributeContentType.Datetime,
            description: 'test-description-4',
            name: 'test-name-4',
            type: AttributeType.Info,
            uuid: 'test-uuid-3',
            properties: {
                label: 'Test Label datetime 4',
                visible: true,
                group: 'test-group-2',
            },
            content: [
                {
                    data: '2022-01-01T00:00:00',
                },
            ],
        },
        {
            contentType: AttributeContentType.Time,
            description: 'test-description-5',
            name: 'test-name-5',
            type: AttributeType.Info,
            uuid: 'test-uuid-5',
            properties: {
                label: 'Test Label time 5',
                visible: true,
                group: 'test-group-2',
            },
            content: [
                {
                    data: '00:00:00',
                },
            ],
        },
        {
            contentType: AttributeContentType.Integer,
            description: 'test-description-6',
            name: 'test-name-6',
            type: AttributeType.Info,
            uuid: 'test-uuid-6',
            properties: {
                label: 'Test Label integer 6',
                visible: true,
                group: 'test-group-3',
            },
            content: [
                {
                    data: 123,
                },
            ],
        },
        {
            contentType: AttributeContentType.Float,
            description: 'test-description-7',
            name: 'test-name-7',
            type: AttributeType.Info,
            uuid: 'test-uuid-7',
            properties: {
                label: 'Test Label float 7',
                visible: true,
                group: 'test-group-3',
            },
            content: [
                {
                    data: '1.5',
                },
            ],
        },
        {
            contentType: AttributeContentType.Codeblock,
            description: 'test-description-8',
            name: 'test-name-8',
            type: AttributeType.Info,
            uuid: 'test-uuid-8',
            properties: {
                label: 'test-property-codeblock',
                group: 'test-group-4',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            content: [
                {
                    data: {
                        code: 'PGgxPk9EUE9WRcSOPC9oMT4KPGRpdj5Qb8SNw610YW1lIGtvxL5rbyBjZXJ0aWZpa8OhdG92IHR1IGplLjwvZGl2PgoKPHVsPgogIDxsaT5TdWJqZWN0OiAke25vdGlmaWNhdGlvbkRhdGEuc3ViamVjdERufTwvbGk+CiAgPGxpPlNlcmlhbCBOdW1iZXI6ICR7bm90aWZpY2F0aW9uRGF0YS5zZXJpYWxOdW1iZXJ9PC9saT4KICA8bGk+SXNzdWVyOiAke25vdGlmaWNhdGlvbkRhdGEuaXNzdWVyRG59PC9saT4KPC91bD4=',
                        language: 'html',
                    },
                },
            ],
        },
        {
            contentType: AttributeContentType.File,
            description: 'test-description-9',
            name: 'test-name-9',
            type: AttributeType.Info,
            uuid: 'test-uuid-9',
            properties: {
                label: 'test-property-file',
                group: 'test-group-4',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            content: [{ data: 'test-file', reference: 'test.txt' }],
        },
        {
            uuid: 'test-uuid-10',
            name: 'test-name-10',
            description: 'test-description-drop-down-4',
            type: AttributeType.Info,
            contentType: AttributeContentType.Credential,
            properties: {
                group: 'test-group-5',
                label: 'Test property Credential',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: true,
            },
            content: [
                {
                    data: 'test-default-content-1',
                    reference: 'test-reference-content-1',
                },
                {
                    data: 'test-default-content-2',
                    reference: 'test-reference-content-2',
                },
            ],
        },
        {
            uuid: 'test-uuid-11',
            name: 'test-name-11',
            description: 'test-description-secret',
            contentType: AttributeContentType.Secret,
            type: AttributeType.Info,
            properties: {
                group: 'test-group-5',
                label: 'Test property secret',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            content: [
                {
                    data: {
                        name: 'password-test',
                        display_name: 'test-reference-secret',
                    },
                    reference: 'test-reference-secret',
                },
            ],
        },
        {
            uuid: 'test-uuid-12',
            name: 'test-name-12',
            label: 'Test object',
            type: AttributeType.Info,
            contentType: AttributeContentType.Object,
            properties: {
                group: 'test-group-5',
                label: 'Test property Object',
            },
            content: [
                {
                    reference: 'Web Server',
                    data: {
                        name: 'WebServer',
                        display_name: 'Web Server',
                        schema_version: '1',
                        version: '4.1',
                        oid: '1.16',
                    },
                },
            ],
        },
    ] as InfoAttributeModel[],
};

export const dataAttributeMockData = {
    authorityResponseDtoObject: {
        uuid: '59c908cd-15ed-4ca0-a183-6237fd65d1f1',
        name: 'ADCS-through-proxy',
        attributes: [
            {
                uuid: '9587a320-a487-4084-9645-0b6c24636fa6',
                name: 'port',
                label: 'Port',
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                content: [
                    {
                        data: '80',
                    },
                ],
            },
            {
                uuid: '93ca0ba2-3863-4ffa-a469-fd14ab3992bf',
                name: 'address',
                label: 'MS-ADCS Address',
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                content: [
                    {
                        data: 'data.cveradar.com',
                    },
                ],
            },
            {
                uuid: 'd9f79ba6-47e5-437b-a7bc-82dbafa9cf03',
                name: 'credential',
                label: 'Credential',
                type: AttributeType.Data,
                contentType: AttributeContentType.Credential,
                content: [
                    {
                        reference: 'adcs-lab02-login',
                        data: {
                            uuid: '04274e0f-06e6-48bc-a5db-d3399c97f1df',
                            name: 'adcs-lab02-login',
                            kind: 'Basic',
                            attributes: [
                                {
                                    uuid: 'fe2d6d35-fb3d-4ea0-9f0b-7e39be93beeb',
                                    name: 'username',
                                    description: 'Username',
                                    content: [
                                        {
                                            data: 'nejaky.uzivatel',
                                        },
                                    ],
                                    type: AttributeType.Data,
                                    contentType: AttributeContentType.String,
                                    properties: {
                                        label: 'Username',
                                        visible: true,
                                        group: 'Basic',
                                        required: true,
                                        readOnly: false,
                                        list: false,
                                        multiSelect: false,
                                    },
                                },
                                {
                                    uuid: '04506d45-c865-4ddc-b6fc-117ee5d5c8e7',
                                    name: 'password',
                                    description: 'Password',
                                    content: [{}],
                                    type: AttributeType.Data,
                                    contentType: AttributeContentType.Secret,
                                    properties: {
                                        label: 'Password',
                                        visible: true,
                                        group: 'Basic',
                                        required: true,
                                        readOnly: false,
                                        list: false,
                                        multiSelect: false,
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        customAttributes: [],
        connectorUuid: '5dcd1aa6-91b7-4d12-9495-c38d43993326',
        connectorName: 'MS-ADCS-Connector',
        kind: 'ADCS',
        status: 'ENABLED',
    } as AuthorityInstanceDto,
    dataAttributeArray: [
        {
            uuid: '93ca0ba2-3863-4ffa-a469-fd14ab3992bf',
            name: 'address',
            description: 'Address of ADCS server.',
            type: AttributeType.Data,
            contentType: AttributeContentType.String,
            properties: {
                label: 'MS-ADCS Address',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            constraints: [
                {
                    description: 'Address of ADCS Server',
                    errorMessage: 'Enter Valid Address',
                    type: 'regExp',
                    data: '^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9]))$',
                },
            ],
        },
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
        {
            uuid: 'd9f79ba6-47e5-437b-a7bc-82dbafa9cf03',
            name: 'credential',
            description: 'Credential for the communication',
            type: AttributeType.Data,
            contentType: AttributeContentType.Credential,
            properties: {
                label: 'Credential',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
            attributeCallback: {
                mappings: [
                    {
                        to: 'credentialKind',
                        targets: ['pathVariable'],
                        value: 'Basic',
                    },
                ],
            },
        },
    ] as DataAttribute[],
    connectorDtoArray: [
        {
            uuid: '5dcd1aa6-91b7-4d12-9495-c38d43993326',
            name: 'MS-ADCS-Connector',
            functionGroups: [
                {
                    functionGroupCode: 'authorityProvider',
                    kinds: ['ADCS'],
                    endPoints: [
                        {
                            uuid: 'efdb9bcd-4f7c-473b-8704-77b12b3f6d33',
                            name: 'renewCertificate',
                            context: '',
                            method: 'POST',
                            required: true,
                        },
                    ],
                    uuid: '736b0fd6-5ea0-4e10-abe7-cfed39cc2a1a',
                    name: 'authorityProvider',
                },
            ],
            url: '',
            authType: 'none',
            authAttributes: [],
            status: 'connected',
        },
    ] as ConnectorDto[],
    callbackSuccessObjectArray: [
        {
            reference: 'lab01-testssh',
            data: {
                uuid: '91c105e3-29d4-46e5-88c3-2ba7fb1fbd40',
                name: 'lab01-testssh',
            },
        },
        {
            reference: 'adcs-lab02-login',
            data: {
                uuid: '34e58936-c041-4aa6-8ae7-ab2157da290b',
                name: 'adcs-lab02-login',
            },
        },
    ],
};

export const groupAttributeAtributeEditorMockData = {
    authorityInstanceDtoArray: [] as AuthorityInstanceDto[],
    customAttributeDtoArray: [] as CustomAttributeDto[],
    groupAttributeArray: [
        {
            uuid: '9b5b38a2-9bcc-4178-8d02-7817cc3f3ada',
            name: 'raprofile_select_ca_method',
            description: 'Select how the CA will be chosen, either by ComputerName or search',
            content: [
                {
                    reference: 'Search for all available CAs',
                    data: 'search',
                },
                {
                    reference: 'Use the ConfigString to select existing CA',
                    data: 'configstring',
                },
            ],
            type: AttributeType.Data,
            contentType: AttributeContentType.String,
            properties: {
                label: 'Select CA Method',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
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
            type: AttributeType.Data,
            contentType: AttributeContentType.Object,
            properties: {
                label: 'Certificate Template Name',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
    ] as GroupAttribute[],
    callbackSuccessObjectArray: [
        {
            name: 'raprofile_ca_name',
            uuid: '86a3fcb9-d74e-4b2c-b78d-3f71b1181472',
            type: 'data',
            contentType: 'object',
            description: 'Identification of the certification authority',
            properties: {
                label: 'CA Name',
                readOnly: false,
                required: false,
                list: true,
                visible: true,
                multiSelect: false,
            },
            content: [
                {
                    reference: 'Demo MS Sub CA',
                    data: {
                        name: 'Demo MS Sub CA',
                        display_name: 'Demo MS Sub CA',
                        computer_name: 'vmi.temp.local',
                        config_string: 'vmi.temp.local',
                        ca_type: 'Enterprise Subordinate CA',
                        is_enterprise: true,
                        is_root: false,
                        is_accessible: true,
                        service_status: 'Running',
                    },
                },
                {
                    reference: 'LAB-CA1',
                    data: {
                        name: 'LAB-CA1',
                        display_name: 'LAB-CA1',
                        computer_name: 'lab.temp.local',
                        config_string: 'lab.temp.local',
                        ca_type: '',
                        is_enterprise: false,
                        is_root: false,
                        is_accessible: false,
                        service_status: '',
                    },
                },
            ],
        },
    ],
    raProfileResponseModel: {
        uuid: '9cb76b6a-c291-4e23-b11a-bb3da76adbc6',
        name: 'ADCS-py-webserver',
        description: '',
        authorityInstanceUuid: '4a87e1a2-c9bf-4f32-a4a9-2f0612f15be7',
        authorityInstanceName: 'pyADCS-lab02-Authority',
        legacyAuthority: false,
        enabled: true,
        attributes: [
            {
                uuid: '8c4c213a-9bd4-4d49-9812-a539a2deac16',
                name: 'raprofile_authority_uuid',
                label: 'Authority UUID',
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                content: [
                    {
                        data: 'b0d18653-14b1-41de-a1b3-8286f07f1c7d',
                    },
                ],
            },
            {
                uuid: '9b5b38a2-9bcc-4178-8d02-7817cc3f3ada',
                name: 'raprofile_select_ca_method',
                label: 'Select CA Method',
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                content: [
                    {
                        reference: 'Search for all available CAs',
                        data: 'search',
                    },
                ],
            },
            {
                uuid: 'da285a61-822a-4508-a565-ce366de66980',
                name: 'raprofile_template_name',
                label: 'Certificate Template Name',
                type: AttributeType.Data,
                contentType: AttributeContentType.Object,
                content: [
                    {
                        reference: 'Web Server',
                        data: {
                            name: 'WebServer',
                            display_name: 'Web Server',
                            schema_version: '1',
                            version: '4.1',
                            oid: '123',
                        },
                    },
                ],
            },
            {
                uuid: '86a3fcb9-d74e-4b2c-b78d-3f71b1181472',
                name: 'raprofile_ca_name',
                label: 'CA Name',
                type: AttributeType.Data,
                contentType: AttributeContentType.Object,
                content: [
                    {
                        reference: 'Demo MS Sub CA',
                        data: {
                            name: 'Demo MS Sub CA',
                            display_name: 'Demo MS Sub CA',
                            computer_name: 'local',
                            config_string: 'Demo MS Sub CA',
                            ca_type: 'Enterprise Subordinate CA',
                            is_enterprise: true,
                            is_root: false,
                            is_accessible: true,
                            service_status: 'Running',
                        },
                    },
                ],
            },
        ],
        customAttributes: [],
        validationEnabled: true,
        certificateValidationSettings: {
            enabled: true,
            usePlatformSettings: false,
            expiringThreshold: 1,
            frequency: 30,
        },
    } as RaProfileResponseModel,
};

export const callbackVariationsAtributeEditorMockData = {
    basicTest: {
        attributeDescriptors: [
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3492',
                name: 'group_IntegerSelect',
                description: 'Group for IntegerSelect based on StringSelect',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'StringSelect',
                            to: 'IntegerSelect',
                            targets: ['pathVariable'],
                        },
                    ],
                },
            },
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b349d',
                name: 'TextSelect',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'TextSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess: [
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'IntegerSelect',
                content: [
                    {
                        reference: 'IntegerOption1',
                        data: 1,
                    },
                    {
                        reference: 'IntegerOption2',
                        data: 2,
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'IntegerSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
    },
    invalidMappingTest: {
        attributeDescriptors: [
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3492',
                name: 'group_IntegerSelect',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: undefined,
                            targets: [],
                        },
                    ],
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess: [
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'IntegerSelect',
                content: [
                    {
                        reference: 'IntegerOption1',
                        data: 1,
                    },
                    {
                        reference: 'IntegerOption2',
                        data: 2,
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'IntegerSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
    },
    defaultValuesTest: {
        attributeDescriptors: [
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3492',
                name: 'group_DefaultText',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'StringSelect',
                            targets: [],
                        },
                    ],
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess: [
            {
                uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'DefaultText',
                content: [{ data: 'default-content' }],
                type: AttributeType.Data,
                contentType: AttributeContentType.Text,
                properties: {
                    label: 'DefaultText',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: false,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
    },
    nestedAttributeCallbacksTest: {
        attributeDescriptors: [
            {
                uuid: '69cfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: '5fcfb71f-a161-4aa7-8b1f-726b477b3492',
                name: 'group_IntegerSelect',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'StringSelect',
                            targets: [],
                        },
                    ],
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess1: [
            {
                uuid: '1fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'DefaultText',
                content: [{ data: 'default-content' }],
                type: AttributeType.Data,
                contentType: AttributeContentType.Text,
                properties: {
                    label: 'DefaultText',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: false,
                    multiSelect: false,
                },
            },
            {
                uuid: '2fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'IntegerSelect',
                content: [
                    { reference: 'Integer1', data: 1 },
                    { reference: 'Integer2', data: 2 },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'IntegerSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: '3fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'group_DefaultBoolean',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'IntegerSelect.reference',
                            targets: [],
                        },
                    ],
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess2: [
            {
                uuid: '4fcfb71f-a16d-4aa7-8b1f-726b477b3494',
                name: 'DefaultBoolean',
                content: [{ data: true }],
                type: AttributeType.Data,
                contentType: AttributeContentType.Boolean,
                properties: {
                    label: 'DefaultBoolean',
                    visible: true,
                    required: false,
                    readOnly: false,
                    list: false,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
    },
    multipleAttributeCallbacksTest: {
        attributeDescriptors: [
            {
                uuid: '69cfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect1',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect1',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: '5fcfb71f-a161-4aa7-8b1f-7260477b3492',
                name: 'group_IntegerSelect1',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'StringSelect1',
                            targets: [],
                        },
                    ],
                },
            },
            {
                uuid: '69cfb71f-a161-4aa7-8b1f-726b470b3493',
                name: 'StringSelect2',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect2',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: '5fcfb71f-a161-4aa7-8b1f-426bd77b3492',
                name: 'group_IntegerSelect2',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'StringSelect2',
                            targets: [],
                        },
                    ],
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess1: [
            {
                uuid: '2fc4321f-a161-4aa7-8b1f-726b47g3494',
                name: 'IntegerSelect1',
                content: [
                    { reference: 'Integer1', data: 1 },
                    { reference: 'Integer2', data: 2 },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'IntegerSelect1',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess2: [
            {
                uuid: '2fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'IntegerSelect2',
                content: [
                    { reference: 'Integer1', data: 1 },
                    { reference: 'Integer2', data: 2 },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'IntegerSelect2',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
    },
    repeatCallbackTest: {
        attributeDescriptors: [
            {
                uuid: '69cfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: '5fcfb71f-a161-4aa7-8b1f-726b477b3492',
                name: 'group_DefaultTextOrIntegerSelect',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'StringSelect',
                            targets: ['pathVariable'],
                        },
                    ],
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess1: [
            {
                uuid: '1fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'DefaultText',
                content: [{ data: 'default-content' }],
                type: AttributeType.Data,
                contentType: AttributeContentType.Text,
                properties: {
                    label: 'DefaultText',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: false,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess2: [
            {
                uuid: '2fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'IntegerSelect',
                content: [
                    { reference: 'Integer1', data: 1 },
                    { reference: 'Integer2', data: 2 },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'IntegerSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
    },
    repeatCallbackSameDescriptorTest: {
        attributes: [
            {
                uuid: '69cfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect',
                label: 'StringSelect',
                contentType: AttributeContentType.String,
                type: AttributeType.Data,
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                ],
            },
            {
                uuid: '1fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'DefaultText',
                label: 'DefaultText',
                type: AttributeType.Data,
                contentType: AttributeContentType.Text,
                content: [{ data: 'non-default' }],
            },
        ] as AttributeResponseModel[],
        attributeDescriptors: [
            {
                uuid: '69cfb71f-a161-4aa7-8b1f-726b477b3493',
                name: 'StringSelect',
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'StringSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
            {
                uuid: '5fcfb71f-a161-4aa7-8b1f-726b477b3492',
                name: 'group_DefaultTextOrIntegerSelect',
                type: AttributeType.Group,
                attributeCallback: {
                    mappings: [
                        {
                            from: 'StringSelect',
                            targets: ['pathVariable'],
                        },
                    ],
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess1: [
            {
                uuid: '1fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'DefaultText',
                content: [{ data: 'default-content' }],
                type: AttributeType.Data,
                contentType: AttributeContentType.Text,
                properties: {
                    label: 'DefaultText',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: false,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
        callbackResourceSuccess2: [
            {
                uuid: '2fcfb71f-a161-4aa7-8b1f-726b477b3494',
                name: 'IntegerSelect',
                content: [
                    { reference: 'Integer1', data: 1 },
                    { reference: 'Integer2', data: 2 },
                ],
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'IntegerSelect',
                    visible: true,
                    required: true,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
            },
        ] as AttributeDescriptorModel[],
    },
};
export const constraintCheckAttributeEditorMockData = {
    attributeDescriptorDtoArray: [
        {
            uuid: 'e05beb6a-90fe-4f85-bd9f-2394d70a0a29',
            name: 'authority_credential_type',
            description: 'Choose the credential type to use for authentication, it should be compatible with selected protocol',
            content: [
                {
                    reference: 'Basic',
                    data: 'Basic',
                },
            ],
            type: 'data',
            contentType: 'string',
            properties: {
                label: 'Credential Type',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
        {
            uuid: '93d77f65-d9c4-497c-bdee-f3330eb0f209',
            name: 'authority_credential',
            description: 'Credential to authenticate with ADCS',
            type: 'data',
            contentType: 'credential',
            properties: {
                label: 'Credential',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
            attributeCallback: {
                mappings: [
                    {
                        from: 'authority_credential_type',
                        to: 'credentialKind',
                        targets: ['pathVariable'],
                    },
                ],
            },
        },
        {
            uuid: 'f2ee713a-c7cf-4b27-ae91-a84606b4877a',
            name: 'authority_server_address',
            description: 'Server hostname where ADCS is running',
            type: 'data',
            contentType: 'string',
            properties: {
                label: 'ADCS server address',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
            constraints: [
                {
                    description: 'Address of ADCS Server',
                    errorMessage: 'Enter Valid Address',
                    type: 'regExp',
                    data: '^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9]))$',
                },
            ],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b4',
            name: 'authority_winrm_transport',
            description: 'Choose the transport type to use for communication with ADCS',
            content: [
                {
                    reference: 'CredSSP',
                    data: 'credssp',
                },
            ],
            type: 'data',
            contentType: 'string',
            properties: {
                label: 'WinRM Transport',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
    ] as AttributeDescriptorDto[],
    connectorResponseDtoArray: [] as ConnectorResponseDto[],
    callbackSuccessObjectArray: [
        {
            reference: 'lab01-testssh',
            data: {
                uuid: '91c105e3-29d4-46e5-88c3-2ba7fb1fbd40',
                name: 'lab01-testssh',
            },
        },
    ],
};

export const constraintTypesCheckMockData = {
    attributeDescriptors: [
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'String',
            type: AttributeType.Data,
            contentType: AttributeContentType.String,
            properties: {
                label: 'String',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
            constraints: [
                {
                    type: AttributeConstraintType.RegExp,
                    data: '^_(.*)_$',
                },
            ],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'Integer',
            type: AttributeType.Data,
            contentType: AttributeContentType.Integer,
            properties: {
                label: 'Integer',
                list: false,
                multiSelect: false,
                readOnly: false,
                required: false,
                visible: true,
            },
            constraints: [
                {
                    type: AttributeConstraintType.Range,
                    data: {
                        from: 1,
                        to: 10,
                    },
                    errorMessage: 'Value should be between 1 and 10',
                },
            ],
        },
        {
            uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
            name: 'TextSelect',
            type: AttributeType.Data,
            contentType: AttributeContentType.Text,
            properties: {
                label: 'TextSelect',
                list: true,
                multiSelect: false,
                readOnly: false,
                required: true,
                visible: true,
            },
            content: [{ data: 'Option1' }, { data: 'Option2' }],
        },
    ] as AttributeDescriptorModel[],
};

export const tabAttributeEditorMockData = {
    tokenProfileDtoArray: [] as TokenProfileDto[],
    certificateGroupSelectArray: [],
    customAttributeDtoArray: [
        {
            uuid: '4b42fe2c-2d59-4a62-8880-38a47d2c7db2',
            name: 'Distribution method',
            description: 'te2',
            content: [
                {
                    data: 'Printer',
                },
                {
                    data: 'Disk',
                },
            ],
            type: 'custom',
            contentType: 'string',
            properties: {
                label: 'Distribution method',
                visible: true,
                group: 'Test',
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
    ] as CustomAttributeDto[],
    baseAttributeDtoArray: [
        {
            uuid: '61a228de-c54e-461e-b0d7-ad156a547b51',
            name: 'data_keyAlias',
            description: 'Alias for the Key that should be unique within the Token',
            type: 'data',
            contentType: 'string',
            properties: {
                label: 'Cryptographic Key Alias',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: '72159c04-d1a9-4703-8b23-469224425d5f',
            name: 'data_keyAlgorithm',
            description: 'Select one of the supported cryptographic key algorithms',
            content: [
                {
                    reference: 'RSA',
                    data: 'RSA',
                },
            ],
            type: 'data',
            contentType: 'string',
            properties: {
                label: 'Cryptographic Key Algorithm',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
        {
            uuid: 'dfcfb71f-a161-4aa7-8b1f-726b477b3492',
            name: 'group_keySpec',
            description: 'Cryptographic Key Specification',
            type: 'group',
            attributeCallback: {
                mappings: [
                    {
                        from: 'data_keyAlgorithm.reference',
                        to: 'algorithm',
                        targets: ['pathVariable'],
                    },
                ],
            },
        },
    ] as BaseAttributeDto[],
    callbackSuccessObjectArray: [
        {
            uuid: 'aa7df6ff-1d64-4a1a-96d6-6c7aeadfbdf3',
            name: 'data_rsaKeySize',
            description: 'Size of the RSA Key in bits',
            content: [
                {
                    reference: 'RSA_1024',
                    data: 1024,
                },
            ],
            type: 'data',
            contentType: 'integer',
            properties: {
                label: 'RSA Key Size',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
    ],
};

export const globalModalAttributeEditorMockData = {
    connectorDtoArrayOne: [] as ConnectorDto[],
    baseAttributeDtoArrayOne: [
        {
            uuid: '5e9146a6-da8a-403f-99cb-d5d64d93ce1c',
            name: 'host',
            description: 'Hostname or IP address of the target system',
            type: 'data',
            contentType: 'string',
            properties: {
                label: 'Hostname / IP address',
                visible: true,
                required: true,
                readOnly: false,
                list: false,
                multiSelect: false,
            },
        },
        {
            uuid: 'c6d5a3ef-bed6-49c6-ae51-2768026a8052',
            name: 'authType',
            description: 'Authentication type to create the Entity instance',
            content: [
                {
                    reference: 'Basic',
                    data: 'Basic',
                },
            ],
            type: 'data',
            contentType: 'string',
            properties: {
                label: 'Authentication Type',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
        },
        {
            uuid: '931073c0-0765-4e6d-904e-8b6364bb66ec',
            name: 'credential',
            description: 'Credential to authenticate to target server',
            type: 'data',
            contentType: 'credential',
            properties: {
                label: 'Credential',
                visible: true,
                required: true,
                readOnly: false,
                list: true,
                multiSelect: false,
            },
            attributeCallback: {
                mappings: [
                    {
                        from: 'authType',
                        to: 'credentialKind',
                        targets: ['pathVariable'],
                    },
                ],
            },
        },
    ] as BaseAttributeDto[],
    callbackSuccessObjectArrayOne: [],
    globalModalModelObject: {
        title: 'Add New credential',
        content: <CredentialForm usesGlobalModal />,
        isOpen: true,
        size: 'lg',
    } as GlobalModalModel,
    connectorDtoArrayTwo: [
        {
            uuid: '2827dd7e-6e66-4076-85f4-f1d21bb4ac22',
            name: 'Common-Credential-Connector',
            functionGroups: [
                {
                    functionGroupCode: 'credentialProvider',
                    kinds: ['SoftKeyStore', 'Basic', 'ApiKey'],
                    endPoints: [
                        {
                            uuid: '886eee93-8a82-4fa0-bee0-60eb4bed766f',
                            name: 'listSupportedFunctions',
                            context: '/v1',
                            method: 'GET',
                            required: false,
                        },
                    ],
                    uuid: 'e8ae0a8c-ed12-4f63-804f-2659ee9dff6e',
                    name: 'credentialProvider',
                },
            ],
        },
    ] as ConnectorDto[],
    baseAttributeDtoArrayTwo: [] as BaseAttributeDto[],
    callbackSuccessObjectArrayTwo: [
        {
            reference: 'testabc123',
            data: {
                uuid: '2b2c6e64-9081-4750-a062-c84be728202d',
                name: 'testabc123',
            },
        },
    ],
};

export const attributeContentTypesMockData = {
    basicFields: {
        id: 'test',
        attributes: [
            {
                uuid: '06cf66eb-5c0e-4edf-8308-617565a546b0',
                name: 'SetFile',
                type: AttributeType.Data,
                contentType: AttributeContentType.File,
                content: [
                    {
                        reference: 'content',
                        data: {
                            content:
                                'ewogICAgIm5hbWUiOiAiVXNpbmcgZml4dHVyZXMgdG8gcmVwcmVzZW50IGRhdGEiLAogICAgImVtYWlsIjogImhlbGxvQGN5cHJlc3MuaW8iLAogICAgImJvZHkiOiAiRml4dHVyZXMgYXJlIGEgZ3JlYXQgd2F5IHRvIG1vY2sgZGF0YSBmb3IgcmVzcG9uc2VzIHRvIHJvdXRlcyIKfQo=',
                            fileName: 'example.json',
                            mimeType: 'application/json',
                        },
                    },
                ],
            },
        ] as AttributeResponseModel[],
        attributeDescriptors: [
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
                name: 'String',
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'String',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b1',
                name: 'Text',
                content: [],
                type: AttributeType.Data,
                contentType: AttributeContentType.Text,
                properties: {
                    label: 'Text',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b2',
                name: 'Integer',
                type: AttributeType.Data,
                contentType: AttributeContentType.Integer,
                properties: {
                    label: 'Integer',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b3',
                name: 'Boolean',
                type: AttributeType.Data,
                contentType: AttributeContentType.Boolean,
                properties: {
                    label: 'Boolean',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b4',
                name: 'Float',
                type: AttributeType.Data,
                contentType: AttributeContentType.Float,
                properties: {
                    label: 'Float',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b5',
                name: 'Date',
                type: AttributeType.Data,
                contentType: AttributeContentType.Date,
                properties: {
                    label: 'Date',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b6',
                name: 'Time',
                type: AttributeType.Data,
                contentType: AttributeContentType.Time,
                properties: {
                    label: 'Time',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d67',
                name: 'DatetimeSimple',
                type: AttributeType.Data,
                contentType: AttributeContentType.Datetime,
                properties: {
                    label: 'Datetime',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565addd7',
                name: 'DatetimeSelect',
                type: AttributeType.Data,
                contentType: AttributeContentType.Datetime,
                properties: {
                    label: 'DatetimeSelect',
                    visible: true,
                    required: false,
                    readOnly: false,
                    list: true,
                    multiSelect: false,
                },
                content: [
                    {
                        data: '2017-06-01T08:30',
                    },
                    {
                        data: '2022-01-01T12:30',
                    },
                ],
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565adda7',
                name: 'DatetimeMultiselect',
                type: AttributeType.Data,
                contentType: AttributeContentType.Datetime,
                properties: {
                    label: 'DatetimeMultiselect',
                    visible: true,
                    required: false,
                    readOnly: false,
                    list: true,
                    multiSelect: true,
                },
                content: [
                    {
                        data: '2017-06-01T08:30',
                    },
                    {
                        data: '2022-01-01T12:30',
                    },
                ],
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b9',
                name: 'Secret',

                type: AttributeType.Data,
                contentType: AttributeContentType.Secret,
                properties: {
                    label: 'Secret',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a546b0',
                name: 'File',
                type: AttributeType.Data,
                contentType: AttributeContentType.File,
                properties: {
                    label: 'File',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c0e-0fdf-8308-617565a546b0',
                name: 'DefaultFile',
                type: AttributeType.Data,
                contentType: AttributeContentType.File,
                properties: {
                    label: 'DefaultFile',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
                content: [
                    {
                        reference: 'content',
                        data: {
                            content:
                                'ewogICAgIm5hbWUiOiAiVXNpbmcgZml4dHVyZXMgdG8gcmVwcmVzZW50IGRhdGEiLAogICAgImVtYWlsIjogImhlbGxvQGN5cHJlc3MuaW8iLAogICAgImJvZHkiOiAiRml4dHVyZXMgYXJlIGEgZ3JlYXQgd2F5IHRvIG1vY2sgZGF0YSBmb3IgcmVzcG9uc2VzIHRvIHJvdXRlcyIKfQo=',
                            fileName: 'example.json',
                            mimeType: 'application/json',
                        },
                    },
                ],
            },
            {
                uuid: '06cf66eb-5c0e-4edf-8308-617565a546b0',
                name: 'SetFile',
                type: AttributeType.Data,
                contentType: AttributeContentType.File,
                properties: {
                    label: 'SetFile',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
                name: 'Credential',
                type: AttributeType.Data,
                contentType: AttributeContentType.Credential,
                properties: {
                    label: 'Credential',
                    list: true,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
                content: [
                    {
                        reference: 'Credential1',
                        data: {
                            uuid: '0bc86bea-d2cf-4ca2-ac8f-01d5d3d99c73',
                            name: 'Credential1',
                        },
                    },
                    {
                        reference: 'Credential2',
                        data: {
                            uuid: '1b34f386-ee3b-47ea-a0c2-0bff311ffcde',
                            name: 'Credential2',
                        },
                    },
                ],
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617535a5d6b0',
                name: 'Codeblock',
                type: AttributeType.Data,
                contentType: AttributeContentType.Codeblock,
                properties: {
                    label: 'Codeblock',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
                content: [
                    {
                        data: {
                            language: 'html',
                        },
                    },
                ],
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a1d6b0',
                name: 'Object',
                type: AttributeType.Data,
                contentType: AttributeContentType.Object,
                properties: {
                    label: 'Object',
                    list: true,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
                content: [
                    {
                        reference: 'Object1',
                        data: {
                            prop1: 'prop1',
                            prop2: 'prop2',
                        },
                    },
                    {
                        reference: 'Object2',
                        data: {
                            prop1: 'prop1',
                            prop2: 'prop2',
                        },
                    },
                ],
            },
        ] as AttributeDescriptorModel[],
    },
    customAttributes: {
        id: 'test',
        attributeDescriptors: [
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b0',
                name: 'CustomRequiredBoolean',
                type: AttributeType.Custom,
                contentType: AttributeContentType.Boolean,
                properties: {
                    label: 'CustomRequiredBoolean',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: true,
                    visible: true,
                },
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b1',
                name: 'CustomString',
                type: AttributeType.Custom,
                contentType: AttributeContentType.String,
                properties: {
                    label: 'CustomString',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
                content: [
                    {
                        data: 'default-content',
                    },
                ],
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a5d6b2',
                name: 'CustomBoolean',
                type: AttributeType.Custom,
                contentType: AttributeContentType.Boolean,
                properties: {
                    label: 'CustomBoolean',
                    list: false,
                    multiSelect: false,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
            },

            {
                uuid: '06cf66eb-5c1e-4edf-8308-617565a536b2',
                name: 'CustomMultiselectText',
                type: AttributeType.Custom,
                contentType: AttributeContentType.Text,
                properties: {
                    label: 'CustomMultiselectText',
                    list: true,
                    multiSelect: true,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
                content: [
                    {
                        data: 'Option1',
                    },
                    {
                        data: 'Option2',
                    },
                    {
                        data: 'Option3',
                    },
                    {
                        data: 'Option4',
                    },
                ],
            },
            {
                uuid: '06cf66eb-5c1e-4edf-8308-617b65a586b2',
                name: 'CustomMultiselectReference',
                type: AttributeType.Custom,
                contentType: AttributeContentType.Text,
                properties: {
                    label: 'CustomMultiselectReference',
                    list: true,
                    multiSelect: true,
                    readOnly: false,
                    required: false,
                    visible: true,
                },
                content: [
                    {
                        reference: 'Option1',
                        data: 'Option1',
                    },
                    {
                        reference: 'Option2',
                        data: 'Option2',
                    },
                    {
                        reference: 'Option3',
                        data: 'Option3',
                    },
                    {
                        reference: 'Option4',
                        data: 'Option4',
                    },
                ],
            },
        ] as AttributeDescriptorModel[],
    },
};

export interface GroupAttributeTestFormValues {
    name: string;
    description: string;
    authority: { value: any; label: string } | undefined;
}

export interface ConstraintCheckAttributeTestFormValues {
    name: string | undefined;
    authorityProvider: { value: string; label: string } | undefined;
    storeKind: { value: string; label: string } | undefined;
}

export interface TabAttributeFormValues {
    raProfile: SingleValue<{ label: string; value: RaProfileResponseModel }> | null;
    pkcs10: File | null;
    uploadCsr?: SingleValue<{ label: string; value: boolean }> | null;
    tokenProfile?: SingleValue<{ label: string; value: TokenProfileResponseModel }> | null;
    key?: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }> | null;
}

export interface GlobalModalAttributeEditorFormValues {
    name: string | undefined;
    entityProvider: { value: string; label: string } | undefined;
    storeKind: { value: string; label: string } | undefined;
}
