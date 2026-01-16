import { ReactNode } from 'react';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

interface Props {
    content: string | ReactNode;
    children: ReactNode;
    title?: string;
    width?: number;
}

function Popover({ content, children, title, width = 300 }: Props) {
    return (
        <div className="hs-tooltip [--trigger:click] inline-block">
            <div className="hs-tooltip-toggle block text-center" tabIndex={0}>
                {children}
                <div
                    className="!bg-[#F7F6F2] px-5 py-4 hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hidden opacity-0 transition-opacity absolute invisible z-10 bg-white border border-gray-100 text-start rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700"
                    style={width ? { width: `${width}px` } : undefined}
                    role="tooltip"
                >
                    {title && <div className="text-lg font-bold mb-2">{title}</div>}
                    {content}
                </div>
            </div>
        </div>
    );
}

export default Popover;
