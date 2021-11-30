import React from "react";
import cx from "classnames";

import style from "./Widget.module.scss";

interface Props {
  title?: string | React.ReactNode;
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
}

function Widget({ title, className, children = [] }: Props) {
  return (
    <section className={cx(style.widget, className)}>
      {title && typeof title === "string" ? (
        <h5 className={style.title}>{title}</h5>
      ) : (
        <header className={style.title}>{title}</header>
      )}
      <div>{children}</div>
    </section>
  );
}

export default Widget;
