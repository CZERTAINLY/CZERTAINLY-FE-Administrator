import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ErrorMessageObjectModel, LockTypeEnum, LockWidgetNameEnum } from "types/widget-locks";
import { actions as widgetLockActions } from "../../src/ducks/widget-locks";
import "../../src/resources/styles/theme.scss";
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

const TestWidget = () => {
    const [isBusy, setIsBusy] = useState(false);

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };
    return (
        <Widget widgetButtons={buttons} refreshAction={refreshAction} busy={isBusy} title="Test Widget">
            <div className="p-4">
                <h5 className="text-center">Widget Content</h5>
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

const TestWidgetLockedGeneric = () => {
    const [isBusy, setIsBusy] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isBusy) {
            const err: ErrorMessageObjectModel = {
                lockText: "Test lock generic error",
                lockType: LockTypeEnum.GENERIC,
                lockTitle: "Test lock error",
                lockDetails: "Test lock details error",
            };
            dispatch(widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ConnectorDetails));
        }
    }, [isBusy]);

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };

    return (
        <Widget
            widgetButtons={buttons}
            refreshAction={refreshAction}
            busy={isBusy}
            widgetLockName={LockWidgetNameEnum.ConnectorDetails}
            title="Test Widget"
        >
            <div className="p-4">
                <h5 className="text-center">Test Widget Lock</h5>
            </div>
        </Widget>
    );
};

describe("Test Widget Component with generic lock", () => {
    it("should render Widget Component with buttons and refresh action", () => {
        cy.mount(<TestWidgetLockedGeneric />);
        cy.wait(1500);
        cy.get("h5").should("contain", "Test Widget");
        cy.get(".fa-refresh").click();
        cy.wait(2000);
        cy.get("h5").should("contain", "Test lock error");
        cy.get(".fa-triangle-exclamation").should("exist");
    });
});

const TestWidgetLockedClient = () => {
    const [isBusy, setIsBusy] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isBusy) {
            const err: ErrorMessageObjectModel = {
                lockText: "Test lock client error",
                lockType: LockTypeEnum.CLIENT,
                lockTitle: "Test lock client error",
                lockDetails: "Test lock details client error",
            };
            dispatch(widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ConnectorDetails));
        }
    }, [isBusy]);

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };

    return (
        <Widget
            widgetButtons={buttons}
            refreshAction={refreshAction}
            busy={isBusy}
            widgetLockName={LockWidgetNameEnum.ConnectorDetails}
            title="Test Widget"
        >
            <div className="p-4">
                <h5 className="text-center">Test Widget Lock</h5>
            </div>
        </Widget>
    );
};

describe("Test Widget Component with client lock", () => {
    it("should render Widget Component with buttons and refresh action", () => {
        cy.mount(<TestWidgetLockedClient />);
        cy.wait(1500);
        cy.get("h5").should("contain", "Test Widget");
        cy.get(".fa-refresh").click();
        cy.wait(2000);
        cy.get("h5").should("contain", "Test lock client error");
        cy.get(".fa-house-laptop").should("exist");
    });
});

const TestWidgetLockedPermission = () => {
    const [isBusy, setIsBusy] = useState(false);

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };

    return (
        <Widget
            refreshAction={refreshAction}
            widgetButtons={buttons}
            busy={isBusy}
            widgetLockName={LockWidgetNameEnum.ConnectorDetails}
            title="Test Widget"
        >
            <div className="m-3">
                <div className="p-4">
                    <h5>Test Widget Lock</h5>
                </div>
            </div>
        </Widget>
    );
};

describe("Test Widget Component with permission lock", () => {
    it("should render Widget Component with buttons and refresh action", () => {
        cy.mount(<TestWidgetLockedPermission />);
        cy.wait(1500);
        cy.get("h5").should("contain", "Test Widget");
        cy.get(".fa-refresh").click();
        cy.wait(2000);
        cy.get("h5").should("contain", "Test Widget Lock");
        cy.get(".fa-lock").should("not.exist");
    });
});

const TestWidgetLockedService = () => {
    const [isBusy, setIsBusy] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        const err: ErrorMessageObjectModel = {
            lockText: "Test lock service error",
            lockType: LockTypeEnum.SERVICE_ERROR,
            lockTitle: "Test lock service error",
            lockDetails: "Test lock details service error",
        };
        dispatch(widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ConnectorDetails));
    }, [isBusy]);

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };

    return (
        <Widget
            widgetButtons={buttons}
            refreshAction={refreshAction}
            busy={isBusy}
            widgetLockName={LockWidgetNameEnum.ConnectorDetails}
            title="Test Widget"
        >
            <div className="m-3">
                <div className="p-4">
                    <h5>Test Widget Lock</h5>
                </div>
            </div>
        </Widget>
    );
};

describe("Test Widget Component with service lock", () => {
    it("should render Widget Component with buttons and refresh action", () => {
        cy.mount(<TestWidgetLockedService />);
        cy.wait(1500);
        cy.get("h5").should("contain", "Test Widget");
        cy.get(".fa-refresh").click();
        cy.wait(2000);
        cy.get("h5").should("contain", "Test lock service error");
        cy.get(".fa-database").should("exist");
    });
});

const TestWidgetLockedServer = () => {
    const [isBusy, setIsBusy] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const err: ErrorMessageObjectModel = {
            lockText: "Test lock server error",
            lockType: LockTypeEnum.SERVER_ERROR,
            lockTitle: "Test lock server error",
            lockDetails: "Test lock details server error",
        };
        dispatch(widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ConnectorDetails));
    }, [isBusy]);

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };

    return (
        <Widget
            widgetButtons={buttons}
            refreshAction={refreshAction}
            busy={isBusy}
            widgetLockName={LockWidgetNameEnum.ConnectorDetails}
            title="Test Widget"
        >
            <div className="m-3">
                <div className="p-4">
                    <h5>Test Widget Lock</h5>
                </div>
            </div>
        </Widget>
    );
};

describe("Test Widget Component with server lock", () => {
    it("should render Widget Component with buttons and refresh action", () => {
        cy.mount(<TestWidgetLockedServer />);
        cy.wait(1500);
        cy.get("h5").should("contain", "Test Widget");
        cy.get(".fa-refresh").click();
        cy.wait(2000);
        cy.get("h5").should("contain", "Test lock server error");
        cy.get(".fa-server").should("exist");
    });
});

const TestWidgetLockedNetwork = () => {
    const [isBusy, setIsBusy] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const err: ErrorMessageObjectModel = {
            lockText: "Test lock network error",
            lockType: LockTypeEnum.NETWORK,
            lockTitle: "Test lock network error",
            lockDetails: "Test lock details network error",
        };
        dispatch(widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ConnectorDetails));
    }, [isBusy]);

    const refreshAction = () => {
        setIsBusy(true);
        setTimeout(() => {
            setIsBusy(false);
        }, 1000);
    };

    return (
        <Widget
            widgetButtons={buttons}
            refreshAction={refreshAction}
            busy={isBusy}
            widgetLockName={LockWidgetNameEnum.ConnectorDetails}
            title="Test Widget"
        >
            <div className="m-3">
                <div className="p-4">
                    <h5>Test Widget Lock</h5>
                </div>
            </div>
        </Widget>
    );
};

describe("Test Widget Component with network lock", () => {
    it("should render Widget Component with buttons and refresh action", () => {
        cy.mount(<TestWidgetLockedNetwork />);
        cy.wait(1500);
        cy.get("h5").should("contain", "Test Widget");
        cy.get(".fa-refresh").click();
        cy.wait(2000);
        cy.get("h5").should("contain", "Test lock network error");
        cy.get(".fa-wifi").should("exist");
    });
});
