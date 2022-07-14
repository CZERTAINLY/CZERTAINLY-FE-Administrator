import React from "react";
import cx from "classnames";

import style from "./Widget.module.scss";
import Spinner from "components/Spinner";

interface Props {
   title?: string | React.ReactNode;
   className?: string;
   children?: React.ReactNode | React.ReactNode[];
   busy?: boolean;
}

function Widget({ title = "", className, children = [], busy = false }: Props) {

   return (

      <section className={cx(style.widget, className)}>

         {
            typeof title === "string" ?
               <h5 className={style.title}>{title}</h5>
               :
               <header className={style.title}>{title}</header>
         }

         <div>{children}</div>

         <Spinner active={busy} />

      </section>

   );

}

export default Widget;
