import { Card, CardBody, CardSubtitle, CardText, CardTitle, Container } from "reactstrap";
import cx from "classnames";
import styles from "./WidgetLock.module.scss";
import { LockTypeEnum } from "types/widget-locks";

interface Props {
    size?: "small" | "normal" | "large";
    lockReason?: string;
    lockDescription?: string;
    lockType?: LockTypeEnum;
}
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
    return (
        <Container style={{ width: "100%" }}>
            <Card className="border-0">
                <i className={iconClasses} />
                <CardBody>
                    <CardSubtitle className="text-center text-muted mx-auto .bg-dark" tag="h6">
                        {lockReason}
                    </CardSubtitle>
                    <CardText className="text-center text-muted mx-auto .bg-dark">{lockDescription}</CardText>
                </CardBody>
            </Card>
        </Container>
    );
};

export default WidgetLock;
