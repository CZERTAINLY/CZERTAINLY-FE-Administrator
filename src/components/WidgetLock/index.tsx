import cx from 'classnames';
import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Container,
    PopoverBody,
    PopoverHeader,
    Row,
    UncontrolledPopover,
} from 'reactstrap';
import { LockTypeEnum } from 'types/user-interface';
import styles from './WidgetLock.module.scss';
interface Props {
    size?: 'small' | 'normal' | 'large';
    lockTitle?: string;
    lockText?: string;
    lockDetails?: string;
    lockType?: LockTypeEnum;
}

// TODO: Add a refresh button
const WidgetLock = ({
    size = 'normal',
    lockTitle = 'There was some problem',
    lockText = 'There was some issue please try again later',
    lockType = LockTypeEnum.GENERIC,
    lockDetails,
}: Props) => {
    const iconClasses = cx(
        `fa ${styles.lockWidgetIcon}`,
        { [styles.normal]: size === 'normal' },
        { [styles.small]: size === 'small' },
        { [styles.large]: size === 'large' },
        { 'fa-triangle-exclamation': lockType === LockTypeEnum.GENERIC },
        { 'fa-house-laptop': lockType === LockTypeEnum.CLIENT },
        { 'fa-lock': lockType === LockTypeEnum.PERMISSION },
        { 'fa-wifi': lockType === LockTypeEnum.NETWORK },
        { 'fa-database': lockType === LockTypeEnum.SERVICE_ERROR },
        { 'fa-server': lockType === LockTypeEnum.SERVER_ERROR },
    );

    const renderPopOver = () => {
        return (
            <div>
                <Button id="PopoverFocus" type="button" className={styles.popOverTrigger} color="link">
                    <i className="fa fa-circle-info ms-1" id="UncontrolledTooltip" />
                </Button>
                <UncontrolledPopover placement="right" target="PopoverFocus" trigger="focus">
                    <PopoverHeader className={cx('text-center', styles.popOverHeaderTitle)}>{lockTitle}</PopoverHeader>
                    <PopoverBody className={cx('text-center')}>{lockDetails}</PopoverBody>
                </UncontrolledPopover>
            </div>
        );
    };

    const getMainColWidthLg = () =>
        size === 'small' ? { offset: 2, size: 5 } : size === 'normal' ? { offset: 3, size: 6 } : { offset: 0, size: 12 };

    return (
        <Container fluid>
            <Row>
                <Col xs={12} lg={getMainColWidthLg()} className="text-center">
                    <Card className={styles.grayOut}>
                        <CardBody>
                            <Row>
                                <Col xs={12} xl={{ offset: 1, size: 3 }}>
                                    <i className={iconClasses} />
                                </Col>
                                <Col xs={12} xl={{ offset: 0, size: 8 }}>
                                    <CardTitle
                                        className={cx(
                                            'd-flex justify-content-center align-content-center align-items-center',
                                            styles.cardTitle,
                                        )}
                                        tag="h5"
                                    >
                                        {lockTitle}
                                        {lockDetails && renderPopOver()}
                                    </CardTitle>
                                    <CardText className={styles.cardText}>{lockText}</CardText>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WidgetLock;
