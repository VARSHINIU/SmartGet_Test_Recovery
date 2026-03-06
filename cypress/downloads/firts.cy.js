describe('OTP Login via Gmail', () => {
  it('should fetch OTP from Gmail and proceed', () => {
    cy.visit('https://crayonte.einvois.in/signin');
    cy.wait(5000);
    cy.xpath("//div[@id='forget_password']").click();
    cy.wait(2000);
    cy.xpath("//input[@id='username_text']").type("automationtesting248@gmail.com");
    cy.xpath("//button[normalize-space()='Get OTP']").click();

    // Call task to fetch OTP from Gmail
    cy.task('getOtpFromGmail', {
      email: "automationtesting248@gmail.com",
      password: "kedi ahdz lqxx dhyz",  // Replace with actual app password
      subject: "Password Reset"
    }).then((otp) => {
      expect(otp).to.match(/^[A-Z]{10}$/);
      console.log("OTP Fetched: " + otp);

    });
  });
});