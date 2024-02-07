import AttributeEditor from 'components/Attributes/AttributeEditor';
import Spinner from 'components/Spinner';

import { actions, selectors } from 'ducks/tokens';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Form as BootstrapForm, Button, ButtonGroup, FormGroup } from 'reactstrap';
import { AttributeDescriptorModel, AttributeRequestModel } from 'types/attributes';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';
import TabLayout from '../../Layout/TabLayout';

interface Props {
    tokenUuid?: string;
    visible: boolean;
    onClose: () => void;
}

export default function TokenActivationDialogBody({ tokenUuid, visible, onClose }: Props) {
    const dispatch = useDispatch();

    const activationAttributes = useSelector(selectors.activationAttributes);

    const [activationGroupAttributesCallbackAttributes, setActivationGroupAttributesCallbackAttributes] = useState<
        AttributeDescriptorModel[]
    >([]);

    const isFetchingTokens = useSelector(selectors.isFetchingList);
    const isFetchingActivationAttributes = useSelector(selectors.isFetchingActivationAttributeDescriptors);

    const isBusy = useMemo(() => isFetchingTokens || isFetchingActivationAttributes, [isFetchingTokens, isFetchingActivationAttributes]);

    useEffect(
        () => {
            if (!visible) return;
            if (!tokenUuid) return;
            dispatch(actions.listActivationAttributeDescriptors({ uuid: tokenUuid || '' }));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visible],
    );

    const onActivateSubmit = useCallback(
        (values: any) => {
            if (!tokenUuid) return;

            const activationAttribs: AttributeRequestModel[] =
                activationAttributes && activationAttributes.length > 0
                    ? collectFormAttributes(
                          'activationAttributes',
                          [...(activationAttributes ?? []), ...activationGroupAttributesCallbackAttributes],
                          values,
                      ) || []
                    : [];
            dispatch(
                actions.activateToken({
                    uuid: tokenUuid,
                    request: activationAttribs,
                }),
            );

            onClose();
        },
        [dispatch, activationAttributes, onClose, tokenUuid, activationGroupAttributesCallbackAttributes],
    );

    if (!tokenUuid) return <></>;

    return (
        <>
            <Form onSubmit={onActivateSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit, pristine, submitting, valid }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <br />
                        <TabLayout
                            tabs={[
                                {
                                    title: 'Issue attributes',
                                    content:
                                        !activationAttributes || activationAttributes.length === 0 ? (
                                            <></>
                                        ) : (
                                            <Field name="ActivationAttributes">
                                                {({ input, meta }) => (
                                                    <FormGroup>
                                                        <AttributeEditor
                                                            id="activationAttributes"
                                                            attributeDescriptors={activationAttributes}
                                                            groupAttributesCallbackAttributes={activationGroupAttributesCallbackAttributes}
                                                            setGroupAttributesCallbackAttributes={
                                                                setActivationGroupAttributesCallbackAttributes
                                                            }
                                                        />
                                                    </FormGroup>
                                                )}
                                            </Field>
                                        ),
                                },
                            ]}
                        />

                        <div style={{ textAlign: 'right' }}>
                            <ButtonGroup>
                                <Button type="submit" color="primary" disabled={pristine || submitting || !valid} onClick={handleSubmit}>
                                    Activate
                                </Button>

                                <Button type="button" color="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>

            <Spinner active={isBusy} />
        </>
    );
}
