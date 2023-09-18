import BooleanBadge from "../../src/components/BooleanBadge/BooleanBadge.tsx";
import "../../src/resources/styles/theme.scss";

describe("Boolean badge component", () => {
    it("should render 'Yes' for true value", () => {
        cy.mount(<BooleanBadge value={true} />);
        cy.get("span").should("have.text", "Yes");
        cy.wait(500);
    });
});

describe("BooleanBadge.cy.jsx", () => {
    it("should render 'No' for false value", () => {
        cy.mount(<BooleanBadge value={false} />);
        cy.get("span").should("have.text", "No");
    });
});
