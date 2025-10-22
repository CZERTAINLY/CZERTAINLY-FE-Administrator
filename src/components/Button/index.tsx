import cn from 'classnames';

export type ButtonType = 'solid' | 'outline' | 'transparent';

interface Props {
    type?: ButtonType;
    color?: 'blue' | 'red' | 'transparent';
    onClick: (event: React.MouseEvent) => void;
    id?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    title?: string;
}

function Button({ children, onClick, className, id, type = 'solid', disabled = false, color = 'blue', title }: Props) {
    const buttonClasses = {
        solid: 'py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none',
        outline:
            'py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-hidden focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400',
        transparent:
            'py-1 px-1 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none',
    };

    const colorClasses = {
        blue: '',
        red: '',
        transparent: '',
    };

    return (
        <button
            type="button"
            id={id}
            className={cn(buttonClasses[type], colorClasses[color], className)}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </button>
    );
}

export default Button;
