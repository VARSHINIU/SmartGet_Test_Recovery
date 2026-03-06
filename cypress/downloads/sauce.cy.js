describe("saucedemo",()=>{
    it("url check",()=>{
        cy.visit("https://www.saucedemo.com/",{timeout:20000});
        cy.get(".dfghj")
        cy.clock();
        cy.tick(20000000);

    })
}
)