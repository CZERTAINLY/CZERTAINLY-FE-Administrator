import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";
import { actions as widgetLockActions } from "ducks/widget-locks";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { ErrorMessageObjectModel, LockTypeEnum, LockWidgetNameEnum } from "types/widget-locks";
import "../../src/resources/styles/theme.scss";

const TestWidget = () => {
    const [isBusy, setIsBusy] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isBusy) {
            const err: ErrorMessageObjectModel = {
                lockText: "Test lock",
                lockType: LockTypeEnum.CLIENT,
                lockTitle: "Test lock title",
                lockDetails: "Test lock details",
            };
            dispatch(widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ConnectorDetails));
        } else {
            dispatch(widgetLockActions.removeWidgetLock(LockWidgetNameEnum.ConnectorDetails));
        }
    }, [isBusy]);

    const buttons: WidgetButtonProps[] = [
        {
            icon: "pencil",
            disabled: true,
            tooltip: "Edit",
            onClick: () => {},
        },
        {
            icon: "plus",
            disabled: true,
            tooltip: "Create",
            onClick: () => {},
        },
        {
            icon: "times",
            disabled: true,
            tooltip: "Disable",
            onClick: () => {},
        },
        {
            icon: "trash",
            disabled: true,
            tooltip: "Delete",
            onClick: () => {},
        },
    ];

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };

    return (
        <Widget widgetButtons={buttons} refreshAction={refreshAction} busy={isBusy} widgetLockName={LockWidgetNameEnum.ConnectorDetails}>
            <div className="m-3">
                <h5>Test Widget</h5>
            </div>
        </Widget>
    );
};

describe("Test Widget Component", () => {
    it("should render Widget Component with buttons and refresh action", () => {
        cy.mount(<TestWidget />);
        cy.wait(1500);
        cy.get(".fa-refresh").click();
        cy.wait(500);
        cy.get("h5").should("contain", "Test Widget");
    });
});
