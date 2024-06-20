import Widget from 'components/Widget';
import dagre from 'dagre';
import { useCallback, useEffect, useState } from 'react';

import cx from 'classnames';
import {
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    Position,
    ReactFlow,
    Viewport,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNodeData } from 'types/flowchart';
import FloatingEdge from './CustomEdge';
import FloatingConnectionLine from './CustomEdge/FloatingConnectionLine';
import CustomFlowNode from './CustomFlowNode';
import style from './flowChart.module.scss';
const nodeTypes = { customFlowNode: CustomFlowNode };

export interface CustomNode extends Node {
    data: CustomNodeData;
}

export interface FlowChartProps {
    flowChartTitle?: string;
    flowDirection?: 'TB' | 'BT' | 'LR' | 'RL' | 'STAR';
    flowChartNodes: CustomNode[];
    flowChartEdges: Edge[];
    defaultViewport?: Viewport | undefined;
    busy?: boolean;
}

const edgeTypes = {
    floating: FloatingEdge,
};
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const nodeWidth = 400;
export const nodeHeight = 100;

// const getLayoutedElements = (nodes: CustomNode[], edges: Edge[], direction = 'TB') => {
//     const isHorizontal = direction === 'LR';
//     dagreGraph.setGraph({ rankdir: direction });

//     nodes.forEach((node) => {
//         const currentNodeHeight = node.data.otherProperties?.length ? nodeHeight + node.data.otherProperties?.length * 20 : nodeHeight;

//         // node.data.isMainNode
//         dagreGraph.setNode(node.id, { width: nodeWidth, height: currentNodeHeight });
//     });

//     edges.forEach((edge) => {
//         dagreGraph.setEdge(edge.source, edge.target);
//     });

//     dagre.layout(dagreGraph);

//     nodes.forEach((node: CustomNode) => {
//         const nodeWithPosition = dagreGraph.node(node.id);
//         node.targetPosition = isHorizontal ? Position.Left : Position.Top;
//         node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

//         node.position = {
//             x: nodeWithPosition.x - nodeWidth / 2,
//             y: nodeWithPosition.y - nodeHeight / 2,
//         };

//         return node;
//     });

//     return { nodes, edges };
// };

const getLayoutedElements = (nodes: CustomNode[], edges: Edge[], direction = 'TB') => {
    if (direction === 'STAR') {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const minRadius = 250; // Minimum radius
        const mainNode = nodes.find((node) => node.data.isMainNode);
        const surroundingNodes = nodes.filter((node) => !node.data.isMainNode);
        const angleIncrement = (2 * Math.PI) / surroundingNodes.length;

        // Calculate dynamic radius based on the number of nodes to ensure minimum distance of 200px
        let dynamicRadius = surroundingNodes.length * 60; // Example calculation, adjust as needed
        dynamicRadius = Math.max(dynamicRadius, minRadius); // Ensure radius is not less than minRadius

        if (mainNode) {
            const currentNodeHeight = mainNode.data?.description ? nodeHeight + 35 : nodeHeight;
            // Position the main node at the center
            mainNode.position = { x: centerX - nodeWidth / 2, y: centerY - currentNodeHeight / 2 };
        }

        surroundingNodes.forEach((node, index) => {
            // Calculate the angle for the current node
            const angle = angleIncrement * index;
            const currentNodeHeight = node.data?.description ? nodeHeight + 35 : nodeHeight;

            // Calculate and set the position for each surrounding node using the dynamic radius
            node.position = {
                x: centerX + dynamicRadius * Math.cos(angle) - nodeWidth / 2,
                y: centerY + dynamicRadius * Math.sin(angle) - currentNodeHeight / 2,
            };
            // Set target and source positions for better edge connections
            node.targetPosition = Position.Top;
            node.sourcePosition = Position.Bottom;
        });

        return { nodes, edges };
    } else {
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction });

        nodes.forEach((node) => {
            // const currentNodeHeight = node.data.otherProperties?.length ? nodeHeight + node.data.otherProperties?.length * 20 : nodeHeight;
            const currentNodeHeight = node.data?.description ? nodeHeight + 35 : nodeHeight;
            dagreGraph.setNode(node.id, { width: nodeWidth, height: currentNodeHeight });
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        nodes.forEach((node: CustomNode) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = isHorizontal ? Position.Left : Position.Top;
            node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
            const currentNodeHeight = node.data?.description ? nodeHeight + 35 : nodeHeight;
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - currentNodeHeight / 2,
            };

            return node;
        });

        return { nodes, edges };
    }
};

const FlowChart = ({ flowChartTitle, flowChartEdges, flowChartNodes, defaultViewport, busy, flowDirection }: FlowChartProps) => {
    const [nodes, setNodes] = useState(flowChartNodes);
    const [edges, setEdges] = useState(flowChartEdges);
    const defaultEdgeOptions = { animated: true };

    const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
    const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
    // TODO: Implement onConnect in future if needed
    // const onConnect = useCallback((connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

    useEffect(() => {
        const { nodes, edges } = getLayoutedElements(flowChartNodes, flowChartEdges, flowDirection);
        setNodes(nodes);
        setEdges(edges);
    }, [flowChartEdges, flowChartNodes, flowDirection]);

    return (
        <Widget className={style.flowWidget} busy={busy}>
            {flowChartTitle && <h5 className="text-muted">{flowChartTitle}</h5>}
            <div className={cx(style.flowChartContainer, style.floatingedges)}>
                <ReactFlow
                    nodes={nodes}
                    proOptions={{ hideAttribution: true }}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView={!defaultViewport}
                    defaultViewport={defaultViewport}
                    defaultEdgeOptions={defaultEdgeOptions}
                    edgeTypes={edgeTypes}
                    connectionLineComponent={FloatingConnectionLine}
                >
                    <Controls />
                    <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                </ReactFlow>
            </div>
        </Widget>
    );
};

export default FlowChart;
