const links = ['/home', '/athletes', '/inventory', '/checkout/users', '/checkin/users', '/staff', '/admin', '/profile'];
const home = '/home';
describe('Test Creds', () => {
    before(()=>{
        cy.initPage();
    });
    after(()=>{
        cy.initPage();
    });
    it('Test Admin', () => {
        cy.login('admin', 'admin');
        for (const link of links) {
            cy.testNoRedirect(link);
        }
    });
    it('Test Coach', () => {
        cy.login('coach', 'coach');
        const blockedViews = ['/staff', '/admin'];
        for (const link of links) {
            if (blockedViews.includes(link)){
                cy.testRedirect(link, home);
            }
            else {
                cy.testNoRedirect(link);
            }
        }
    });
    it('Test Employee', () => {
        cy.login('employee', 'employee');
        const blockedViews = ['/admin'];
        for (const link of links) {
            if (blockedViews.includes(link)){
                cy.testRedirect(link, home);
            }
            else {
                cy.testNoRedirect(link);
            }
        }
    });
    it('Test Athlete', () => {
        cy.login('athlete', 'athlete1');
        const allowedViews = ['/home', '/profile'];
        for (const link of links) {
            if (!allowedViews.includes(link)){
                cy.testRedirect(link, home);
            }
            else {
                cy.testNoRedirect(link);
            }
        }
    });
    afterEach(()=> {
       cy.logout();
    });
});