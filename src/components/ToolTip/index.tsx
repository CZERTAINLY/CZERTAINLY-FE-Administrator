import React from "react";
import ReactTooltip from "react-tooltip";

interface Props {
   id: string;
   message: any;
   place?: any;
   tooltipType?: "dark" | "success" | "warning" | "error" | "info" | "light";
}

function ToolTip({
   id,
   message,
   place = "top",
   tooltipType = "dark"
}: Props) {

   return (

      <ReactTooltip
         id={id}
         place={place}
         type={tooltipType}
         effect="solid"
         delayShow={100}
         clickable={true}
         delayHide={100}
      >
         {message}
      </ReactTooltip>

   );

}

export default ToolTip;
