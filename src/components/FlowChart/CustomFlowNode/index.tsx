import cx from 'classnames';
import { actions as alertActions } from 'ducks/alerts';
import { actions as userInterfaceActions, selectors as userInterfaceSelectors } from 'ducks/user-interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Handle, Position } from 'reactflow';
import { Button, Collapse } from 'reactstrap';
import { EntityNodeProps } from 'types/flowchart';
import { CertificateValidationStatus } from 'types/openapi';
import { useCopyToClipboard } from 'utils/common-hooks';
import style from './customFlowNode.module.scss';

export default function CustomFlowNode({ data, dragging, selected, xPos, yPos, id }: EntityNodeProps) {
    const [isNodeExpanded, setIsNodeExpanded] = useState(data.expandedByDefault ?? false);
    const [addNodeContentCollapse, setAddNodeContentCollapse] = useState(false);

    const flowChartNoedesState = useSelector(userInterfaceSelectors.flowChartNodes);
    const expandedHiddenNodeId = useSelector(userInterfaceSelectors.expandedHiddenNodeId);

    const thisNodeState = useMemo(() => {
        return flowChartNoedesState?.find((node) => node?.id === id);
    }, [flowChartNoedesState, id]);

    const hasHiddenChildren = useMemo(() => {
        return flowChartNoedesState?.some((node) => node?.parentId === id && node.hidden !== undefined);
    }, [flowChartNoedesState, id]);
    const dispatch = useDispatch();

    const toggleHiddenNodes = useCallback(() => {
        if (expandedHiddenNodeId !== id) {
            const updatedNodes = flowChartNoedesState?.map((node, i) => {
                const totalNodes = flowChartNoedesState?.filter((node) => node.parentId === id).length || 1; // Total child nodes

                const multiplier = totalNodes < 3 ? 300 : 200;
                const nodeRadius = multiplier * (totalNodes * 0.3); // Smaller radius for nodes within a group
                const nodeAngle = ((2 * Math.PI) / totalNodes) * i;

                if (node?.parentId !== id && node.hidden === false) {
                    return {
                        ...node,
                        hidden: true,
                    };
                }

                if (node?.parentId === id && node.hidden !== undefined) {
                    const positionMultiplier = totalNodes < 2 ? 3.5 : 1.75;
                    const xPosition = nodeRadius * positionMultiplier * Math.cos(nodeAngle);
                    const xWithExpandedOffset = isNodeExpanded && xPosition > 0 ? xPosition + 350 : xPosition;
                    const position = {
                        x: xWithExpandedOffset,
                        y: nodeRadius * positionMultiplier * Math.sin(nodeAngle),
                    };

                    return {
                        ...node,
                        position: position,
                        hidden: false,
                    };
                }
                return node;
            });

            if (updatedNodes) dispatch(userInterfaceActions.updateReactFlowNodes(updatedNodes));

            dispatch(userInterfaceActions.setShowHiddenNodes(id));
        } else {
            const updatedNodes = flowChartNoedesState?.map((node) => {
                if (node?.parentId === id && node.hidden !== undefined) {
                    return {
                        ...node,
                        hidden: true,
                    };
                }
                return node;
            });

            if (updatedNodes) dispatch(userInterfaceActions.updateReactFlowNodes(updatedNodes));

            dispatch(userInterfaceActions.setShowHiddenNodes(undefined));
        }
    }, [flowChartNoedesState, dispatch, id, expandedHiddenNodeId, isNodeExpanded]);

    const expandToggle = useCallback(() => {
        setIsNodeExpanded(!isNodeExpanded);
    }, [isNodeExpanded]);

    const copyToClipboard = useCopyToClipboard();

    useEffect(() => {
        if (isNodeExpanded && data?.expandAction) data.expandAction();
    }, [data, isNodeExpanded]);

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
        }
        switch (data?.group) {
            case 'rules':
                return style.rulesGroupNodeExpandButton;
            case 'actions':
                return style.actionsGroupNodeExpandButton;
        }

        return style.expandButtonUnknown;
    };

    return (
        <>
            <Handle hidden={data.handleHide === 'target'} className={cx(style.handleUp)} type="target" position={Position.Top} />
            <div className="d-flex align-items-start">
                <div
                    // style={{ width: '500px' }}
                    className={cx(
                        // style.customNodeBackground,
                        { [style.customNodeBackground]: !data.formContent },
                        { [style.selectedBackground]: dragging },
                        {
                            [style.mainNodeBody]: data.isMainNode,
                            [style.groupNode]: data.group,
                            [style.hiddenStatus]: thisNodeState?.hidden !== undefined,
                        },
                        getStatusClasses(),
                        {
                            [style.expandedNode]: isNodeExpanded,
                        },
                    )}
                >
                    {selected && (
                        <div className={style.expandButtonContainer}>
                            <div className="d-flex flex-column">
                                {data.otherProperties && (
                                    <Button
                                        color="primary"
                                        onClick={expandToggle}
                                        className={cx(style.nodeButton, getExpandButtonStatusClasses())}
                                    >
                                        {/* <span className="mx-auto">{status}</span> */}
                                        <i className={cx('fa ', { 'fa-chevron-down': !isNodeExpanded, 'fa-chevron-up': isNodeExpanded })} />
                                    </Button>
                                )}

                                {hasHiddenChildren ? (
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            // setShowHiddenNodes(!expandedHiddenNodeId);
                                            toggleHiddenNodes();
                                        }}
                                        className={cx('mt-1', style.nodeButton, getExpandButtonStatusClasses())}
                                    >
                                        {/* <span className="mx-auto">{status}</span> */}
                                        <i
                                            className={cx('fa ', {
                                                'fa-eye': expandedHiddenNodeId !== id,
                                                'fa-eye-slash': expandedHiddenNodeId === id,
                                            })}
                                        />
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
                                        onClick={() => {
                                            if (data.deleteAction) {
                                                switch (data.deleteAction.disableCondition) {
                                                    case 'SingleChild':
                                                        const totalSiblings = flowChartNoedesState?.filter(
                                                            (node) =>
                                                                node.parentId === thisNodeState?.parentId &&
                                                                node.id !== id &&
                                                                node.parentId !== undefined,
                                                        ).length;
                                                        if (totalSiblings === 0) {
                                                            dispatch(
                                                                alertActions.error(
                                                                    data.deleteAction.disabledMessage ||
                                                                        'Cannot delete the last node of this group',
                                                                ),
                                                            );
                                                            return;
                                                        }
                                                        break;
                                                }

                                                data.deleteAction.action();
                                                const childrenNodes = flowChartNoedesState?.filter((node) => node.parentId === id);
                                                childrenNodes?.forEach((node) => {
                                                    dispatch(userInterfaceActions.deleteNode(node.id));
                                                });
                                                dispatch(userInterfaceActions.deleteNode(id));
                                            }
                                        }}
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

                    {data.redirectUrl && data.entityLabel ? (
                        <div className={cx('d-flex ms-2', style.entityLabel)}>
                            <h6>Entity Name :</h6>
                            &nbsp;
                            <Link to={data.redirectUrl}>
                                <h6 className="text-wrap">{data.entityLabel}</h6>
                            </Link>
                        </div>
                    ) : data.entityLabel ? (
                        <div className={cx('d-flex ms-2', style.entityLabel)}>
                            <h6>Entity Name :</h6>
                            &nbsp;
                            <h6>{data.entityLabel}</h6>
                        </div>
                    ) : (
                        <div className="mt-4" />
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
                                isOpen={isNodeExpanded}
                                // onEntered={onEntered} onExited={onExited}
                                className="w-100"
                            >
                                <div className={cx(style.listContainer, { [style.listContainerDragging]: dragging })}>
                                    <ul className={cx('list-group p-1')}>
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

                    {data?.formContent && (
                        <div className="m-auto" style={{ minWidth: '500px' }}>
                            {data.formContent}
                        </div>
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
