import {
    ProfileApprovalDetailDto,
    ProfileApprovalDetailModel,
    ProfileApprovalDto,
    ProfileApprovalModel,
    ProfileApprovalRequestDto,
    ProfileApprovalRequestModel,
    ProfileApprovalResponseDto,
    ProfileApprovalResponseModel,
    ProfileApprovalStepDto,
    ProfileApprovalStepModel,
    ProfileApprovalUpdateRequestDto,
    ProfileApprovalUpdateRequestModel,
} from "types/approval-profiles";

export function transformProfileApprovalStepDtoToModel(profileApprovalStep: ProfileApprovalStepDto): ProfileApprovalStepModel {
    return { ...profileApprovalStep };
}

export function transformProfileApprovalDetailDtoToModel(profileApprovalDetail: ProfileApprovalDetailDto): ProfileApprovalDetailModel {
    return {
        ...profileApprovalDetail,
        approvalSteps: profileApprovalDetail.approvalSteps?.map(transformProfileApprovalStepDtoToModel) || [],
    };
}

export function transformProfileApprovalDtoToModel(profileApproval: ProfileApprovalDto): ProfileApprovalModel {
    return { ...profileApproval };
}

export function transformProfileApprovalRequestDtoToModel(profileApprovalRequest: ProfileApprovalRequestDto): ProfileApprovalRequestModel {
    return {
        ...profileApprovalRequest,
        approvalSteps: profileApprovalRequest.approvalSteps?.map(transformProfileApprovalStepDtoToModel) || [],
    };
}

export function transformProfileApprovalResponseDtoToModel(
    profileApprovalResponse: ProfileApprovalResponseDto,
): ProfileApprovalResponseModel {
    return {
        ...profileApprovalResponse,
        approvalProfiles: profileApprovalResponse.approvalProfiles?.map(transformProfileApprovalDtoToModel) || [],
    };
}

export function transformProfileApprovalUpdateRequestDtoToModel(
    profileApprovalUpdateRequest: ProfileApprovalUpdateRequestDto,
): ProfileApprovalUpdateRequestModel {
    return {
        ...profileApprovalUpdateRequest,
        approvalSteps: profileApprovalUpdateRequest.approvalSteps?.map(transformProfileApprovalStepDtoToModel) || [],
    };
}

// export function transformCreateProfileApprovalRequestToModel(
//     createProfileApprovalRequest: CreateProfileApprovalRequest,
// ): CreateProfileApprovalModel {
//     return { ...createProfileApprovalRequest };
// }
