import Dialog from 'components/Dialog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ComplianceProfileDtoV2, PlatformEnum, Resource, ResourceObjectDto } from 'types/openapi';
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Label } from 'reactstrap';
import { Field, Form } from 'react-final-form';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { validateRequired } from 'utils/validators';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as resourceActions, selectors as resourceSelectors } from 'ducks/resource';
import { actions as raActions, selectors as raSelectors } from 'ducks/ra-profiles';
import { actions as tokenProfileActions, selectors as tokenProfileSelectors } from 'ducks/token-profiles';
import { actions } from 'ducks/compliance-profiles';
import { makeOptions } from 'utils/compliance-profile';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    profile: ComplianceProfileDtoV2 | undefined;
    associationsOfComplianceProfile: ResourceObjectDto[];
};

export default function ProfileAssociationsDialog({ isOpen, onClose, profile, associationsOfComplianceProfile }: Props) {
    const dispatch = useDispatch();

    const resourcesList = useSelector(resourceSelectors.resourcesWithComplianceProfiles);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const raProfiles = useSelector(raSelectors.raProfiles);
    const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);

    const [selectedResourse, setSelectedResourse] = useState<Resource | null>(null);

    const optionsForResources = useMemo(
        () =>
            resourcesList.map((resource) => ({
                value: resource.resource,
                label: getEnumLabel(resourceEnum, resource.resource),
            })),
        [resourcesList, resourceEnum],
    );

    useEffect(
        () => {
            if (!isOpen) return;
            dispatch(resourceActions.listResources());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isOpen],
    );

    useEffect(() => {
        if (selectedResourse === 'raProfiles') {
            dispatch(raActions.listRaProfiles());
        } else if (selectedResourse === 'tokenProfiles') {
            dispatch(tokenProfileActions.listTokenProfiles({ enabled: undefined }));
        }
    }, [dispatch, selectedResourse]);

    const onCancel = useCallback(() => {
        setSelectedResourse(null);
        onClose();
    }, [onClose]);

    const onSubmit = useCallback(
        (values: any) => {
            if (!profile || !selectedResourse) return;
            console.log(values);
            dispatch(
                actions.associateComplianceProfile({
                    uuid: profile.uuid,
                    resource: values.resource,
                    associationObjectUuid: values[selectedResourse].value.uuid,
                    associationObjectName: values[selectedResourse].value.name,
                }),
            );
            onCancel();
        },
        [dispatch, profile, selectedResourse, onCancel],
    );

    const optionsForRaProfiles = useMemo(() => {
        return makeOptions(raProfiles, associationsOfComplianceProfile);
    }, [associationsOfComplianceProfile, raProfiles]);

    const optionsForTokenProfiles = useMemo(() => {
        return makeOptions(tokenProfiles, associationsOfComplianceProfile);
    }, [associationsOfComplianceProfile, tokenProfiles]);

    const dialogBody = useMemo(
        () => (
            <>
                <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                    {({ handleSubmit, pristine, submitting, valid }) => (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <Field name="resource" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="resource-select">Select the resource of association </Label>

                                        <Select
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForResources}
                                            value={
                                                selectedResourse
                                                    ? { value: selectedResourse, label: getEnumLabel(resourceEnum, selectedResourse) }
                                                    : null
                                            }
                                            onChange={(event) => {
                                                setSelectedResourse(event?.value ?? null);
                                                input.onChange(event?.value ?? null);
                                            }}
                                            placeholder="Select the resource to be associated"
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
                            {selectedResourse && (
                                <Field name={selectedResourse} validate={validateRequired()}>
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <>
                                                <Label for="resource-profiles-select">
                                                    Select {getEnumLabel(resourceEnum, selectedResourse)}
                                                </Label>

                                                <Select
                                                    {...input}
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={
                                                        selectedResourse === 'raProfiles' ? optionsForRaProfiles : optionsForTokenProfiles
                                                    }
                                                    placeholder={`Select ${getEnumLabel(resourceEnum, selectedResourse)} to be associated`}
                                                    styles={{
                                                        control: (provided) =>
                                                            meta.touched && meta.invalid
                                                                ? {
                                                                      ...provided,
                                                                      border: 'solid 1px red',
                                                                      '&:hover': { border: 'solid 1px red' },
                                                                  }
                                                                : { ...provided },
                                                    }}
                                                />

                                                <div
                                                    className="invalid-feedback"
                                                    style={meta.touched && meta.invalid ? { display: 'block' } : {}}
                                                >
                                                    Required Field
                                                </div>
                                            </>
                                        </FormGroup>
                                    )}
                                </Field>
                            )}

                            <div style={{ textAlign: 'right' }}>
                                <ButtonGroup>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        disabled={pristine || submitting || !valid}
                                        onClick={handleSubmit}
                                    >
                                        Associate
                                    </Button>

                                    <Button type="button" color="secondary" disabled={submitting} onClick={onCancel}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </BootstrapForm>
                    )}
                </Form>
            </>
        ),
        [onSubmit, selectedResourse, onCancel, optionsForResources, resourceEnum, optionsForRaProfiles, optionsForTokenProfiles],
    );

    return <Dialog isOpen={isOpen} caption="Associate Profile" body={dialogBody} toggle={onCancel} buttons={[]} />;
}
