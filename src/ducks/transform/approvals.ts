import {
    ApprovalDtoType,
    ApprovalModel,
    DetailApprovalDto,
    DetailApprovalModel,
    DetailApprovalStepDto,
    DetailApprovalStepModel,
    RecipientApprovalStepDto,
    RecipientApprovalStepModel,
    ResponseApprovalDto,
    ResponseApprovalModel,
} from 'types/approvals';

export function transformApprovalDtoToModel(approval: ApprovalDtoType): ApprovalModel {
    return {
        ...approval,
    };
}

export function transformApprovalStepRecipientDtoToModel(recipientApprovalStep: RecipientApprovalStepDto): RecipientApprovalStepModel {
    return {
        ...recipientApprovalStep,
    };
}

export function transformDetailApprovalStepDtoToModel(detailApprovalStep: DetailApprovalStepDto): DetailApprovalStepModel {
    return {
        ...detailApprovalStep,
        approvalStepRecipients: detailApprovalStep.approvalStepRecipients?.map(transformApprovalStepRecipientDtoToModel) || [],
    };
}

export function transformDetailApprovalDtoToModel(detailApproval: DetailApprovalDto): DetailApprovalModel {
    return {
        ...detailApproval,
        approvalSteps: detailApproval.approvalSteps?.map(transformDetailApprovalStepDtoToModel) || [],
    };
}

export function transformResponseApprovalDtoToModel(responseApproval: ResponseApprovalDto): ResponseApprovalModel {
    return {
        ...responseApproval,
        approvals: responseApproval.approvals?.map(transformApprovalDtoToModel) || [],
    };
}
