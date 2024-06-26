import { CustomNode } from 'components/FlowChart';
import CertificateStatus from 'components/_pages/certificates/CertificateStatus';
import { Edge, MarkerType } from 'reactflow';
import {
    CertificateBulkDeleteRequestDto,
    CertificateBulkDeleteRequestModel,
    CertificateBulkDeleteResponseDto,
    CertificateBulkDeleteResponseModel,
    CertificateBulkObjectDto,
    CertificateBulkObjectModel,
    CertificateChainResponseModel,
    CertificateComplianceCheckModel,
    CertificateComplianceResponseDto,
    CertificateComplianceResponseModel,
    CertificateContentResponseDto,
    CertificateContentResponseModel,
    CertificateDetailResponseDto,
    CertificateDetailResponseModel,
    CertificateHistoryDto,
    CertificateHistoryModel,
    CertificateListResponseDto,
    CertificateListResponseModel,
    CertificateObjectDto,
    CertificateObjectModel,
    CertificateRekeyRequestDto,
    CertificateRekeyRequestModel,
    CertificateRenewRequestDto,
    CertificateRenewRequestModel,
    CertificateRevokeRequestDto,
    CertificateRevokeRequestModel,
    CertificateSignRequestDto,
    CertificateSignRequestModel,
    CertificateUploadDto,
    CertificateUploadModel,
    RaProfileSimplifiedDto,
    RaProfileSimplifiedModel,
    SearchFieldDto,
    SearchFieldListDto,
    SearchFieldListModel,
    SearchFieldModel,
    SearchFilterDto,
    SearchFilterModel,
    SearchRequestDto,
    SearchRequestModel,
} from 'types/certificate';
import { OtherProperties } from 'types/flowchart';
import { LocationResponseModel } from 'types/locations';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { UserResponseModel } from 'types/users';
import { CertificateChainResponseDto, CertificateComplianceCheckDto } from '../../types/openapi';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';
import { transformCertificateGroupResponseDtoToModel } from './certificateGroups';
import { transformLocationResponseDtoToModel, transformMetadataDtoToModel } from './locations';
export function transformSearchFilterModelToDto(search: SearchFilterModel): SearchFilterDto {
    return { ...search };
}

export function transformSearchRequestModelToDto(search: SearchRequestModel): SearchRequestDto {
    return {
        ...search,
        filters: search.filters?.map(transformSearchFilterModelToDto),
    };
}

export function transformRaProfileSimplifiedDtoToModel(raProfile: RaProfileSimplifiedDto): RaProfileSimplifiedModel {
    return { ...raProfile };
}

export function transformCertificateComplianceResponseDtoToModel(
    cerCompliance: CertificateComplianceResponseDto,
): CertificateComplianceResponseModel {
    return {
        ...cerCompliance,
        attributes: cerCompliance.attributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformCertificateDetailResponseDtoToModel(certificate: CertificateDetailResponseDto): CertificateDetailResponseModel {
    return {
        ...certificate,
        metadata: certificate.metadata?.map(transformMetadataDtoToModel),
        raProfile: certificate.raProfile ? transformRaProfileSimplifiedDtoToModel(certificate.raProfile) : undefined,
        locations: certificate.locations?.map(transformLocationResponseDtoToModel),
        groups: certificate.groups?.length ? certificate.groups.map(transformCertificateGroupResponseDtoToModel) : undefined,
        nonCompliantRules: certificate.nonCompliantRules?.map(transformCertificateComplianceResponseDtoToModel),
        customAttributes: certificate.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformCertificateResponseDtoToModel(certificate: CertificateListResponseDto): CertificateListResponseModel {
    return {
        ...certificate,
        raProfile: certificate.raProfile ? transformRaProfileSimplifiedDtoToModel(certificate.raProfile) : undefined,
        groups: certificate.groups?.length ? certificate.groups.map(transformCertificateGroupResponseDtoToModel) : undefined,
    };
}

export function transformCertificateListResponseDtoToModel(certificates: CertificateListResponseDto): CertificateListResponseModel {
    return {
        ...certificates,
    };
}

export function transformCertificateContentResponseDtoToModel(contents: CertificateContentResponseDto): CertificateContentResponseModel {
    return {
        ...contents,
    };
}

export function transformCertificateSignRequestModelToDto(signRequest: CertificateSignRequestModel): CertificateSignRequestDto {
    return {
        ...signRequest,
        attributes: signRequest.attributes.map(transformAttributeRequestModelToDto),
        customAttributes: signRequest.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformCertificateRevokeRequestModelToDto(revokeRequest: CertificateRevokeRequestModel): CertificateRevokeRequestDto {
    return {
        ...revokeRequest,
        attributes: revokeRequest.attributes.map(transformAttributeRequestModelToDto),
    };
}

export function transformCertificateRenewRequestModelToDto(renewRequest: CertificateRenewRequestModel): CertificateRenewRequestDto {
    return { ...renewRequest };
}

export function transformCertificateRekeyRequestModelToDto(rekeyRequest: CertificateRekeyRequestModel): CertificateRekeyRequestDto {
    return { ...rekeyRequest };
}

export function transformSearchFieldDtoToModel(searchField: SearchFieldDto): SearchFieldModel {
    return { ...searchField };
}

export function transformSearchFieldListDtoToModel(searchFields: SearchFieldListDto): SearchFieldListModel {
    return {
        ...searchFields,
        searchFieldData: searchFields.searchFieldData?.map(transformSearchFieldDtoToModel),
    };
}

export function transformCertificateHistoryDtoToModel(history: CertificateHistoryDto): CertificateHistoryModel {
    return { ...history };
}

export function transformCertificateObjectModelToDto(certificateObject: CertificateObjectModel): CertificateObjectDto {
    return { ...certificateObject };
}

export function transformCertificateBulkObjectModelToDto(bulk: CertificateBulkObjectModel): CertificateBulkObjectDto {
    return {
        ...bulk,
        filters: bulk.filters?.map(transformSearchFilterModelToDto),
    };
}

export function transformCertificateBulkDeleteRequestModelToDto(bulk: CertificateBulkDeleteRequestModel): CertificateBulkDeleteRequestDto {
    return {
        ...bulk,
        filters: bulk.filters?.map(transformSearchFilterModelToDto),
    };
}

export function transformCertificateBulkDeleteResponseDtoToModel(
    bulk: CertificateBulkDeleteResponseDto,
): CertificateBulkDeleteResponseModel {
    return { ...bulk };
}

export function transformCertificateUploadModelToDto(upload: CertificateUploadModel): CertificateUploadDto {
    return {
        ...upload,
        customAttributes: upload.customAttributes.map(transformAttributeRequestModelToDto),
    };
}

export function transformCertificateComplianceCheckModelToDto(check: CertificateComplianceCheckModel): CertificateComplianceCheckDto {
    return { ...check };
}

export function transformCertifacetObjectToNodesAndEdges(
    certificate?: CertificateDetailResponseModel,
    users?: UserResponseModel[],
    locations?: LocationResponseModel[],
    raProfileSelected?: RaProfileResponseModel,
    certificateChain?: CertificateChainResponseModel,
) {
    const nodes: CustomNode[] = [];
    const edges: Edge[] = [];

    if (!certificate) {
        return { nodes, edges };
    }

    const otherPropertiesCurrentCertificate: OtherProperties[] = [
        {
            propertyName: 'State',
            propertyContent: <CertificateStatus status={certificate.state} />,
        },
    ];

    if (certificate?.validationStatus) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Validation Status',
            propertyContent: <CertificateStatus status={certificate.validationStatus} />,
        });
    }

    otherPropertiesCurrentCertificate.push({
        propertyName: 'Subject DN',
        propertyValue: certificate.subjectDn,
        copyable: true,
    });

    if (certificate?.serialNumber) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Serial Number',
            propertyValue: certificate.serialNumber,
            copyable: true,
        });
    }
    if (certificate?.fingerprint) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Fingerprint',
            propertyValue: certificate.fingerprint,
            copyable: true,
        });
    }

    if (!certificateChain?.certificates?.length && !certificateChain?.completeChain) {
        if (certificate?.issuerDn) {
            otherPropertiesCurrentCertificate.push({
                propertyName: 'Issuer DN',
                propertyValue: certificate.issuerDn,
                copyable: true,
            });
        }
        if (certificate?.issuerSerialNumber) {
            otherPropertiesCurrentCertificate.push({
                propertyName: 'Issuer Sr. No.',
                propertyValue: certificate.issuerSerialNumber,
                copyable: true,
            });
        }
    }
    nodes.push({
        id: '1',
        type: 'customFlowNode',
        position: { x: 0, y: 0 },
        // width: nodeWidth,
        // height: nodeHeight,
        data: {
            customNodeCardTitle: 'Current Certificate',
            entityLabel: certificate.commonName,
            icon: 'fa fa-certificate',
            isMainNode: true,
            certificateNodeData: {
                certificateNodeStatus: certificate.state,
                certificateNodeValidationStatus: certificate.validationStatus,
            },
            otherProperties: otherPropertiesCurrentCertificate,
        },
    });

    if (certificateChain && certificateChain?.certificates?.length) {
        certificateChain.certificates.forEach((chain, index) => {
            const chainLength = certificateChain?.certificates?.length || 0;

            const otherProperties: OtherProperties[] = [
                {
                    propertyName: 'State',
                    propertyContent: <CertificateStatus status={chain.state} />,
                },
                {
                    propertyName: 'Validation Status',
                    propertyContent: <CertificateStatus status={chain.validationStatus} />,
                },
                {
                    propertyName: 'Subject DN',
                    propertyValue: chain.subjectDn,
                    copyable: true,
                },
            ];

            if (chain?.serialNumber) {
                otherProperties.push({
                    propertyName: 'Serial Number',
                    propertyValue: chain?.serialNumber,
                    copyable: true,
                });
            }

            if (chain?.fingerprint) {
                otherProperties.push({
                    propertyName: 'Fingerprint',
                    propertyValue: chain.fingerprint,
                    copyable: true,
                });
            }

            if (chainLength - 1 === index && !certificateChain?.completeChain) {
                if (chain?.issuerDn) {
                    otherProperties.push({
                        propertyName: 'Issuer DN',
                        propertyValue: chain.issuerDn,
                        copyable: true,
                    });
                }
                if (chain?.issuerSerialNumber) {
                    otherProperties.push({
                        propertyName: 'Issuer Sr. No.',
                        propertyValue: chain.issuerSerialNumber,
                        copyable: true,
                    });
                }
            }

            nodes.push({
                id: `chain-${index}`,
                type: 'customFlowNode',
                position: { x: 0, y: 0 },
                // width: nodeWidth,
                // height: nodeHeight,
                data: {
                    customNodeCardTitle: chainLength - 1 === index && certificateChain?.completeChain ? `Root CA` : `Intermediate CA`,
                    redirectUrl: chain?.uuid ? `/certificates/detail/${chain.uuid}` : undefined,
                    entityLabel: chain.commonName,
                    icon: chainLength - 1 === index && certificateChain?.completeChain ? 'fa fa-medal' : 'fa fa-certificate',
                    // isMainNode: true,
                    certificateNodeData: {
                        certificateNodeStatus: chain.state,
                        certificateNodeValidationStatus: chain.validationStatus,
                    },
                    otherProperties: otherProperties,
                },
            });
            edges.push({
                id: `e1-chain-${index}`,
                // source: "1",
                source: index === 0 ? '1' : `chain-${index - 1}`,
                // target: `chain-${index}`,
                target: `chain-${index}`,
                type: 'floating',
                markerEnd: { type: MarkerType.Arrow },
            });
        });
    }

    if (users?.length) {
        const user = users.find((u) => u.username === certificate?.owner);
        if (user) {
            const userOtherProperties: OtherProperties[] = [
                {
                    propertyName: 'Username',
                    propertyValue: user.username,
                    copyable: true,
                },
                { propertyName: 'User UUID', propertyValue: user.uuid, copyable: true },
                {
                    propertyName: 'User Enabled',
                    propertyValue: user.enabled ? 'Yes' : 'No',
                },
            ];

            if (user?.email) {
                userOtherProperties.push({
                    propertyName: 'Email',
                    propertyValue: user.email,
                    copyable: true,
                });
            }

            nodes.push({
                id: '2',
                type: 'customFlowNode',
                position: { x: 0, y: 0 },
                // width: nodeWidth,
                // height: nodeHeight,
                data: {
                    customNodeCardTitle: 'Owner',
                    icon: 'fa fa fa-user',
                    entityLabel: user?.username || '',
                    description: user?.description || '',
                    redirectUrl: user?.uuid ? `/users/detail/${user?.uuid}` : undefined,
                    otherProperties: userOtherProperties,
                },
            });
            edges.push({
                id: 'e1-2',
                source: '1',
                target: '2',
                type: 'floating',
                markerEnd: { type: MarkerType.Arrow },
            });
        }
    }

    if (certificate?.key) {
        const keyOtherProperties: OtherProperties[] = [];

        if (certificate?.key?.owner) {
            keyOtherProperties.push({
                propertyName: 'Key Owner',
                propertyValue: certificate.key.owner,
                copyable: true,
            });
        }

        if (certificate?.key?.tokenProfileName) {
            keyOtherProperties.push({
                propertyName: 'Key Token ProfileName',
                propertyValue: certificate.key.tokenProfileName,
                copyable: true,
            });
        }
        nodes.push({
            id: '4',
            type: 'customFlowNode',
            position: { x: 0, y: 0 },
            // width: nodeWidth,
            // height: nodeHeight,
            data: {
                customNodeCardTitle: 'Key',
                entityLabel: certificate?.key?.name || '',
                icon: 'fa fa fa-key',
                description: certificate?.key?.description || '',
                redirectUrl:
                    certificate?.key?.uuid && certificate?.key?.tokenInstanceUuid
                        ? `/keys/detail/${certificate.key.tokenInstanceUuid}/${certificate.key.uuid}`
                        : undefined,
                otherProperties: keyOtherProperties,
            },
        });
        edges.push({
            id: 'e1-4',
            source: '4',
            target: '1',
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
        });
    }

    if (certificate?.groups?.length) {
        certificate?.groups.forEach((group) => {
            nodes.push({
                id: '3',
                type: 'customFlowNode',
                position: { x: 0, y: 0 },
                // width: nodeWidth,
                // height: nodeHeight,
                data: {
                    customNodeCardTitle: 'Group',
                    description: group?.description || '',
                    icon: 'fa fa fa-users',
                    entityLabel: group?.name || '',
                    redirectUrl: group?.uuid ? `/groups/detail/${group?.uuid}` : undefined,
                },
            });
            edges.push({
                id: 'e1-3',
                source: '3',
                target: '1',
                type: 'floating',
                markerEnd: { type: MarkerType.Arrow },
            });
        });
    }

    if (certificate?.raProfile) {
        const raProfileOtherProperties: OtherProperties[] = [];

        if (certificate?.raProfile?.enabled) {
            raProfileOtherProperties.push({
                propertyName: 'RA Profile Enabled',
                propertyValue: certificate.raProfile.enabled ? 'Yes' : 'No',
            });
        }

        nodes.push({
            id: '5',
            type: 'customFlowNode',
            position: { x: 0, y: 0 },
            // width: nodeWidth,
            // height: nodeHeight,
            data: {
                customNodeCardTitle: 'RA Profile',
                icon: 'fa fa fa-address-card',
                entityLabel: certificate?.raProfile?.name || '',
                redirectUrl:
                    certificate?.raProfile?.uuid && certificate?.raProfile.authorityInstanceUuid
                        ? `/raProfiles/detail/${certificate.raProfile.authorityInstanceUuid}/${certificate.raProfile.uuid}`
                        : undefined,
                otherProperties: raProfileOtherProperties,
            },
        });
        edges.push({
            id: 'e1-5',
            source: '1',
            target: '5',
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
        });

        if (raProfileSelected) {
            nodes.push({
                id: '7',
                type: 'customFlowNode',
                position: { x: 0, y: 0 },
                // width: nodeWidth,
                // height: nodeHeight,
                data: {
                    customNodeCardTitle: 'Authority',
                    icon: 'fa fa fa-stamp',
                    entityLabel: raProfileSelected.authorityInstanceName || '',
                    redirectUrl: `/authorities/detail/${raProfileSelected.authorityInstanceUuid}`,
                    otherProperties: [
                        {
                            propertyName: 'Authority Instance Name',
                            propertyValue: raProfileSelected.authorityInstanceName,
                            copyable: true,
                        },

                        {
                            propertyName: 'Authority UUID',
                            propertyValue: raProfileSelected.authorityInstanceUuid,
                            copyable: true,
                        },
                    ],
                },
            });
            edges.push({
                id: 'e7-5',
                target: '7',
                source: '5',
                type: 'floating',
                markerEnd: { type: MarkerType.Arrow },
            });
        }
    }
    if (locations?.length) {
        locations.forEach((location) => {
            const otherPropertiesLocation: OtherProperties[] = [
                {
                    propertyName: 'Location Enabled',
                    propertyValue: location.enabled ? 'Yes' : 'No',
                },
            ];
            if (location?.description) {
                otherPropertiesLocation.push({
                    propertyName: 'Description',
                    propertyValue: location?.description,
                });
            }
            nodes.push({
                id: location?.uuid || '',
                type: 'customFlowNode',
                position: { x: 0, y: 0 },
                // width: nodeWidth,
                // height: nodeHeight,
                data: {
                    customNodeCardTitle: 'Location',
                    icon: 'fa fa fa-map-marker',
                    entityLabel: location?.name || '',
                    redirectUrl: location?.uuid ? `/locations/detail/${certificate?.uuid}/${location?.uuid}` : undefined,
                    otherProperties: otherPropertiesLocation,
                },
            });
            edges.push({
                id: `e${location?.uuid}-1`,
                target: location?.uuid || '',
                source: '1',
                type: 'floating',
                markerEnd: { type: MarkerType.Arrow },
            });
        });
    }

    return { nodes, edges };
}

export function transformCertificateChainDownloadResponseDtoToCertificateChainResponseModel(
    certificateChain: CertificateChainResponseDto,
): CertificateChainResponseModel {
    return {
        ...certificateChain,
        certificates: certificateChain.certificates?.map(transformCertificateDetailResponseDtoToModel),
        completeChain: certificateChain.completeChain,
    };
}
