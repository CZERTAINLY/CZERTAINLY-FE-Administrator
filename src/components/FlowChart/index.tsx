import Widget from "components/Widget";
import dagre from "dagre";
import { useCallback, useEffect, useState } from "react";

import {
    Background,
    BackgroundVariant,
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    Position,
    ReactFlow,
    Viewport,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Controls
} from "reactflow";
import "reactflow/dist/style.css";
import { CustomNodeData } from "types/flowchart";
import CustomFlowNode from "./CustomFlowNode";
import style from "./flowChart.module.scss";
const nodeTypes = { customFlowNode: CustomFlowNode };

export interface CustomNode extends Node {
    data: CustomNodeData;
}

export interface FlowChartProps {
    flowChartTitle?: string;
    flowChartNodes: CustomNode[];
    flowChartEdges: Edge[];
    defaultViewport?: Viewport | undefined;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 350;
const nodeHeight = 350;

const getLayoutedElements = (nodes: CustomNode[], edges: Edge[], direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        const currentNodeHeight = node.data.otherProperties?.length ? nodeHeight : nodeHeight - 325;
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

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

const FlowChart = ({ flowChartTitle, flowChartEdges, flowChartNodes, defaultViewport }: FlowChartProps) => {
    const [nodes, setNodes] = useState(flowChartNodes);
    const [edges, setEdges] = useState(flowChartEdges);
    const defaultEdgeOptions = { animated: true };

    const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
    const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
    const onConnect = useCallback((connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

    useEffect(() => {
        const { nodes, edges } = getLayoutedElements(flowChartNodes, flowChartEdges);
        setNodes(nodes);
        setEdges(edges);
    }, [flowChartEdges, flowChartNodes]);

    return (
        <Widget>
            {flowChartTitle && <h5 className="text-muted">{flowChartTitle}</h5>}
            <div className={style.flowChartContainer}>
                <ReactFlow
                    title={flowChartTitle}
                    nodes={nodes}
                    proOptions={{ hideAttribution: true }}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView={!defaultViewport}
                    defaultViewport={defaultViewport}
                    defaultEdgeOptions={defaultEdgeOptions}
                >
                    <Controls />
                    <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                </ReactFlow>
            </div>
        </Widget>
    );
};

export default FlowChart;
