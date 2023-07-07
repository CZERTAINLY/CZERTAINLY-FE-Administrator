import cx from "classnames";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { Button, Collapse } from "reactstrap";
import { EntityNodeProps } from "types/flowchart";
import { CertificateStatus } from "types/openapi";
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
    console.log("data.certificateNodeStatus", data.certificateNodeStatus);

    const getStatusClasses = () => {
        switch (data.certificateNodeStatus) {
            case CertificateStatus.Valid:
                return style.validStatus;
            case CertificateStatus.Expired:
                return style.expiredStatus;
            case CertificateStatus.Revoked:
                return style.revokedStatus;
            case CertificateStatus.Expiring:
                return style.expiringStatus;
            case CertificateStatus.Invalid:
                return style.invalidStatus;
            case CertificateStatus.Unknown:
                return style.unknownStatus;
            case CertificateStatus.New:
                return style.newStatus;
            default:
                return style.unknownStatus;
        }
    };

    const getExpandButtonStatusClasses = () => {
        switch (data.certificateNodeStatus) {
            case CertificateStatus.Valid:
                return style.expandButtonValid;
            case CertificateStatus.Expired:
                return style.expandButtonExpired;
            case CertificateStatus.Revoked:
                return style.expandButtonRevoked;
            case CertificateStatus.Expiring:
                return style.expandButtonExpiring;
            case CertificateStatus.Invalid:
                return style.expandButtonInvalid;
            case CertificateStatus.Unknown:
                return style.expandButtonUnknown;
            case CertificateStatus.New:
                return style.expandButtonNew;
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

                    <h6 className={cx(style.entityType, "my-auto ms-2")}>{data.entityType}</h6>
                </div>

                {data.redirectUrl ? (
                    <div className={cx("d-flex ms-2", style.entityLabel)}>
                        <h6>Entity Name :</h6>
                        &nbsp;
                        <Link to={data.redirectUrl}>
                            <h6>{data.entityLabel}</h6>
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
                                            <span className={style.propertyValue}>{property.propertyValue}</span>
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
