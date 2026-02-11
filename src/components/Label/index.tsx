import cn from 'classnames';
import { useEffect, useRef } from 'react';

export type SingleValue<T> = T | undefined;
export type MultiValue<T> = T[] | undefined;

interface Props {
    htmlFor?: string;
    title?: string;
    children?: React.ReactNode;
    required?: boolean;
    className?: string;
    onClick?: () => void;
    dataTestId?: string;
}

function Label({ htmlFor, title, children, required, className, onClick, dataTestId }: Props) {
    const defaultClasses = 'block text-left text-sm font-medium mb-2 text-center dark:text-white text-[var(--dark-gray-color)]';
    return (
        <label
            htmlFor={htmlFor}
            className={cn(defaultClasses, className)}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onClick();
                          }
                      }
                    : undefined
            }
            data-testid={dataTestId ?? (htmlFor ? `label-${htmlFor}` : 'label')}
        >
            {title || children}
            {required && <span className="text-red-500"> *</span>}
        </label>
    );
}

export default Label;
