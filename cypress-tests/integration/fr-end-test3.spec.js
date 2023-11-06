describe('User List Test', () => {
    it('should load and display the user list', () => {
      cy.visit('/'); // Assuming your app is hosted at the root URL
  
      // Ensure the user list is displayed after loading
      cy.get('h2').should('contain', 'Available Users');
  
      // Verify that at least one user is listed
      cy.get('li').should('have.length.gt', 0);
    });
  });