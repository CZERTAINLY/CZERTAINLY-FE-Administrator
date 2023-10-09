import { CustomNode } from "components/FlowChart";
import { Edge, NodeProps } from "reactflow";
import { CertificateStatus } from "./openapi";

export interface OtherProperties {
    propertyName: string;
    propertyValue: string;
    copyable?: boolean;
}

export interface CustomNodeData {
    isMainNode?: boolean;
    customNodeCardTitle: string;
    entityLabel: string;
    redirectUrl?: string;
    icon?: string;
    handleHide?: "source" | "target";
    description?: string;
    otherProperties?: OtherProperties[];
    certificateNodeStatus?: CertificateStatus;
}
export interface EntityNodeProps extends NodeProps {
    data: CustomNodeData;
}

export interface FlowChartProps {
    flowChartTitle?: string;
    flowChartNodes: CustomNode[];
    flowChartEdges: Edge[];
}
