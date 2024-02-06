import cx from 'classnames';
import React, { useCallback } from 'react';

import Spinner from 'components/Spinner';
import WidgetButtons, { WidgetButtonProps } from 'components/WidgetButtons';
import WidgetLock from 'components/WidgetLock';
import { selectors } from 'ducks/user-interface';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LockWidgetNameEnum } from 'types/user-interface';
import style from './Widget.module.scss';

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
}: Props) {
    const widgetLock = useSelector(selectors.selectWidgetLocks).find((lock) => lock.widgetName === widgetLockName);

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

        if (!widgetButtons) return null;
        if (hideWidgetButtons) return null;
        else {
            return (
                <div className="ms-auto">
                    <WidgetButtons buttons={updatedWidgetButtons} />
                </div>
            );
        }
    }, [widgetButtons, hideWidgetButtons, widgetLock]);

    return (
        <section className={cx(style.widget, className)}>
            <div className="d-flex align-items-center">
                {renderTitle()}
                {renderRefreshButton()}
                {renderWidgetButtons()}
                {widgetExtraTopNode}
            </div>
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
