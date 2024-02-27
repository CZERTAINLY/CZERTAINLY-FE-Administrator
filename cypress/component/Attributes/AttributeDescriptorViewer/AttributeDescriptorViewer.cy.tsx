import AttributeDescriptorViewer, { Props as AttributeDescriptorViewerProps } from 'components/Attributes/AttributeDescriptorViewer';
import { actions as userInterfaceActions } from 'ducks/user-interface';

import { InfoAttributeModel } from 'types/attributes';
import { LockTypeEnum, LockWidgetNameEnum } from 'types/user-interface';
import '../../../../src/resources/styles/theme.scss';

const infoAttributeEditorProps: AttributeDescriptorViewerProps = {
    attributeDescriptors: [
        {
            content: [{ data: 'test-data-1', reference: 'test-reference-1' }],
            contentType: 'string',
            description: 'test-description-1',
            name: 'test-name-1',
            type: 'info',
            uuid: 'test-uuid-1',
            properties: {
                label: 'Test Label 1',
                visible: true,
                group: 'test-group-1',
            },
        },
        {
            content: [{ data: 'test-data-2', reference: 'test-reference-2' }],
            contentType: 'string',
            description: 'test-description-2',
            name: 'test-name-2',
            type: 'info',
            uuid: 'test-uuid-2',
            properties: {
                label: 'Test Label 2',
                visible: true,
                group: 'test-group-2',
            },
        },
    ] as InfoAttributeModel[],
};
describe('AttributeDescriptorViewer', () => {
    it('should render info attribute editor', () => {
        cy.mount(<AttributeDescriptorViewer attributeDescriptors={infoAttributeEditorProps.attributeDescriptors} />);

        cy.window()
            .its('store')
            .invoke(
                'dispatch',
                userInterfaceActions.insertWidgetLock(
                    {
                        lockTitle: 'test',
                        lockText: 'test lock',
                        lockType: LockTypeEnum.GENERIC,
                    },
                    LockWidgetNameEnum.ConnectorDetails,
                ),
            );
    });
});
