import { useEffect, useRef, useMemo } from 'react';
import Label from 'components/Label';

export type SingleValue<T> = T | undefined;
export type MultiValue<T> = T[] | undefined;

interface BaseProps {
    id: string;
    options?: {
        value: string | number | object;
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
    value: string | number | { value: string | number; label: string };
    onChange: (value: string | number) => void;
}

interface MultiSelectProps extends BaseProps {
    isMulti: true;
    value: { value: string | number; label: string }[];
    onChange: (value: { value: string | number; label: string }[] | undefined) => void;
}

type OptionValue = string | number | object;
type Option = { value: OptionValue; label: string; disabled?: boolean };

const getOptionValueString = (val: OptionValue): string => {
    if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val);
    }
    return String(val);
};

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
    if (id === '__attributes__entity__.credentialSelect') {
        console.log('value', value);
        console.log('options', options);
    }
    const selectRef = useRef<HTMLSelectElement>(null);
    const previousOptionsRef = useRef<string>('');
    const previousValueRef = useRef<
        string | number | { value: string | number; label: string } | { value: string | number; label: string }[] | undefined
    >(undefined);
    const isInitializedRef = useRef(false);

    const getValueFromProp = useMemo(() => {
        if (isMulti) {
            return undefined; // Multi-select doesn't need this
        }
        const singleValue = value as SingleSelectProps['value'];
        if (singleValue && typeof singleValue === 'object' && 'value' in singleValue) {
            return singleValue.value;
        }
        return singleValue as string | number | undefined;
    }, [isMulti, value]);

    const optionsKey = useMemo(() => {
        return JSON.stringify(options?.map((opt) => ({ value: opt.value, label: opt.label, disabled: opt.disabled })));
    }, [options]);

    useEffect(() => {
        if (!selectRef.current || !(window as any).HSSelect) return;

        const optionsChanged = previousOptionsRef.current !== optionsKey;

        if (optionsChanged) {
            const instance = (window as any).HSSelect.getInstance(selectRef.current);
            if (instance) {
                const isOpen = instance.isOpened && typeof instance.isOpened === 'function' && instance.isOpened();
                if (isOpen) {
                    previousOptionsRef.current = optionsKey;
                    previousValueRef.current = value;
                    return;
                }
                instance.destroy();
                isInitializedRef.current = false;
            }

            const frameId = requestAnimationFrame(() => {
                if (selectRef.current && (window as any).HSSelect) {
                    (window as any).HSSelect.autoInit();
                    isInitializedRef.current = true;
                }
            });

            previousOptionsRef.current = optionsKey;
            previousValueRef.current = value;

            return () => cancelAnimationFrame(frameId);
        } else if (!isInitializedRef.current) {
            const frameId = requestAnimationFrame(() => {
                if (selectRef.current && (window as any).HSSelect) {
                    (window as any).HSSelect.autoInit();
                    isInitializedRef.current = true;
                }
            });
            previousValueRef.current = value;
            return () => cancelAnimationFrame(frameId);
        } else {
            previousValueRef.current = value;
        }
    }, [optionsKey, value]);

    const hasOptions = options && options.length > 0;

    return (
        <div>
            {label && <Label htmlFor={id} title={label} required={required} />}
            <div>
                <select
                    ref={selectRef}
                    multiple={isMulti}
                    value={isMulti ? undefined : (getValueFromProp?.toString() ?? '')}
                    data-hs-select={JSON.stringify({
                        placeholder: hasOptions ? placeholder : 'No options',
                        toggleTag: '<button type="button" aria-expanded="false"></button>',
                        toggleClasses:
                            'hs-select-disabled:pointer-events-none text-[var(--dark-gray-color)] hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600',
                        dropdownClasses:
                            'mt-2 z-[100] w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700',
                        optionClasses:
                            'py-2 px-4 w-full text-sm cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800',
                        optionTemplate:
                            '<div class="flex justify-between items-center w-full text-[var(--dark-gray-color)]"><span data-title></span><span class="hidden hs-selected:block"><svg class="shrink-0 size-3.5 text-blue-600 dark:text-blue-500 ml-2" xmlns="http:.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div>',
                        extraMarkup:
                            '<div class="absolute top-1/2 end-3 -translate-y-1/2"><svg class="shrink-0 size-3.5 dark:text-neutral-500 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></div>',
                        closeOnSelect: !isMulti,
                        dropdownVerticalFixedPlacement: placement,
                        tagsItemTemplate:
                            '<div class="flex flex-nowrap items-center relative z-10 bg-white border border-gray-200 rounded-full p-1 m-1 dark:bg-neutral-900 dark:border-neutral-700 "><div class="size-6 me-1" data-icon></div><div class="whitespace-nowrap dark:text-neutral-200 " data-title></div><div class="inline-flex shrink-0 justify-center items-center size-5 ms-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-hidden focus:ring-2 focus:ring-gray-400 text-sm dark:bg-neutral-700/50 dark:hover:bg-neutral-700 dark:text-neutral-400 cursor-pointer" data-remove><svg class="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div></div>',
                    })}
                    id={id}
                    disabled={isDisabled || !hasOptions}
                    className={className}
                    onChange={(e) => {
                        if (isMulti) {
                            const selectedOptions = Array.from(e.target.selectedOptions);
                            const newValues = selectedOptions
                                .map((option) => {
                                    const matchedOption = (options || []).find((opt) => getOptionValueString(opt.value) === option.value);
                                    return matchedOption ? { value: matchedOption.value, label: matchedOption.label } : null;
                                })
                                .filter((val) => val !== null) as { value: string | number; label: string }[]; // Filter out null values and placeholder
                            const result = newValues.length > 0 ? newValues : undefined;
                            (onChange as MultiSelectProps['onChange'])(result);
                        } else {
                            const selectedValue = e.target.value;
                            if (selectedValue === '') {
                                (onChange as SingleSelectProps['onChange'])('' as any);
                                return;
                            }
                            const matchedOption = (options || []).find((opt) => getOptionValueString(opt.value) === selectedValue);
                            (onChange as SingleSelectProps['onChange'])(matchedOption ? matchedOption.value : (selectedValue as any));
                        }
                    }}
                >
                    <option value="">Choose</option>
                    {(options || []).map((option, index) => {
                        const optionValueString = getOptionValueString(option.value);
                        const isSelected = isMulti
                            ? !!value &&
                              (value as { value: string | number; label: string }[]).some((v) => {
                                  if (typeof v.value === 'object' && typeof option.value === 'object') {
                                      return JSON.stringify(v.value) === JSON.stringify(option.value);
                                  }
                                  return v.value === option.value;
                              })
                            : (() => {
                                  const currentValue = getValueFromProp;
                                  if (typeof option.value === 'object' && typeof currentValue === 'object') {
                                      return JSON.stringify(option.value) === JSON.stringify(currentValue);
                                  }
                                  return option.value === currentValue;
                              })();
                        return (
                            <option
                                key={optionValueString || index}
                                value={optionValueString}
                                selected={isSelected}
                                disabled={option.disabled}
                            >
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
