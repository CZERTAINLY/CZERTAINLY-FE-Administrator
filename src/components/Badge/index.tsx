import cn from 'classnames';

interface Props {
    color: 'gray' | 'light-gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'transparent';
    onClick?: () => void;
    onRemove?: () => void;
    children: React.ReactNode;
}

function Switch({ color, onClick, onRemove, children }: Props) {
    const colorClasses = {
        gray: 'bg-gray-800 text-white dark:bg-white dark:text-neutral-800',
        'light-gray': 'bg-gray-500 text-white',
        teal: 'bg-teal-500 text-white',
        blue: 'bg-blue-600 text-white dark:bg-blue-500',
        red: 'bg-red-500 text-white',
        yellow: 'bg-yellow-500 text-white',
        transparent: 'bg-white text-gray-600',
    };
    return (
        <span
            onClick={onClick}
            className={cn('inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium', colorClasses[color], {
                'cursor-pointer': !!onClick,
            })}
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
