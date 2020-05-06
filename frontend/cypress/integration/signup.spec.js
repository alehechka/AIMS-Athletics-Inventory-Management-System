describe('Login Process', () => {
    before(()=>{
        cy.initPage();
    });
    after(()=>{
        cy.initPage();
    });
    beforeEach(()=> {
        cy.server();
        cy.route('http://localhost:5000/api/v1/credentials/*').as('getCreds');
        cy.route('POST', 'http://localhost:5000/api/v1/credentials/*').as('getCredsPOST');
    });
    it('Opens Signup', () => {
        cy.visit('/signup');
        cy.wait('@getCreds');
    });
    it('Focuses on organization', ()=>{
        cy.focused()
            .should('have.id', 'organization');
    });
    it('check username valid', ()=>{
        cy.checkHelperTextExistence("#username", "test1", false);
    });
    it('check username invalid', ()=>{
        cy.checkHelperTextExistence("#username", "test", true);
    });
    it('check email valid', ()=>{
        cy.checkHelperTextExistence("#email", "test@test.com", false);
    });
    it('check email invalid', ()=>{
        cy.checkHelperTextExistence("#email", "testtest.com", true);
    });
    it('check Password1 valid', ()=>{
        cy.checkHelperTextExistence("#password1", "password", false);
    });
    it('check Password1 invalid length', ()=>{
        cy.checkHelperTextExistence("#password1", "passwor", true);
        cy.checkHelperTextExistence("#password1", "passwor".repeat(6), true);
    });
    it('check Password2 valid', ()=>{
        cy.checkHelperTextExistence("#password1", "password", false);
        cy.checkHelperTextExistence("#password2", "password", false);
    });
    it('check Password2 invalid', ()=>{
        cy.checkHelperTextExistence("#password1", "password", false);
        cy.checkHelperTextExistence("#password2", "password1", true);
    });
});