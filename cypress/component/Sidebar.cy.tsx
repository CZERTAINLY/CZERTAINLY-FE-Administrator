import Sidebar from "components/Layout/Sidebar";
import "../../src/resources/styles/theme.scss";

describe("Sidebar component", () => {
    it("should render sidebar", () => {
        cy.mount(<Sidebar />);
        cy.wait(1000);
        cy.get("nav > div").contains("Dashboard").click();
        cy.get("nav > div").contains("Connectors").click();
        cy.get("nav > div").contains("Access Control").click();
        cy.get("nav > div").contains("Profiles").click();
        cy.get("nav > div").contains("Inventory").click();
        cy.get("nav > div").contains("Protocols").click();
        cy.get("nav > div").contains("Approvals").click();
        cy.get("nav > div").contains("Scheduler").click();
        cy.get("nav > div").contains("Settings").click();
        cy.get("nav > div").contains("Audit Logs").click();
    });
});
