import cn from 'classnames';

export type ButtonVariant = 'solid' | 'outline' | 'transparent';

export type ButtonColor = 'primary' | 'danger' | 'secondary' | 'warning';
interface Props {
    variant?: ButtonVariant;
    color?: ButtonColor;
    onClick?: (event: React.MouseEvent) => void;
    id?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    title?: string;
    type?: 'submit' | 'reset' | 'button';
}

const baseButton =
    'py-2.5 px-3.5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden border';

const buttonClasses = {
    solid: '',
    outline: '',
    transparent: '!p-2 border-transparent',
};

const colorClasses = {
    solid: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 dark:border-blue-500 dark:text-white',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:bg-red-600',
        secondary: 'bg-gray-800 text-white hover:bg-gray-900 focus:bg-gray-900 dark:bg-white dark:text-neutral-800',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-600',
    },
    outline: {
        primary:
            'border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400',
        danger: 'border-red-500 text-red-500 hover:border-red-400 hover:text-red-400 focus:border-red-400 focus:text-red-400',
        secondary:
            'border-gray-300 hover:border-gray-400 focus:border-gray-400 dark:border-white dark:text-white dark:hover:text-neutral-300 dark:hover:border-neutral-300',
        warning:
            'border-yellow-500 text-yellow-500 hover:border-yellow-400 hover:text-yellow-400 focus:border-yellow-400 focus:text-yellow-400',
    },
    transparent: {
        primary: 'hover:bg-gray-200',
        danger: 'text-red-500 hover:bg-red-100 focus:bg-red-100 hover:text-red-800 dark:hover:bg-red-800/30 dark:hover:text-red-400 dark:focus:bg-red-800/30 dark:focus:text-red-400',
        secondary: 'hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
        warning:
            'text-yellow-500 hover:bg-yellow-100 focus:bg-yellow-100 hover:text-yellow-800 dark:hover:bg-yellow-800/30 dark:hover:text-yellow-400 dark:focus:bg-yellow-800/30 dark:focus:text-yellow-400',
    },
};

function Button({
    children,
    onClick,
    className,
    id,
    variant = 'solid',
    disabled = false,
    color = 'primary',
    title,
    type = 'button',
}: Props) {
    // const buttonClasses = {
    //     solid: 'py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent focus:outline-hidden focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none',
    //     outline:
    //         'py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border text-blue-600 hover:text-blue-500 focus:outline-hidden  focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400',
    //     transparent:
    //         'py-1 px-1 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none',
    // };

    // const colorClasses = {
    //     primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 border-blue-600 hover:border-blue-500 focus:border-blue-500',
    //     danger: '',
    //     secondary: '',
    // };

    return (
        <button
            type={type}
            id={id}
            className={cn(baseButton, buttonClasses[variant], colorClasses[variant][color], className)}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </button>
    );
}

export default Button;
