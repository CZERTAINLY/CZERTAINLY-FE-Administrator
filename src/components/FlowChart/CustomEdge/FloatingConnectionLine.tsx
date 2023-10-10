import { ConnectionLineComponentProps, Position, getBezierPath } from "reactflow";

import { CustomNode, nodeHeight, nodeWidth } from "..";
import { getEdgeParams } from "./edgeUtils";

interface FloatingConnectionLineProps {
    toX: number;
    toY: number;
    fromPosition: Position;
    toPosition: Position;
    fromNode: CustomNode;
}

function FloatingConnectionLine({ toX, toY, fromPosition, toPosition, fromNode }: ConnectionLineComponentProps) {
    if (!fromNode) {
        return null;
    }

    const targetNode: CustomNode = {
        id: "connection-target",
        type: "connection-target",
        position: { x: 0, y: 0 },
        width: nodeWidth,
        height: nodeHeight,
        data: {
            customNodeCardTitle: "NA",
            entityLabel: "NA",
        },
    };

    const { sx, sy } = getEdgeParams(fromNode, targetNode);
    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: fromPosition,
        targetPosition: toPosition,
        targetX: toX,
        targetY: toY,
    });

    return (
        <g>
            <path fill="none" stroke="#222" strokeWidth={1.5} className="animated" d={edgePath} />
            <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
        </g>
    );
}

export default FloatingConnectionLine;
export {};
