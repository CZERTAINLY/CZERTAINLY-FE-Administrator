import { CustomNode } from 'components/FlowChart';
import { ReactNode } from 'react';
import { Edge, NodeProps } from 'reactflow';
import { CertificateState, CertificateValidationStatus } from './openapi';

export interface OtherProperties {
    propertyName?: string;
    propertyValue?: string;
    copyable?: boolean;
    propertyContent?: ReactNode;
}

interface CertificateNodeData {
    certificateNodeStatus?: CertificateState;
    certificateNodeValidationStatus?: CertificateValidationStatus;
}

export interface CustomNodeData {
    isMainNode?: boolean;
    customNodeCardTitle: string;
    entityLabel: string;
    redirectUrl?: string;
    icon?: string;
    handleHide?: 'source' | 'target';
    description?: string;
    otherProperties?: OtherProperties[];
    expandedByDefault?: boolean;
    onNodeAddButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    // certificateNodeStatus?: CertificateState;
    // certificateNodeValidationStatus?: CertificateValidationStatus;
    certificateNodeData?: CertificateNodeData;
}
export interface EntityNodeProps extends NodeProps {
    data: CustomNodeData;
}

export interface FlowChartProps {
    flowChartTitle?: string;
    flowChartNodes: CustomNode[];
    flowChartEdges: Edge[];
}
