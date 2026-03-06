describe("AI Selector Recovery", () => {
    it("smartAI Test", () => {
        cy.visit('/practice-test-login/');

        cy.smartAI("//h2[text()='Test']", "Test login")
            .should("have.text", "Test login");

        cy.smartAI("//label[text()='U']", "name")
            .should("have.text", "Username")
            .and("be.visible");

        cy.smartAI("//label[text()='word']", "Password")
            .should("have.text", "Password")
            .and("be.visible");

        cy.smartAI("input#us", "name")
            .type("varshini");

        cy.smartAI("input[name='wor']", "password")
            .type("varshini");

        cy.smartAI("//button[@name='login']", "submit")
            .should("be.visible").click({ force: true });

    })
})






