import { CustomNode } from 'components/FlowChart';
import { Edge, MarkerType, Position } from 'reactflow';
import { CertificateState, CertificateValidationStatus } from 'types/openapi';
import '../../../src/resources/styles/theme.scss';

export const nodes: CustomNode[] = [
    {
        id: '1',
        type: 'customFlowNode',
        position: {
            x: 0,
            y: 310,
        },
        width: 350,
        height: 100,
        data: {
            customNodeCardTitle: 'Certificate',
            entityLabel: 'demo.3key.test',
            icon: 'fa fa-certificate',
            isMainNode: true,
            certificateNodeData: {
                certificateNodeStatus: CertificateState.Issued,
                certificateNodeValidationStatus: CertificateValidationStatus.Valid,
            },
            // certificateNodeStatus: CertificateState.Issued,
            // certificateNodeValidationStatus: CertificateValidationStatus.Valid,
            description: 'This is a description',
            otherProperties: [
                {
                    propertyName: 'Serial Number',
                    propertyValue: '18000002d184a284af0c9ec3c20000000002d1',
                },
                {
                    propertyName: 'Subject DN',
                    propertyValue: 'CN=demo.3key.test',
                },
                {
                    propertyName: 'certificateType',
                    propertyValue: 'X.509',
                },
                {
                    propertyName: 'Status',
                    propertyValue: 'valid',
                },
            ],
        },
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '6',
        type: 'customFlowNode',
        position: {
            x: 0,
            y: 40,
        },
        width: 350,
        height: 100,
        data: {
            customNodeCardTitle: 'Certificate Issuer',
            icon: 'fa fa fa fa-stamp',
            entityLabel: 'Demo MS Sub CA',
            otherProperties: [
                {
                    propertyName: 'Issuer DN',
                    propertyValue: 'O=3Key Company s.r.o., CN=Demo MS Sub CA',
                },
                {
                    propertyName: 'Issuer Sr. No.',
                    propertyValue: '656879dc6dfcc35c431488317ddb331f486a3847',
                },
            ],
        },
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '5',
        type: 'customFlowNode',
        position: {
            x: 200,
            y: 560,
        },
        width: 350,
        height: 100,
        data: {
            customNodeCardTitle: 'RA Profile',
            icon: 'fa fa fa-address-card',
            entityLabel: 'ms-adcs-webserver',
            otherProperties: [
                {
                    propertyName: 'RA Profile Enabled',
                    propertyValue: 'Yes',
                },
            ],
        },
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '7',
        type: 'customFlowNode',
        position: {
            x: 400,
            y: 310,
        },
        width: 350,
        height: 100,
        data: {
            customNodeCardTitle: 'Authority',
            icon: 'fa fa fa-stamp',
            entityLabel: 'ms-adcs-lab02-authority',
            otherProperties: [
                {
                    propertyName: 'Authority Instance Name',
                    propertyValue: 'ms-adcs-lab02-authority',
                },
                {
                    propertyName: 'Authority UUID',
                    propertyValue: 'e244af09-f043-4db9-8f73-3201d3ab87b9',
                },
            ],
        },
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
];
export const edges: Edge[] = [
    {
        id: 'e1-6',
        source: '6',
        target: '1',
        type: 'floating',
        markerEnd: {
            type: MarkerType.Arrow,
        },
    },
    {
        id: 'e1-5',
        source: '1',
        target: '5',
        type: 'floating',
        markerEnd: {
            type: MarkerType.Arrow,
        },
    },
    {
        id: 'e5-7',
        target: '5',
        source: '7',
        type: 'floating',
        markerEnd: {
            type: MarkerType.Arrow,
        },
    },
];
