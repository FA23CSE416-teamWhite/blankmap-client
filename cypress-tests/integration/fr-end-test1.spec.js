//layout for a test, add "Hello from React" and Hello World messages
describe('Test1', () => {
    it('Visits the app', () => {
      cy.visit('/');
      cy.contains('Hello from React!');
    });
  
    it('Checks API communication', () => {
      cy.request('/api')
        .its('body.message')
        .should('eq', 'Hello World!');
    });
  });
