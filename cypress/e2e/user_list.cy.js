describe('user_list.cy.js', () => {
  it('should load and display the user list', () => {
    cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com'); // Assuming your app is hosted at the root URL

    // Ensure the user list is displayed after loading
    // cy.get('h2').should('contain', 'Available Users');
    // wrong
    cy.get('h2').should('contain', 'Available123');

    // Verify that at least one user is listed
    cy.get('li').should('have.length.gt', 0);
  });
})