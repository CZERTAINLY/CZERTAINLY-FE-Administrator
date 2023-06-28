import { CustomNode } from "components/FlowChart";
import { selectors } from "ducks/certificates";
import { transformCertifacetObjectToNodesAndEdges } from "ducks/transform/certificates";
import { selectors as userSelectors } from "ducks/users";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Edge } from "reactflow";
import { FlowChartType } from "types/flowchart";

export function useFlowChartValues(flowChartType: FlowChartType): [CustomNode[], Edge[]] {
    const [certificateNodes, setCertificateNodes] = useState<CustomNode[]>([]);
    const [certificateEdges, setCertificateEdges] = useState<Edge[]>([]);

    const certificate = useSelector(selectors.certificateDetail);
    const users = useSelector(userSelectors.users);

    useEffect(() => {
        if (certificate && flowChartType === FlowChartType.CERTIFICATE) {
            const { nodes, edges } = transformCertifacetObjectToNodesAndEdges(certificate, users);
            setCertificateNodes(nodes);
            setCertificateEdges(edges);
        } else {
            setCertificateNodes([]);
            setCertificateEdges([]);
        }
    }, [certificate, users]);

    return [certificateNodes, certificateEdges];
}
