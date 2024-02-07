import {
    ApprovalProfileDetailDto,
    ApprovalProfileDto,
    ApprovalProfileRequestDto,
    ApprovalProfileResponseDto,
    ApprovalProfileUpdateRequestDto,
    ApprovalStepDto,
    ApprovalStepRequestDto,
} from './openapi';
export type ProfileApprovalStepDto = ApprovalStepDto;
export type ProfileApprovalStepModel = ProfileApprovalStepDto;
export type ApprovalStepRequestModel = ApprovalStepRequestDto;

export type ProfileApprovalDetailDto = ApprovalProfileDetailDto;
export type ProfileApprovalDetailModel = Omit<ProfileApprovalDetailDto, 'approvalSteps'> & {
    approvalSteps: Array<ProfileApprovalStepModel>;
};

export type ProfileApprovalDto = ApprovalProfileDto;
export type ProfileApprovalModel = ProfileApprovalDto;

export type ProfileApprovalRequestDto = ApprovalProfileRequestDto;
export type ProfileApprovalRequestModel = Omit<ProfileApprovalRequestDto, 'approvalSteps'> & {
    approvalSteps: Array<ApprovalStepRequestModel>;
};

export type ProfileApprovalResponseDto = ApprovalProfileResponseDto;
export type ProfileApprovalResponseModel = Omit<ProfileApprovalResponseDto, 'approvalProfiles'> & {
    approvalProfiles?: Array<ProfileApprovalModel>;
};

export type ProfileApprovalUpdateRequestDto = ApprovalProfileUpdateRequestDto;
export type ProfileApprovalUpdateRequestModel = Omit<ProfileApprovalUpdateRequestDto, 'approvalSteps'> & {
    approvalSteps: Array<ApprovalStepRequestDto>;
};

export enum ApproverType {
    User = 'User',
    Group = 'Group',
    Role = 'Role',
}
