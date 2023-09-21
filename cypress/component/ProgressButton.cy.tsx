import ProgressButton from "components/ProgressButton/index";
import { useState } from "react";
import "../../src/resources/styles/theme.scss";

const TestProgressButton = () => {
    const [inProgress, setInProgress] = useState(false);

    const toggleProgress = () => {
        console.log("toggleProgress");
        setInProgress(!inProgress);

        setTimeout(() => {
            setInProgress(false);
        }, 750);
    };

    return <ProgressButton inProgressTitle="Loading" title="Test Progress Button" inProgress={inProgress} onClick={toggleProgress} />;
};

describe("Progress Button component", () => {
    it("should render progress button with text 'Test Progress Button'", () => {
        cy.mount(<TestProgressButton />);
        cy.get("button").should("have.text", "Test Progress Button");
        cy.get("button").click();
    });
});
