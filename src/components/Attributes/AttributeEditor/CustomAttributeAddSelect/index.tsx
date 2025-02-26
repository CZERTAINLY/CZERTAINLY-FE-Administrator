import { useMemo } from 'react';
import { Field } from 'react-final-form';
import Select from 'react-select';
import { Col, Row } from 'reactstrap';
import { AttributeDescriptorModel, CustomAttributeModel, isCustomAttributeModel } from '../../../../types/attributes';

export type Props = {
    attributeDescriptors: AttributeDescriptorModel[] | undefined;
    onAdd: (attribute: CustomAttributeModel) => void;
};

export default function CustomAttributeAddSelect({ attributeDescriptors, onAdd }: Props) {
    const options = useMemo(
        () =>
            attributeDescriptors
                ?.filter<CustomAttributeModel>((el) => isCustomAttributeModel(el))
                .map((el) => ({
                    label: el.properties.label,
                    value: el,
                })) || [],
        [attributeDescriptors],
    );

    if (options.length === 0) return null;

    return (
        <>
            <h6>
                <b>Show custom attribute</b>
            </h6>
            <Row>
                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <Field key={'selectAddShowCustomAttribute'} name={'selectAddCustomAttribute'}>
                        {({ input }) => (
                            <Select
                                {...input}
                                options={options}
                                placeholder={`Show...`}
                                isClearable={true}
                                onChange={(v) => {
                                    onAdd(v.value);
                                }}
                            />
                        )}
                    </Field>
                </Col>
            </Row>
        </>
    );
}
