import {
    ApprovalDetailDto,
    ApprovalDetailDtoStatusEnum,
    ApprovalDetailStepDto,
    ApprovalDto,
    ApprovalDtoStatusEnum,
    ApprovalResponseDto,
    ApprovalStepRecipientDto,
    ApprovalStepRecipientDtoStatusEnum,
    ApprovalUserDto,
    Resource as ResourceEnum,
    UserApprovalDto,
} from './openapi';

export type ApprovalDtoStatusModel = ApprovalDtoStatusEnum;

export type ApprovalDetailDtoStatusModel = ApprovalDetailDtoStatusEnum;

export type ApprovalDetailStepDtoStatusModel = ApprovalStepRecipientDtoStatusEnum;

export type ApprovalDtoType = ApprovalDto;
export type ApprovalModel = Omit<ApprovalDtoType, 'status' | 'resource'> & {
    status: ApprovalDtoStatusModel;
    resource: ResourceEnum;
};

export type RecipientApprovalStepDto = ApprovalStepRecipientDto;
export type RecipientApprovalStepModel = Omit<RecipientApprovalStepDto, 'status'> & {
    status: ApprovalDetailStepDtoStatusModel;
};

export type UserApprovalModel = UserApprovalDto;

export type DetailApprovalStepDto = ApprovalDetailStepDto;
export type DetailApprovalStepModel = Omit<DetailApprovalStepDto, 'approvalStepsRecipients'> & {
    approvalStepRecipients: Array<RecipientApprovalStepModel>;
};

export type DetailApprovalDto = ApprovalDetailDto;
export type DetailApprovalModel = Omit<DetailApprovalDto, 'status' | 'resource' | 'approvalSteps'> & {
    status: ApprovalDetailDtoStatusModel;
    resource: ResourceEnum;
    approvalSteps: Array<DetailApprovalStepModel>;
};

export type ResponseApprovalDto = ApprovalResponseDto;
export type ResponseApprovalModel = Omit<ResponseApprovalDto, 'approvals'> & {
    approvals: Array<ApprovalModel>;
};

export type ApprovalUserModel = ApprovalUserDto;
