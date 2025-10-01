import { useCallback, useEffect, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Label } from 'reactstrap';

import { mutators } from 'utils/attributes/attributeEditorMutators';

import { validateRequired } from 'utils/validators';

import Spinner from 'components/Spinner';

import { actions, selectors } from 'ducks/compliance-profiles';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { Resource } from 'types/openapi/models/Resource';

interface Props {
    raProfile?: RaProfileResponseModel;
    availableComplianceProfileUuids?: string[];
    visible: boolean;
    onClose: () => void;
}

export default function AssociateComplianceProfileDialogBody({ raProfile, availableComplianceProfileUuids, visible, onClose }: Props) {
    const dispatch = useDispatch();

    const complianceProfiles = useSelector(selectors.complianceProfiles);

    const isFetchingComplianceProfiles = useSelector(selectors.isFetchingList);

    const isBusy = useMemo(() => isFetchingComplianceProfiles, [isFetchingComplianceProfiles]);

    useEffect(
        () => {
            if (!visible) return;

            dispatch(actions.getListComplianceProfiles());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visible],
    );

    const optionsForComplianceProfiles = useMemo(
        () =>
            complianceProfiles
                .filter((e) => !availableComplianceProfileUuids?.includes(e.uuid))
                .map((raProfile) => ({
                    value: raProfile,
                    label: raProfile.name,
                })),
        [complianceProfiles, availableComplianceProfileUuids],
    );

    const onSubmit = useCallback(
        (values: any) => {
            if (!raProfile) return;

            dispatch(
                actions.associateComplianceProfile({
                    uuid: values.complianceProfiles.value.uuid as string,
                    resource: Resource.RaProfiles,
                    associationObjectUuid: raProfile.uuid,
                    associationObjectName: raProfile.name,
                }),
            );

            onClose();
        },
        [dispatch, onClose, raProfile],
    );

    if (!raProfile) return <></>;

    return (
        <>
            <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit, pristine, submitting, valid }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="complianceProfiles" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="complianceProfile">Select Compliance profile</Label>

                                    <Select
                                        {...input}
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForComplianceProfiles}
                                        placeholder="Select Compliance profile to be associated"
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
