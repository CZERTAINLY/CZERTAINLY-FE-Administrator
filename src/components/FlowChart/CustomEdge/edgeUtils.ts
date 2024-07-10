import { Position } from 'reactflow';
import { CustomNode, nodeHeight, nodeWidth } from '..';

function getNodeIntersection(intersectionNode: CustomNode, targetNode: CustomNode) {
    const { positionAbsolute: intersectionNodePosition } = intersectionNode;
    const targetPosition = targetNode.positionAbsolute;
    const currentIntersectionNodeWidth = intersectionNode?.data?.group || intersectionNode.hidden !== undefined ? 242.5 : nodeWidth;
    const w = currentIntersectionNodeWidth / 2;
    const currentIntersectionNodeNodeHeight = intersectionNode?.data?.description ? nodeHeight + 35 : nodeHeight;

    const h = currentIntersectionNodeNodeHeight / 2;

    if (!intersectionNodePosition || !targetPosition) return { x: 0, y: 0 };

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + w;
    const y1 = targetPosition.y + h;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

interface IntersectionPoint {
    x: number;
    y: number;
}

function getEdgePosition(node: CustomNode, intersectionPoint: IntersectionPoint) {
    const n = { ...node.positionAbsolute, ...node };
    let nx = 0;
    let ny = 0;
    if (n.x && n.y) {
        nx = Math.round(n.x);
        ny = Math.round(n.y);
    }

    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }
    if (px >= nx + nodeWidth - 1) {
        return Position.Right;
    }
    if (py <= ny + 1) {
        return Position.Top;
    }

    if (n.y && py >= n.y + nodeHeight - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: CustomNode, target: CustomNode) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}
