import cx from "classnames";
import { Link } from "react-router-dom";
import { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { Table } from "reactstrap";
import { EntityNodeProps } from "types/flowchart";
import style from "./customFlowNode.module.scss";

export default function CustomFlowNode({ data, dragging, xPos, yPos }: EntityNodeProps) {
    return (
        <>
            <Handle hidden={data.handleHide === "target"} className={cx(style.handleUp)} type="target" position={Position.Top} />

            {data.icon && (
                <div className="d-flex flex-column align-items-center">
                    <div className={cx(style.iconContainer, { [style.selectedBackground]: dragging })}>
                        <i className={cx(style.iconStyle, data.icon)}></i>
                    </div>
                </div>
            )}
            <div className={cx(style.customNodeBackground, { [style.selectedBackground]: dragging })}>
                <div className="mx-auto">
                    <h6 className={style.entityType}>{data.entityType}</h6>
                </div>

                {data.redirectUrl ? (
                    <div className="d-flex mx-2">
                        <h6>Entity Name :</h6>
                        &nbsp;
                        <Link to={data.redirectUrl}>
                            <h6>{data.entityLabel}</h6>
                        </Link>
                    </div>
                ) : (
                    <div className={cx("d-flex mx-2", style.entityLabel)}>
                        <h6>Entity Name :</h6>
                        &nbsp;
                        <h6>{data.entityLabel}</h6>
                    </div>
                )}
                {data.description && (
                    <div className="d-flex">
                        <h6>Description :</h6>
                        &nbsp;
                        <h6>{data.description}</h6>
                    </div>
                )}

                {data.otherProperties && (
                    <div className={style.tableContainer}>
                        <Table responsive className={cx("table-bordered", style.tableStyle)}>
                            <thead>
                                <tr>
                                    <th>Property Name</th>
                                    <th>Property Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.otherProperties.map((property, index) => (
                                    <tr key={index}>
                                        <td>{property.propertyName}</td>
                                        <td>{property.propertyValue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
            <Handle hidden={data.handleHide === "source"} className={style.handleDown} type="source" position={Position.Bottom} id="a" />
        </>
    );
}
