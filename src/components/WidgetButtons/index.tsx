import cn from 'classnames';
import React from 'react';
import {
    Plus,
    Copy,
    Trash2,
    X,
    Check,
    Plug,
    History,
    XCircle,
    Upload,
    ArrowDownToLine,
    Users,
    User,
    Boxes,
    Repeat2,
    MinusSquare,
    Info,
    Gavel,
    ArrowUpCircle,
    RefreshCw,
    Minus,
    Lock,
    RotateCw,
    Handshake,
    Ban,
    Bomb,
    Search,
    Shuffle,
    Pen,
    CheckSquare,
    KeyRound,
    Link,
    Recycle,
    Archive,
    PackageOpen,
    SquareMinus,
} from 'lucide-react';
import Button from 'components/Button';
import EditIcon from 'components/icons/EditIcon';

export type IconName =
    | 'plus'
    | 'copy'
    | 'trash'
    | 'times'
    | 'check'
    | 'plug'
    | 'pencil'
    | 'history'
    | 'cross-circle'
    | 'upload'
    | 'download'
    | 'group'
    | 'user'
    | 'cubes'
    | 'retweet'
    | 'minus-square'
    | 'info'
    | 'gavel'
    | 'push'
    | 'sync'
    | 'minus'
    | 'lock'
    | 'refresh'
    | 'reload'
    | 'handshake'
    | 'compromise'
    | 'destroy'
    | 'bomb'
    | 'search'
    | 'random'
    | 'sign'
    | 'verify'
    | 'key'
    | 'link'
    | 'recycle'
    | 'rekey'
    | 'archive'
    | 'unarchive';
export interface WidgetButtonProps {
    icon: IconName;
    id?: string;
    tooltip?: any;
    hidden?: boolean;
    disabled: boolean;
    custom?: React.ReactNode;
    onClick: (event: React.MouseEvent) => void;
}

interface Props {
    buttons: WidgetButtonProps[];
    justify?: 'start' | 'end' | 'center';
    className?: string;
}

const getIcon = (icon: IconName, size: number = 20): React.ReactNode => {
    const iconMap: Record<IconName, React.ComponentType<{ size?: number }>> = {
        plus: Plus,
        copy: Copy,
        trash: Trash2,
        times: X,
        check: Check,
        plug: Plug,
        pencil: EditIcon,
        history: History,
        'cross-circle': XCircle,
        upload: Upload,
        download: ArrowDownToLine,
        group: Users,
        user: User,
        cubes: Boxes,
        retweet: Repeat2,
        'minus-square': MinusSquare,
        push: ArrowUpCircle,
        sync: RefreshCw,
        info: Info,
        minus: Minus,
        gavel: Gavel,
        lock: Lock,
        refresh: RefreshCw,
        reload: RotateCw,
        handshake: Handshake,
        compromise: Ban,
        destroy: SquareMinus,
        bomb: Bomb,
        search: Search,
        random: Shuffle,
        sign: Pen,
        verify: CheckSquare,
        key: KeyRound,
        link: Link,
        recycle: Recycle,
        rekey: Shuffle,
        archive: Archive,
        unarchive: PackageOpen,
    };

    const IconComponent = iconMap[icon];
    return IconComponent ? <IconComponent size={16} /> : null;
};

function WidgetButtons({ buttons, justify = 'center', className }: Props) {
    const renderButton = (button: WidgetButtonProps) => {
        let toolTip: React.ReactNode | undefined;

        const btnProps = {
            onClick: button.onClick,
            disabled: button.disabled,
        };

        const key = button.icon + button.tooltip + button.id || '';

        return button.custom ? (
            <span key={key}>{button.custom}</span>
        ) : (
            <Button variant="transparent" data-testid={`${button.id}-button`} title={button.tooltip} {...btnProps}>
                {getIcon(button.icon)}
                {toolTip}
            </Button>
        );
    };

    const renderedButtons: React.ReactNode[] = [];

    buttons.forEach((button) => {
        renderedButtons.push(renderButton(button));
    });

    const wrapperClassName = cn(
        'flex ml-2 items-center gap-1',
        {
            'justify-start': justify === 'start',
            'justify-center': justify === 'center',
            'justify-end': justify === 'end',
        },
        className,
    );

    return <div className={wrapperClassName}>{renderedButtons}</div>;
}

export default WidgetButtons;
