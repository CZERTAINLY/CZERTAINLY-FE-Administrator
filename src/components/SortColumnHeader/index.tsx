import cx from "classnames";
import React, { ReactElement } from "react";

import styles from "./sortColumnHeader.module.scss";

export interface Props {
   id: string;
   sortDirection?: SortDirection | null;
   text: string | ReactElement;
   onClick?: (event: React.MouseEvent) => void;
}

export enum SortDirection {
   Asc = "asc",
   Desc = "desc",
}

function SortColumnHeader({ sortDirection, text, onClick }: Props) {

   return (

      <th className={styles.sortColumn} onClick={onClick}>

         <strong>

            {text}

            {sortDirection === SortDirection.Desc ? null : (
               <i
                  className={cx("fa", "fa-arrow-up", {
                     [styles.hoverOnly]:
                        sortDirection === null || sortDirection === undefined,
                  })}
               ></i>
            )}

            {sortDirection === SortDirection.Desc ? (
               <i className="fa fa-arrow-down"></i>
            ) : null}

         </strong>

      </th>

   );

}

export default SortColumnHeader;
