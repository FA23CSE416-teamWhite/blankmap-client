// describe('Normal Login', () => {
//   it('successfully loads', () => {
//     cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/

//     // Click the login button
//     cy.contains('Login').click();

//     // Assert that the login was successful
//     cy.url().should('include', '/home');
//   });
// });
describe('Guest login', () => {
  it('successfully loads', () => {
    cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/

    // Click the guest login button
    cy.contains('Guest Login').click();

    // Assert that the guest login was successful
    cy.url().should('include', '/home');
  });
});

describe('Register Screen', () => {
  it('successfully loads', () => {
    cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/


    // Click the "Register Account" link
    cy.contains('Register Account').click();

    // Assert that the URL includes '/register'
    cy.url().should('include', '/register');

  });
});

describe('Forgot Screen', () => {
  it('successfully loads', () => {
    cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/

    
    // Click the "Forgot Password" link
    cy.contains('Forgot Password').click();

    // Assert that the URL includes '/forgot'
    cy.url().should('include', '/forgot');

  });
});
