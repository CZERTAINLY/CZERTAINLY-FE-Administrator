import { useEffect, useRef } from 'react';
import Label from 'components/Label';

export type SingleValue<T> = T | undefined;
export type MultiValue<T> = T[] | undefined;

interface BaseProps {
    id: string;
    options?: {
        value: string | number;
        label: string;
        disabled?: boolean;
    }[];
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    isDisabled?: boolean;
    placement?: 'top' | 'bottom';
    isClearable?: boolean;
    required?: boolean;
    error?: string;
}

interface SingleSelectProps extends BaseProps {
    isMulti?: false;
    value: string | number;
    onChange: (value: string | number) => void;
}

interface MultiSelectProps extends BaseProps {
    isMulti: true;
    value: { value: string | number; label: string }[];
    onChange: (value: { value: string | number; label: string }[] | undefined) => void;
}

type OptionValue = string | number;
type Option = { value: OptionValue; label: string; disabled?: boolean };

type Props = SingleSelectProps | MultiSelectProps;

function Select({
    id,
    required,
    options = [],
    value,
    onChange,
    className,
    placeholder = 'Select...',
    label,
    isDisabled,
    placement,
    isMulti = false,
    isClearable,
    error,
}: Props) {
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

    const hasOptions = options && options.length > 0;

    return (
        <div>
            {label && <Label htmlFor={id} title={label} required={required} />}
            <div>
                <select
                    ref={selectRef}
                    multiple={isMulti}
                    data-hs-select={JSON.stringify({
                        placeholder: hasOptions ? placeholder : 'No options',
                        toggleTag: '<button type="button" aria-expanded="false"></button>',
                        toggleClasses:
                            'hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600',
                        dropdownClasses:
                            'mt-2 z-[100] w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700',
                        optionClasses:
                            'py-2 px-4 w-full text-sm text-gray cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800',
                        optionTemplate:
                            '<div class="flex justify-between items-center w-full"><span data-title></span><span class="hidden hs-selected:block"><svg class="shrink-0 size-3.5 text-blue-600 dark:text-blue-500 ml-2" xmlns="http:.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div>',
                        extraMarkup:
                            '<div class="absolute top-1/2 end-3 -translate-y-1/2"><svg class="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></div>',
                        closeOnSelect: !isMulti,
                        dropdownVerticalFixedPlacement: placement,
                        tagsItemTemplate:
                            '<div class="flex flex-nowrap items-center relative z-10 bg-white border border-gray-200 rounded-full p-1 m-1 dark:bg-neutral-900 dark:border-neutral-700 "><div class="size-6 me-1" data-icon></div><div class="whitespace-nowrap text-gray-800 dark:text-neutral-200 " data-title></div><div class="inline-flex shrink-0 justify-center items-center size-5 ms-2 rounded-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:outline-hidden focus:ring-2 focus:ring-gray-400 text-sm dark:bg-neutral-700/50 dark:hover:bg-neutral-700 dark:text-neutral-400 cursor-pointer" data-remove><svg class="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div></div>',
                    })}
                    id={id}
                    disabled={isDisabled || !hasOptions}
                    className={className}
                    // className={cn(
                    //     'py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                    //     className,
                    // )}
                    onChange={(e) => {
                        if (isMulti) {
                            const selectedOptions = Array.from(e.target.selectedOptions);
                            const newValues = selectedOptions
                                .map((option) => {
                                    const matchedOption = (options || []).find((opt) => opt.value.toString() === option.value);
                                    return matchedOption ? { value: matchedOption.value, label: matchedOption.label } : null;
                                })
                                .filter((val) => val !== null) as { value: string | number; label: string }[]; // Filter out null values and placeholder
                            const result = newValues.length > 0 ? newValues : undefined;
                            (onChange as MultiSelectProps['onChange'])(result);
                        } else {
                            const value = e.target.value;
                            (onChange as SingleSelectProps['onChange'])(
                                value === '' ? (options || []).find((opt) => opt.value.toString() === value)?.value || value : value,
                            );
                        }
                    }}
                >
                    <option value="">Choose</option>
                    {(options || []).map((option) => {
                        const isSelected = isMulti
                            ? !!value && (value as { value: string | number; label: string }[]).some((v) => v.value === option.value)
                            : option.value === value;
                        return (
                            <option key={option.value} value={option.value} selected={isSelected} disabled={option.disabled}>
                                {option.label}
                            </option>
                        );
                    })}
                </select>
            </div>
            {error && <div className="text-red-500 mt-1">{error}</div>}
        </div>
    );
}

export default Select;
