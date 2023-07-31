import {
    ApprovalProfileDetailDto,
    ApprovalProfileDto,
    ApprovalProfileRequestDto,
    ApprovalProfileResponseDto,
    ApprovalProfileUpdateRequestDto,
    ApprovalStepDto,
} from "./openapi";
export type ProfileApprovalStepDto = ApprovalStepDto;
export type ProfileApprovalStepModel = ProfileApprovalStepDto;

export type ProfileApprovalDetailDto = ApprovalProfileDetailDto;
export type ProfileApprovalDetailModel = Omit<ProfileApprovalDetailDto, "approvalSteps"> & {
    approvalSteps: Array<ProfileApprovalStepModel>;
};

export type ProfileApprovalDto = ApprovalProfileDto;
export type ProfileApprovalModel = ProfileApprovalDto;

export type ProfileApprovalRequestDto = ApprovalProfileRequestDto;
export type ProfileApprovalRequestModel = Omit<ProfileApprovalRequestDto, "approvalSteps"> & {
    approvalSteps: Array<ProfileApprovalStepModel>;
};

export type ProfileApprovalResponseDto = ApprovalProfileResponseDto;
export type ProfileApprovalResponseModel = Omit<ProfileApprovalResponseDto, "approvalProfiles"> & {
    approvalProfiles?: Array<ProfileApprovalModel>;
};

export type ProfileApprovalUpdateRequestDto = ApprovalProfileUpdateRequestDto;
export type ProfileApprovalUpdateRequestModel = Omit<ProfileApprovalUpdateRequestDto, "approvalSteps"> & {
    approvalSteps: Array<ProfileApprovalStepModel>;
};

export enum ApproverType {
    User = "User",
    Group = "Group",
    Role = "Role",
}
