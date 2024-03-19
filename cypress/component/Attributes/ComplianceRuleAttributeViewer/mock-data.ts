import { Props as ComplianceRuleAttributeViewerProps } from 'components/Attributes/ComplianceRuleAttributeViewer';
import { AttributeDescriptorModel, AttributeResponseModel } from 'types/attributes';
import { AttributeContentType, AttributeType } from 'types/openapi';

export const complianceRuleAttributeViewerProps: ComplianceRuleAttributeViewerProps = {
    attributes: [
        {
            contentType: AttributeContentType.String,
            label: 'Test Label 1',
            name: 'test-name-1',
            type: AttributeType.Info,
            uuid: 'test-uuid-1',
            content: [
                {
                    data: 'test-data-1',
                    reference: 'test-reference-1',
                },
            ],
        },
        {
            contentType: AttributeContentType.Boolean,
            label: 'Test Label 2',
            name: 'test-name-2',
            type: AttributeType.Info,
            uuid: 'test-uuid-2',
            content: [
                {
                    data: true,
                    reference: 'test-reference-2',
                },
            ],
        },
    ] as AttributeResponseModel[],
    descriptorAttributes: [
        {
            content: [{ data: 'test-data-1', reference: 'test-reference-1' }],
            contentType: AttributeContentType.String,
            description: 'test-descriptor-data-1',
            name: 'test-descriptor-name-1',
            type: AttributeType.Data,
            uuid: 'test-descriptor-uuid-1',
            properties: {
                label: 'Test Descriptor Label 1',
                visible: true,
                group: 'test-descriptor-group-1',
            },
        },
        {
            content: [{ data: 'test-data-2', reference: 'test-reference-2' }],
            contentType: AttributeContentType.String,
            description: 'test-descriptor-data-2',
            name: 'test-descriptor-name-2',
            type: AttributeType.Data,
            uuid: 'test-descriptor-uuid-2',
            properties: {
                label: 'Test Descriptor Label 2',
                visible: true,
                group: 'test-descriptor-group-2',
            },
        },
    ] as AttributeDescriptorModel[],
};
