import Widget from 'components/Widget';
import { actions, selectors } from 'ducks/oids';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
    CustomOidEntryRequestDto,
    CustomOidEntryUpdateRequestDto,
    CustomOidEntryUpdateRequestDtoAdditionalProperties,
    OidCategory,
    PlatformEnum,
} from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { Field, Form } from 'react-final-form';
import { validateLength, composeValidators, validateRequired } from 'utils/validators';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';
import ProgressButton from 'components/ProgressButton';
import { selectors as enumSelectors } from 'ducks/enums';
import MultipleValueTextInput from 'components/Input/MultipleValueTextInput';

interface FormValues {
    oid: string | undefined;
    displayName: string | undefined;
    description?: string | undefined;
    category: { value: string; label: string } | undefined;
    code?: string;
    alternativeCode?: string[];
}

export default function CustomOIDForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const oidSelector = useSelector(selectors.oid);
    const isFetching = useSelector(selectors.isFetching);
    const isCreating = useSelector(selectors.isCreating);
    const isUpdating = useSelector(selectors.isUpdating);

    const [oid, setOid] = useState<CustomOidEntryRequestDto>();

    useEffect(() => {
        if (editMode && id) {
            dispatch(actions.getOID({ oid: id }));
        }
    }, [dispatch, editMode, id]);

    useEffect(() => {
        if (editMode && oidSelector?.oid === id) {
            setOid(oidSelector);
        }
    }, [dispatch, editMode, id, oidSelector]);

    const isBusy = useMemo(() => isFetching || isCreating || isUpdating, [isFetching, isCreating, isUpdating]);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const title = useMemo(() => (editMode ? 'Edit Custom OID' : 'Create Custom OID'), [editMode]);

    const oidCategoryEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.OidCategory));

    const [categoryList, setCategoryList] = useState<{ label: string; value: OidCategory }[]>([]);

    useEffect(() => {
        if (oidCategoryEnum)
            setCategoryList(
                Object.values(oidCategoryEnum)?.map(({ code, label }) => ({
                    label,
                    value: code as OidCategory,
                })),
            );
    }, [oidCategoryEnum]);

    const defaultValues: FormValues = useMemo(() => {
        const categoryOption = oid?.category ? categoryList.find((c) => c.value === oid.category) : undefined;

        return {
            oid: editMode ? oid?.oid : undefined,
            displayName: editMode ? oid?.displayName : undefined,
            description: editMode ? oid?.description : undefined,
            category: editMode ? categoryOption : undefined,
            code: editMode ? oid?.additionalProperties?.code : undefined,
            alternativeCode: editMode ? oid?.additionalProperties?.altCodes : undefined,
        };
    }, [oid, editMode, categoryList]);

    const onSubmit = useCallback(
        (values: FormValues, form: any) => {
            const newOID = {
                oid: values.oid!,
                displayName: values.displayName!,
                description: values.description,
                category: values.category?.value as OidCategory,
                ...(values.category?.value === OidCategory.RdnAttributeType && {
                    additionalProperties: {
                        code: values.code,
                        altCodes: values.alternativeCode ? values.alternativeCode : undefined,
                    } as CustomOidEntryUpdateRequestDtoAdditionalProperties,
                }),
            };
            if (editMode) {
                dispatch(actions.updateOID({ oid: id!, data: newOID as CustomOidEntryUpdateRequestDto }));
            } else {
                dispatch(
                    actions.createOID({
                        oid: newOID,
                    }),
                );
            }
        },
        [dispatch, editMode, id],
    );

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="oid" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="oid">OID*</Label>
                                    <Input
                                        disabled={editMode}
                                        required
                                        id="oid"
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the OID"
                                    />
                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="displayName" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="displayName">Display Name*</Label>
                                    <Input
                                        id="displayName"
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Display name"
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="description" validate={composeValidators(validateLength(0, 300))}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Description</Label>
                                    <Input
                                        id="description"
                                        {...input}
                                        type="textarea"
                                        className="form-control"
                                        placeholder="Enter Description / Comment"
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="category" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="category">Select Category*</Label>
                                    <Select
                                        isDisabled={editMode}
                                        required
                                        {...input}
                                        id="category"
                                        inputId="categorySelect"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={categoryList}
                                        onChange={(event) => {
                                            input.onChange(event);
                                        }}
                                        placeholder="Select Category"
                                        styles={{
                                            control: (provided) =>
                                                meta.touched && meta.invalid
                                                    ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                    : { ...provided },
                                        }}
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        {values.category?.value === OidCategory.RdnAttributeType && (
                            <>
                                <Field name="code" validate={validateRequired()}>
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <Label for="code">OID code</Label>
                                            <Input id="code" {...input} type="text" placeholder="Enter OID code" />
                                        </FormGroup>
                                    )}
                                </Field>
                                <Field name="alternativeCode">
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <Label for="alternativeCode">Alternative Code</Label>
                                            <MultipleValueTextInput
                                                id="alternativeCode"
                                                value={values.alternativeCode}
                                                onChange={(values) => {
                                                    input.onChange(values);
                                                }}
                                            />
                                        </FormGroup>
                                    )}
                                </Field>
                            </>
                        )}
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
