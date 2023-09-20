import BooleanBadge from "../../src/components/BooleanBadge/BooleanBadge.tsx";
import "../../src/resources/styles/theme.scss";

describe("Boolean badge component with true value", () => {
    it("should render 'Yes' for true value", () => {
        cy.mount(<BooleanBadge value={true} />);
        cy.get("span").should("have.text", "Yes");
        cy.wait(500);
    });
});

describe("Boolean badge component with true value", () => {
    it("should render 'No' for false value", () => {
        cy.mount(<BooleanBadge value={false} />);
        cy.get("span").should("have.text", "No");
    });
});
