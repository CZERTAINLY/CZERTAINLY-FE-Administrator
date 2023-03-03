import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/settings";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Container } from "reactstrap";
import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from "../../../Attributes/AttributeViewer";
import TabLayout from "../../../Layout/TabLayout";

export default function SettingsDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const settings = useSelector(selectors.settings);
    const isFetching = useSelector(selectors.isFetching);

    useEffect(
        () => {
            if (!settings) {
                dispatch(actions.getSettings());
            }
        },
        [dispatch, settings],
    );

    const onEditClick = useCallback(
        () => {
            navigate(`./edit`);
        },
        [navigate],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => {
                    onEditClick();
                },
            },
        ],
        [onEditClick],
    );

    const detailsTitle = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons}/>
                </div>
                <h5>
                    Configuration
                </h5>
            </div>
        ), [buttons],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={detailsTitle} busy={isFetching}>
                <TabLayout tabs={
                    settings?.map((section) => ({
                        title: section.name,
                        content: <div key={section.uuid}>
                            <div style={{paddingTop: "2em", paddingBottom: "1.5em"}}>{section.description}</div>
                            <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTES_WITH_DESCRIPTORS}
                                             descriptors={section.attributeDefinitions}
                                             attributes={section.attributes}/></div>,
                    })) ?? []
                }/>
            </Widget>
        </Container>
    );
}

