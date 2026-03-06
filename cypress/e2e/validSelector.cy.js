describe("AI Selector Recovery", () => {
    it("Valid selector Test", () => {
        cy.visit('/practice-test-login/');

        cy.xpath("//h2[normalize-space()='Test login']")
            .should("have.text", "Test login");

        cy.xpath("//label[normalize-space()='Username']")
            .should("have.text", "Username")
            .and("be.visible");

        cy.xpath("//label[normalize-space()='Password']")
            .should("have.text", "Password")
            .and("be.visible");

        cy.get("input#username")
            .type("varshini");

        cy.get("input[name='password']")
            .type("varshini");

        cy.xpath("//button[@id='submit']")
            .should("be.visible").click({ force: true });

    })
})
