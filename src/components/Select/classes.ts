const SELECT_WRAPPER_BASE =
    'relative ps-2 min-h-11 flex items-center flex-wrap w-full bg-white border border-gray-200 rounded-lg text-start text-sm hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 [&>*:not(.hs-select-dropdown)]:max-w-full';

export const SELECT_WRAPPER_CLASSES = `${SELECT_WRAPPER_BASE} pe-9`;
export const SELECT_WRAPPER_CLEARABLE_CLASSES = `${SELECT_WRAPPER_BASE} pe-14`;

export const SELECT_TAGS_INPUT_CLASSES =
    'py-2.5 px-1 flex-1 min-w-[80px] bg-transparent border-0 text-[var(--dark-gray-color)] placeholder-gray-400 focus:ring-0 text-sm outline-none dark:text-neutral-200 dark:placeholder-neutral-500 order-1';

export const SELECT_TAGS_ITEM_TEMPLATE =
    '<div class="max-w-full min-w-0 flex flex-nowrap items-center relative z-10 bg-white border border-gray-200 rounded-full p-1 pl-2.5 m-1 dark:bg-neutral-800 dark:border-neutral-600"><div class="hs-tooltip [--placement:top] inline-block min-w-0 flex-1"><div class="hs-tooltip-toggle truncate min-w-0 text-[var(--dark-gray-color)] dark:text-neutral-200 cursor-default block" data-title></div><span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hs-tooltip-shown:h-auto hs-tooltip-shown:overflow-visible opacity-0 invisible h-0 overflow-hidden transition-opacity inline-block absolute z-[110] py-1 px-2 bg-[var(--tooltip-background-color)] text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700" data-tooltip-content role="tooltip"></span></div><div class="inline-flex shrink-0 justify-center items-center size-5 ms-1.5 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none text-gray-600 hover:text-gray-800 dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-neutral-300 cursor-pointer" data-remove><svg class="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div></div>';

export const SELECT_SEARCH_CLASSES =
    'block w-full sm:text-sm !border-gray-200 rounded-lg focus:ring-transparent dark:bg-neutral-900 dark:!border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 py-1.5 sm:py-2 px-3';

export const SELECT_SEARCH_WRAPPER_CLASSES = 'bg-white p-2 -mx-1 sticky top-0 dark:bg-neutral-900';

export const SELECT_TOGGLE_CLASSES_BASE =
    'hs-select-disabled:pointer-events-none text-[var(--dark-gray-color)] hs-select-disabled:opacity-50 relative py-3 ps-4 flex gap-x-2 w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600 overflow-hidden [&>span]:truncate [&>span]:block [&>span]:min-w-0';

export const SELECT_DROPDOWN_CLASSES_BASE =
    'hs-select-dropdown mt-2 z-[100] max-h-72 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700';

export const SELECT_DROPDOWN_FIXED_WIDTH_CLASSES = 'w-[var(--select-dropdown-width)] !right-0 !left-auto';

export const SELECT_OPTION_CLASSES =
    'hs-select-option-row py-2 px-3 w-full text-sm cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800 overflow-hidden';

export const SELECT_OPTION_TEMPLATE =
    '<div class="flex justify-between items-center w-full text-[var(--dark-gray-color)] min-w-0"><div class="hs-tooltip [--placement:top] inline-block min-w-0 flex-1"><span class="hs-tooltip-toggle truncate block min-w-0 cursor-pointer" data-title></span><span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hs-tooltip-shown:h-auto hs-tooltip-shown:overflow-visible opacity-0 invisible h-0 overflow-hidden transition-opacity inline-block absolute z-[110] py-1 px-2 bg-[var(--tooltip-background-color)] text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700" data-tooltip-content role="tooltip"></span></div><span class="hidden hs-selected:block shrink-0"><svg class="shrink-0 size-3.5 text-blue-600 dark:text-blue-500 ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div>';

export const SELECT_EXTRA_MARKUP =
    '<div class="absolute top-1/2 end-3 -translate-y-1/2"><svg class="shrink-0 size-3.5 dark:text-neutral-500 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></div>';
