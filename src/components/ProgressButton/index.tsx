import { Button, Spinner } from 'reactstrap';

interface Props {
    disabled?: boolean;
    inProgress: boolean;
    title: string;
    inProgressTitle?: string;
    color?: string;
    className?: string;
    type?: 'submit' | 'reset' | 'button';
    onClick?: () => void;
}

function ProgressButton({
    inProgress,
    title,
    inProgressTitle = title,
    disabled = false,
    color = 'primary',
    className = 'btn btn-primary',
    type = 'submit',
    onClick,
}: Props) {
    return (
        <Button className={className} color={color} type={type} disabled={disabled || inProgress} onClick={onClick}>
            {inProgress ? (
                <div>
                    <Spinner color="light" size="sm" />
                    <span>&nbsp;{inProgressTitle}</span>
                </div>
            ) : (
                title
            )}
        </Button>
    );
}

export default ProgressButton;
