import cn from 'classnames';
interface Props {
    active?: boolean;
    color?: 'light' | 'primary';
    size?: 'sm' | 'md' | 'lg';
}

function Spinner({ active = true, color = 'primary', size = 'md' }: Props) {
    if (!active) return null;

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
                className={cn(
                    'animate-spin inline-block border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500',
                    {
                        'size-4': size === 'sm',
                        'size-6': size === 'md',
                        'size-8': size === 'lg',
                        'text-blue-600': color === 'primary',
                        'text-white': color === 'light',
                    },
                )}
                role="status"
                aria-label="loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Spinner;
