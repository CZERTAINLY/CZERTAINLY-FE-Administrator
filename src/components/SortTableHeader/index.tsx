import React, { ReactElement, useState } from "react";

import SortColumnHeader, {
   Props as ColProps,
   SortDirection,
} from "components/SortColumnHeader";

type SortDirectionString = "asc" | "desc" | null;

interface Props {

   children?: React.ReactNode;
   sortBy?: string | null;
   direction?: SortDirectionString;

   onSortChange?: (
      column: SortDirectionString,
      direction: string | null
   ) => void;

}

function SortTableHeader({ children, onSortChange }: Props) {

   const [sortColumn, setSortColumn] = useState<string | null>(null);

   const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

   const onColClick = (col: string) => () => {

      let sortCol: string | null = col;
      let newDirection: SortDirection | null;

      if (col !== sortColumn) {

         newDirection = SortDirection.Asc;

      } else {

         switch (sortDirection) {

            case SortDirection.Asc:
               newDirection = SortDirection.Desc;
               break;

            case SortDirection.Desc:
               newDirection = null;
               sortCol = null;
               break;

            default:
               newDirection = SortDirection.Asc;
               break;

         }

      }

      setSortColumn(sortCol);
      setSortDirection(newDirection);

      if (onSortChange) {
         onSortChange(sortCol as SortDirectionString, newDirection);
      }

   };

   const renderChildren = React.Children.map(children, (child) => {

      if (!child || typeof child !== "object") return child;

      const el = child as ReactElement;

      if (el.type !== SortColumnHeader) return child;

      const elProps = el.props as ColProps;

      const newProps: ColProps = {
         ...elProps,
         sortDirection: sortColumn === elProps.id ? sortDirection : null,
         onClick: onColClick(elProps.id),
      };

      return React.cloneElement(el, newProps);

   });

   return (
      <thead>
         <tr>{renderChildren}</tr>
      </thead>
   );
}

export default SortTableHeader;
