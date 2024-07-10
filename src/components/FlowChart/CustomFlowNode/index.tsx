import cx from 'classnames';
import { actions as userInterfaceActions, selectors as userInterfaceSelectors } from 'ducks/user-interface';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Handle, Position } from 'reactflow';
import { Button, Collapse } from 'reactstrap';
import { EntityNodeProps } from 'types/flowchart';
import { CertificateValidationStatus } from 'types/openapi';
import { useCopyToClipboard } from 'utils/common-hooks';
import style from './customFlowNode.module.scss';

export default function CustomFlowNode({ data, dragging, selected, xPos, yPos, id }: EntityNodeProps) {
    const [collapse, setCollapse] = useState(data.expandedByDefault ?? false);
    const [addNodeContentCollapse, setAddNodeContentCollapse] = useState(false);
    const reactFlowUI = useSelector(userInterfaceSelectors.selectReactFlowUI);
    const [showHiddenNodes, setShowHiddenNodes] = useState(false);

    const currentnodes = reactFlowUI?.flowChartNodes;
    const thisNodeState = currentnodes?.find((node) => node?.id === id);

    const hasHiddenChildren = useMemo(() => {
        return currentnodes?.some((node) => node?.parentId === id && node.hidden !== undefined);
    }, [currentnodes, id]);
    const dispatch = useDispatch();

    const toggleHiddenNodes = useCallback(
        (showHiddenNodes: boolean) => {
            // const
            if (showHiddenNodes) {
                const updatedNodes = currentnodes?.map((node, i) => {
                    const totalNodes = currentnodes?.filter((node) => node.parentId === id).length || 1; // Total child nodes

                    const angleIncrement = (2 * Math.PI) / totalNodes; // Divide the circle based on the number of groups
                    const multiplier = totalNodes < 3 ? 300 : 180;
                    const nodeRadius = multiplier * (totalNodes * 0.3); // Smaller radius for nodes within a group
                    const nodeAngle = ((2 * Math.PI) / totalNodes) * i;
                    const onlyTwoNodes = totalNodes === 2;
                    let yOffset = 0;
                    if (onlyTwoNodes && i === 1) {
                        yOffset = 105;
                    }

                    if (node?.parentId === id && node.hidden !== undefined) {
                        const angle = angleIncrement * i; // Calculate angle for this node
                        const position = {
                            // x: xPos + Math.cos(angle) * radius, // Calculate x position
                            // y: yPos + Math.sin(angle) * radius, // Calculate y position
                            // x: xPos + nodeRadius * 1.75 * Math.cos(nodeAngle),
                            // y: yPos + nodeRadius * Math.sin(nodeAngle) + yOffset,
                            x: nodeRadius * 1.75 * Math.cos(nodeAngle),
                            y: nodeRadius * Math.sin(nodeAngle) + yOffset,
                        };

                        return {
                            ...node,
                            position: position,
                            // position: {
                            //     x: xPos + 100,
                            //     y: yPos + 100,
                            // },
                            hidden: false,
                        };
                    }
                    return node;
                });

                dispatch(
                    userInterfaceActions.setReactFlowUI({
                        flowChartNodes: updatedNodes || [],
                        flowChartEdges: reactFlowUI?.flowChartEdges || [],
                        flowDirection: reactFlowUI?.flowDirection,
                        legends: reactFlowUI?.legends,
                    }),
                );
            } else {
                const updatedNodes = currentnodes?.map((node) => {
                    if (node?.parentId === id && node.hidden !== undefined) {
                        return {
                            ...node,
                            // position: {
                            //     x: xPos + 100,
                            //     y: yPos + 100,
                            // },
                            hidden: true,
                        };
                    }
                    return node;
                });

                dispatch(
                    userInterfaceActions.setReactFlowUI({
                        flowChartNodes: updatedNodes || [],
                        flowChartEdges: reactFlowUI?.flowChartEdges || [],
                        flowDirection: reactFlowUI?.flowDirection,
                        legends: reactFlowUI?.legends,
                    }),
                );
            }
        },
        [currentnodes, reactFlowUI, dispatch, id],
    );

    const toggle = () => setCollapse(!collapse);
    const copyToClipboard = useCopyToClipboard();

    // TODO: use only for certificates not for rules
    const getStatusClasses = () => {
        switch (data?.certificateNodeData?.certificateNodeValidationStatus) {
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
        }

        switch (data?.group) {
            case 'rules':
                return style.rulesGroupNodeStatus;
            case 'actions':
                return style.actionGroupNodeStatus;
        }

        // switch(data)

        // switch (thisNodeState?.hidden) {
        //     case true:
        //         return style.hiddenStatus;
        //     case false:
        //         return style.hiddenStatus;
        // }

        return style.unknownStatus;
    };

    // TODO: use only for certificates not for rules
    const getExpandButtonStatusClasses = () => {
        switch (data?.certificateNodeData?.certificateNodeValidationStatus) {
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
            // default:
            //     return style.expandButtonUnknown;
        }
        switch (data?.group) {
            case 'rules':
                return style.rulesGroupNodeExpandButton;
            case 'actions':
                return style.actionsGroupNodeExpandButton;
            // default:
            //     return style.unknownNode;
        }

        return style.expandButtonUnknown;
    };

    return (
        <>
            <Handle hidden={data.handleHide === 'target'} className={cx(style.handleUp)} type="target" position={Position.Top} />
            <div className="d-flex align-items-start">
                <div
                    className={cx(
                        style.customNodeBackground,
                        { [style.selectedBackground]: dragging },
                        {
                            [style.mainNodeBody]: data.isMainNode,
                            [style.groupNode]: data.group,
                            [style.hiddenStatus]: thisNodeState?.hidden !== undefined,
                        },
                        getStatusClasses(),
                    )}
                >
                    {selected && (
                        <div className={style.expandButtonContainer}>
                            <div className="d-flex flex-column">
                                {data.otherProperties && (
                                    <Button
                                        color="primary"
                                        onClick={toggle}
                                        className={cx(style.nodeButton, getExpandButtonStatusClasses())}
                                    >
                                        {/* <span className="mx-auto">{status}</span> */}
                                        <i className={cx('fa ', { 'fa-chevron-down': !collapse, 'fa-chevron-up': collapse })} />
                                    </Button>
                                )}

                                {hasHiddenChildren ? (
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            setShowHiddenNodes(!showHiddenNodes);
                                            toggleHiddenNodes(!showHiddenNodes);
                                        }}
                                        className={cx('mt-1', style.nodeButton, getExpandButtonStatusClasses())}
                                    >
                                        {/* <span className="mx-auto">{status}</span> */}
                                        <i className={cx('fa ', { 'fa-eye': !showHiddenNodes, 'fa-eye-slash': showHiddenNodes })} />
                                    </Button>
                                ) : null}
                                {/* 
                                {/* TODO: Make this button to be collapsible and expandable to the right side, show attachable items to that
                            specific node */}
                                {data.addButtonContent && (
                                    <Button
                                        color="primary"
                                        className={cx('mt-1', style.nodeButton, style.addButton)}
                                        // onClick={data.addButtonContent}
                                        title="Add connections to this node"
                                        onClick={() => setAddNodeContentCollapse(!addNodeContentCollapse)}
                                    >
                                        {/* <i className={cx('fa fa-plus')} /> */}
                                        <i
                                            className={cx('fa ', {
                                                'fa-plus': !addNodeContentCollapse,
                                                'fa-minus': addNodeContentCollapse,
                                            })}
                                        />
                                    </Button>
                                )}

                                {data.deleteAction && (
                                    <Button
                                        color="danger"
                                        className={cx('mt-1', style.nodeButton, style.deleteButton)}
                                        onClick={data.deleteAction}
                                        title="Delete this node"
                                    >
                                        <i className={cx('fa fa-trash text-white')} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="d-flex my-1">
                        <i className={cx(style.iconStyle, data.icon, getStatusClasses())}></i>

                        <h6 className={cx(style.customNodeCardTitle, 'my-auto ms-2')}>{data.customNodeCardTitle}</h6>
                    </div>

                    {data.redirectUrl ? (
                        <div className={cx('d-flex ms-2', style.entityLabel)}>
                            <h6>Entity Name :</h6>
                            &nbsp;
                            <Link to={data.redirectUrl}>
                                <h6 className="text-wrap">{data.entityLabel}</h6>
                            </Link>
                        </div>
                    ) : (
                        <div className={cx('d-flex ms-2', style.entityLabel)}>
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
                            <Collapse
                                isOpen={collapse}
                                // onEntered={onEntered} onExited={onExited}
                                className="w-100"
                            >
                                <div className={cx(style.listContainer, { [style.listContainerDragging]: dragging })}>
                                    <ul className={cx('list-group p-1', style.listStyle)}>
                                        {data.otherProperties.map((property, index) => (
                                            <li key={index} className="list-group-item text-wrap p-0 ps-1">
                                                {property?.propertyName && (
                                                    <span className={style.propertyName}>{property.propertyName} : </span>
                                                )}
                                                {property?.propertyValue && (
                                                    <span className={style.propertyValue}>{property.propertyValue}</span>
                                                )}
                                                {property?.copyable && property?.propertyValue && (
                                                    <i
                                                        onClick={() => {
                                                            if (typeof property.propertyValue === 'string') {
                                                                copyToClipboard(
                                                                    property.propertyValue,
                                                                    `${property.propertyName} copied to clipboard`,
                                                                    `Failed to copy ${property.propertyName} to clipboard`,
                                                                );
                                                            }
                                                        }}
                                                        className="fa fa-copy ms-2"
                                                    />
                                                )}
                                                {property?.propertyContent && <>{property.propertyContent}</>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Collapse>
                        </>
                    )}

                    <Collapse isOpen={addNodeContentCollapse}>
                        <div className={style.addContentContainer}>{data.addButtonContent}</div>
                    </Collapse>
                </div>
            </div>

            {/* <Collapse isOpen={addNodeContentCollapse}>hiiiiiiii</Collapse> */}
            <Handle hidden={data.handleHide === 'source'} className={style.handleDown} type="source" position={Position.Bottom} id="a" />
        </>
    );
}
