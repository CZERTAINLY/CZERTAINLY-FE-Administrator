import { useEffect, useRef, useMemo } from 'react';
import Label from 'components/Label';
import Button from 'components/Button';
import cn from 'classnames';
import { X } from 'lucide-react';

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
    isSearchable?: boolean;
    minWidth?: number;
    dropdownScope?: 'window';
    dropdownWidth?: number;
    dataTestId?: string;
}

interface SingleSelectProps extends BaseProps {
    isMulti?: false;
    value: string | number | object | { value: string | number | object; label: string };
    onChange: (value: string | number | object | { value: string | number | object; label: string }) => void;
}

interface MultiSelectProps extends BaseProps {
    isMulti: true;
    value: { value: string | number; label: string }[];
    onChange: (value: { value: string | number; label: string }[] | undefined) => void;
}

type OptionValue = string | number | object;

const getOptionValueString = (val: OptionValue): string => {
    if (typeof val === 'object' && val !== null) {
        if ('reference' in val && typeof val.reference === 'string') {
            return val.reference;
        }
        const uuid = getUuidFromValue(val);
        if (uuid) {
            return uuid;
        }
        if ('data' in val && val.data !== undefined) {
            const d = (val as { data: unknown }).data;
            if (typeof d === 'string' || typeof d === 'number' || typeof d === 'boolean') {
                return String(d);
            }
            if (typeof d === 'object' && d !== null) {
                return JSON.stringify(d);
            }
        }
        return JSON.stringify(val);
    }
    return String(val);
};

const getUuidFromValue = (val: any): string | null => {
    if (typeof val === 'object' && val !== null) {
        if (val.uuid && typeof val.uuid === 'string') {
            return val.uuid;
        }
        if (val.data && typeof val.data === 'object' && val.data.uuid && typeof val.data.uuid === 'string') {
            return val.data.uuid;
        }
    }
    return null;
};

const valuesMatch = (val1: any, val2: any): boolean => {
    if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'string' && val1?.name) {
        return val1.name === val2;
    }

    if (typeof val1 === 'string' && typeof val2 === 'object' && val2 !== null && val2?.name) {
        return val1 === val2.name;
    }

    if (typeof val1 !== 'object' || typeof val2 !== 'object' || val1 === null || val2 === null) {
        return val1 === val2;
    }

    if (val1?.reference && val2?.reference) {
        return val1.reference === val2.reference;
    }

    if ('data' in val1 && 'data' in val2) {
        const d1 = val1.data;
        const d2 = val2.data;
        if (typeof d1 === 'object' && d1 !== null && typeof d2 === 'object' && d2 !== null) {
            return JSON.stringify(d1) === JSON.stringify(d2);
        }
        return d1 === d2;
    }

    return JSON.stringify(val1) === JSON.stringify(val2);
};

type Props = SingleSelectProps | MultiSelectProps;

function Select({
    id,
    required,
    options: optionsProp = [],
    value,
    onChange,
    className,
    placeholder = 'Select...',
    label,
    isDisabled,
    placement,
    isMulti = false,
    isClearable,
    isSearchable = false,
    error,
    minWidth,
    dropdownScope,
    dropdownWidth,
    dataTestId,
}: Props) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const previousOptionsRef = useRef<string>('');
    const previousValueRef = useRef<
        | string
        | number
        | object
        | { value: string | number | object; label: string }
        | { value: string | number; label: string }[]
        | undefined
    >(undefined);
    const isInitializedRef = useRef(false);

    const getValueFromProp = useMemo(() => {
        if (isMulti) {
            return undefined; // Multi-select doesn't need this
        }
        const singleValue = value as SingleSelectProps['value'];
        if (singleValue && typeof singleValue === 'object' && 'value' in singleValue) {
            return (singleValue as { value: string | number | object; label: string }).value;
        }
        return singleValue as string | number | object | undefined;
    }, [isMulti, value]);

    // Remove duplicate options
    const options = useMemo(() => {
        return Array.from(new Map(optionsProp.map((o) => [o.value, o])).values());
    }, [optionsProp]);

    const optionsKey = useMemo(() => {
        return JSON.stringify(options?.map((opt) => ({ value: opt.value, label: opt.label, disabled: opt.disabled })));
    }, [options]);

    useEffect(() => {
        if (!selectRef.current || !(window as any).HSSelect) return;

        const optionsChanged = previousOptionsRef.current !== optionsKey;
        const valueChanged = (() => {
            if (isMulti) {
                const prev = previousValueRef.current as { value: string | number; label: string }[] | undefined;
                const curr = value as { value: string | number; label: string }[];
                if (!prev && !curr) return false;
                if (!prev || !curr) return true;
                if (prev.length !== curr.length) return true;
                return prev.some((p, i) => !valuesMatch(p.value, curr[i]?.value));
            } else {
                const prev = previousValueRef.current;
                const curr = getValueFromProp;
                return !valuesMatch(prev, curr);
            }
        })();

        if (optionsChanged) {
            const instance = (window as any).HSSelect.getInstance(selectRef.current);
            if (instance) {
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
        } else if (valueChanged) {
            const instance = (window as any).HSSelect.getInstance(selectRef.current);
            if (instance) {
                const isOpen = instance.isOpened && typeof instance.isOpened === 'function' && instance.isOpened();
                if (isOpen) {
                    instance.close();
                }
                instance.destroy();
                isInitializedRef.current = false;
            }

            if (selectRef.current) {
                if (isMulti) {
                    const curr = value as { value: string | number; label: string }[];
                    Array.from(selectRef.current.options).forEach((option) => {
                        if (option.value === '') {
                            option.selected = false;
                            return;
                        }
                        const isSelected = curr?.some((v) => getOptionValueString(v.value) === option.value);
                        option.selected = isSelected || false;
                    });
                } else {
                    const valueString = getValueFromProp != null ? getOptionValueString(getValueFromProp as OptionValue) : '';
                    selectRef.current.value = valueString;
                }
            }

            const frameId = requestAnimationFrame(() => {
                if (selectRef.current && (window as any).HSSelect) {
                    (window as any).HSSelect.autoInit();
                    isInitializedRef.current = true;
                }
            });

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
    }, [optionsKey, value, id, isMulti, getValueFromProp]);

    useEffect(() => {
        const select = selectRef.current;
        if (!select?.parentNode) return;

        const setTitlesAndTooltips = () => {
            const container = select.closest('[data-testid]')?.parentElement ?? select.parentNode;
            const root = container as Element;

            // Try to get dropdown from HSSelect instance (works also when dropdownScope === 'window')
            const hsInstance = (window as any).HSSelect?.getInstance?.(select);
            const dropdown: Element | null = (hsInstance && hsInstance.dropdown) || root.querySelector?.('.hs-select-dropdown');
            dropdown?.querySelectorAll?.('.hs-select-option-row').forEach((row) => {
                const titleEl = row.querySelector?.('[data-title]');
                const tooltipContentEl = row.querySelector?.('[data-tooltip-content]');
                if (titleEl instanceof HTMLElement && tooltipContentEl instanceof HTMLElement && titleEl.textContent) {
                    tooltipContentEl.textContent = titleEl.textContent.trim();
                }
            });
            root.querySelectorAll?.('[data-tag-value]').forEach((tagEl) => {
                const titleEl = tagEl.querySelector?.('[data-title]');
                const tooltipContentEl = tagEl.querySelector?.('[data-tooltip-content]');
                if (titleEl instanceof HTMLElement && tooltipContentEl instanceof HTMLElement && titleEl.textContent) {
                    tooltipContentEl.textContent = titleEl.textContent.trim();
                }
            });
            (window as any).HSTooltip?.autoInit?.();
        };

        const observer = new MutationObserver(() => {
            requestAnimationFrame(() => setTitlesAndTooltips());
        });
        observer.observe(select.parentNode, { childList: true, subtree: true });
        requestAnimationFrame(() => setTitlesAndTooltips());
        return () => observer.disconnect();
    }, [options, isMulti, id]);

    const hasOptions = options && options.length > 0;

    const hasSearch = isSearchable && !isMulti;

    // Check if there's a selected value for clear button
    const hasValue = isMulti
        ? Array.isArray(value) && value.length > 0
        : getValueFromProp != null && getValueFromProp !== '' && getValueFromProp !== placeholder;

    return (
        <div data-testid={dataTestId ?? `select-${id}`}>
            {label && <Label htmlFor={id} title={label} required={required} />}
            <div className={cn('relative', className)} style={minWidth ? { minWidth: `${minWidth}px` } : undefined}>
                <select
                    ref={selectRef}
                    multiple={isMulti}
                    data-testid={dataTestId ? `${dataTestId}-input` : `select-${id}-input`}
                    value={
                        isMulti
                            ? undefined
                            : (() => {
                                  if (getValueFromProp == null) return '';
                                  return getOptionValueString(getValueFromProp as OptionValue);
                              })()
                    }
                    data-hs-select={JSON.stringify({
                        ...(isMulti && {
                            mode: 'tags',
                            wrapperClasses:
                                'relative ps-2 pe-9 min-h-11 flex items-center flex-wrap w-full bg-white border border-gray-200 rounded-lg text-start text-sm hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 [&>*:not(.hs-select-dropdown)]:max-w-full',
                            tagsInputClasses:
                                'py-2.5 px-1 flex-1 min-w-[80px] bg-transparent border-0 text-[var(--dark-gray-color)] placeholder-gray-400 focus:ring-0 text-sm outline-none dark:text-neutral-200 dark:placeholder-neutral-500 order-1',
                            tagsItemTemplate:
                                '<div class="max-w-full min-w-0 flex flex-nowrap items-center relative z-10 bg-white border border-gray-200 rounded-full p-1 pl-2.5 m-1 dark:bg-neutral-800 dark:border-neutral-600"><div class="hs-tooltip [--placement:top] inline-block min-w-0 flex-1"><div class="hs-tooltip-toggle truncate min-w-0 text-[var(--dark-gray-color)] dark:text-neutral-200 cursor-default block" data-title></div><span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition-opacity inline-block absolute z-[110] py-1 px-2 bg-[var(--tooltip-background-color)] text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700" data-tooltip-content role="tooltip"></span></div><div class="inline-flex shrink-0 justify-center items-center size-5 ms-1.5 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none text-gray-600 hover:text-gray-800 dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-neutral-300 cursor-pointer" data-remove><svg class="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div></div>',
                        }),
                        hasSearch: hasSearch,
                        searchPlaceholder: 'Search...',
                        searchClasses:
                            'block w-full sm:text-sm !border-gray-200 rounded-lg focus:ring-transparent dark:bg-neutral-900 dark:!border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 py-1.5 sm:py-2 px-3',
                        searchWrapperClasses: 'bg-white p-2 -mx-1 sticky top-0 dark:bg-neutral-900',
                        placeholder: hasOptions ? placeholder : 'No options',
                        toggleTag: '<button type="button" aria-expanded="false"></button>',
                        toggleClasses: `${isClearable && hasValue ? 'pe-14' : 'pe-9'} hs-select-disabled:pointer-events-none text-[var(--dark-gray-color)] hs-select-disabled:opacity-50 relative py-3 ps-4 flex gap-x-2 w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600 overflow-hidden [&>span]:truncate [&>span]:block [&>span]:min-w-0`,
                        dropdownClasses: `hs-select-dropdown mt-2 z-[100] ${
                            dropdownWidth ? `w-[${dropdownWidth}px] !right-0 !left-auto` : 'w-full'
                        } max-h-72 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700 ${
                            hasSearch ? ' px-1 pb-1' : 'p-1'
                        }`,
                        ...(dropdownScope && { dropdownScope }),
                        optionClasses:
                            'hs-select-option-row py-2 px-3 w-full text-sm cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800 overflow-hidden',
                        optionTemplate:
                            '<div class="flex justify-between items-center w-full text-[var(--dark-gray-color)] min-w-0"><div class="hs-tooltip [--placement:top] inline-block min-w-0 flex-1"><span class="hs-tooltip-toggle truncate block min-w-0 cursor-pointer" data-title></span><span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition-opacity inline-block absolute z-[110] py-1 px-2 bg-[var(--tooltip-background-color)] text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700" data-tooltip-content role="tooltip"></span></div><span class="hidden hs-selected:block shrink-0"><svg class="shrink-0 size-3.5 text-blue-600 dark:text-blue-500 ml-2" xmlns="http:.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div>',
                        extraMarkup:
                            '<div class="absolute top-1/2 end-3 -translate-y-1/2"><svg class="shrink-0 size-3.5 dark:text-neutral-500 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></div>',
                        closeOnSelect: !isMulti,
                        dropdownVerticalFixedPlacement: placement,
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
                                  return valuesMatch(v.value, option.value);
                              })
                            : (() => {
                                  const currentValue = getValueFromProp;
                                  return valuesMatch(option.value, currentValue);
                              })();
                        return (
                            <option
                                key={optionValueString || index}
                                value={optionValueString}
                                selected={isSelected}
                                disabled={option.disabled}
                                title={option.label}
                            >
                                {option.label}
                            </option>
                        );
                    })}
                </select>
                {isClearable && hasValue && !isMulti && (
                    <Button
                        id={`${id}-clear`}
                        type="button"
                        variant="transparent"
                        color="lightGray"
                        className="!p-0 absolute top-1/2 end-8 -translate-y-1/2"
                        data-testid={dataTestId ? `${dataTestId}-clear` : `select-${id}-clear`}
                        onClick={() => {
                            (onChange as MultiSelectProps['onChange'])(undefined);
                        }}
                        aria-label="Clear selection"
                    >
                        <X size={12} />
                    </Button>
                )}
            </div>
            {error && <div className="text-red-500 mt-1">{error}</div>}
        </div>
    );
}

export default Select;
