import { Badge } from 'reactstrap';
import { ApprovalDetailDtoStatusEnum, ApprovalDtoStatusEnum, ApprovalStepRecipientDtoStatusEnum } from 'types/openapi';

interface Props {
    enabled?: boolean;
    textStatus?: ApprovalDetailDtoStatusEnum | ApprovalDtoStatusEnum | ApprovalStepRecipientDtoStatusEnum;
    style?: React.CSSProperties;
}

function StatusBadge({ enabled, style, textStatus }: Props) {
    if (!textStatus) {
        switch (enabled) {
            case true:
                return (
                    <Badge style={style} color="success">
                        Enabled
                    </Badge>
                );

            case false:
                return (
                    <Badge style={style} color="danger">
                        Disabled
                    </Badge>
                );

            default:
                return (
                    <Badge style={style} color="secondary">
                        Unknown
                    </Badge>
                );
        }
    }
    switch (textStatus) {
        case ApprovalDetailDtoStatusEnum.Approved:
        case ApprovalStepRecipientDtoStatusEnum.Approved:
        case ApprovalDtoStatusEnum.Approved:
            return (
                <Badge style={style} color="success">
                    Approved
                </Badge>
            );

        case ApprovalDetailDtoStatusEnum.Rejected:
        case ApprovalStepRecipientDtoStatusEnum.Rejected:
        case ApprovalDtoStatusEnum.Rejected:
            return (
                <Badge style={style} color="danger">
                    Rejected
                </Badge>
            );

        case ApprovalDetailDtoStatusEnum.Pending:
        case ApprovalStepRecipientDtoStatusEnum.Pending:
        case ApprovalDtoStatusEnum.Pending:
            return (
                <Badge style={style} color="secondary">
                    Pending
                </Badge>
            );

        case ApprovalDtoStatusEnum.Expired:
        case ApprovalStepRecipientDtoStatusEnum.Expired:
            return (
                <Badge style={style} color="danger">
                    Expired
                </Badge>
            );

        default:
            return (
                <Badge style={style} color="secondary">
                    Unknown
                </Badge>
            );
    }
}

export default StatusBadge;
