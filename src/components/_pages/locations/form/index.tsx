import AttributeEditor from 'components/Attributes/AttributeEditor';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as entityActions, selectors as entitySelectors } from 'ducks/entities';

import { actions as locationActions, selectors as locationSelectors } from 'ducks/locations';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { LocationResponseModel } from 'types/locations';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { EntityType } from 'ducks/filters';
import { composeValidators, validateAlphaNumericWithSpecialChars, validateLength, validateRequired } from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { selectors as pagingSelectors } from '../../../../ducks/paging';
import { Resource } from '../../../../types/openapi';
import TabLayout from '../../../Layout/TabLayout';

interface FormValues {
    name: string | undefined;
    description: string | undefined;
    entity: { value: string; label: string } | undefined;
}

export default function LocationForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { entityId, id } = useParams();

    const editMode = useMemo(() => (id && entityId ? true : false), [entityId, id]);

    const entities = useSelector(entitySelectors.entities);
    const locationAttributeDescriptors = useSelector(entitySelectors.locationAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    const locationSelector = useSelector(locationSelectors.location);

    const isFetchingLocationDetail = useSelector(locationSelectors.isFetchingDetail);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const isCreating = useSelector(locationSelectors.isCreating);
    const isUpdating = useSelector(locationSelectors.isUpdating);

    const isFetchingLocationAttributeDescriptors = useSelector(entitySelectors.isFetchingLocationAttributeDescriptors);
    const isFetchingEntities = useSelector(pagingSelectors.isFetchingList(EntityType.ENTITY));

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [init, setInit] = useState(true);

    const [location, setLocation] = useState<LocationResponseModel>();

    const isBusy = useMemo(
        () =>
            isFetchingLocationDetail ||
            isCreating ||
            isUpdating ||
            isFetchingEntities ||
            isFetchingLocationAttributeDescriptors ||
            isFetchingResourceCustomAttributes,
        [
            isFetchingLocationDetail,
            isCreating,
            isUpdating,
            isFetchingEntities,
            isFetchingLocationAttributeDescriptors,
            isFetchingResourceCustomAttributes,
        ],
    );

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Locations));

        if (init) {
            dispatch(locationActions.resetState());
            dispatch(entityActions.resetState());
            dispatch(entityActions.listEntities({}));
            setInit(false);
        }
    }, [dispatch, init]);

    useEffect(() => {
        if (editMode && id && entityId) {
            dispatch(locationActions.getLocationDetail({ entityUuid: entityId, uuid: id }));
        }
    }, [dispatch, editMode, entityId, id]);

    useEffect(() => {
        if (editMode && locationSelector?.uuid === id) {
            setLocation(locationSelector);
        }
    }, [locationSelector, editMode, id]);

    useEffect(() => {
        if (editMode && location?.uuid === id && entities && entities.length > 0) {
            dispatch(entityActions.listLocationAttributeDescriptors({ entityUuid: location!.entityInstanceUuid }));
        }
    }, [dispatch, editMode, location, id, entities]);

    const onEntityChange = useCallback(
        (event: { value: string }) => {
            if (!event.value) return;
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            dispatch(entityActions.listLocationAttributeDescriptors({ entityUuid: event.value }));
        },
        [dispatch],
    );

    const onSubmit = useCallback(
        (values: FormValues, form: any) => {
            if (editMode) {
                dispatch(
                    locationActions.editLocation({
                        uuid: id!,
                        entityUuid: values.entity!.value,
                        editLocationRequest: {
                            description: values.description || '',
                            enabled: location!.enabled,
                            attributes: collectFormAttributes(
                                'location',
                                [...(locationAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                                values,
                            ),
                            customAttributes: collectFormAttributes('customLocation', resourceCustomAttributes, values),
                        },
                    }),
                );
            } else {
                dispatch(
                    locationActions.addLocation({
                        entityUuid: values.entity!.value,
                        addLocationRequest: {
                            name: values.name!,
                            description: values.description || '',
                            enabled: true,
                            attributes: collectFormAttributes(
                                'location',
                                [...(locationAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                                values,
                            ),
                            customAttributes: collectFormAttributes('customLocation', resourceCustomAttributes, values),
                        },
                    }),
                );
            }
        },
        [dispatch, editMode, location, locationAttributeDescriptors, id, groupAttributesCallbackAttributes, resourceCustomAttributes],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const optionsForEntities = useMemo(
        () =>
            entities?.map((entity) => ({
                label: entity.name,
                value: entity.uuid,
            })),
        [entities],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? location?.name || undefined : undefined,
            description: editMode ? location?.description || undefined : undefined,
            entity: editMode
                ? location
                    ? { value: location.entityInstanceUuid, label: location.entityInstanceName }
                    : undefined
                : undefined,
        }),
        [editMode, location],
    );

    const title = useMemo(() => (editMode ? `Edit Location: ${location?.name}` : 'Add Location'), [editMode, location]);

    const renderCustomAttributesEditor = useMemo(() => {
        if (isBusy) return <></>;
        return (
            <AttributeEditor id="customLocation" attributeDescriptors={resourceCustomAttributes} attributes={location?.customAttributes} />
        );
    }, [isBusy, location, resourceCustomAttributes]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Location Name</Label>

                                    <Input
                                        id="name"
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Location Name"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Location Description</Label>

                                    <Input
                                        {...input}
                                        id="description"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the location description"
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="entity" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="entitySelect">Entity</Label>

                                    <Select
                                        {...input}
                                        inputId="entitySelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForEntities}
                                        placeholder="Select Entity"
                                        onChange={(event) => {
                                            onEntityChange(event);
                                            form.mutators.clearAttributes('location');
                                            form.mutators.setAttribute('storeKind', undefined);
                                            input.onChange(event);
                                        }}
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                        {meta.error}
                                    </div>
                                </FormGroup>
                            )}
                        </Field>

                        <>
                            <br />

                            <TabLayout
                                tabs={[
                                    {
                                        title: 'Connector Attributes',
                                        content:
                                            values.entity && locationAttributeDescriptors && locationAttributeDescriptors.length > 0 ? (
                                                <AttributeEditor
                                                    id="location"
                                                    callbackParentUuid={
                                                        location?.entityInstanceUuid ?? form.getFieldState('entity')?.value?.value
                                                    }
                                                    callbackResource={Resource.Locations}
                                                    attributeDescriptors={locationAttributeDescriptors}
                                                    attributes={location?.attributes}
                                                    groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                                    setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                                />
                                            ) : (
                                                <></>
                                            ),
                                    },
                                    {
                                        title: 'Custom Attributes',
                                        content: renderCustomAttributesEditor,
                                    },
                                ]}
                            />
                        </>

                        {
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={submitTitle}
                                        inProgressTitle={inProgressTitle}
                                        inProgress={submitting}
                                        disabled={(editMode ? pristine : false) || !valid}
                                    />

                                    <Button color="default" onClick={onCancel} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        }
                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
}
