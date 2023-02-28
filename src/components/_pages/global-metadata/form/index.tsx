import CheckboxField from "components/Input/CheckboxField";
import TextField from "components/Input/TextField";
import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions, selectors } from "ducks/globalMetadata";
import React, { useCallback, useEffect, useMemo } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { GlobalMetadataCreateRequestModel, GlobalMetadataUpdateRequestModel } from "types/globalMetadata";
import { AttributeContentType } from "types/openapi";
import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";

export default function GlobalMetadataForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {id} = useParams();
    const editMode = useMemo(() => !!id, [id]);

    const globalMetadataDetail = useSelector(selectors.globalMetadata);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isCreating = useSelector(selectors.isCreating);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = useMemo(
        () => isFetchingDetail || isCreating || isUpdating,
        [isCreating, isFetchingDetail, isUpdating],
    );

    const defaultValuesCreate: GlobalMetadataCreateRequestModel = useMemo(
        () => ({
            name: "",
            label: "",
            description: "",
            contentType: AttributeContentType.Text,
            group: "",
            visible: true,
        }),
        [],
    );
    const defaultValuesUpdate: GlobalMetadataUpdateRequestModel = useMemo(
        () => (globalMetadataDetail ? globalMetadataDetail : defaultValuesCreate),
        [globalMetadataDetail, defaultValuesCreate],
    );

    const onSubmit = useCallback(
        (values: GlobalMetadataCreateRequestModel) => editMode ? dispatch(actions.updateGlobalMetadata({
            uuid: id!,
            globalMetadataUpdateRequest: values,
        })) : dispatch(actions.createGlobalMetadata(values)),
        [dispatch, id, editMode],
    );

    useEffect(() => {
        if (editMode && id !== globalMetadataDetail?.uuid) {
            dispatch(actions.getGlobalMetadata(id!));
        }
    }, [dispatch, editMode, id, globalMetadataDetail?.uuid]);

    return (
        <Widget title={editMode ? "Edit Global Metadata" : "Add Global Metadata"} busy={isBusy}>
            <Form<GlobalMetadataCreateRequestModel> initialValues={editMode ? defaultValuesUpdate : defaultValuesCreate} onSubmit={onSubmit}>
                {({handleSubmit, pristine, submitting, valid, values, form}) => (
                    <BootstrapForm onSubmit={handleSubmit}>

                        <TextField label={"Name"} id={"name"} disabled={editMode} validators={[validateRequired(), validateAlphaNumeric()]}/>
                        <TextField label={"Label"} id={"label"} validators={[validateRequired(), validateAlphaNumeric()]}/>
                        <TextField label={"Description"} id={"description"} validators={[validateAlphaNumeric()]}/>

                        <Field name="contentType" validate={composeValidators(validateRequired())}>
                            {({input, meta}) => (
                                <FormGroup>
                                    <Label for="contentType">Content Type</Label>
                                    <Input
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="select"
                                        id="contentType"
                                        placeholder="Content Type"
                                        disabled={editMode}
                                    >
                                        {Object.values(AttributeContentType).map(contentType => (
                                            <option key={contentType} value={contentType}>
                                                {contentType}
                                            </option>
                                        ))}
                                    </Input>
                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <TextField label={"Group"} id={"group"} validators={[validateAlphaNumeric()]}/>

                        <CheckboxField label={"Visible"} id={"visible"}/>

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={editMode ? "Update" : "Create"}
                                    inProgressTitle={editMode ? "Updating..." : "Creating..."}
                                    inProgress={submitting}
                                    disabled={pristine || submitting || !valid}
                                />
                                <Button color="default" onClick={() => navigate(-1)} disabled={submitting}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>

                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
}