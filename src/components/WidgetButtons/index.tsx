import cn from 'classnames';
import React from 'react';
import {
    Plus,
    Copy,
    Trash2,
    X,
    Check,
    Plug,
    PencilLine,
    History,
    XCircle,
    Upload,
    Download,
    Users,
    User,
    Box,
    Repeat,
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
    MinusCircle,
    Bomb,
    Search,
    Shuffle,
    Pen,
    CheckSquare,
    Key,
    Link,
    Recycle,
    Archive,
    ArchiveRestore,
} from 'lucide-react';

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
}

const getIcon = (icon: IconName, size: number = 20): React.ReactNode => {
    const iconMap: Record<IconName, React.ComponentType<{ size?: number }>> = {
        plus: Plus,
        copy: Copy,
        trash: Trash2,
        times: X,
        check: Check,
        plug: Plug,
        pencil: PencilLine,
        history: History,
        'cross-circle': XCircle,
        upload: Upload,
        download: Download,
        group: Users,
        user: User,
        cubes: Box,
        retweet: Repeat,
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
        destroy: MinusCircle,
        bomb: Bomb,
        search: Search,
        random: Shuffle,
        sign: Pen,
        verify: CheckSquare,
        key: Key,
        link: Link,
        recycle: Recycle,
        rekey: Shuffle,
        archive: Archive,
        unarchive: ArchiveRestore,
    };

    const IconComponent = iconMap[icon];
    return IconComponent ? <IconComponent size={size} /> : null;
};

function WidgetButtons({ buttons, justify = 'center' }: Props) {
    const renderButton = (button: WidgetButtonProps) => {
        let toolTip: React.ReactNode | undefined;

        const btnProps = {
            className:
                'py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
            onClick: button.onClick,
            disabled: button.disabled,
        };

        if (!button.disabled) {
            btnProps.className = `${btnProps.className} opacity-100`;
        }

        if (button.hidden) {
            btnProps.disabled = true;
        }

        const key = button.icon + button.tooltip + button.id || '';

        return button.custom ? (
            <span key={key}>{button.custom}</span>
        ) : (
            <button data-testid={`${button.id}-button`} key={key} type="button" {...btnProps} title={button.tooltip}>
                {getIcon(button.icon)}
                {toolTip}
            </button>
        );
    };

    const renderedButtons: React.ReactNode[] = [];

    buttons.forEach((button) => {
        renderedButtons.push(renderButton(button));
    });

    const wrapperClassName = cn('flex ml-2', {
        'justify-start': justify === 'start',
        'justify-center': justify === 'center',
        'justify-end': justify === 'end',
    });

    return <div className={wrapperClassName}>{renderedButtons}</div>;
}

export default WidgetButtons;
