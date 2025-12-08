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
}

function Label({ htmlFor, title, children, required, className }: Props) {
    const defaultClasses = 'block text-left text-sm font-medium mb-2 text-center dark:text-white text-[var(--dark-gray-color)]';
    return (
        <label htmlFor={htmlFor} className={cn(defaultClasses, className)}>
            {title || children}
            {required && <span className="text-red-500"> *</span>}
        </label>
    );
}

export default Label;
