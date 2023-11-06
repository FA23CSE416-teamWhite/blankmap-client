//just a layout for tests, doesn't check yet since we have no buttons
describe('Test2', () => {
    it('Visits the app and clicks a button', () => {
      cy.visit('/');
      cy.get('button').click();
      cy.contains('Button Clicked!');
    });
  });