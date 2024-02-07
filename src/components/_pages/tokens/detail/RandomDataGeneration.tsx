import AttributeEditor from 'components/Attributes/AttributeEditor';
import Spinner from 'components/Spinner';

import { actions, selectors } from 'ducks/cryptographic-operations';
import { useCallback, useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel, AttributeRequestModel } from 'types/attributes';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';
import TabLayout from '../../../Layout/TabLayout';

interface Props {
    tokenUuid?: string;
    visible: boolean;
    onClose: () => void;
}

export default function RandomDataGeneration({ tokenUuid, visible, onClose }: Props) {
    const dispatch = useDispatch();

    const isFetchingAttributes = useSelector(selectors.isFetchingRandomDataAttributes);

    const attributes = useSelector(selectors.randomDataAttributeDescriptors);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    useEffect(
        () => {
            if (!visible) return;
            if (!tokenUuid) return;
            dispatch(actions.listRandomAttributeDescriptors({ tokenInstanceUuid: tokenUuid }));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visible, tokenUuid, dispatch],
    );

    const onSubmit = useCallback(
        (values: any) => {
            if (!tokenUuid) return;

            const attribs: AttributeRequestModel[] =
                attributes && attributes.length > 0
                    ? collectFormAttributes('attributes', [...(attributes ?? []), ...groupAttributesCallbackAttributes], values) || []
                    : [];
            dispatch(
                actions.generateRandomData({
                    tokenInstanceUuid: tokenUuid,
                    request: {
                        attributes: attribs,
                        length: values.length,
                    },
                }),
            );

            onClose();
        },
        [dispatch, attributes, onClose, tokenUuid, groupAttributesCallbackAttributes],
    );

    if (!tokenUuid) return <></>;

    return (
        <>
            <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit, pristine, submitting, valid }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="length">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Random Data Length (in bytes)</Label>

                                    <Input
                                        {...input}
                                        id="length"
                                        type="number"
                                        placeholder="Random Data Length (in bytes)"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                    />
                                </FormGroup>
                            )}
                        </Field>

                        {!attributes || attributes.length === 0 ? (
                            <></>
                        ) : (
                            <Field name="Attributes">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <br />

                                        <TabLayout
                                            tabs={[
                                                {
                                                    title: 'Connector Attributes',
                                                    content: (
                                                        <AttributeEditor
                                                            id="attributes"
                                                            attributeDescriptors={attributes}
                                                            groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                                            setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                                        />
                                                    ),
                                                },
                                            ]}
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                        )}

                        <div style={{ textAlign: 'right' }}>
                            <ButtonGroup>
                                <Button type="submit" color="primary" disabled={pristine || submitting || !valid} onClick={handleSubmit}>
                                    Generate
                                </Button>

                                <Button type="button" color="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>

            <Spinner active={isFetchingAttributes} />
        </>
    );
}
