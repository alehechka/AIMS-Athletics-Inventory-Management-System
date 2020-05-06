describe('Login Process', () => {
    before(()=>{
        cy.initPage();
    });
    after(()=>{
        cy.initPage();
    })
    beforeEach(()=> {
        cy.server();
        cy.route('http://localhost:5000/api/v1/credentials/*').as('getCreds');
        cy.route('POST', 'http://localhost:5000/api/v1/credentials/*').as('getCredsPOST');
    });
    it('Opens Login', () => {
        cy.visit('/');
        cy.wait('@getCreds');
    });
    it('Focuses on email', ()=>{
        cy.focused()
            .should('have.id', 'email');
    });
    it("Invalid Login", ()=> {
        cy.loginType("admon", "admon");
        cy.get('#login').click();
        cy.wait('@getCredsPOST');
        cy.window()
            .its("sessionStorage")
            .its("creds")
            .should('not.exist');
    });
    it("Valid Login", ()=> {
        cy.loginType("admin", "admin");
        cy.get('#login').click();
        cy.wait('@getCredsPOST');
        cy.window()
            .its("sessionStorage")
            .its("creds")
            .should('exist');
    });
   
  });