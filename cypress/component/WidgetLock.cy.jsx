import WidgetLock from "../../src/components/WidgetLock/index";
// import WidgetLock from "../../src/components/WidgetLock/index";

describe("WidgetLock.cy.jsx", () => {
    it("playground", () => {
        cy.mount(<WidgetLock lockTitle="Test lock" lockText="Test lock text" />);
        cy.get("h5").should("have.text", "Test lock");
        cy.get("p").should("have.text", "Test lock text");
    });
});
