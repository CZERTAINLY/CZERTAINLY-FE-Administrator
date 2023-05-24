import cx from "classnames";
import React from "react";

import Spinner from "components/Spinner";
import style from "./Widget.module.scss";
import { LockWidgetNameEnum } from "types/widget-locks";
import { selectors } from "ducks/widget-locks";
import { useSelector } from "react-redux";
import WidgetLock from "components/WidgetLock";

interface Props {
    title?: string | React.ReactNode;
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
    busy?: boolean;
    widgetLockName?: LockWidgetNameEnum;
}

function Widget({ title = "", className, children = [], busy = false, widgetLockName }: Props) {
    const widgetLock = useSelector(selectors.selectWidgetLocks).find((lock) => lock.widgetName === widgetLockName);

    return (
        <section className={cx(style.widget, className)}>
            {typeof title === "string" ? <h5 className={style.title}>{title}</h5> : <header className={style.title}>{title}</header>}
            {widgetLock ? (
                <WidgetLock
                    lockReason={widgetLock.errorMessage}
                    lockDescription={widgetLock.errorDetails}
                    size="normal"
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
