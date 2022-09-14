import React from "react";

interface Props {
   columnName: string;
}

function MDBColumnName({ columnName }: Props) {

   return <strong>{columnName}</strong>;

}

export default MDBColumnName;
