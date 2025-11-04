import cn from 'classnames';
import { useEffect, useRef } from 'react';

export type SingleValue<T> = T | undefined;
export type MultiValue<T> = T[] | undefined;

interface Props {
    id: string;
    options: {
        value: string | number;
        label: string;
        disabled?: boolean;
    }[];
    value: string | number;
    onChange: (value: string | number) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    isDisabled?: boolean;
    placement?: 'top' | 'bottom';
}

function Select({ id, options, value, onChange, className, placeholder = 'Select...', label, isDisabled, placement }: Props) {
    const selectRef = useRef<HTMLSelectElement>(null);

    // Render the select component
    useEffect(() => {
        if (selectRef.current && (window as any).HSSelect) {
            const instance = (window as any).HSSelect.getInstance(selectRef.current);
            if (instance) {
                instance.destroy();
            }
            (window as any).HSSelect.autoInit();
        }
    }, [options, value]);

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm text-left font-medium mb-2 text-center dark:text-white">
                    {label}
                </label>
            )}
            <div>
                <select
                    ref={selectRef}
                    data-hs-select={JSON.stringify({
                        placeholder: placeholder,
                        toggleTag: '<button type="button" aria-expanded="false"></button>',
                        toggleClasses:
                            'hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600',
                        dropdownClasses:
                            'mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700',
                        optionClasses:
                            'py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800',
                        optionTemplate:
                            '<div class="flex justify-between items-center w-full"><span data-title></span><span class="hidden hs-selected:block"><svg class="shrink-0 size-3.5 text-blue-600 dark:text-blue-500 ml-2" xmlns="http:.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div>',
                        extraMarkup:
                            '<div class="absolute top-1/2 end-3 -translate-y-1/2"><svg class="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></div>',
                        dropdownVerticalFixedPlacement: placement,
                    })}
                    id={id}
                    disabled={isDisabled}
                    className={className}
                    // className={cn(
                    //     'py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                    //     className,
                    // )}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Choose</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} selected={option.value === value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Select;
