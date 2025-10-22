import cx from 'classnames';
import React, { useCallback, useState } from 'react';

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
    titleBoldness?: 'normal' | 'bold' | 'bolder';
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
                className={cx(
                    '',
                    { 'font-bold': titleBoldness === 'bold' },
                    { 'font-extrabold': titleBoldness === 'bolder' },
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

    const renderTitle = () => (titleLink ? <Link to={titleLink}>{getTitleText()}</Link> : getTitleText());

    const renderRefreshButton = () =>
        refreshAction ? (
            <Button onClick={refreshAction} data-testid="refresh-icon" type="transparent">
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

    return (
        <section
            data-testid={dataTestId}
            className={cx('relative flex flex-col bg-white shadow-2xs rounded-xl dark:bg-neutral-900 dark:text-neutral-400', className, {
                'border border-gray-200 dark:border-neutral-700 p-4 md:p-5': !noBorder,
            })}
            id={id}
        >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2">
                    {renderTitle()}
                    {renderRefreshButton()}
                </div>

                <div className="flex-1 flex items-center gap-2 justify-end">
                    {renderWidgetButtons()}
                    {widgetExtraTopNode}
                </div>
            </div>

            {/* {widgetInfoCard && (
                <Collapse isOpen={showWidgetInfo}>
                    <Card color="default" className="my-2">
                        <CardHeader>{widgetInfoCard.title}</CardHeader>
                        {widgetInfoCard.heading && <h2 className="ms-3 mb-0 mt-3">{widgetInfoCard.heading}</h2>}
                        <CardBody>
                            {widgetInfoCard.description && <p>{widgetInfoCard.description}</p>}

                            {widgetInfoCard.notesList && (
                                <ul>
                                    {widgetInfoCard.notesList.map((note, index) => (
                                        <li key={index}>{note}</li>
                                    ))}
                                </ul>
                            )}
                        </CardBody>
                    </Card>
                </Collapse>
            )} */}
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
