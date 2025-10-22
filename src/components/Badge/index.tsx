import cn from 'classnames';

export type BadgeColor = 'gray' | 'secondary' | 'success' | 'primary' | 'danger' | 'warning' | 'info' | 'transparent';

interface Props {
    color?: BadgeColor;
    onClick?: () => void;
    onRemove?: () => void;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

function Switch({ color = 'secondary', onClick, onRemove, children, style, className }: Props) {
    const colorClasses = {
        gray: 'bg-gray-800 text-white dark:bg-white dark:text-neutral-800',
        secondary: 'bg-gray-500 text-white',
        success: 'bg-[var(--status-success-color)] text-white',
        primary: 'bg-blue-600 text-white dark:bg-blue-500',
        danger: 'bg-[var(--status-danger-color)] text-white',
        warning: 'bg-[var(--status-warning-color)] text-white',
        info: 'bg-[var(--status-info-color)] text-white',
        transparent: 'bg-white text-gray-600',
    };
    return (
        <span
            onClick={onClick}
            className={cn(
                'inline-flex items-center justify-center gap-x-1.5 py-0.5 px-1.5 rounded-md text-xs font-medium min-w-[24px]',
                colorClasses[color],
                {
                    'cursor-pointer': !!onClick,
                },
                className,
            )}
            style={style}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    className="shrink-0 size-4 inline-flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-500 dark:hover:bg-gray-900"
                    onClick={onRemove}
                >
                    <span className="sr-only">Remove badge</span>
                    <svg
                        className="shrink-0 size-3"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
            )}
        </span>
    );
}

export default Switch;
