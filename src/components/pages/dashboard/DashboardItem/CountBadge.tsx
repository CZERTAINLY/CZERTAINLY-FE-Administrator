import React from "react";
import Widget from "components/Widget";
import { Col, Row } from "reactstrap";

interface Props {
   data?: number;
   title: string;
}

function CountBadge({
   data,
   title
}: Props) {

   return (

      <Widget title={<p style={{ fontWeight: 700 }}>{title}</p>}>

         <Row className={`justify-content-between mt-3`} noGutters>

            <Col sm={8} className={"d-flex align-items-center"}>
               <h3 className={"fw-semi-bold mb-0"}>{data}</h3>
            </Col>

         </Row>

      </Widget>

   );

}

export default CountBadge;
