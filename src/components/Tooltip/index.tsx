import cn from 'classnames';
import { ReactNode, cloneElement, isValidElement } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

interface Props {
    content: string | ReactNode;
    placement?: TooltipPlacement;
    children: ReactNode;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    disabled?: boolean;
}

function Tooltip({ content, placement = 'bottom', children, className, triggerClassName, contentClassName, disabled = false }: Props) {
    if (disabled) {
        return <>{children}</>;
    }

    const placementClass = placement !== 'auto' ? `[--placement:${placement}]` : '[--placement:auto]';

    // Clone the child element and add hs-tooltip-toggle class
    const triggerElement = isValidElement(children) ? (
        cloneElement(children as React.ReactElement<any>, {
            className: cn('hs-tooltip-toggle', (children as React.ReactElement<any>).props?.className, triggerClassName),
        })
    ) : (
        <span className={cn('hs-tooltip-toggle', triggerClassName)}>{children}</span>
    );

    // Arrow classes based on placement
    const getArrowClasses = () => {
        const baseClasses = 'absolute w-0 h-0 border-4';

        switch (placement) {
            case 'top':
                return cn(
                    baseClasses,
                    'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
                    'border-t-gray-900 border-r-transparent border-b-transparent border-l-transparent',
                    'dark:border-t-neutral-700',
                );
            case 'bottom':
                return cn(
                    baseClasses,
                    'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
                    'border-b-gray-900 border-r-transparent border-t-transparent border-l-transparent',
                    'dark:border-b-neutral-700',
                );
            case 'left':
                return cn(
                    baseClasses,
                    'right-0 top-1/2 -translate-y-1/2 translate-x-full',
                    'border-l-gray-900 border-r-transparent border-t-transparent border-b-transparent',
                    'dark:border-l-neutral-700',
                );
            case 'right':
                return cn(
                    baseClasses,
                    'left-0 top-1/2 -translate-y-1/2 -translate-x-full',
                    'border-r-gray-900 border-l-transparent border-t-transparent border-b-transparent',
                    'dark:border-r-neutral-700',
                );
            default:
                return cn(
                    baseClasses,
                    'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
                    'border-b-gray-900 border-r-transparent border-t-transparent border-l-transparent',
                    'dark:border-b-neutral-700',
                );
        }
    };

    return (
        <div className={cn('hs-tooltip inline-block', placementClass, className)}>
            {triggerElement}
            <span
                className={cn(
                    'hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700',
                    contentClassName,
                )}
                role="tooltip"
            >
                {content}
                <span className={getArrowClasses()} aria-hidden="true" />
            </span>
        </div>
    );
}

export default Tooltip;
