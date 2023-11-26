// // describe('Normal Login', () => {
// //   it('successfully loads', () => {
// //     cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/

// //     // Click the login button
// //     cy.contains('Login').click();

// //     // Assert that the login was successful
// //     cy.url().should('include', '/home');
// //   });
// // });
// describe('Guest login', () => {
//   it('successfully loads', () => {
//     cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/

//     // Click the guest login button
//     cy.contains('Guest Login').click();

//     // Assert that the guest login was successful
//     cy.url().should('include', '/home');
//   });
// });

// describe('Register Screen', () => {
//   it('successfully loads', () => {
//     cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/


//     // Click the "Register Account" link
//     cy.contains('Register Account').click();

//     // Assert that the URL includes '/register'
//     cy.url().should('include', '/register');

//   });
// });

// describe('Forgot Screen', () => {
//   it('successfully loads', () => {
//     cy.visit('https://blankmap-front-1626f242c2d7.herokuapp.com/login'); // Assuming your app is served at http://localhost:3000/


//     // Click the "Forgot Password" link
//     cy.contains('Forgot Password').click();

//     // Assert that the URL includes '/forgot'
//     cy.url().should('include', '/forgot');

//   });
// });
const localhost = 'http://localhost:3000';
const heroku = 'https://blankmap-front-1626f242c2d7.herokuapp.com';
const firebase = 'https://blank-map-client.web.app/';
const url = localhost;

describe('Main Page Get Started', () => {
    it('successfully loads main page', () => {
        cy.visit(url); // Assuming your app is served at http://localhost:3000/
        cy.contains('Get Started').click();
        cy.url().should('include', '/register');
    });
});
describe('Login Test', () => {
    it('should successfully log in with valid credentials', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Enter username and password
        cy.get('#username').type('test3');
        cy.get('#password').type('12345678');

        // Click the login button
        cy.get('button').contains('Log in').click();

        // Verify that the login was successful
        cy.url().should('include', '/home'); // Adjust this URL based on your application's behavior
    });
}
);
describe('Guest Login Test', () => {
    it('should successfully log in as guest', () => {
        // Visit the login page
        cy.visit(url + '/login');

        // Click the login button
        cy.contains('Guest Login').click();

        // Verify that the login was successful
        cy.url().should('include', '/home'); // Adjust this URL based on your application's behavior
    });
}
);

describe('Already have an account', () => {
    it('should successfully goes to login page', () => {
        // Visit the login page
        cy.visit(url + '/register');

        // Click the login button
        cy.contains('Already have an Account?').click();

        // Verify that the login was successful
        cy.url().should('include', '/login'); // Adjust this URL based on your application's behavior
    });
}
);