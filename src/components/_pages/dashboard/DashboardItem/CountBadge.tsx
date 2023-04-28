import Widget from "components/Widget";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

interface Props {
    data?: number;
    title: string;
    link: string;
}

function CountBadge({ data, title, link }: Props) {
    return (
        <Widget
            title={
                <Link to={link}>
                    <p style={{ fontWeight: 700 }}>{title}</p>
                </Link>
            }
        >
            <Row className={`justify-content-between mt-3 gx-0`}>
                <Col sm={8} className={"d-flex align-items-center"}>
                    <h3 className={"fw-semi-bold mb-0"}>{data}</h3>
                </Col>
            </Row>
        </Widget>
    );
}

export default CountBadge;
