Cypress.Commands.add("clearItems", (items) => { 
    for (const itemName of items){
        cy.get(itemName).clear();
    }
});
Cypress.Commands.add("loginClear", () => { 
    cy.clearItems(["#email", "#password"])
});
Cypress.Commands.add("typeAndCheck", (itemId, value) =>{
    cy.get(itemId)
        .type(value)
        .should('have.value', value);
});
Cypress.Commands.add("loginType", (email, password) => { 
    cy.loginClear();
    cy.typeAndCheck("#email", email);
    cy.typeAndCheck("#password", password);
});
Cypress.Commands.add("login", (email, password) => {
    cy.server();
    cy.route('POST', 'http://localhost:5000/api/v1/credentials/*').as('getCredsPOST');
    cy.visit('/');
    cy.loginType(email, password);
    cy.get('#login').click();
    cy.wait('@getCredsPOST');
    cy.window()
        .its("sessionStorage")
        .its("creds")
        .should('exist');
});
Cypress.Commands.add("logout", () => {
    cy.server();
    cy.route('http://localhost:5000/api/v1/credentials/*').as('getCreds');
    cy.get('#logout').click();
    cy.get('#logoutConfirm').click();
    cy.wait('@getCreds');
    cy.window()
        .its("sessionStorage")
        .its("creds")
        .should('not.exist');
});

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
