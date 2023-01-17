import CheckboxField from "components/Input/CheckboxField";
import DynamicContent from "components/Input/DynamicContent";
import TextField from "components/Input/TextField";
import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions, selectors } from "ducks/customAttributes";
import React, { useCallback, useEffect, useMemo } from "react";

import { Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ButtonGroup, Form as BootstrapForm } from "reactstrap";
import { CustomAttributeCreateRequestModel, CustomAttributeUpdateRequestModel } from "types/customAttributes";
import { AttributeContentType } from "types/openapi";
import { validateAlphaNumeric, validateRequired } from "utils/validators";

export default function CustomAttributeForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {id} = useParams();
    const editMode = useMemo(() => !!id, [id]);

    const customAttributeDetail = useSelector(selectors.customAttribute);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isCreating = useSelector(selectors.isCreating);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = useMemo(
        () => isFetchingDetail || isCreating || isUpdating,
        [isCreating, isFetchingDetail, isUpdating],
    );

    const defaultValuesCreate: CustomAttributeCreateRequestModel = useMemo(
        () => ({
            name: "",
            label: "",
            description: "",
            contentType: AttributeContentType.Text,
            list: false,
            multiSelect: false,
            visible: true,
            required: false,
            readOnly: false,
            content: undefined,
        }),
        [],
    );
    const defaultValuesUpdate: CustomAttributeUpdateRequestModel = useMemo(
        () => (customAttributeDetail ? {...customAttributeDetail} : defaultValuesCreate),
        [customAttributeDetail, defaultValuesCreate],
    );

    const onSubmitCreate = useCallback((values: CustomAttributeCreateRequestModel) => dispatch(actions.createCustomAttribute(values)), [dispatch]);
    const onSubmitUpdate = useCallback(
        (values: CustomAttributeUpdateRequestModel) => dispatch(actions.updateCustomAttribute({
            uuid: id!,
            customAttributeUpdateRequest: values,
        })),
        [dispatch, id],
    );

    useEffect(() => {
        if (editMode && id !== customAttributeDetail?.uuid) {
            dispatch(actions.getCustomAttribute(id!));
        }
    }, [dispatch, editMode, id, customAttributeDetail?.uuid]);

    return (
        <Widget title={editMode ? "Edit Custom Attribute" : "Add Custom Attribute"} busy={isBusy}>
            <Form initialValues={editMode ? defaultValuesUpdate : defaultValuesCreate}
                  onSubmit={editMode ? onSubmitUpdate : onSubmitCreate}>
                {({handleSubmit, pristine, submitting, valid, values, form}) => (
                    <BootstrapForm onSubmit={handleSubmit}>

                        <TextField label={"Name"} id={"name"} disabled={editMode} validators={[validateRequired(), validateAlphaNumeric()]}/>
                        <TextField label={"Label"} id={"label"} validators={[validateRequired(), validateAlphaNumeric()]}/>
                        <TextField label={"Description"} id={"description"} validators={[validateRequired(), validateAlphaNumeric()]}/>
                        <TextField label={"Group"} id={"group"} validators={[validateAlphaNumeric()]}/>

                        <CheckboxField label={"Visible"} id={"visible"} />
                        <CheckboxField label={"Required"} id={"required"} />
                        <CheckboxField label={"Read Only"} id={"readOnly"} />
                        <CheckboxField label={"List"} id={"list"} onChange={(value) => !value ? form.change("multiSelect", false) : false}/>
                        <CheckboxField label={"Multi Select"} id={"multiSelect"} disabled={!values["list"]}/>

                        <DynamicContent editable={!editMode} isList={!!values["list"]}/>

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