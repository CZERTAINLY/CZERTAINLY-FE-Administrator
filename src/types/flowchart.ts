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
    customNodeCardTitle?: string;
    entityLabel?: string;
    redirectUrl?: string;
    icon?: string;
    handleHide?: 'source' | 'target';
    description?: string;
    otherProperties?: OtherProperties[];
    expandedByDefault?: boolean;
    expandAction?: () => void;
    group?: string;
    addButtonContent?: React.ReactNode;
    formContent?: React.ReactNode;
    deleteAction?: {
        disableCondition?: 'SingleChild';
        disabledMessage?: string;
        action: () => void;
    };
    // certificateNodeStatus?: CertificateState;
    // certificateNodeValidationStatus?: CertificateValidationStatus;
    certificateNodeData?: CertificateNodeData;
}
export interface EntityNodeProps extends NodeProps {
    data: CustomNodeData;
    hidden?: boolean;
}

export interface FlowChartProps {
    flowChartTitle?: string;
    flowChartNodes: CustomNode[];
    flowChartEdges: Edge[];
}
