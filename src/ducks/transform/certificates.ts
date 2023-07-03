import { CustomNode } from "components/FlowChart";
import { Edge } from "reactflow";
import {
    CertificateBulkDeleteRequestDto,
    CertificateBulkDeleteRequestModel,
    CertificateBulkDeleteResponseDto,
    CertificateBulkDeleteResponseModel,
    CertificateBulkObjectDto,
    CertificateBulkObjectModel,
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
} from "types/certificate";
import { UserResponseModel } from "types/users";
import { CertificateComplianceCheckDto } from "../../types/openapi";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import { transformCertificateGroupResponseDtoToModel } from "./certificateGroups";
import { transformLocationResponseDtoToModel, transformMetadataDtoToModel } from "./locations";

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
        group: certificate.group ? transformCertificateGroupResponseDtoToModel(certificate.group) : undefined,
        nonCompliantRules: certificate.nonCompliantRules?.map(transformCertificateComplianceResponseDtoToModel),
        customAttributes: certificate.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformCertificateResponseDtoToModel(certificate: CertificateListResponseDto): CertificateListResponseModel {
    return {
        ...certificate,
        raProfile: certificate.raProfile ? transformRaProfileSimplifiedDtoToModel(certificate.raProfile) : undefined,
        group: certificate.group ? transformCertificateGroupResponseDtoToModel(certificate.group) : undefined,
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

export function transformCertifacetObjectToNodesAndEdges(certificate: CertificateDetailResponseModel, users: UserResponseModel[]) {
    const nodes: CustomNode[] = [];
    const edges: Edge[] = [];

    edges.push({
        id: "e0-1",
        source: "0",
        target: "6",
        type: "default",
    });

    nodes.push({
        id: "1",
        type: "customFlowNode",
        position: { x: 0, y: 0 },
        data: {
            entityType: "Certificate",
            entityLabel: certificate.commonName,
            icon: "fa fa-certificate",
            isMainNode: true,
            otherProperties: [
                {
                    propertyName: "Serial Number",
                    propertyValue: certificate?.serialNumber || "NA",
                },
                {
                    propertyName: "Subject DN",
                    propertyValue: certificate?.subjectDn || "NA",
                },
                {
                    propertyName: "certificateType",
                    propertyValue: certificate?.certificateType || "NA",
                },
            ],
        },
    });
    const user = users.find((u) => u.username === certificate?.owner);

    if (certificate?.key) {
        nodes.push({
            id: "4",
            type: "customFlowNode",
            position: { x: 0, y: 0 },
            data: {
                entityType: "Key",
                entityLabel: certificate?.key?.name || "",
                icon: "fa fa fa-key",
                handleHide: "target",
                description: certificate?.key?.description || "",
                redirectUrl:
                    certificate?.key?.uuid && certificate?.key?.tokenInstanceUuid
                        ? `/cryptographicKeys/detail/${certificate.key.tokenInstanceUuid}/${certificate.key.uuid}`
                        : undefined,
                otherProperties: [
                    {
                        propertyName: "Key Owner",
                        propertyValue: certificate?.key?.owner || "NA",
                    },
                    {
                        propertyName: "Key Token ProfileName",
                        propertyValue: certificate?.key?.tokenProfileName || "NA",
                    },
                ],
            },
        });
        edges.push({
            id: "e1-4",
            source: "4",
            target: "1",
            type: "default",
        });
    }

    if (certificate?.issuerCommonName) {
        nodes.push({
            id: "6",
            type: "customFlowNode",
            position: { x: 0, y: 0 },
            data: {
                entityType: "Certificate Issuer",
                icon: "fa fa fa fa-stamp",
                entityLabel: certificate?.issuerCommonName || "",
                handleHide: "target",
                otherProperties: [
                    {
                        propertyName: "Issuer DN",
                        propertyValue: certificate?.issuerDn || "NA",
                    },
                    {
                        propertyName: "Issuer Sr. No.",
                        propertyValue: certificate?.issuerSerialNumber || "NA",
                    },
                ],
            },
        });
        edges.push({
            id: "e1-6",
            source: "6",
            target: "1",
            type: "default",
        });
    }

    if (user) {
        nodes.push({
            id: "2",
            type: "customFlowNode",
            position: { x: 0, y: 0 },
            data: {
                entityType: "Owner",
                icon: "fa fa fa-user",
                handleHide: "source",
                entityLabel: user?.username || "",
                description: user?.description || "",
                redirectUrl: user?.uuid ? `/users/detail/${user?.uuid}` : undefined,
                otherProperties: [
                    {
                        propertyName: "User Email",
                        propertyValue: user?.email || "NA",
                    },
                    {
                        propertyName: "User Enabled",
                        propertyValue: user?.enabled !== undefined ? (user?.enabled ? "Yes" : "No") : "NA",
                    },
                ],
            },
        });
        edges.push({
            id: "e1-2",
            source: "1",
            target: "2",
            type: "default",
        });
    }

    if (certificate?.group) {
        nodes.push({
            id: "3",
            type: "customFlowNode",
            position: { x: 0, y: 0 },
            data: {
                entityType: "Group",
                handleHide: "target",
                description: certificate?.group?.description || "",
                icon: "fa fa fa-users",
                entityLabel: certificate?.group?.name || "",
                redirectUrl: certificate?.group?.uuid ? `/groups/detail/${certificate?.group?.uuid}` : undefined,
            },
        });
        edges.push({
            id: "e1-3",
            source: "3",
            target: "1",
            type: "default",
        });
    }

    if (certificate?.raProfile) {
        nodes.push({
            id: "5",
            type: "customFlowNode",
            position: { x: 0, y: 0 },
            data: {
                entityType: "Ra Profile",
                icon: "fa fa fa-address-card",
                handleHide: "source",
                entityLabel: certificate?.raProfile?.name || "",
                redirectUrl:
                    certificate?.raProfile?.uuid && certificate?.raProfile.authorityInstanceUuid
                        ? `/raProfiles/detail/${certificate.raProfile.authorityInstanceUuid}/${certificate.raProfile.uuid}`
                        : undefined,
                otherProperties: [
                    {
                        propertyName: "RA Profile Enabled",
                        propertyValue:
                            certificate?.raProfile?.enabled !== undefined ? (certificate?.raProfile?.enabled ? "Yes" : "No") : "NA",
                    },
                ],
            },
        });
        edges.push({
            id: "e1-5",
            source: "1",
            target: "5",
            type: "default",
        });
    }

    return { nodes, edges };
}
