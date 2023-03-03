import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions, selectors } from "ducks/settings";
import React, { useCallback, useEffect, useMemo } from "react";
import { Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Form as BootstrapForm } from "reactstrap";
import { AttributeRequestModel } from "../../../../types/attributes";
import { mutators } from "../../../../utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "../../../../utils/attributes/attributes";
import AttributeEditor from "../../../Attributes/AttributeEditor";
import TabLayout from "../../../Layout/TabLayout";

interface FormValues {
}

export default function SettingsForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const settings = useSelector(selectors.settings);
    const isFetching = useSelector(selectors.isFetching);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = useMemo(
        () => isFetching || isUpdating,
        [isFetching, isUpdating],
    );

    const onSubmit = useCallback(
        (values: FormValues) => {
            const result: { [key: string]: Array<AttributeRequestModel> } = {};

            settings?.forEach(section => {
                const attributeDescriptors = section.attributeDefinitions;
                result[section.section] = collectFormAttributes(`configuration__${section.section}`, attributeDescriptors, values);
            });

            dispatch(actions.updateSettings(result));
        }, [dispatch, settings],
    );

    useEffect(
        () => {
            if (!settings) {
                dispatch(actions.getSettings());
            }
        }, [dispatch, settings],
    );

    return (
        <Widget title="Configuration" busy={isBusy}>

            <Form<FormValues> mutators={{...mutators<FormValues>()}} onSubmit={onSubmit}>
                {({handleSubmit, pristine, submitting, values, valid, form}) => {
                    return (
                        <BootstrapForm onSubmit={handleSubmit}>

                            <TabLayout tabs={settings?.map((section) => ({
                                title: section.name,
                                content: <div key={section.uuid}>
                                    <div style={{paddingTop: "2em", paddingBottom: "1.5em"}}>{section.description}</div>
                                    <AttributeEditor id={`configuration__${section.section}`}
                                                     attributeDescriptors={section.attributeDefinitions}
                                                     attributes={section.attributes}/>
                                </div>,
                            })) ?? []
                            }/>

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={"Save"}
                                        inProgressTitle={"Saving..."}
                                        inProgress={submitting}
                                        disabled={submitting || !valid}
                                    />
                                    <Button color="default" onClick={() => navigate(-1)} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>

                        </BootstrapForm>
                    )
                }}
            </Form>
        </Widget>
    );
}