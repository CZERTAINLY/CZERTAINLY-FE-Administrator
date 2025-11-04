import Button, { ButtonColor, ButtonVariant } from 'components/Button';
import { Trash2, Info, AlertTriangle, X, ArrowUpFromLine, Users, User, CircleMinus } from 'lucide-react';
import cx from 'classnames';
import { useEffect } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DialogButton {
    color: ButtonColor;
    body: string | React.ReactNode;
    onClick: (formData?: any) => void;
    disabled?: boolean;
    variant?: ButtonVariant;
}

interface Props {
    isOpen: boolean;
    toggle?: () => void;
    caption?: string | React.ReactNode;
    body?: string | React.ReactNode;
    buttons?: DialogButton[];
    size?: ModalSize;
    dataTestId?: string;
    icon?: 'delete' | 'info' | 'warning' | 'success' | 'error' | 'users' | 'user' | React.ReactNode;
    noBorder?: boolean;
}

export default function Dialog({ isOpen, toggle, caption, body, buttons, size = 'sm', dataTestId, icon, noBorder = false }: Props) {
    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-xl',
        xl: 'sm:max-w-4xl',
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const renderIcon = () => {
        if (!icon) return null;
        const iconColor = {
            delete: '#991B1B',
            destroy: '#991B1B',
        };
        let iconElement = null;
        const buttonProps = {
            size: 26,
            strokeWidth: 1,
        };
        switch (icon) {
            case 'delete':
                iconElement = <Trash2 {...buttonProps} />;
                break;
            case 'info':
                iconElement = <Info {...buttonProps} />;
                break;
            case 'warning':
                iconElement = <AlertTriangle {...buttonProps} />;
                break;
            case 'upload':
                iconElement = <ArrowUpFromLine {...buttonProps} />;
                break;
            case 'users':
                iconElement = <Users {...buttonProps} />;
                break;
            case 'user':
                iconElement = <User {...buttonProps} />;
                break;
            case 'destroy':
                iconElement = <CircleMinus {...buttonProps} />;
                break;
            default:
                iconElement = icon as React.ReactNode;
                break;
        }

        return (
            <div
                className="w-12 h-12 m-2 mb-4 bg-current/12 rounded-full flex items-center justify-center relative z-1 after:content-[''] after:absolute after:w-16 after:h-16 after:bg-current/6 after:rounded-full after:-z-10 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
                style={{ color: iconColor[icon as keyof typeof iconColor] || '#6B7280' }}
            >
                {iconElement}
            </div>
        );
    };

    const hideBorders = icon === 'delete' || icon === 'destroy' || noBorder;

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[79] transition-opacity duration-200" onClick={toggle} aria-hidden="true" />
            )}
            <div
                id="hs-scale-animation-modal"
                className={cx('hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto', {
                    hidden: !isOpen,
                    'pointer-events-auto': isOpen,
                    'pointer-events-none': !isOpen,
                })}
                role="dialog"
                tabIndex={-1}
                aria-labelledby="hs-scale-animation-modal-label"
                data-testid={dataTestId}
            >
                <div
                    className={cx(
                        'hs-overlay-animation-target ease-in-out transition-all duration-200 m-3 sm:mx-auto min-h-[calc(100%-56px)] flex items-center',
                        sizeClasses[size || 'sm'],
                        {
                            'scale-100 opacity-100': isOpen,
                            'scale-95 opacity-0': !isOpen,
                        },
                    )}
                >
                    <div className="w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70 md:p-8 relative">
                        <Button variant="transparent" onClick={toggle} className="absolute right-2 top-2">
                            <X size={16} />
                        </Button>
                        <div
                            className={cx('flex flex-col justify-center items-center py-3 px-4 dark:border-neutral-700', {
                                'border-b border-gray-200': !hideBorders,
                            })}
                        >
                            {renderIcon()}
                            <h3
                                id="hs-scale-animation-modal-label"
                                className="font-bold text-gray-800 dark:text-white text-2xl text-center"
                            >
                                {caption}
                            </h3>
                        </div>
                        <div className="p-4 overflow-y-auto text-gray-800 dark:text-white">{body}</div>
                        {buttons && buttons.length > 0 && (
                            <div
                                className={cx('flex justify-center items-center gap-4 py-3 px-4 mt-2 dark:border-neutral-700', {
                                    'border-t border-gray-200': !hideBorders,
                                    'pt-0': hideBorders,
                                })}
                            >
                                {buttons.map((button, index) => (
                                    <Button
                                        key={index}
                                        color={button.color}
                                        onClick={() => button.onClick()}
                                        disabled={button.disabled || false}
                                        data-hs-overlay="#hs-scale-animation-modal"
                                        variant={button.variant}
                                    >
                                        {button.body}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
