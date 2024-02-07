import Widget from 'components/Widget';
import { Col, Row } from 'reactstrap';

interface Props {
    //TODO: Add a null type to data which should also be sent from the backend then we can use widget lock for this component
    data?: number;
    title: string;
    link: string;
}

function CountBadge({ data, title, link }: Props) {
    return (
        <Widget titleLink={link} title={title} titleBoldness="bold">
            <Row className={`justify-content-between mt-3 gx-0`}>
                <Col sm={8} className={'d-flex align-items-center'}>
                    <h3 className={'fw-semi-bold mb-0'}>{data}</h3>
                </Col>
            </Row>
        </Widget>
    );
}

export default CountBadge;
