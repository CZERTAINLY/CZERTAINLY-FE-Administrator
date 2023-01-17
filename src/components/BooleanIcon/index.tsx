import React from "react";

type Props = {
    enabled?: boolean;
}

export default function BooleanIcon({enabled = false}: Props) {
    return (<i title={enabled ? "yes" : "no"}
               className={`fa fa-circle text-${enabled ? "success" : "danger"}`}/>);
}
