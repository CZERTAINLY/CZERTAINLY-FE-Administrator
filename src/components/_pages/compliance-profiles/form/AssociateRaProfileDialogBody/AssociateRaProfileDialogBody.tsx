import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Field, Form } from 'react-final-form';
import Select from 'react-select';
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Label } from 'reactstrap';

import { mutators } from 'utils/attributes/attributeEditorMutators';

import { validateRequired } from 'utils/validators';

import Spinner from 'components/Spinner';

import { actions } from 'ducks/compliance-profiles';
import { actions as raActions, selectors as raSelectors } from 'ducks/ra-profiles';

interface Props {
    complianceProfileUuid?: string;
    availableRaProfileUuids?: string[];
    visible: boolean;
    onClose: () => void;
}

export default function AssociateRaProfileDialogBody({ complianceProfileUuid, availableRaProfileUuids, visible, onClose }: Props) {
    const dispatch = useDispatch();

    const raProfiles = useSelector(raSelectors.raProfiles);

    const isFetchingRaProfiles = useSelector(raSelectors.isFetchingList);

    const isBusy = useMemo(() => isFetchingRaProfiles, [isFetchingRaProfiles]);

    useEffect(
        () => {
            if (!visible) return;

            dispatch(raActions.listRaProfiles());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visible],
    );

    const optionsForRaProfiles = useMemo(
        () =>
            raProfiles
                .filter((e) => !availableRaProfileUuids?.includes(e.uuid))
                .map((raProfile) => ({
                    value: raProfile,
                    label: raProfile.name,
                })),
        [raProfiles, availableRaProfileUuids],
    );

    const onSubmit = useCallback(
        (values: any) => {
            if (!complianceProfileUuid) return;

            dispatch(
                actions.associateRaProfile({
                    uuid: complianceProfileUuid,
                    raProfileUuids: [
                        {
                            uuid: values.raProfiles.value.uuid,
                            name: values.raProfiles.value.name,
                            enabled: values.raProfiles.value.enabled,
                            authorityInstanceUuid: values.raProfiles.value.authorityInstanceUuid,
                        },
                    ],
                }),
            );

            onClose();
        },
        [dispatch, onClose, complianceProfileUuid],
    );

    if (!complianceProfileUuid) return <></>;

    return (
        <>
            <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit, pristine, submitting, valid }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="raProfiles" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="raProfiles">Select RA profile</Label>

                                    <Select
                                        {...input}
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForRaProfiles}
                                        placeholder="Select RA profile to be associated"
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        Required Field
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        <div style={{ textAlign: 'right' }}>
                            <ButtonGroup>
                                <Button type="submit" color="primary" disabled={pristine || submitting || !valid} onClick={handleSubmit}>
                                    Associate
                                </Button>

                                <Button type="button" color="secondary" disabled={submitting} onClick={onClose}>
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
