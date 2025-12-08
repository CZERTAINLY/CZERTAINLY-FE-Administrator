import { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { CalendarRange } from 'lucide-react';

interface Props {
    value?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    disabled?: boolean;
    id?: string;
    invalid?: boolean;
    error?: string;
    className?: string;
    required?: boolean;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function DatePicker({ value, onChange, onBlur, disabled, id, invalid, error, className, required }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [currentMonth, setCurrentMonth] = useState(selectedDate ? selectedDate.getMonth() : new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear());
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const inputValue = useMemo(() => {
        if (!selectedDate) return '';
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        return `${day}.${month}.${year}`;
    }, [selectedDate]);

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setSelectedDate(date);
                setCurrentMonth(date.getMonth());
                setCurrentYear(date.getFullYear());
            }
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            const updateDropdownPosition = () => {
                if (inputRef.current) {
                    const inputRect = inputRef.current.getBoundingClientRect();
                    const dropdownHeight = 380; // Approximate height of the dropdown (w-80 calendar)
                    const dropdownWidth = 320; // w-80 = 20rem = 320px

                    // Position above the input
                    let top = inputRect.top - dropdownHeight - 4; // 4px gap

                    // Ensure dropdown doesn't go above viewport
                    if (top < 8) {
                        top = 8; // 8px margin from top
                    }

                    let left = inputRect.left;

                    // Ensure dropdown doesn't go off right edge
                    if (left + dropdownWidth > window.innerWidth - 8) {
                        left = window.innerWidth - dropdownWidth - 8; // 8px margin from right
                    }

                    // Ensure dropdown doesn't go off left edge
                    if (left < 8) {
                        left = 8; // 8px margin from left
                    }

                    setDropdownPosition({ top, left });
                }
            };

            updateDropdownPosition();

            // Update position on scroll and resize
            window.addEventListener('scroll', updateDropdownPosition, true);
            window.addEventListener('resize', updateDropdownPosition);

            return () => {
                window.removeEventListener('scroll', updateDropdownPosition, true);
                window.removeEventListener('resize', updateDropdownPosition);
            };
        } else {
            setDropdownPosition(null);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (onBlur) {
                    onBlur();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onBlur]);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        // Convert Sunday (0) to 6, Monday (1) to 0, etc.
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(newDate);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(newDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${dayStr}`;
        onChange(formattedDate);
        setIsOpen(false);
        if (onBlur) {
            onBlur();
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleMonthChange = (monthIndex: number) => {
        setCurrentMonth(monthIndex);
    };

    const handleYearChange = (year: number) => {
        setCurrentYear(year);
    };

    const generateYearOptions = () => {
        const currentYearValue = new Date().getFullYear();
        const years = [];
        for (let i = currentYearValue - 10; i <= currentYearValue + 10; i++) {
            years.push(i);
        }
        return years;
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days: Array<{ day: number; isCurrentMonth: boolean; isPrevMonth?: boolean; isNextMonth?: boolean }> = [];

        // Get previous month's last days
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, isPrevMonth: true });
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ day, isCurrentMonth: true });
        }

        // Add days from next month to fill the grid
        const remainingCells = 42 - days.length; // 6 rows * 7 days = 42
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        for (let day = 1; day <= remainingCells; day++) {
            days.push({ day, isCurrentMonth: false, isNextMonth: true });
        }

        const rows: Array<{ day: number; isCurrentMonth: boolean; isPrevMonth?: boolean; isNextMonth?: boolean }>[] = [];
        for (let i = 0; i < days.length; i += 7) {
            rows.push(days.slice(i, i + 7));
        }

        return rows;
    };

    const isSelectedDate = (day: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth || !selectedDate) return false;
        return selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
    };

    const isToday = (day: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return false;
        const today = new Date();
        return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    };

    const calendarRows = renderCalendarDays();
    const yearOptions = generateYearOptions();

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <CalendarRange size={16} className="text-gray-400 dark:text-neutral-500" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    readOnly
                    value={inputValue}
                    disabled={disabled}
                    id={id}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    placeholder="dd.mm.yyyy"
                    className={cn(
                        'py-2.5 sm:py-3 pl-10 pr-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 cursor-pointer',
                        {
                            'border-red-500 focus:border-red-500 focus:ring-red-500': invalid,
                        },
                        {
                            'bg-[#F8FAFC]': disabled,
                        },
                    )}
                />
            </div>
            {isOpen && !disabled && dropdownPosition && (
                <div
                    ref={dropdownRef}
                    className="fixed z-50 w-80 flex flex-col bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-700"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                    }}
                >
                    <div className="p-3 space-y-0.5">
                        {/* Month/Year Navigation */}
                        <div className="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
                            {/* Prev Button */}
                            <div className="col-span-1">
                                <button
                                    type="button"
                                    className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                    aria-label="Previous"
                                    onClick={handlePrevMonth}
                                >
                                    <svg
                                        className="shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Month / Year */}
                            <div className="col-span-3 flex justify-center items-center gap-x-1">
                                <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">{MONTHS[currentMonth]}</span>
                                <span className="text-gray-800 dark:text-neutral-200">/</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">{currentYear}</span>
                            </div>

                            {/* Next Button */}
                            <div className="col-span-1 flex justify-end">
                                <button
                                    type="button"
                                    className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                                    aria-label="Next"
                                    onClick={handleNextMonth}
                                >
                                    <svg
                                        className="shrink-0 size-4"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Weekday Headers */}
                        <div className="flex pb-1.5">
                            {WEEKDAYS.map((day) => (
                                <span key={day} className="m-px w-10 block text-center text-sm text-gray-500 dark:text-neutral-500">
                                    {day}
                                </span>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        {calendarRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {row.map((dayInfo, dayIndex) => {
                                    const { day, isCurrentMonth } = dayInfo;
                                    const isSelected = isSelectedDate(day, isCurrentMonth);
                                    const isTodayDate = isToday(day, isCurrentMonth);

                                    return (
                                        <div key={`${rowIndex}-${dayIndex}`}>
                                            <button
                                                type="button"
                                                className={cn(
                                                    'm-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden',
                                                    {
                                                        'bg-blue-600 border-transparent text-white font-medium hover:border-blue-600 dark:bg-blue-500':
                                                            isSelected,
                                                        'text-gray-800 hover:border-blue-600 hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500':
                                                            !isSelected && isCurrentMonth,
                                                        'text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700':
                                                            !isCurrentMonth,
                                                    },
                                                )}
                                                onClick={() => isCurrentMonth && handleDateSelect(day)}
                                                disabled={!isCurrentMonth}
                                            >
                                                {day}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export default DatePicker;
