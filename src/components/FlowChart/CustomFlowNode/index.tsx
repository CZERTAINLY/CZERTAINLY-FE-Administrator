import cx from "classnames";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { Button, Collapse } from "reactstrap";
import { EntityNodeProps } from "types/flowchart";
import { CertificateValidationStatus } from "types/openapi";
import style from "./customFlowNode.module.scss";
export default function CustomFlowNode({ data, dragging, selected, xPos, yPos }: EntityNodeProps) {
    const [collapse, setCollapse] = useState(false);

    const [status, setStatus] = useState("+");
    // TODO: Use this during dynamic flowchart updates
    // const onEntering = () => setStatus("Opening...");
    // const onExiting = () => setStatus("Closing...");

    const onEntered = () => setStatus("-");
    const onExited = () => setStatus("+");
    const toggle = () => setCollapse(!collapse);

    const getStatusClasses = () => {
        switch (data.certificateNodeValidationStatus) {
            case CertificateValidationStatus.Valid:
                return style.validStatus;
            case CertificateValidationStatus.Expired:
                return style.expiredStatus;
            case CertificateValidationStatus.Revoked:
                return style.revokedStatus;
            case CertificateValidationStatus.Invalid:
                return style.invalidStatus;
            case CertificateValidationStatus.NotChecked:
                return style.notCheckedStatus;
            case CertificateValidationStatus.Inactive:
                return style.inactiveStatus;
            case CertificateValidationStatus.Expiring:
                return style.expiringStatus;
            case CertificateValidationStatus.Failed:
                return style.failedStatus;

            default:
                return style.unknownStatus;
        }
    };

    const getExpandButtonStatusClasses = () => {
        switch (data.certificateNodeValidationStatus) {
            case CertificateValidationStatus.Valid:
                return style.expandButtonValid;
            case CertificateValidationStatus.Expired:
                return style.expandButtonExpired;
            case CertificateValidationStatus.Revoked:
                return style.expandButtonRevoked;
            case CertificateValidationStatus.Expiring:
                return style.expandButtonExpiring;
            case CertificateValidationStatus.Invalid:
                return style.expandButtonInvalid;
            case CertificateValidationStatus.NotChecked:
                return style.expandButtonNotChecked;
            case CertificateValidationStatus.Failed:
                return style.expandButtonFailed;
            case CertificateValidationStatus.Inactive:
                return style.expandButtonInactive;
            default:
                return style.expandButtonUnknown;
        }
    };

    return (
        <>
            <Handle hidden={data.handleHide === "target"} className={cx(style.handleUp)} type="target" position={Position.Top} />

            <div
                className={cx(
                    style.customNodeBackground,
                    { [style.selectedBackground]: dragging },
                    {
                        [style.mainNodeBody]: data.isMainNode,
                    },
                    getStatusClasses(),
                )}
            >
                {selected && data.otherProperties && (
                    <div className={style.expandButtonContainer}>
                        <Button color="primary" onClick={toggle} className={cx(style.expandButton, getExpandButtonStatusClasses())}>
                            <span className="mx-auto">{status}</span>
                        </Button>
                    </div>
                )}
                <div className="d-flex my-1">
                    <i className={cx(style.iconStyle, data.icon, getStatusClasses())}></i>

                    <h6 className={cx(style.customNodeCardTitle, "my-auto ms-2")}>{data.customNodeCardTitle}</h6>
                </div>

                {data.redirectUrl ? (
                    <div className={cx("d-flex ms-2", style.entityLabel)}>
                        <h6>Entity Name :</h6>
                        &nbsp;
                        <Link to={data.redirectUrl}>
                            <h6 className="text-wrap">{data.entityLabel}</h6>
                        </Link>
                    </div>
                ) : (
                    <div className={cx("d-flex ms-2", style.entityLabel)}>
                        <h6>Entity Name :</h6>
                        &nbsp;
                        <h6>{data.entityLabel}</h6>
                    </div>
                )}
                {data.description && (
                    <div className="d-flex ms-2">
                        <h6>Description :</h6>
                        &nbsp;
                        <h6>{data.description}</h6>
                    </div>
                )}

                {data.otherProperties && (
                    <>
                        <Collapse isOpen={collapse} onEntered={onEntered} onExited={onExited}>
                            <div className={cx(style.listContainer, { [style.listContainerDragging]: dragging })}>
                                <ul className={cx("list-group ps-2", style.listStyle)}>
                                    {data.otherProperties.map((property, index) => (
                                        <li key={index} className="list-group-item text-wrap p-0 ">
                                            <span className={style.propertyName}>{property.propertyName} : </span>
                                            {property?.propertyValue && (
                                                <span className={style.propertyValue}>{property.propertyValue}</span>
                                            )}
                                            {property?.copyable && property?.propertyValue && (
                                                <i
                                                    onClick={() => {
                                                        if (typeof property.propertyValue === "string") {
                                                            navigator.clipboard.writeText(property.propertyValue);
                                                        }
                                                    }}
                                                    className="fa fa-copy ms-2"
                                                ></i>
                                            )}
                                            {property?.propertyContent && <>{property.propertyContent}</>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Collapse>
                    </>
                )}
            </div>
            <Handle hidden={data.handleHide === "source"} className={style.handleDown} type="source" position={Position.Bottom} id="a" />
        </>
    );
}
