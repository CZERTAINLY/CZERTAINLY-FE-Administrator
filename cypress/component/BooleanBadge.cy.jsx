import BooleanBadge from "../../src/components/BooleanBadge/BooleanBadge.tsx";

describe("BooleanBadge.cy.jsx", () => {
    it("should render 'Yes' for true value", () => {
        cy.mount(<BooleanBadge value={true} />);
        cy.get("span").should("have.text", "Yes");
    });
});

describe("BooleanBadge.cy.jsx", () => {
    it("should render 'No' for false value", () => {
        cy.mount(<BooleanBadge value={false} />);
        cy.get("span").should("have.text", "No");
    });
});
