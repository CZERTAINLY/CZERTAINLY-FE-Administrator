import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Container,
    Popover,
    PopoverBody,
    PopoverHeader,
    Row,
    Tooltip,
    UncontrolledTooltip,
} from "reactstrap";
import cx from "classnames";
import styles from "./WidgetLock.module.scss";
import { LockTypeEnum } from "types/widget-locks";
import { CSSProperties, useEffect, useRef, useState } from "react";
import "./WidgetLock.module.scss";
interface Props {
    size?: "small" | "normal" | "large";
    lockReason?: string;
    lockDescription?: string;
    lockType?: LockTypeEnum;
}

// TODO: Add a refresh button
const WidgetLock = ({
    size = "normal",
    lockReason = "There was some problem",
    lockDescription = "There was some issue please try again later",
    lockType = LockTypeEnum.GENERIC,
}: Props) => {
    const iconClasses = cx(
        `fa ${styles.lockWidgetIcon}`,
        { [styles.normal]: size === "normal" },
        { [styles.small]: size === "small" },
        { [styles.large]: size === "large" },
        { "fa-triangle-exclamation": lockType === LockTypeEnum.GENERIC },
        { "fa-house-laptop": lockType === LockTypeEnum.CLIENT },
        { "fa-lock": lockType === LockTypeEnum.PERMISSION },
        { "fa-wifi": lockType === LockTypeEnum.NETWORK },
        { "fa-database": lockType === LockTypeEnum.SERVER_ERROR || lockType === LockTypeEnum.SERVICE_ERROR },
    );
    const [popoverOpen, setPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const togglePopover = () => setPopoverOpen(!popoverOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setPopoverOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverRef]);

    const renderPopOver = () => {
        return (
            <div ref={popoverRef}>
                <Button className={styles.popOverTrigger} color="link" id="popoverButton" type="button" onClick={togglePopover}>
                    <i className="fa fa-circle-info ms-1" id="UncontrolledTooltip" />
                </Button>
                <Popover placement="right" isOpen={popoverOpen} target="popoverButton" toggle={togglePopover}>
                    <PopoverHeader className={cx("text-center", styles.popOverHeaderTitle)}>{lockReason}</PopoverHeader>
                    <PopoverBody className={cx("text-center")}>{lockDescription}</PopoverBody>
                </Popover>
            </div>
        );
    };
    return (
        <Container fluid>
            <Row>
                <Col xs={12} lg={{ offset: 3, size: 6 }} className="text-center">
                    <Card className={styles.grayOut}>
                        <CardBody>
                            <Row>
                                <Col xs={12} xl={{ offset: 2, size: 3 }}>
                                    <i className={iconClasses} />
                                </Col>
                                <Col xs={12} xl={{ offset: 0, size: 5 }}>
                                    <CardTitle
                                        className={cx(
                                            "d-flex justify-content-center align-content-center align-items-center",
                                            styles.cardTitle,
                                        )}
                                        tag="h5"
                                    >
                                        {lockReason}
                                        {renderPopOver()}
                                    </CardTitle>
                                    <CardText className={styles.cardText}>{lockDescription}</CardText>
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
