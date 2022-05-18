import React from "react";
import { Button, ButtonProps } from "reactstrap";
import ToolTip from "../ToolTip";


export interface WidgetButtonProps {
   icon: "plus" | "trash" | "times" | "check" | "plug" | "cross-circle";
   tooltip?: string;
   disabled: boolean;
   onClick: (event: React.MouseEvent) => void
}


interface Props {
   buttons: WidgetButtonProps[];
}


const colors = {
   "plus": "auto",
   "trash": "red",
   "times": "red",
   "check": "auto",
   "plug": "auto",
   "cross-circle": "black",
};


const classNames = {
   "plus": "fa fa-plus",
   "trash": "fa fa-trash",
   "times": "fa fa-times",
   "check": "fa fa-check",
   "plug": "fa fa-trash",
   "cross-circle": "fa fa-times-circle"
}


function WidgetButtons({ buttons }: Props) {

   const renderButton = (button: WidgetButtonProps) => {

      let toolTip: JSX.Element | undefined;
      let style;

      let btnProps: ButtonProps = {
         key: button.icon + button.tooltip,
         className: "btn btn-link",
         color: "white",
         onClick: button.onClick,
         disabled: button.disabled,
      }

      if (button.tooltip) {

         const toolTipId = `btn_tooltip_${button.tooltip}`;

         btnProps["data-for"] = toolTipId;
         btnProps["data-tip"] = "";

         toolTip = <ToolTip id={toolTipId} message={button.tooltip} />

      }

      if (!button.disabled) {
         style = { color: colors[button.icon] }
      }

      return (
         <Button {...btnProps}>
            <i className={classNames[button.icon]} style={style} />
            {toolTip}
         </Button>
      )

   }

   const renderedButtons: JSX.Element[] = [];

   buttons.forEach(button => {
      renderedButtons.push(renderButton(button))
   });

   return <>{renderedButtons}</>

}

export default WidgetButtons;