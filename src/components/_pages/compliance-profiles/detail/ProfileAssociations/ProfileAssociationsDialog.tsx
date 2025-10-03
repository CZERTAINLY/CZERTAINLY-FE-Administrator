import Dialog from 'components/Dialog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ComplianceProfileDtoV2, PlatformEnum, Resource, ResourceObjectDto } from 'types/openapi';
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Label } from 'reactstrap';
import { Field, Form } from 'react-final-form';
import Select, { components, MenuProps, ControlProps } from 'react-select';
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

    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

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
        if (selectedResource === 'raProfiles') {
            dispatch(raActions.listRaProfiles());
        } else if (selectedResource === 'tokenProfiles') {
            dispatch(tokenProfileActions.listTokenProfiles({ enabled: undefined }));
        }
    }, [dispatch, selectedResource]);

    const onCancel = useCallback(() => {
        setSelectedResource(null);
        onClose();
    }, [onClose]);

    const onSubmit = useCallback(
        (values: any) => {
            if (!profile || !selectedResource) return;
            dispatch(
                actions.associateComplianceProfile({
                    uuid: profile.uuid,
                    resource: values.resource,
                    associationObjectUuid: values[selectedResource].value.uuid,
                    associationObjectName: values[selectedResource].value.name,
                }),
            );
            onCancel();
        },
        [dispatch, profile, selectedResource, onCancel],
    );

    const optionsForRaProfiles = useMemo(() => {
        return makeOptions(raProfiles, associationsOfComplianceProfile);
    }, [associationsOfComplianceProfile, raProfiles]);

    const optionsForTokenProfiles = useMemo(() => {
        return makeOptions(tokenProfiles, associationsOfComplianceProfile);
    }, [associationsOfComplianceProfile, tokenProfiles]);

    type TestableMenuProps = MenuProps<any, false> & { 'data-testid'?: string };
    type TestableControlProps = ControlProps<any, false> & { 'data-testid'?: string };

    const TestableMenu = useCallback(
        (props: TestableMenuProps) => (
            <components.Menu {...props} innerProps={{ ...props.innerProps, 'data-testid': props['data-testid'] } as any} />
        ),
        [],
    );

    const TestableControl = useCallback(
        (props: TestableControlProps) => (
            <components.Control {...props} innerProps={{ ...props.innerProps, 'data-testid': props['data-testid'] } as any} />
        ),
        [],
    );

    const getControlStyles = (meta: any) => ({
        control: (provided: any) =>
            meta.touched && meta.invalid
                ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                : { ...provided },
    });

    const handleResourceChange =
        (setSelectedResource: (value: Resource | null) => void, input: any) => (event: { value?: Resource } | null) => {
            const value = event?.value ?? null;
            setSelectedResource(value);
            input.onChange(value);
        };

    const dialogBody = useMemo(
        () => (
            <div data-testid="add-profile-association-dialog">
                <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                    {({ handleSubmit, pristine, submitting, valid }) => (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <Field name="resource" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="resource-select">Select the resource of association </Label>

                                        <Select
                                            data-testid="resource-select"
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForResources}
                                            value={
                                                selectedResource
                                                    ? { value: selectedResource, label: getEnumLabel(resourceEnum, selectedResource) }
                                                    : null
                                            }
                                            onChange={handleResourceChange(setSelectedResource, input)}
                                            placeholder="Select the resource to be associated"
                                            styles={getControlStyles(meta)}
                                            components={{
                                                Menu: (props) => (
                                                    <TestableMenu {...props} data-testid="associate-profile-resource-select-menu" />
                                                ),
                                                Control: (props) => (
                                                    <TestableControl {...props} data-testid="associate-profile-resource-select-control" />
                                                ),
                                            }}
                                        />
                                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                            Required Field
                                        </div>
                                    </FormGroup>
                                )}
                            </Field>
                            {selectedResource && (
                                <Field name={selectedResource} validate={validateRequired()}>
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <>
                                                <Label for="resource-profiles-select">
                                                    Select {getEnumLabel(resourceEnum, selectedResource)}
                                                </Label>

                                                <Select
                                                    {...input}
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={
                                                        selectedResource === 'raProfiles' ? optionsForRaProfiles : optionsForTokenProfiles
                                                    }
                                                    placeholder={`Select ${getEnumLabel(resourceEnum, selectedResource)} to be associated`}
                                                    styles={getControlStyles(meta)}
                                                    components={{
                                                        Menu: (props) => (
                                                            <TestableMenu
                                                                {...props}
                                                                data-testid="associate-profile-resource-profiles-select-menu"
                                                            />
                                                        ),
                                                        Control: (props) => (
                                                            <TestableControl
                                                                {...props}
                                                                data-testid="associate-profile-resource-profiles-select-control"
                                                            />
                                                        ),
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
            </div>
        ),
        [
            onSubmit,
            selectedResource,
            onCancel,
            optionsForResources,
            resourceEnum,
            TestableMenu,
            TestableControl,
            optionsForRaProfiles,
            optionsForTokenProfiles,
        ],
    );

    return <Dialog isOpen={isOpen} caption="Associate Profile" body={dialogBody} toggle={onCancel} buttons={[]} />;
}
