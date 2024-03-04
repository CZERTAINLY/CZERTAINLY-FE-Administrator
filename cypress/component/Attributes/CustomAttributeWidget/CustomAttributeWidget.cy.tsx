import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import { actions as customAttributesActions } from 'ducks/customAttributes';
import { transformCustomAttributeDtoToModel } from 'ducks/transform/attributes';
import '../../../../src/resources/styles/theme.scss';
import { customAttributeWidgetProps, successData } from './mock-data';

describe('CustomAttributeWidget', () => {
    it('should render CustomAttributeWidget', () => {
        cy.mount(<></>);
        cy.mount(
            <CustomAttributeWidget
                resource={customAttributeWidgetProps.resource}
                resourceUuid={customAttributeWidgetProps.resourceUuid}
                attributes={customAttributeWidgetProps.attributes}
            />,
        )
            .wait(1000)
            .window()
            .its('store')
            .invoke(
                'dispatch',
                customAttributesActions.listResourceCustomAttributesSuccess(successData.map(transformCustomAttributeDtoToModel)),
            );
    });
});
