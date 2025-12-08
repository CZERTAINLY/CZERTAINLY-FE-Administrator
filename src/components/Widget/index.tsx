import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import Spinner from 'components/Spinner';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';
import WidgetLock from 'components/WidgetLock';
import { selectors } from 'ducks/user-interface';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { LockWidgetNameEnum } from 'types/user-interface';
import { RefreshCw } from 'lucide-react';
import Button from 'components/Button';

interface WidgetInfoCard {
    title: string;
    heading?: string;
    description: string;
    notesList?: string[];
}

interface Props {
    id?: string;
    title?: string;
    titleLink?: string;
    titleSize?: 'small' | 'medium' | 'large' | 'larger';
    titleBoldness?: 'normal' | 'bold' | 'semi-bold';
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
    busy?: boolean;
    widgetLockName?: LockWidgetNameEnum | LockWidgetNameEnum[];
    refreshAction?: () => void;
    widgetButtons?: WidgetButtonProps[];
    widgetExtraTopNode?: React.ReactNode;
    hideWidgetButtons?: boolean;
    lockSize?: 'small' | 'normal' | 'large';
    widgetInfoCard?: WidgetInfoCard;
    innerContainerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    dataTestId?: string;
    noBorder?: boolean;
}

function Widget({
    id,
    title = '',
    titleLink,
    titleSize = 'medium',
    widgetButtons,
    titleBoldness = 'bold',
    className,
    children = [],
    busy = false,
    widgetLockName,
    refreshAction,
    widgetExtraTopNode,
    hideWidgetButtons = false,
    lockSize = 'normal',
    widgetInfoCard,
    innerContainerProps,
    dataTestId,
    noBorder = false,
}: Props) {
    const widgetLock = useSelector(selectors.selectWidgetLocks).find(
        (lock) => lock.widgetName === widgetLockName || (Array.isArray(widgetLockName) && widgetLockName.includes(lock.widgetName)),
    );
    const [showWidgetInfo, setShowWidgetInfo] = useState(false);

    const getTitleText = () =>
        title ? (
            <h5
                className={cn(
                    'text-[var(--dark-gray-color)]',
                    { 'font-bold': titleBoldness === 'bold' },
                    { 'font-semibold': titleBoldness === 'semi-bold' },
                    { 'font-normal': titleBoldness === 'normal' },
                    { 'text-base': titleSize === 'medium' },
                    { 'text-lg font-bold': titleSize === 'large' },
                    { 'text-sm': titleSize === 'small' },
                    { 'text-xl font-bold': titleSize === 'larger' },
                )}
            >
                {title}
            </h5>
        ) : null;

    const renderTitle = () =>
        titleLink ? (
            <Link to={titleLink} className="text-blue-600">
                {getTitleText()}
            </Link>
        ) : (
            getTitleText()
        );

    const renderRefreshButton = () =>
        refreshAction ? (
            <Button onClick={refreshAction} data-testid="refresh-icon" variant="transparent" title="Refresh">
                <RefreshCw size={16} />
            </Button>
        ) : null;

    const renderWidgetButtons = useCallback(() => {
        const updatedWidgetButtons = widgetButtons?.map((button) => ({ ...button, disabled: widgetLock ? true : button.disabled })) || [];
        if (widgetInfoCard)
            updatedWidgetButtons.push({
                icon: 'info',
                onClick: () => setShowWidgetInfo(!showWidgetInfo),
                disabled: false,
            });

        if (!updatedWidgetButtons.length) return null;
        if (hideWidgetButtons) return null;
        else {
            return <WidgetButtons buttons={updatedWidgetButtons} justify="end" />;
        }
    }, [widgetButtons, hideWidgetButtons, widgetLock, widgetInfoCard, showWidgetInfo]);

    const hasHeaderContent = useMemo(() => {
        const hasTitle = !!title;
        const hasRefreshButton = !!refreshAction;
        const hasButtons = !!(widgetButtons?.length || widgetInfoCard) && !hideWidgetButtons;
        return !!(hasTitle || hasRefreshButton || hasButtons || widgetExtraTopNode);
    }, [title, refreshAction, widgetButtons, widgetInfoCard, hideWidgetButtons, widgetExtraTopNode]);

    return (
        <section
            data-testid={dataTestId}
            className={cn(
                'relative flex flex-col bg-white rounded-xl dark:bg-neutral-900 dark:text-neutral-400 w-full',
                {
                    'border border-gray-200 dark:border-neutral-700 p-4 md:p-5 shadow-2xs': !noBorder,
                },
                className,
            )}
            id={id}
        >
            {hasHeaderContent && (
                <div className={cn('flex items-center justify-between flex-wrap gap-2', { 'mb-3': !!widgetLock || !!children })}>
                    <div className="flex items-center gap-2">
                        {renderTitle()}
                        {renderRefreshButton()}
                    </div>

                    <div className="flex-1 flex items-center gap-2 justify-end">
                        {renderWidgetButtons()}
                        {widgetExtraTopNode}
                    </div>
                </div>
            )}

            {widgetInfoCard && (
                <div
                    className={cn('overflow-hidden transition-all duration-300 ease-in-out my-2', {
                        'max-h-0 opacity-0': !showWidgetInfo,
                        'max-h-[1000px] opacity-100': showWidgetInfo,
                    })}
                >
                    <div className="my-2 border border-gray-200 dark:border-neutral-700 rounded-lg">
                        {widgetInfoCard.heading && (
                            <h2 className="px-4 pt-3 mb-0 text-base font-semibold text-gray-800 dark:text-white">
                                {widgetInfoCard.heading}
                            </h2>
                        )}
                        <div className="px-4 py-3">
                            {widgetInfoCard.description && (
                                <p className="text-sm text-gray-700 dark:text-neutral-300 mb-0">
                                    {widgetInfoCard.title}: {widgetInfoCard.description}
                                </p>
                            )}

                            {widgetInfoCard.notesList && (
                                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700 dark:text-neutral-300">
                                    {widgetInfoCard.notesList.map((note, index) => (
                                        <li key={index}>{note}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {widgetLock ? (
                <WidgetLock
                    lockTitle={widgetLock.lockTitle}
                    lockText={widgetLock.lockText}
                    lockDetails={widgetLock.lockDetails}
                    size={lockSize}
                    lockType={widgetLock.lockType}
                />
            ) : (
                <div {...innerContainerProps}>{children}</div>
            )}

            <Spinner active={busy} />
        </section>
    );
}

export default Widget;
