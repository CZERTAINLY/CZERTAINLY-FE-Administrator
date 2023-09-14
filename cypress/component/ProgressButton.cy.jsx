import ProgressButton from "../../src/components/ProgressButton/index";

describe("StatusBadge.cy.jsx", () => {
    it("playground", () => {
        cy.mount(<ProgressButton title="Test Progress Button" />);
        cy.get("button").should("have.text", "Test Progress Button");
        cy.get("button").click();
    });
});
