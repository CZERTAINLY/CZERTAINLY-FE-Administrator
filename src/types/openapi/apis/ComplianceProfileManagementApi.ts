// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.9.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from "rxjs";
import type { AjaxResponse } from "rxjs/ajax";
import { BaseAPI, throwIfNullOrUndefined, encodeURI } from "../runtime";
import type { OperationOpts, HttpHeaders, HttpQuery } from "../runtime";
import type {
    AuthenticationServiceExceptionDto,
    BulkActionMessageDto,
    CertificateType,
    ComplianceGroupRequestDto,
    ComplianceGroupsListResponseDto,
    ComplianceProfileDto,
    ComplianceProfileRequestDto,
    ComplianceProfileRuleDto,
    ComplianceProfilesListDto,
    ComplianceRuleAdditionRequestDto,
    ComplianceRuleDeletionRequestDto,
    ComplianceRulesListResponseDto,
    ErrorMessageDto,
    RaProfileAssociationRequestDto,
    SimplifiedRaProfileDto,
    UuidDto,
} from "../models";

export interface AddGroupRequest {
    uuid: string;
    complianceGroupRequestDto: ComplianceGroupRequestDto;
}

export interface AddRuleRequest {
    uuid: string;
    complianceRuleAdditionRequestDto: ComplianceRuleAdditionRequestDto;
}

export interface AssociateProfilesRequest {
    uuid: string;
    raProfileAssociationRequestDto: RaProfileAssociationRequestDto;
}

export interface BulkDeleteComplianceProfilesRequest {
    requestBody: Array<string>;
}

export interface CheckComplianceRequest {
    requestBody: Array<string>;
}

export interface CreateComplianceProfileRequest {
    complianceProfileRequestDto: ComplianceProfileRequestDto;
}

export interface DeleteComplianceProfileRequest {
    uuid: string;
}

export interface DisassociateProfilesRequest {
    uuid: string;
    raProfileAssociationRequestDto: RaProfileAssociationRequestDto;
}

export interface ForceDeleteComplianceProfilesRequest {
    requestBody: Array<string>;
}

export interface GetAssociatedRAProfilesRequest {
    uuid: string;
}

export interface GetComplianceGroupsRequest {
    complianceProvider?: string;
    kind?: string;
}

export interface GetComplianceProfileRequest {
    uuid: string;
}

export interface GetComplianceRulesRequest {
    complianceProvider?: string;
    kind?: string;
    certificateType?: Array<CertificateType>;
}

export interface RemoveGroupRequest {
    uuid: string;
    complianceGroupRequestDto: ComplianceGroupRequestDto;
}

export interface RemoveRuleRequest {
    uuid: string;
    complianceRuleDeletionRequestDto: ComplianceRuleDeletionRequestDto;
}

/**
 * no description
 */
export class ComplianceProfileManagementApi extends BaseAPI {
    /**
     * Add group to a Compliance Profile
     */
    addGroup({ uuid, complianceGroupRequestDto }: AddGroupRequest): Observable<void>;
    addGroup({ uuid, complianceGroupRequestDto }: AddGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    addGroup({ uuid, complianceGroupRequestDto }: AddGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "addGroup");
        throwIfNullOrUndefined(complianceGroupRequestDto, "complianceGroupRequestDto", "addGroup");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/complianceProfiles/{uuid}/groups".replace("{uuid}", encodeURI(uuid)),
                method: "POST",
                headers,
                body: complianceGroupRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Add rule to a Compliance Profile
     */
    addRule({ uuid, complianceRuleAdditionRequestDto }: AddRuleRequest): Observable<ComplianceProfileRuleDto>;
    addRule(
        { uuid, complianceRuleAdditionRequestDto }: AddRuleRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<ComplianceProfileRuleDto>>;
    addRule(
        { uuid, complianceRuleAdditionRequestDto }: AddRuleRequest,
        opts?: OperationOpts,
    ): Observable<ComplianceProfileRuleDto | AjaxResponse<ComplianceProfileRuleDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "addRule");
        throwIfNullOrUndefined(complianceRuleAdditionRequestDto, "complianceRuleAdditionRequestDto", "addRule");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<ComplianceProfileRuleDto>(
            {
                url: "/v1/complianceProfiles/{uuid}/rules".replace("{uuid}", encodeURI(uuid)),
                method: "POST",
                headers,
                body: complianceRuleAdditionRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Associate Compliance Profile to RA Profile
     */
    associateProfiles({ uuid, raProfileAssociationRequestDto }: AssociateProfilesRequest): Observable<void>;
    associateProfiles(
        { uuid, raProfileAssociationRequestDto }: AssociateProfilesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>>;
    associateProfiles(
        { uuid, raProfileAssociationRequestDto }: AssociateProfilesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "associateProfiles");
        throwIfNullOrUndefined(raProfileAssociationRequestDto, "raProfileAssociationRequestDto", "associateProfiles");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/complianceProfiles/{uuid}/raProfiles/associate".replace("{uuid}", encodeURI(uuid)),
                method: "PATCH",
                headers,
                body: raProfileAssociationRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Delete multiple Compliance Profiles
     */
    bulkDeleteComplianceProfiles({ requestBody }: BulkDeleteComplianceProfilesRequest): Observable<Array<BulkActionMessageDto>>;
    bulkDeleteComplianceProfiles(
        { requestBody }: BulkDeleteComplianceProfilesRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<Array<BulkActionMessageDto>>>;
    bulkDeleteComplianceProfiles(
        { requestBody }: BulkDeleteComplianceProfilesRequest,
        opts?: OperationOpts,
    ): Observable<Array<BulkActionMessageDto> | AjaxResponse<Array<BulkActionMessageDto>>> {
        throwIfNullOrUndefined(requestBody, "requestBody", "bulkDeleteComplianceProfiles");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<Array<BulkActionMessageDto>>(
            {
                url: "/v1/complianceProfiles",
                method: "DELETE",
                headers,
                body: requestBody,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Initiate Certificate Compliance Check
     */
    checkCompliance({ requestBody }: CheckComplianceRequest): Observable<void>;
    checkCompliance({ requestBody }: CheckComplianceRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    checkCompliance({ requestBody }: CheckComplianceRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestBody, "requestBody", "checkCompliance");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/complianceProfiles/compliance",
                method: "POST",
                headers,
                body: requestBody,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Add Compliance Profile
     */
    createComplianceProfile({ complianceProfileRequestDto }: CreateComplianceProfileRequest): Observable<UuidDto>;
    createComplianceProfile(
        { complianceProfileRequestDto }: CreateComplianceProfileRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<UuidDto>>;
    createComplianceProfile(
        { complianceProfileRequestDto }: CreateComplianceProfileRequest,
        opts?: OperationOpts,
    ): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(complianceProfileRequestDto, "complianceProfileRequestDto", "createComplianceProfile");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<UuidDto>(
            {
                url: "/v1/complianceProfiles",
                method: "POST",
                headers,
                body: complianceProfileRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Delete Compliance Profile
     */
    deleteComplianceProfile({ uuid }: DeleteComplianceProfileRequest): Observable<void>;
    deleteComplianceProfile({ uuid }: DeleteComplianceProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    deleteComplianceProfile({ uuid }: DeleteComplianceProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "deleteComplianceProfile");

        return this.request<void>(
            {
                url: "/v1/complianceProfiles/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "DELETE",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Disassociate Compliance Profile to RA Profile
     */
    disassociateProfiles({ uuid, raProfileAssociationRequestDto }: DisassociateProfilesRequest): Observable<void>;
    disassociateProfiles(
        { uuid, raProfileAssociationRequestDto }: DisassociateProfilesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>>;
    disassociateProfiles(
        { uuid, raProfileAssociationRequestDto }: DisassociateProfilesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "disassociateProfiles");
        throwIfNullOrUndefined(raProfileAssociationRequestDto, "raProfileAssociationRequestDto", "disassociateProfiles");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/complianceProfiles/{uuid}/raProfiles/disassociate".replace("{uuid}", encodeURI(uuid)),
                method: "PATCH",
                headers,
                body: raProfileAssociationRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Force delete Compliance Profiles
     */
    forceDeleteComplianceProfiles({ requestBody }: ForceDeleteComplianceProfilesRequest): Observable<Array<BulkActionMessageDto>>;
    forceDeleteComplianceProfiles(
        { requestBody }: ForceDeleteComplianceProfilesRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<Array<BulkActionMessageDto>>>;
    forceDeleteComplianceProfiles(
        { requestBody }: ForceDeleteComplianceProfilesRequest,
        opts?: OperationOpts,
    ): Observable<Array<BulkActionMessageDto> | AjaxResponse<Array<BulkActionMessageDto>>> {
        throwIfNullOrUndefined(requestBody, "requestBody", "forceDeleteComplianceProfiles");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<Array<BulkActionMessageDto>>(
            {
                url: "/v1/complianceProfiles/force",
                method: "DELETE",
                headers,
                body: requestBody,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get RA Profiles for a Compliance Profile
     */
    getAssociatedRAProfiles({ uuid }: GetAssociatedRAProfilesRequest): Observable<Array<SimplifiedRaProfileDto>>;
    getAssociatedRAProfiles(
        { uuid }: GetAssociatedRAProfilesRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<Array<SimplifiedRaProfileDto>>>;
    getAssociatedRAProfiles(
        { uuid }: GetAssociatedRAProfilesRequest,
        opts?: OperationOpts,
    ): Observable<Array<SimplifiedRaProfileDto> | AjaxResponse<Array<SimplifiedRaProfileDto>>> {
        throwIfNullOrUndefined(uuid, "uuid", "getAssociatedRAProfiles");

        return this.request<Array<SimplifiedRaProfileDto>>(
            {
                url: "/v1/complianceProfiles/{uuid}/raProfiles".replace("{uuid}", encodeURI(uuid)),
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get Compliance groups
     */
    getComplianceGroups({ complianceProvider, kind }: GetComplianceGroupsRequest): Observable<Array<ComplianceGroupsListResponseDto>>;
    getComplianceGroups(
        { complianceProvider, kind }: GetComplianceGroupsRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<Array<ComplianceGroupsListResponseDto>>>;
    getComplianceGroups(
        { complianceProvider, kind }: GetComplianceGroupsRequest,
        opts?: OperationOpts,
    ): Observable<Array<ComplianceGroupsListResponseDto> | AjaxResponse<Array<ComplianceGroupsListResponseDto>>> {
        const query: HttpQuery = {};

        if (complianceProvider != null) {
            query["complianceProvider"] = complianceProvider;
        }
        if (kind != null) {
            query["kind"] = kind;
        }

        return this.request<Array<ComplianceGroupsListResponseDto>>(
            {
                url: "/v1/complianceProfiles/groups",
                method: "GET",
                query,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Details of a Compliance Profiles
     */
    getComplianceProfile({ uuid }: GetComplianceProfileRequest): Observable<ComplianceProfileDto>;
    getComplianceProfile({ uuid }: GetComplianceProfileRequest, opts?: OperationOpts): Observable<AjaxResponse<ComplianceProfileDto>>;
    getComplianceProfile(
        { uuid }: GetComplianceProfileRequest,
        opts?: OperationOpts,
    ): Observable<ComplianceProfileDto | AjaxResponse<ComplianceProfileDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "getComplianceProfile");

        return this.request<ComplianceProfileDto>(
            {
                url: "/v1/complianceProfiles/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get Compliance rules
     */
    getComplianceRules({
        complianceProvider,
        kind,
        certificateType,
    }: GetComplianceRulesRequest): Observable<Array<ComplianceRulesListResponseDto>>;
    getComplianceRules(
        { complianceProvider, kind, certificateType }: GetComplianceRulesRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<Array<ComplianceRulesListResponseDto>>>;
    getComplianceRules(
        { complianceProvider, kind, certificateType }: GetComplianceRulesRequest,
        opts?: OperationOpts,
    ): Observable<Array<ComplianceRulesListResponseDto> | AjaxResponse<Array<ComplianceRulesListResponseDto>>> {
        const query: HttpQuery = {};

        if (complianceProvider != null) {
            query["complianceProvider"] = complianceProvider;
        }
        if (kind != null) {
            query["kind"] = kind;
        }
        if (certificateType != null) {
            query["certificateType"] = certificateType;
        }

        return this.request<Array<ComplianceRulesListResponseDto>>(
            {
                url: "/v1/complianceProfiles/rules",
                method: "GET",
                query,
            },
            opts?.responseOpts,
        );
    }

    /**
     * List of available Compliance Profiles
     */
    listComplianceProfiles(): Observable<Array<ComplianceProfilesListDto>>;
    listComplianceProfiles(opts?: OperationOpts): Observable<AjaxResponse<Array<ComplianceProfilesListDto>>>;
    listComplianceProfiles(
        opts?: OperationOpts,
    ): Observable<Array<ComplianceProfilesListDto> | AjaxResponse<Array<ComplianceProfilesListDto>>> {
        return this.request<Array<ComplianceProfilesListDto>>(
            {
                url: "/v1/complianceProfiles",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Delete group from a Compliance Profile
     */
    removeGroup({ uuid, complianceGroupRequestDto }: RemoveGroupRequest): Observable<void>;
    removeGroup({ uuid, complianceGroupRequestDto }: RemoveGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    removeGroup({ uuid, complianceGroupRequestDto }: RemoveGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "removeGroup");
        throwIfNullOrUndefined(complianceGroupRequestDto, "complianceGroupRequestDto", "removeGroup");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/complianceProfiles/{uuid}/groups".replace("{uuid}", encodeURI(uuid)),
                method: "DELETE",
                headers,
                body: complianceGroupRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Delete rule from a Compliance Profile
     */
    removeRule({ uuid, complianceRuleDeletionRequestDto }: RemoveRuleRequest): Observable<void>;
    removeRule({ uuid, complianceRuleDeletionRequestDto }: RemoveRuleRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    removeRule({ uuid, complianceRuleDeletionRequestDto }: RemoveRuleRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "removeRule");
        throwIfNullOrUndefined(complianceRuleDeletionRequestDto, "complianceRuleDeletionRequestDto", "removeRule");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/complianceProfiles/{uuid}/rules".replace("{uuid}", encodeURI(uuid)),
                method: "DELETE",
                headers,
                body: complianceRuleDeletionRequestDto,
            },
            opts?.responseOpts,
        );
    }
}
