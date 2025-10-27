import cn from 'classnames';
import Button, { ButtonColor } from 'components/Button';
import Spinner from 'components/Spinner';

interface Props {
    disabled?: boolean;
    inProgress: boolean;
    title: string;
    inProgressTitle?: string;
    color?: ButtonColor;
    className?: string;
    type?: 'submit' | 'reset' | 'button';
    onClick?: () => void;
}

function ProgressButton({ inProgress, title, inProgressTitle = title, disabled = false, color = 'blue', type = 'submit', onClick }: Props) {
    return (
        <Button color={color} disabled={disabled || inProgress} onClick={onClick} className={cn('relative', { 'opacity-50': inProgress })}>
            {inProgress ? (
                <div>
                    <Spinner color="light" size="sm" />
                    {inProgressTitle}
                </div>
            ) : (
                title
            )}
        </Button>
    );
}

export default ProgressButton;
