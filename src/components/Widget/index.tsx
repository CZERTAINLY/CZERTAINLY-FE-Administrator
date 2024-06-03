import cx from 'classnames';
import React, { useCallback, useState } from 'react';

import Spinner from 'components/Spinner';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';
import WidgetLock from 'components/WidgetLock';
import { selectors } from 'ducks/user-interface';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import style from './Widget.module.scss';

interface WidgetInfoCard {
    title: string;
    heading?: string;
    description: string;
    notesList?: string[];
}

interface Props {
    title?: string;
    titleLink?: string;
    titleSize?: 'small' | 'medium' | 'large' | 'larger';
    titleBoldness?: 'normal' | 'bold' | 'bolder';
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
    busy?: boolean;
    widgetLockName?: LockWidgetNameEnum;
    refreshAction?: () => void;
    widgetButtons?: WidgetButtonProps[];
    widgetExtraTopNode?: React.ReactNode;
    hideWidgetButtons?: boolean;
    lockSize?: 'small' | 'normal' | 'large';
    widgetInfoCard?: WidgetInfoCard;
}

function Widget({
    title = '',
    titleLink,
    titleSize = 'medium',
    widgetButtons,
    titleBoldness = 'normal',
    className,
    children = [],
    busy = false,
    widgetLockName,
    refreshAction,
    widgetExtraTopNode,
    hideWidgetButtons = false,
    lockSize = 'normal',
    widgetInfoCard,
}: Props) {
    const widgetLock = useSelector(selectors.selectWidgetLocks).find((lock) => lock.widgetName === widgetLockName);
    const [showWidgetInfo, setShowWidgetInfo] = useState(false);

    const getTitleText = () =>
        title ? (
            <h5
                className={cx(
                    style.title,
                    { 'fw-bold': titleBoldness === 'bold' },
                    { 'fw-bolder': titleBoldness === 'bolder' },
                    { 'fw-normal': titleBoldness === 'normal' },
                    { [style.titleMedium]: titleSize === 'medium' },
                    { [style.titleLarge]: titleSize === 'large' },
                    { [style.titleSmall]: titleSize === 'small' },
                    { [style.titleXL]: titleSize === 'larger' },
                )}
            >
                {title}
            </h5>
        ) : null;

    const renderTitle = () => (titleLink ? <Link to={titleLink}>{getTitleText()}</Link> : getTitleText());

    const renderRefreshButton = () =>
        refreshAction ? (
            <div className="ms-2 mb-1 me-auto">
                <i onClick={refreshAction} className={cx(style.refreshIcon, 'fa fa-refresh ')} />
            </div>
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
            return (
                <div className="ms-auto">
                    <WidgetButtons buttons={updatedWidgetButtons} />
                </div>
            );
        }
    }, [widgetButtons, hideWidgetButtons, widgetLock, widgetInfoCard, showWidgetInfo]);

    return (
        <section className={cx(style.widget, className)}>
            <div className="d-flex align-items-center">
                <div>{renderTitle()}</div>
                {renderRefreshButton()}
                {renderWidgetButtons()}
                {widgetExtraTopNode}
            </div>

            {widgetInfoCard && (
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
                <div>{children}</div>
            )}

            <Spinner active={busy} />
        </section>
    );
}

export default Widget;
